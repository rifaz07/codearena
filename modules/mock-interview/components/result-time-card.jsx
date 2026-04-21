import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Target, Turtle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const verdictMeta = {
  Fast: {
    icon: Zap,
    className:
      "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    description: "You finished well under expected time.",
  },
  "On Track": {
    icon: Target,
    className:
      "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    description: "Your pace matches the expected time.",
  },
  Slow: {
    icon: Turtle,
    className:
      "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    description: "You took longer than expected. Practice speed.",
  },
  "Very Slow": {
    icon: AlertTriangle,
    className:
      "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    description: "Significantly over expected time. Focus on patterns.",
  },
};

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function ResultTimeCard({ timeAnalysis }) {
  const { yourTime, expectedTime, verdict } = timeAnalysis;
  const meta = verdictMeta[verdict] ?? verdictMeta["On Track"];
  const Icon = meta.icon;

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-5 h-5 text-amber-500" />
          Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-4xl font-black text-gray-900 dark:text-white">
              {formatDuration(yourTime)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Expected: {formatDuration(expectedTime)}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("font-semibold flex items-center gap-1 text-sm px-3 py-1", meta.className)}
          >
            <Icon className="w-3.5 h-3.5" />
            {verdict}
          </Badge>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {meta.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}