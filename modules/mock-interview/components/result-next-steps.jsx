import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTag(tag) {
  return tag.replace(/([A-Z])/g, " $1").trim();
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "HARD":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ResultNextSteps({ nextSteps, message }) {
  const hasProblems = nextSteps && nextSteps.length > 0;

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="w-5 h-5 text-amber-500" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {message}
          </p>
        )}

        {hasProblems ? (
          <div className="grid md:grid-cols-3 gap-3">
            {nextSteps.map((problem) => (
              <Link
                key={problem.id}
                href={`/problem/${problem.id}`}
                className="group"
              >
                <div className="h-full border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 rounded-xl p-4 transition-all duration-200 hover:shadow-md flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {problem.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 flex-shrink-0 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <Badge
                      className={cn(
                        "font-medium text-xs",
                        getDifficultyColor(problem.difficulty)
                      )}
                    >
                      {problem.difficulty}
                    </Badge>
                    {problem.primaryTag && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-600 dark:text-gray-400"
                      >
                        {formatTag(problem.primaryTag)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No recommendations available
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check back as more problems are added.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}