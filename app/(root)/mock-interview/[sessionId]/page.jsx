import { redirect } from "next/navigation";
import { getCurrentSession } from "@/modules/mock-interview/actions";
import InterviewRoomClient from "@/modules/mock-interview/components/interview-room-client";

export default async function InterviewRoomPage({ params }) {
  const { sessionId } = await params;

  const result = await getCurrentSession(sessionId);

  if (!result.success) {
    if (result.error === "UNAUTHORIZED") redirect("/sign-in");
    redirect("/mock-interview");
  }

  const { session, timeRemaining, currentQuestionOrder } = result.data;

  // Session already closed — send to results
  if (session.status !== "IN_PROGRESS") {
    redirect(`/mock-interview/${sessionId}/result`);
  }

  // Time already up on load
  if (timeRemaining <= 0) {
    redirect(`/mock-interview/${sessionId}/result`);
  }

  return (
    <InterviewRoomClient
      session={session}
      initialTimeRemaining={timeRemaining}
      initialQuestionOrder={currentQuestionOrder}
    />
  );
}