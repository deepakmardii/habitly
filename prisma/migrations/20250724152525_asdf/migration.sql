/*
  Warnings:

  - A unique constraint covering the columns `[habitId,userId,completion_date]` on the table `HabitCompletion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `HabitCompletion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HabitCompletion_habitId_completion_date_key";

-- AlterTable
ALTER TABLE "HabitCompletion" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HabitCompletion_habitId_userId_completion_date_key" ON "HabitCompletion"("habitId", "userId", "completion_date");

-- AddForeignKey
ALTER TABLE "HabitCompletion" ADD CONSTRAINT "HabitCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
