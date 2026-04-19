"use server";

import { db } from "@/lib/db";
import { getLanguageName, pollBatchResults, submitBatch } from "@/lib/judge0";
import { currentUser } from "@clerk/nextjs/server";
import {
  Company,
  Difficulty,
  MockQuestionStatus,
  MockSessionStatus,
} from "@prisma/client";

//CONSTANTS 

const INTERVIEW_DURATION_SECONDS = 3600;
const VALID_COMPANIES = Object.values(Company);
const VALID_DIFFICULTIES = [Difficulty.EASY, Difficulty.MEDIUM];

//HELPERS

async function getDbUser(clerkId) {
  return db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
}

async function getSession(sessionId) {
  return db.mockSession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        include: { problem: true, submission: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

function unauthorized() {
  return {
    success: false,
    error: "UNAUTHORIZED",
    message: "Access denied",
  };
}

// compareOutput: normalize before comparing
function compareOutput(judgeStdout, expectedOutput) {
  if (judgeStdout === null || judgeStdout === undefined) {
    return { passed: false, reason: "NO_OUTPUT", actual: null, expected: expectedOutput };
  }

  const normalize = (str) =>
    str
      .trim()
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");

  const actual = normalize(String(judgeStdout));
  const expected = normalize(String(expectedOutput));

  return {
    passed: actual === expected,
    reason: actual === expected ? "ACCEPTED" : "WRONG_ANSWER",
    actual,
    expected,
  };
}

// Fix topic distribution
function selectProblems(pool) {
  const byTopic = {};
  for (const p of pool) {
    const topic = p.primaryTag;
    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(p);
  }

  const topics = Object.keys(byTopic);

  if (topics.length < 2) {
    console.warn("⚠️ Topic variety insufficient — falling back to random 2");
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }

  const shuffledTopics = [...topics].sort(() => Math.random() - 0.5);
  const [topic1, topic2] = shuffledTopics;

  const q1 = byTopic[topic1][Math.floor(Math.random() * byTopic[topic1].length)];
  const q2 = byTopic[topic2][Math.floor(Math.random() * byTopic[topic2].length)];

  return [q1, q2];
}

//START INTERVIEW

export async function startInterview(company, difficulty) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    //validate inputs explicitly
    if (!company || !VALID_COMPANIES.includes(company)) {
      return {
        success: false,
        error: "INVALID_COMPANY",
        message: `Company must be one of: ${VALID_COMPANIES.join(", ")}`,
      };
    }

    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return {
        success: false,
        error: "INVALID_DIFFICULTY",
        message: "Difficulty must be EASY or MEDIUM",
      };
    }

    // Get already solved problems to exclude
    const solved = await db.problemSolved.findMany({
      where: { userId: dbUser.id },
      select: { problemId: true },
    });
    const solvedIds = solved.map((s) => s.problemId);
    let pool = await db.problem.findMany({
      where: {
        companies: { has: company },
        difficulty: difficulty,
        id: { notIn: solvedIds.length > 0 ? solvedIds : undefined },
      },
    });

    //guaranteed check after fallback
    if (pool.length < 2) {
      console.warn("⚠️ Not enough unsolved problems — retrying without solved filter");
      pool = await db.problem.findMany({
        where: {
          companies: { has: company },
          difficulty: difficulty,
        },
      });

      // Hard stop — even fallback has < 2
      if (pool.length < 2) {
        return {
          success: false,
          error: "NOT_ENOUGH_PROBLEMS",
          message: "Not enough problems available for this selection. Please try a different company or difficulty.",
        };
      }
    }

    const [q1, q2] = selectProblems(pool);

    // Safety check after selectProblems
    if (!q1 || !q2) {
      return {
        success: false,
        error: "PROBLEM_SELECTION_FAILED",
        message: "Could not select problems. Please try again.",
      };
    }

    const now = new Date();

    const session = await db.mockSession.create({
      data: {
        userId: dbUser.id,
        company,
        difficulty,
        status: MockSessionStatus.IN_PROGRESS,
        startTime: now,
        questions: {
          create: [
            {
              problemId: q1.id,
              order: 1,
              status: MockQuestionStatus.PENDING,
              questionStartTime: now,
            },
            {
              problemId: q2.id,
              order: 2,
              status: MockQuestionStatus.PENDING,
            },
          ],
        },
      },
      include: {
        questions: {
          include: { problem: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return { success: true, data: session };
  } catch (error) {
    console.error("❌ startInterview error:", error);
    return {
      success: false,
      error: "START_FAILED",
      message: "Failed to start interview. Please try again.",
    };
  }
}

//GET CURRENT SESSION

export async function getCurrentSession(sessionId) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    if (!sessionId) {
      return {
        success: false,
        error: "MISSING_SESSION_ID",
        message: "Session ID is required",
      };
    }

    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Session not found",
      };
    }

    if (session.userId !== dbUser.id) return unauthorized();
    const elapsed = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000
    );
    const timeRemaining = Math.max(0, INTERVIEW_DURATION_SECONDS - elapsed);

    const currentQuestion =
      session.questions.find(
        (q) => q.status === MockQuestionStatus.PENDING
      ) || null;

    return {
      success: true,
      data: {
        session,
        timeRemaining,
        currentQuestionOrder: currentQuestion?.order ?? null,
      },
    };
  } catch (error) {
    console.error("❌ getCurrentSession error:", error);
    return {
      success: false,
      error: "FETCH_FAILED",
      message: "Failed to fetch session",
    };
  }
}

// SUBMIT ANSWER

export async function submitAnswer(
  sessionId,
  questionOrder,
  sourceCode,
  languageId
) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    //validate all inputs
    if (!sessionId || !questionOrder || !sourceCode || !languageId) {
      return {
        success: false,
        error: "MISSING_FIELDS",
        message: "sessionId, questionOrder, sourceCode and languageId are required",
      };
    }

    if (typeof sourceCode !== "string" || sourceCode.trim().length === 0) {
      return {
        success: false,
        error: "INVALID_SOURCE_CODE",
        message: "Source code cannot be empty",
      };
    }

    if (typeof languageId !== "number") {
      return {
        success: false,
        error: "INVALID_LANGUAGE_ID",
        message: "languageId must be a number",
      };
    }

    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Session not found",
      };
    }

    if (session.userId !== dbUser.id) return unauthorized();

    if (session.status !== MockSessionStatus.IN_PROGRESS) {
      return {
        success: false,
        error: "SESSION_CLOSED",
        message: "This session is no longer active",
      };
    }

    const question = session.questions.find((q) => q.order === questionOrder);
    if (!question) {
      return {
        success: false,
        error: "QUESTION_NOT_FOUND",
        message: "Question not found in this session",
      };
    }

    // Duplicate submit guard
    if (question.status !== MockQuestionStatus.PENDING) {
      return {
        success: false,
        error: "ALREADY_SUBMITTED",
        message: "This question has already been answered",
      };
    }

    const problem = question.problem;
    let testCases = [];
    try {
      testCases = Array.isArray(problem.testCases)
        ? problem.testCases
        : JSON.parse(problem.testCases);
    } catch {
      return {
        success: false,
        error: "INVALID_TEST_CASES",
        message: "Problem test cases are malformed",
      };
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return {
        success: false,
        error: "NO_TEST_CASES",
        message: "Problem has no test cases",
      };
    }

    const stdin = testCases.map((tc) => tc.input);
    const expectedOutputs = testCases.map((tc) => tc.output);

    // Build Judge0 batch
    const judgeSubmissions = stdin.map((input) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));

    const submitResponse = await submitBatch(judgeSubmissions);
    const tokens = submitResponse.map((r) => r.token);
    const results = await pollBatchResults(tokens);

    // Compare outputs
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const comparison = compareOutput(result.stdout, expectedOutputs[i]);
      if (!comparison.passed) allPassed = false;
      return {
        testCase: i + 1,
        passed: comparison.passed,
        stdout: comparison.actual ?? null,
        expected: comparison.expected,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status?.description ?? "Unknown",
        memory: result.memory ? `${result.memory} KB` : null,
        time: result.time ? `${result.time} s` : null,
      };
    });

    const now = new Date();
    const timeTaken = question.questionStartTime
      ? Math.floor(
          (now.getTime() - question.questionStartTime.getTime()) / 1000
        )
      : null;

    const isLastQuestion = questionOrder === 2;
    const [submission] = await db.$transaction(async (tx) => {
      const sub = await tx.submission.create({
        data: {
          userId: dbUser.id,
          problemId: problem.id,
          sourceCode: { code: sourceCode, language: getLanguageName(languageId) },
          language: getLanguageName(languageId),
          stdin: stdin.join("\n"),
          stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
          stderr: detailedResults.some((r) => r.stderr)
            ? JSON.stringify(detailedResults.map((r) => r.stderr))
            : null,
          compileOutput: detailedResults.some((r) => r.compile_output)
            ? JSON.stringify(detailedResults.map((r) => r.compile_output))
            : null,
          status: allPassed ? "Accepted" : "Wrong Answer",
          memory: detailedResults.some((r) => r.memory)
            ? JSON.stringify(detailedResults.map((r) => r.memory))
            : null,
          time: detailedResults.some((r) => r.time)
            ? JSON.stringify(detailedResults.map((r) => r.time))
            : null,
        },
      });

      await tx.testCaseResult.createMany({
        data: detailedResults.map((r) => ({
          submissionId: sub.id,
          testCase: r.testCase,
          passed: r.passed,
          stdout: r.stdout,
          expected: r.expected,
          stderr: r.stderr,
          compileOutput: r.compile_output,
          status: r.status,
          memory: r.memory,
          time: r.time,
        })),
      });

      // Update current question
      await tx.mockSessionQuestion.update({
        where: { sessionId_order: { sessionId, order: questionOrder } },
        data: {
          status: allPassed
            ? MockQuestionStatus.SOLVED
            : MockQuestionStatus.FAILED,
          submissionId: sub.id,
          questionEndTime: now,
          timeTaken,
        },
      });

      // Start Q2 timer atomically when Q1 is submitted
      if (questionOrder === 1) {
        await tx.mockSessionQuestion.update({
          where: { sessionId_order: { sessionId, order: 2 } },
          data: { questionStartTime: now },
        });
      }

      // Close session if last question
      if (isLastQuestion) {
        const totalTime = Math.floor(
          (now.getTime() - session.startTime.getTime()) / 1000
        );
        await tx.mockSession.update({
          where: { id: sessionId },
          data: {
            status: MockSessionStatus.COMPLETED,
            endTime: now,
            totalTime,
          },
        });
      }

      // Mark as solved if all passed
      if (allPassed) {
        await tx.problemSolved.upsert({
          where: {
            userId_problemId: {
              userId: dbUser.id,
              problemId: problem.id,
            },
          },
          update: {},
          create: {
            userId: dbUser.id,
            problemId: problem.id,
          },
        });
      }

      return [sub];
    });

    return {
      success: true,
      data: {
        passed: allPassed,
        results: detailedResults,
        submissionId: submission.id,
        isLastQuestion,
      },
    };
  } catch (error) {
    console.error("❌ submitAnswer error:", error);
    return {
      success: false,
      error: "EXECUTION_FAILED",
      message: "Code execution failed. Please try again.",
    };
  }
}

//SKIP QUESTION

export async function skipQuestion(sessionId, questionOrder) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    if (!sessionId || !questionOrder) {
      return {
        success: false,
        error: "MISSING_FIELDS",
        message: "sessionId and questionOrder are required",
      };
    }

    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Session not found",
      };
    }

    if (session.userId !== dbUser.id) return unauthorized();

    if (session.status !== MockSessionStatus.IN_PROGRESS) {
      return {
        success: false,
        error: "SESSION_CLOSED",
        message: "Session is no longer active",
      };
    }

    const question = session.questions.find((q) => q.order === questionOrder);

    if (!question || question.status !== MockQuestionStatus.PENDING) {
      return {
        success: false,
        error: "CANNOT_SKIP",
        message: "This question cannot be skipped",
      };
    }

    const now = new Date();
    const timeTaken = question.questionStartTime
      ? Math.floor(
          (now.getTime() - question.questionStartTime.getTime()) / 1000
        )
      : null;

    const isLastQuestion = questionOrder === 2;

    await db.$transaction(async (tx) => {
      await tx.mockSessionQuestion.update({
        where: { sessionId_order: { sessionId, order: questionOrder } },
        data: {
          status: MockQuestionStatus.SKIPPED,
          questionEndTime: now,
          timeTaken,
        },
      });

      if (questionOrder === 1) {
        await tx.mockSessionQuestion.update({
          where: { sessionId_order: { sessionId, order: 2 } },
          data: { questionStartTime: now },
        });
      }

      if (isLastQuestion) {
        const totalTime = Math.floor(
          (now.getTime() - session.startTime.getTime()) / 1000
        );
        await tx.mockSession.update({
          where: { id: sessionId },
          data: {
            status: MockSessionStatus.COMPLETED,
            endTime: now,
            totalTime,
          },
        });
      }
    });

    return {
      success: true,
      data: { skipped: true, isLastQuestion },
    };
  } catch (error) {
    console.error("❌ skipQuestion error:", error);
    return {
      success: false,
      error: "SKIP_FAILED",
      message: "Failed to skip question",
    };
  }
}

//TIMEOUT SESSION 

export async function timeoutSession(sessionId) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    if (!sessionId) {
      return {
        success: false,
        error: "MISSING_SESSION_ID",
        message: "Session ID is required",
      };
    }

    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Session not found",
      };
    }

    if (session.userId !== dbUser.id) return unauthorized();

    if (session.status !== MockSessionStatus.IN_PROGRESS) {
      return { success: true, data: { alreadyClosed: true } };
    }

    const now = new Date();
    const totalTime = Math.floor(
      (now.getTime() - session.startTime.getTime()) / 1000
    );

    await db.$transaction(async (tx) => {
      for (const q of session.questions) {
        if (q.status === MockQuestionStatus.PENDING) {
          const timeTaken = q.questionStartTime
            ? Math.floor(
                (now.getTime() - q.questionStartTime.getTime()) / 1000
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
      }

      await tx.mockSession.update({
        where: { id: sessionId },
        data: {
          status: MockSessionStatus.TIMED_OUT,
          endTime: now,
          totalTime,
        },
      });
    });

    return { success: true, data: { timedOut: true } };
  } catch (error) {
    console.error("❌ timeoutSession error:", error);
    return {
      success: false,
      error: "TIMEOUT_FAILED",
      message: "Failed to close session",
    };
  }
}

//GET RESULT

export async function getResult(sessionId) {
  try {
    const user = await currentUser();
    if (!user) return unauthorized();

    const dbUser = await getDbUser(user.id);
    if (!dbUser) return unauthorized();

    if (!sessionId) {
      return {
        success: false,
        error: "MISSING_SESSION_ID",
        message: "Session ID is required",
      };
    }

    const session = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Session not found",
      };
    }

    if (session.userId !== dbUser.id) return unauthorized();

    if (session.status === MockSessionStatus.IN_PROGRESS) {
      const elapsed = Date.now() - session.startTime.getTime();

      if (elapsed > 65 * 60 * 1000) {
        await timeoutSession(sessionId);

        const updatedSession = await getSession(sessionId);
        if (!updatedSession || updatedSession.status === MockSessionStatus.IN_PROGRESS) {
          return {
            success: false,
            error: "CLOSE_FAILED",
            message: "Could not close session. Please try again.",
          };
        }
        // Continue with updated session
        return computeResult(updatedSession, dbUser.id);
      }

      return {
        success: false,
        error: "STILL_IN_PROGRESS",
        message: "Interview is still in progress",
      };
    }

    return computeResult(session, dbUser.id);
  } catch (error) {
    console.error("❌ getResult error:", error);
    return {
      success: false,
      error: "RESULT_FAILED",
      message: "Failed to compute results",
    };
  }
}

//RESULT

async function computeResult(session, userId) {
  const q1 = session.questions.find((q) => q.order === 1);
  const q2 = session.questions.find((q) => q.order === 2);

  //SCORE
  const solved = session.questions.filter(
    (q) => q.status === MockQuestionStatus.SOLVED
  ).length;

  const score = {
    solved,
    total: 2,
    percent: Math.round((solved / 2) * 100),
    q1Status: q1?.status ?? MockQuestionStatus.SKIPPED,
    q2Status: q2?.status ?? MockQuestionStatus.SKIPPED,
  };

  //TIME ANALYSIS
  const totalExpectedTime =
    (q1?.problem?.expectedTime ?? 1500) +
    (q2?.problem?.expectedTime ?? 1500);

  const yourTime = session.totalTime ?? INTERVIEW_DURATION_SECONDS;
  const ratio = yourTime / totalExpectedTime;

  let verdict;
  if (ratio <= 0.75) verdict = "Fast";
  else if (ratio <= 1.1) verdict = "On Track";
  else if (ratio <= 1.4) verdict = "Slow";
  else verdict = "Very Slow";

  const q1Time = q1?.timeTaken ?? 0;
  const q2Time = q2?.timeTaken ?? 0;

  const timeAnalysis = {
    yourTime,
    expectedTime: totalExpectedTime,
    yourTimeMinutes: Math.floor(yourTime / 60),
    expectedTimeMinutes: Math.floor(totalExpectedTime / 60),
    verdict,
    q1TimeTaken: q1Time,
    q2TimeTaken: q2Time,
    q1Percent: yourTime > 0 ? Math.round((q1Time / yourTime) * 100) : 50,
    q2Percent: yourTime > 0 ? Math.round((q2Time / yourTime) * 100) : 50,
  };

  //WEAK AREAS
  const weakAreas = [
    ...new Set(
      session.questions
        .filter(
          (q) =>
            q.status === MockQuestionStatus.FAILED ||
            q.status === MockQuestionStatus.SKIPPED
        )
        .map((q) => q.problem?.primaryTag)
        .filter(Boolean)
    ),
  ];

  //BEHAVIOR INSIGHT
  const q1Ratio = yourTime > 0 ? q1Time / yourTime : 0;
  const q2Ratio = yourTime > 0 ? q2Time / yourTime : 0;

  let behaviorInsight;

  if (session.status === MockSessionStatus.TIMED_OUT) {
    behaviorInsight =
      "You ran out of time. Practice solving each problem within 25 minutes. Speed is a skill.";
  } else if (q1Ratio > 0.65 && q1?.status !== MockQuestionStatus.SOLVED) {
    behaviorInsight =
      "You spent over 65% of your time on Q1 and still didn't solve it. In real interviews, move on after 20 minutes.";
  } else if (q1Ratio > 0.65 && q1?.status === MockQuestionStatus.SOLVED) {
    behaviorInsight =
      "You solved Q1 but used too much time on it. Q2 deserved more attention.";
  } else if (q2Ratio > 0.75) {
    behaviorInsight =
      "You rushed Q1 and got stuck on Q2. Balance your time — both questions matter equally.";
  } else if (
    q1?.status !== MockQuestionStatus.SOLVED &&
    q2?.status !== MockQuestionStatus.SOLVED &&
    yourTime < totalExpectedTime
  ) {
    behaviorInsight =
      "You finished quickly but solved nothing. Slow down and think before coding.";
  } else {
    behaviorInsight = "Good time distribution across both questions.";
  }

  
  const solvedRecords = await db.problemSolved.findMany({
    where: { userId },
    select: { problemId: true },
  });

  const solvedIds = solvedRecords.map((s) => s.problemId);
  const sessionProblemIds = session.questions.map((q) => q.problemId);
  const excludeIds = [...new Set([...solvedIds, ...sessionProblemIds])];

  const nextDifficulty =
    session.difficulty === Difficulty.EASY
      ? Difficulty.MEDIUM
      : Difficulty.HARD;

  let nextSteps = [];
  let nextStepsMessage = "";

  if (weakAreas.length === 0) {
    nextSteps = await db.problem.findMany({
      where: {
        difficulty: nextDifficulty,
        id: { notIn: excludeIds.length > 0 ? excludeIds : undefined },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    nextStepsMessage =
      nextSteps.length > 0
        ? `Great job solving both! Try these ${nextDifficulty.toLowerCase()} problems next.`
        : "No harder problems available yet. Check back soon.";
  } else {
    nextSteps = await db.problem.findMany({
      where: {
        primaryTag: { in: weakAreas },
        difficulty: session.difficulty,
        id: { notIn: excludeIds.length > 0 ? excludeIds : undefined },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    if (nextSteps.length < 3) {
      const usedIds = [
        ...excludeIds,
        ...nextSteps.map((p) => p.id),
      ];
      const fill = await db.problem.findMany({
        where: {
          difficulty: session.difficulty,
          id: { notIn: usedIds.length > 0 ? usedIds : undefined },
        },
        take: 3 - nextSteps.length,
      });
      nextSteps = [...nextSteps, ...fill];
    }

    nextStepsMessage =
      nextSteps.length > 0
        ? "Practice these to strengthen your weak areas."
        : "No more problems available yet. Check back soon.";
  }

  return {
    success: true,
    data: {
      score,
      timeAnalysis,
      weakAreas,
      behaviorInsight,
      nextSteps,
      nextStepsMessage,
    },
  };
}