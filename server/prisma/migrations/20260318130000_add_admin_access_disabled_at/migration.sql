-- Add missing adminAccessDisabledAt column to User table
ALTER TABLE "User"
ADD COLUMN "adminAccessDisabledAt" TIMESTAMP(3);
