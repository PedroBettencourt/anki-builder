/*
  Warnings:

  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - Added the required column `username` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Card" DROP CONSTRAINT "Card_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Card" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
