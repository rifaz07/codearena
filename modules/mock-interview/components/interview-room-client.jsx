"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import {
  Send,
  SkipForward,
  Code,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { getJudge0LanguageId } from "@/lib/judge0";

import {
  submitAnswer,
  skipQuestion,
  timeoutSession,
} from "@/modules/mock-interview/actions";
import InterviewTimer from "./interview-timer";
import QuestionPanel from "./question-panel";

const LANGUAGES = [
  { value: "JAVASCRIPT", label: "JavaScript" },
  { value: "PYTHON", label: "Python" },
  { value: "JAVA", label: "Java" },
];

const storageKey = (sessionId, order, language) =>
  `mock-interview:${sessionId}:q${order}:${language}`;

export default function InterviewRoomClient({
  session,
  initialTimeRemaining,
  initialQuestionOrder,
}) {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentOrder, setCurrentOrder] = useState(initialQuestionOrder ?? 1);
  const [questions, setQuestions] = useState(session.questions);
  const currentQuestion = questions.find((q) => q.order === currentOrder);
  const problem = currentQuestion?.problem;

  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const timeoutFiredRef = useRef(false);

  // Load code: localStorage draft → problem snippet fallback
  useEffect(() => {
    if (!problem) return;

    const key = storageKey(session.id, currentOrder, selectedLanguage);
    const draft =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;

    if (draft !== null) {
      setCode(draft);
    } else {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
    }
  }, [problem, selectedLanguage, currentOrder, session.id]);

  // Autosave every 2s (only when editor is still editable)
  useEffect(() => {
    if (lastResult) return;
    const key = storageKey(session.id, currentOrder, selectedLanguage);
    const id = setTimeout(() => {
      try {
        localStorage.setItem(key, code);
      } catch {
        // quota exceeded — silent fail
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [code, session.id, currentOrder, selectedLanguage, lastResult]);

  const handleTimeout = useCallback(async () => {
    if (timeoutFiredRef.current) return;
    timeoutFiredRef.current = true;
    try {
      await timeoutSession(session.id);
    } catch (e) {
      console.error("timeoutSession failed:", e);
    } finally {
      toast.error("Time's up! Redirecting to results...");
      router.push(`/mock-interview/${session.id}/result`);
    }
  }, [session.id, router]);

  const handleSubmit = async () => {
    if (isSubmitting || lastResult) return;

    if (!code.trim()) {
      toast.error("Cannot submit empty code");
      return;
    }

    const languageId = getJudge0LanguageId(selectedLanguage);
    if (!languageId) {
      toast.error("Invalid language");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAnswer(
        session.id,
        currentOrder,
        code,
        languageId
      );

      if (!res.success) {
        toast.error(res.message || "Submission failed");
        return;
      }

      try {
        localStorage.removeItem(
          storageKey(session.id, currentOrder, selectedLanguage)
        );
      } catch {}

      setQuestions((prev) =>
        prev.map((q) =>
          q.order === currentOrder
            ? {
                ...q,
                status: res.data.passed ? "SOLVED" : "FAILED",
                submissionId: res.data.submissionId,
              }
            : q
        )
      );

      setLastResult(res.data);
      if (res.data.passed) {
        toast.success("All test cases passed!");
      } else {
        toast.error("Some test cases failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (isSkipping || lastResult) return;
    setIsSkipping(true);
    try {
      const res = await skipQuestion(session.id, currentOrder);

      if (!res.success) {
        toast.error(res.message || "Failed to skip");
        return;
      }

      try {
        localStorage.removeItem(
          storageKey(session.id, currentOrder, selectedLanguage)
        );
      } catch {}

      setQuestions((prev) =>
        prev.map((q) =>
          q.order === currentOrder ? { ...q, status: "SKIPPED" } : q
        )
      );

      toast.info(
        res.data.isLastQuestion
          ? "Question skipped. Redirecting to results..."
          : "Question skipped. Moving to Q2."
      );

      if (res.data.isLastQuestion) {
        router.push(`/mock-interview/${session.id}/result`);
      } else {
        setCurrentOrder(2);
        setLastResult(null);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to skip. Please try again.");
    } finally {
      setIsSkipping(false);
      setShowSkipDialog(false);
    }
  };

  const handleContinue = () => {
    if (!lastResult) return;
    if (lastResult.isLastQuestion) {
      router.push(`/mock-interview/${session.id}/result`);
    } else {
      setCurrentOrder(2);
      setLastResult(null);
    }
  };

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin size-6 text-amber-400" />
      </div>
    );
  }

  const q1Status = questions.find((q) => q.order === 1)?.status;

  return (
    <div className="min-h-screen mt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            >
              <Building2 className="w-3 h-3 mr-1" />
              {session.company}
            </Badge>

            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  currentOrder === 1
                    ? "bg-amber-500 text-white"
                    : q1Status === "SOLVED"
                    ? "bg-green-500 text-white"
                    : q1Status === "FAILED" || q1Status === "SKIPPED"
                    ? "bg-gray-400 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                Q1
              </Badge>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Badge
                className={cn(
                  currentOrder === 2
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                )}
              >
                Q2
              </Badge>
            </div>
          </div>

          <InterviewTimer
            initialSeconds={initialTimeRemaining}
            onTimeout={handleTimeout}
          />
        </div>

        {/* Main split */}
        <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
          {/* Left: problem */}
          <div className="overflow-hidden">
            <QuestionPanel
              problem={problem}
              selectedLanguage={selectedLanguage}
            />
          </div>

          {/* Right: editor + actions */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <Card className="flex flex-col flex-1 overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="h-4 w-4 text-amber-500" />
                    Code Editor
                  </CardTitle>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                    disabled={isSubmitting || !!lastResult}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
                <div className="border rounded-lg overflow-hidden flex-1 min-h-[300px]">
                  <Editor
                    height="100%"
                    language={
                      selectedLanguage.toLowerCase() === "javascript"
                        ? "javascript"
                        : selectedLanguage.toLowerCase()
                    }
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 15,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                      readOnly: isSubmitting || !!lastResult,
                    }}
                  />
                </div>

                {/* Actions */}
                {!lastResult ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isSkipping}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running tests...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSkipDialog(true)}
                      disabled={isSubmitting || isSkipping}
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900"
                  >
                    {lastResult.isLastQuestion
                      ? "View Results"
                      : "Continue to Q2"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Test results */}
            {lastResult && (
              <Card className="flex-shrink-0">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {lastResult.passed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">
                          All tests passed
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">
                          {lastResult.results.filter((r) => r.passed).length} /{" "}
                          {lastResult.results.length} tests passed
                        </span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {lastResult.results.map((r) => (
                        <div
                          key={r.testCase}
                          className={cn(
                            "flex items-center justify-between text-xs px-3 py-2 rounded-md border",
                            r.passed
                              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                          )}
                        >
                          <span className="font-medium">
                            Test Case {r.testCase}
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              r.passed
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                            )}
                          >
                            {r.passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Skip confirmation */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip this question?</AlertDialogTitle>
            <AlertDialogDescription>
              You won't be able to come back to Q{currentOrder}. This will be
              marked as skipped in your results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSkipping}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSkip}
              disabled={isSkipping}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSkipping ? "Skipping..." : "Yes, skip"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}