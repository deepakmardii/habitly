/*
  Warnings:

  - You are about to drop the column `icon` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `emoji` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "icon",
ADD COLUMN     "emoji" TEXT NOT NULL,
ADD COLUMN     "tag" TEXT NOT NULL;
