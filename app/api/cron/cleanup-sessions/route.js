import { db } from "@/lib/db";
import { MockQuestionStatus, MockSessionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

//CONSTANTS
const INTERVIEW_DURATION_SECONDS = 3600;       
const STALE_BUFFER_SECONDS = 5 * 60;         
const STALE_THRESHOLD_MS =
  (INTERVIEW_DURATION_SECONDS + STALE_BUFFER_SECONDS) * 1000;

const MAX_RETRIES = 2;
const BATCH_SIZE = 10; 

export async function POST(request) {
  try {
    const secret = request.headers.get("x-cron-secret");

    if (!secret || secret !== process.env.CRON_SECRET) {
      console.warn("⚠️ Cron cleanup: unauthorized attempt", {
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const now = new Date();
    const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS);

    console.log("🔄 Cron cleanup started", {
      cutoff: cutoff.toISOString(),
      thresholdMinutes: STALE_THRESHOLD_MS / 60000,
      timestamp: now.toISOString(),
    });

    const staleSessions = await db.mockSession.findMany({
      where: {
        status: MockSessionStatus.IN_PROGRESS,
        startTime: { lt: cutoff },
      },
      include: { questions: true },
    });

    if (staleSessions.length === 0) {
      console.log("✅ Cron cleanup: no stale sessions found");
      return NextResponse.json({
        success: true,
        data: { cleaned: 0, failed: 0, message: "No stale sessions found" },
      });
    }

    console.log(`🔍 Found ${staleSessions.length} stale sessions`);

    let cleaned = 0;
    let failed = 0;
    const failedSessions = [];

    for (let i = 0; i < staleSessions.length; i += BATCH_SIZE) {
      const batch = staleSessions.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((session) => cleanSessionWithRetry(session, now))
      );

      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        const session = batch[j];

        if (result.status === "fulfilled") {
          cleaned++;
          console.log("✅ Cleaned session", {
            sessionId: session.id,
            userId: session.userId,
            company: session.company,
            startTime: session.startTime.toISOString(),
          });
        } else {
          failed++;
          failedSessions.push(session.id);
          console.error("❌ Failed to clean session", {
            sessionId: session.id,
            error: result.reason?.message ?? "Unknown",
          });
        }
      }
    }

    console.log("✅ Cron cleanup finished", {
      total: staleSessions.length,
      cleaned,
      failed,
      failedSessions,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: { total: staleSessions.length, cleaned, failed, failedSessions },
    });
  } catch (error) {
    console.error("❌ Cron cleanup fatal error", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, error: "CLEANUP_FAILED" },
      { status: 500 }
    );
  }
}

//RETRY WRAPPER
async function cleanSessionWithRetry(session, now, attempt = 1) {
  try {
    await cleanSession(session, now);
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.warn(`⚠️ Retry ${attempt} for session ${session.id}`);
      // exponential backoff — 500ms, 1000ms
      await new Promise((r) => setTimeout(r, attempt * 500));
      return cleanSessionWithRetry(session, now, attempt + 1);
    }
    throw error;
  }
}

//CLEAN ONE SESSION 
async function cleanSession(session, now) {
  const rawTotalTime = Math.floor(
    (now.getTime() - session.startTime.getTime()) / 1000
  );
  const totalTime = Math.min(rawTotalTime, INTERVIEW_DURATION_SECONDS);

  await db.$transaction(async (tx) => {
    const fresh = await tx.mockSession.findUnique({
      where: { id: session.id },
      select: { status: true },
    });

    if (!fresh || fresh.status !== MockSessionStatus.IN_PROGRESS) {
      console.log(`⚠️ Session ${session.id} already closed — skipping`);
      return;
    }

    const pendingQuestions = session.questions.filter(
      (q) => q.status === MockQuestionStatus.PENDING
    );

    for (const q of pendingQuestions) {
      const timeTaken = q.questionStartTime
        ? Math.min(
            Math.floor(
              (now.getTime() - q.questionStartTime.getTime()) / 1000
            ),
            INTERVIEW_DURATION_SECONDS
          )
        : null;

      await tx.mockSessionQuestion.update({
        where: { id: q.id },
        data: {
          status: MockQuestionStatus.SKIPPED,
          questionEndTime: now,
          timeTaken,
        },
      });
    }

    await tx.mockSession.update({
      where: { id: session.id },
      data: {
        status: MockSessionStatus.TIMED_OUT,
        endTime: now,
        totalTime,
      },
    });
  });
}