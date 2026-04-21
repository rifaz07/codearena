import { redirect } from "next/navigation";
import { getResult } from "@/modules/mock-interview/actions";
import ResultScoreCard from "@/modules/mock-interview/components/result-score-card";
import ResultTimeCard from "@/modules/mock-interview/components/result-time-card";
import ResultTimeSplit from "@/modules/mock-interview/components/result-time-split";
import ResultWeakArea from "@/modules/mock-interview/components/result-weak-area";
import ResultBehavior from "@/modules/mock-interview/components/result-behavior";
import ResultNextSteps from "@/modules/mock-interview/components/result-next-steps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

export default async function ResultPage({ params }) {
  const { sessionId } = await params;

  const result = await getResult(sessionId);

  if (!result.success) {
    if (result.error === "UNAUTHORIZED") redirect("/sign-in");
    if (result.error === "STILL_IN_PROGRESS") {
      redirect(`/mock-interview/${sessionId}`);
    }
    redirect("/mock-interview");
  }

  const {
    score,
    timeAnalysis,
    weakAreas,
    behaviorInsight,
    nextSteps,
    nextStepsMessage,
  } = result.data;

  return (
    <div className="min-h-screen mt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge
            variant="secondary"
            className="mb-4 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            <Trophy className="w-3 h-3 mr-1" />
            Interview Complete
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Your Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Detailed breakdown of your performance and next steps.
          </p>
        </div>

        {/* Grid layout */}
        <div className="space-y-6">
          {/* Row 1 — Score + Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <ResultScoreCard score={score} />
            <ResultTimeCard timeAnalysis={timeAnalysis} />
          </div>

          {/* Row 2 — Time split (full width) */}
          <ResultTimeSplit timeAnalysis={timeAnalysis} />

          {/* Row 3 — Weak areas + Behavior */}
          <div className="grid md:grid-cols-2 gap-6">
            <ResultWeakArea weakAreas={weakAreas} />
            <ResultBehavior insight={behaviorInsight} />
          </div>

          {/* Row 4 — Next Steps (full width) */}
          <ResultNextSteps
            nextSteps={nextSteps}
            message={nextStepsMessage}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link href="/mock-interview/setup">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900 shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Interview
            </Button>
          </Link>
          <Link href="/problems">
            <Button variant="outline" size="lg">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Problems
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}