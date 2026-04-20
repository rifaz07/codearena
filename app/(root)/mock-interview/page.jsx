import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Brain, BarChart3, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export default function MockInterviewPage() {
  const steps = [
    {
      step: "01",
      title: "Select Company & Difficulty",
      description:
        "Choose from Google, Amazon, or Microsoft. Pick Easy or Medium difficulty.",
    },
    {
      step: "02",
      title: "Solve 2 Real Problems",
      description:
        "60 minutes. 2 questions from different topics. Monaco editor — same as VS Code.",
    },
    {
      step: "03",
      title: "Get Detailed Feedback",
      description:
        "See your score, time analysis, weak areas, behavior insight, and next steps.",
    },
  ];

  const features = [
    {
      icon: <Timer className="w-5 h-5" />,
      title: "60 Minute Timer",
      description: "Real interview pressure. Server-side tracking — no cheating.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Behavior Insight",
      description:
        "Know if you spent too long on Q1. Real feedback, not just pass/fail.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Weak Area Detection",
      description:
        "System detects which topics you struggle with and recommends next problems.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real Code Execution",
      description:
        "Your code runs against real test cases via Judge0. No fake evaluation.",
    },
  ];

  return (
    <div className="min-h-screen mt-24">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          >
            <Zap className="w-3 h-3 mr-1" />
            Free Mock Interviews — No Paywall
          </Badge>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            Practice Like It's{" "}
            <span className="px-4 py-1 bg-amber-500 dark:bg-amber-400 text-white dark:text-gray-900 rounded-2xl inline-block">
              Real
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Take a timed 60-minute coding interview. Get feedback that tells you
            not just what went wrong — but{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              why
            </span>{" "}
            and{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              what to do next.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mock-interview/setup">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Start Mock Interview
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/problems">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600"
              >
                Browse Problems
              </Button>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-12 mt-14">
            {[
              { value: "60 min", label: "Per Session" },
              { value: "2", label: "Questions" },
              { value: "3", label: "Companies" },
              { value: "Free", label: "Always" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How it{" "}
              <span className="text-amber-600 dark:text-amber-400">works</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start a test in under 10 seconds. Get results in under 60 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                  <CardHeader>
                    <div className="text-4xl font-black text-amber-500 dark:text-amber-400 mb-2">
                      {step.step}
                    </div>
                    <CardTitle className="text-gray-900 dark:text-white text-lg">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 z-10">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What makes this{" "}
              <span className="text-amber-600 dark:text-amber-400">
                different
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Not just a timer and an editor. Real feedback that helps you improve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white text-base">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-300 dark:from-amber-600 dark:to-indigo-600 rounded-md mx-4 mb-8">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to test yourself?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            No scheduling. No cost. Start your mock interview right now.
          </p>
          <Link href="/mock-interview/setup">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              Start Now — It's Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}