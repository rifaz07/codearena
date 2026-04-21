"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function QuestionPanel({ problem, selectedLanguage }) {
  if (!problem) return null;

  const example = problem.examples?.[selectedLanguage];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-amber-500" />
            {problem.title}
          </CardTitle>
          <Badge
            className={cn(
              "font-medium flex-shrink-0",
              getDifficultyColor(problem.difficulty)
            )}
          >
            {problem.difficulty}
          </Badge>
        </div>
        {problem.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-6">
            {/* Description */}
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>

            {/* Example */}
            {example && (
              <div>
                <h3 className="font-semibold text-base mb-3">Example</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div>
                    <span className="font-medium text-amber-500">Input: </span>
                    <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                      {example.input}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-amber-500">Output: </span>
                    <code className="text-sm dark:bg-zinc-900 bg-zinc-200 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                      {example.output}
                    </code>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="font-medium">Explanation: </span>
                      <span className="text-sm text-muted-foreground">
                        {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div>
                <h3 className="font-semibold text-base mb-3">Constraints</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}