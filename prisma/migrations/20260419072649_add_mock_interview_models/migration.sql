-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "expectedTime" INTEGER NOT NULL DEFAULT 1500,
ADD COLUMN     "primaryTag" TEXT NOT NULL DEFAULT 'Array';

-- CreateTable
CREATE TABLE "MockSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "totalTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockSessionQuestion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "timeTaken" INTEGER,
    "questionStartTime" TIMESTAMP(3),
    "questionEndTime" TIMESTAMP(3),
    "submissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockSessionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MockSession_userId_idx" ON "MockSession"("userId");

-- CreateIndex
CREATE INDEX "MockSession_status_idx" ON "MockSession"("status");

-- CreateIndex
CREATE INDEX "MockSessionQuestion_sessionId_idx" ON "MockSessionQuestion"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "MockSessionQuestion_sessionId_order_key" ON "MockSessionQuestion"("sessionId", "order");

-- AddForeignKey
ALTER TABLE "MockSession" ADD CONSTRAINT "MockSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockSessionQuestion" ADD CONSTRAINT "MockSessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "MockSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockSessionQuestion" ADD CONSTRAINT "MockSessionQuestion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
