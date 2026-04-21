import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

// Format enum values like "DynamicProgramming" → "Dynamic Programming"
function formatTag(tag) {
  return tag.replace(/([A-Z])/g, " $1").trim();
}

export default function ResultWeakArea({ weakAreas }) {
  const hasWeakAreas = weakAreas && weakAreas.length > 0;

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {hasWeakAreas ? (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          Weak Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasWeakAreas ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Topics from questions you failed or skipped:
            </p>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-medium"
                >
                  {formatTag(tag)}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                No weak areas detected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You handled both topics well in this session.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}