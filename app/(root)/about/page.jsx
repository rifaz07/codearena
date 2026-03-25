import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Code2,
  Zap,
  Trophy,
  Users,
  Database,
  Shield,
  CheckCircle2,
  ArrowRight,
  Github,
  Globe,
} from "lucide-react";

const AboutPage = () => {
  const techStack = [
    { name: "Next.js 15", description: "Full-stack React framework", color: "bg-black text-white" },
    { name: "PostgreSQL", description: "Relational database", color: "bg-blue-600 text-white" },
    { name: "Prisma", description: "Type-safe ORM", color: "bg-indigo-600 text-white" },
    { name: "Clerk", description: "Authentication", color: "bg-purple-600 text-white" },
    { name: "Judge0", description: "Code execution engine", color: "bg-amber-500 text-white" },
    { name: "shadcn/ui", description: "UI components", color: "bg-zinc-800 text-white" },
    { name: "Tailwind CSS", description: "Utility-first CSS", color: "bg-cyan-500 text-white" },
    { name: "Docker", description: "Containerization", color: "bg-blue-500 text-white" },
  ];

  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-amber-500" />,
      title: "Multi-language Support",
      description: "Write and execute code in JavaScript, Python, and Java with real-time feedback.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Real-time Code Execution",
      description: "Powered by Judge0 engine — your code runs instantly with accurate results.",
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      title: "Track Your Progress",
      description: "View submission history, solved problems, and performance stats on your profile.",
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-500" />,
      title: "Role-based Access",
      description: "Admin can create and manage problems. Users can solve and track their journey.",
    },
    {
      icon: <Database className="w-6 h-6 text-amber-500" />,
      title: "Persistent Storage",
      description: "All submissions, solutions, and playlists are saved to your account.",
    },
    {
      icon: <Users className="w-6 h-6 text-amber-500" />,
      title: "GitHub OAuth",
      description: "Sign in instantly with your GitHub account — no passwords needed.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign in with GitHub",
      description: "One click login with your GitHub account via Clerk authentication.",
    },
    {
      number: "02",
      title: "Browse Problems",
      description: "Explore problems filtered by difficulty — Easy, Medium, or Hard.",
    },
    {
      number: "03",
      title: "Write Your Solution",
      description: "Use our Monaco code editor to write your solution in your preferred language.",
    },
    {
      number: "04",
      title: "Submit and Get Results",
      description: "Judge0 runs your code against all test cases and gives instant feedback.",
    },
  ];

  return (
    <div className="min-h-screen mt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            About CodeArena
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white">
            Built for Developers,{" "}
            <span className="text-amber-500">by Developers</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CodeArena is a full-stack LeetCode clone built with modern technologies.
            Practice coding problems, get instant feedback, and track your progress —
            all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/problems">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
                Start Solving <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com/rifaz07/codearena" target="_blank">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" /> View on GitHub
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to{" "}
              <span className="text-amber-500">level up</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Packed with features to make your coding practice effective and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How it <span className="text-amber-500">works</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Get started in minutes — no complex setup required.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="space-y-3">
                  <div className="text-5xl font-black text-amber-500/20">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="w-5 h-5 text-amber-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Built with <span className="text-amber-500">modern tech</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Industry-standard technologies used by top companies.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="pt-4 pb-4">
                  <div className="space-y-2">
                    <Badge className={`${tech.color} text-xs`}>
                      {tech.name}
                    </Badge>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Ready to start coding?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Join CodeArena and start solving problems today.
            Track your progress and become a better developer!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/problems">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2" size="lg">
                Browse Problems <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="gap-2">
                <Globe className="w-4 h-4" /> Get Started Free
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;