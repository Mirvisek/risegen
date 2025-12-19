/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "bio" TEXT,
    "categories" TEXT NOT NULL DEFAULT '[]',
    "email" TEXT,
    "phone" TEXT,
    "alignment" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomeHeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "author" TEXT,
    "alignment" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "instagram" TEXT,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "birthDate" DATETIME,
    "assignedUserId" TEXT,
    "deletionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Application" ("assignedUserId", "birthDate", "createdAt", "deletionReason", "description", "email", "firstName", "id", "instagram", "lastName", "phone", "status") SELECT "assignedUserId", "birthDate", "createdAt", "deletionReason", "description", "email", "firstName", "id", "instagram", "lastName", "phone", "status" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "documents" TEXT NOT NULL DEFAULT '[]',
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_News" ("content", "createdAt", "id", "images", "slug", "title", "updatedAt") SELECT "content", "createdAt", "id", "images", "slug", "title", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "documents" TEXT NOT NULL DEFAULT '[]',
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'CURRENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("content", "createdAt", "description", "id", "images", "isHighlight", "slug", "title", "updatedAt") SELECT "content", "createdAt", "description", "id", "images", "isHighlight", "slug", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE TABLE "new_SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "orgName" TEXT,
    "orgAddress" TEXT,
    "orgNip" TEXT,
    "orgRegon" TEXT,
    "orgBankAccount" TEXT,
    "siteName" TEXT,
    "logoUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "showBoard" BOOLEAN NOT NULL DEFAULT true,
    "showOffice" BOOLEAN NOT NULL DEFAULT true,
    "showCoordinators" BOOLEAN NOT NULL DEFAULT true,
    "showCollaborators" BOOLEAN NOT NULL DEFAULT true,
    "showHero" BOOLEAN NOT NULL DEFAULT true,
    "showNews" BOOLEAN NOT NULL DEFAULT true,
    "showProjects" BOOLEAN NOT NULL DEFAULT true,
    "showPartners" BOOLEAN NOT NULL DEFAULT true,
    "enableHeroSlider" BOOLEAN NOT NULL DEFAULT true,
    "staticHeroTitle" TEXT,
    "staticHeroSubtitle" TEXT,
    "staticHeroImage" TEXT,
    "staticHeroAlignment" TEXT NOT NULL DEFAULT 'center',
    "staticHeroAuthor" TEXT,
    "aboutUsText" TEXT,
    "aboutUsGoals" TEXT,
    "aboutUsJoinText" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFrom" TEXT,
    "emailForApplications" TEXT,
    "emailForContact" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "seoAuthor" TEXT,
    "seoRobots" TEXT,
    "faviconUrl" TEXT,
    "ogImageUrl" TEXT,
    "aboutUsSublinks" TEXT,
    "footerDocuments" TEXT,
    "headCode" TEXT,
    "footerCode" TEXT,
    "accessibilityInfo" TEXT,
    "recaptchaSiteKey" TEXT,
    "recaptchaSecretKey" TEXT,
    "googleAnalyticsId" TEXT
);
INSERT INTO "new_SiteConfig" ("id", "orgAddress", "orgName", "orgNip", "orgRegon", "updatedAt") SELECT "id", "orgAddress", "orgName", "orgNip", "orgRegon", "updatedAt" FROM "SiteConfig";
DROP TABLE "SiteConfig";
ALTER TABLE "new_SiteConfig" RENAME TO "SiteConfig";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "roles" TEXT NOT NULL DEFAULT '["EDITOR"]',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "mustChangePassword", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "mustChangePassword", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
