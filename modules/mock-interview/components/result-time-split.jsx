import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function ResultTimeSplit({ timeAnalysis }) {
  const { q1TimeTaken, q2TimeTaken, q1Percent, q2Percent } = timeAnalysis;

  // Guard: if both zero (edge case — immediate timeout), show empty bar
  const totalPercent = q1Percent + q2Percent;
  const hasData = totalPercent > 0;

  // Normalize so bar always totals 100% visually
  const q1Width = hasData ? (q1Percent / totalPercent) * 100 : 50;
  const q2Width = hasData ? (q2Percent / totalPercent) * 100 : 50;

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="w-5 h-5 text-amber-500" />
          Time Split
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Question 1
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatDuration(q1TimeTaken)} · {q1Percent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">
              {q2Percent}% · {formatDuration(q2TimeTaken)}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Question 2
            </span>
            <span className="w-3 h-3 rounded-sm bg-gray-400 dark:bg-gray-500" />
          </div>
        </div>

        {/* Bar */}
        <div
          className={cn(
            "flex w-full h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700",
            !hasData && "opacity-50"
          )}
        >
          <div
            className="bg-amber-500 transition-all duration-500 flex items-center justify-center"
            style={{ width: `${q1Width}%` }}
          >
            {hasData && q1Width >= 10 && (
              <span className="text-[10px] font-bold text-white">
                {q1Percent}%
              </span>
            )}
          </div>
          <div
            className="bg-gray-400 dark:bg-gray-500 transition-all duration-500 flex items-center justify-center"
            style={{ width: `${q2Width}%` }}
          >
            {hasData && q2Width >= 10 && (
              <span className="text-[10px] font-bold text-white">
                {q2Percent}%
              </span>
            )}
          </div>
        </div>

        {!hasData && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            No time data recorded for this session.
          </p>
        )}
      </CardContent>
    </Card>
  );
}