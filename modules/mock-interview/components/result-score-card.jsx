import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, XCircle, SkipForward, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusMeta = {
  SOLVED: {
    label: "Solved",
    icon: CheckCircle2,
    className:
      "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className:
      "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  SKIPPED: {
    label: "Skipped",
    icon: SkipForward,
    className:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  },
  PENDING: {
    label: "Not attempted",
    icon: Clock,
    className:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  },
};

function QuestionRow({ label, status }) {
  const meta = statusMeta[status] ?? statusMeta.PENDING;
  const Icon = meta.icon;
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <Badge
        variant="outline"
        className={cn("font-medium flex items-center gap-1", meta.className)}
      >
        <Icon className="w-3 h-3" />
        {meta.label}
      </Badge>
    </div>
  );
}

export default function ResultScoreCard({ score }) {
  const { solved, total, percent, q1Status, q2Status } = score;

  const accentColor =
    percent === 100
      ? "text-green-600 dark:text-green-400"
      : percent >= 50
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="w-5 h-5 text-amber-500" />
          Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className={cn("text-5xl font-black", accentColor)}>
            {solved}
          </span>
          <span className="text-2xl font-semibold text-gray-400 dark:text-gray-500">
            / {total}
          </span>
          <span className={cn("ml-auto text-2xl font-bold", accentColor)}>
            {percent}%
          </span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <QuestionRow label="Question 1" status={q1Status} />
          <QuestionRow label="Question 2" status={q2Status} />
        </div>
      </CardContent>
    </Card>
  );
}