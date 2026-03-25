import { getJudge0LanguageId, pollBatchResults, submitBatch } from "@/lib/judge0";
import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";

import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    //validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 }
      );
    }

    if (!referenceSolutions || typeof referenceSolutions !== "object") {
      return NextResponse.json(
        {
          error:
            "Reference solutions must be provided for all supported languages",
        },
        { status: 400 }
      );
    }

    //VALIDATION
    for (const [language, solutionCode] of Object.entries(
      referenceSolutions
    )) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        console.warn(`Unsupported language skipped: ${language}`);
        continue;
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      try {
        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          const actualOutput =
            result.stdout ??
            result.stderr ??
            result.compile_output ??
            null;

          console.log(`Test case ${i + 1} (${language})`, {
            input: submissions[i].stdin,
            expected: submissions[i].expected_output,
            actual: actualOutput,
            status: result.status,
          });

          
          if (result.status.id !== 3) {
            console.warn("Validation failed", {
              language,
              testCase: submissions[i],
              result,
            });
          }
        }
      } catch (judgeError) {
        console.error("Judge0 error (ignored):", judgeError);
      }
    }

    //SAVE PROBLEM
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 CREATE PROBLEM ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}