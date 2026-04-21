import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const FALLBACK_INSIGHT =
  "No specific behavior pattern detected for this session.";

export default function ResultBehavior({ insight }) {
  const text = insight?.trim() || FALLBACK_INSIGHT;

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-amber-500" />
          Behavior Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="w-1 flex-shrink-0 bg-amber-500 rounded-full" />
          <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed italic">
            {text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}