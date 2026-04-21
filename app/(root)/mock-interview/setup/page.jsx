"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startInterview } from "@/modules/mock-interview/actions";

const COMPANIES = [
  {
    id: "GOOGLE",
    name: "Google",
    description: "Arrays, Trees, Dynamic Programming",
    color: "border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500",
    activeColor: "border-blue-500 bg-blue-50 dark:bg-blue-950/50",
    badgeColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  {
    id: "AMAZON",
    name: "Amazon",
    description: "Graphs, Sliding Window, Two Pointers",
    color: "border-yellow-300 dark:border-yellow-700 hover:border-yellow-500 dark:hover:border-yellow-500",
    activeColor: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
    badgeColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
    dot: "bg-yellow-500",
  },
  {
    id: "MICROSOFT",
    name: "Microsoft",
    description: "Linked Lists, Binary Search, Stacks",
    color: "border-green-300 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500",
    activeColor: "border-green-500 bg-green-50 dark:bg-green-950/50",
    badgeColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
];

const DIFFICULTIES = [
  {
    id: "EASY",
    name: "Easy",
    description: "15 min avg per question",
    expectedTime: "~30 min total",
    color: "border-green-300 dark:border-green-700 hover:border-green-500",
    activeColor: "border-green-500 bg-green-50 dark:bg-green-950/50",
    badgeColor: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  },
  {
    id: "MEDIUM",
    name: "Medium",
    description: "25 min avg per question",
    expectedTime: "~50 min total",
    color: "border-yellow-300 dark:border-yellow-700 hover:border-yellow-500",
    activeColor: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
    badgeColor: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  },
];

export default function MockInterviewSetupPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [loading, setLoading] = useState(false);

  const canStart = selectedCompany && selectedDifficulty;

  const handleStart = async () => {
    if (!canStart) return;
    setLoading(true);

    try {
      const result = await startInterview(selectedCompany, selectedDifficulty);

      if (!result.success) {
        toast.error(result.message || "Failed to start interview");
        return;
      }

      toast.success("Interview started! Good luck.");
      router.push(`/mock-interview/${result.data.id}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            Mock Interview Setup
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            Configure Your Interview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Select a company and difficulty. Once started, the 60-minute timer
            begins immediately.
          </p>
        </div>

        {/* Company Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Company
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMPANIES.map((company) => {
              const isSelected = selectedCompany === company.id;
              return (
                <Card
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    isSelected ? company.activeColor : company.color
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${company.dot}`}
                      />
                      <CardTitle className="text-base text-gray-900 dark:text-white">
                        {company.name}
                      </CardTitle>
                      {isSelected && (
                        <Badge
                          className={`ml-auto text-xs ${company.badgeColor}`}
                          variant="secondary"
                        >
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {company.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Difficulty
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <Card
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`cursor-pointer border-2 transition-all duration-200 ${
                    isSelected ? diff.activeColor : diff.color
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base text-gray-900 dark:text-white">
                        {diff.name}
                      </CardTitle>
                      {isSelected && (
                        <Badge
                          className={`ml-auto text-xs ${diff.badgeColor}`}
                          variant="secondary"
                        >
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {diff.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {diff.expectedTime}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Summary */}
        {canStart && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Company</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {COMPANIES.find((c) => c.id === selectedCompany)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-300">
                Difficulty
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {DIFFICULTIES.find((d) => d.id === selectedDifficulty)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-300">
                Questions
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                2 problems
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-300">
                Time Limit
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                60 minutes
              </span>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Once you click{" "}
            <strong className="text-gray-900 dark:text-white">
              Begin Interview
            </strong>
            , the 60-minute timer starts immediately. You cannot pause or
            restart the session.
          </p>
        </div>

        {/* Start Button */}
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!canStart || loading}
          className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Starting Interview...
            </>
          ) : (
            <>
              Begin Interview
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}