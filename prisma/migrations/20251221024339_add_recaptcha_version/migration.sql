/*
  Warnings:

  - You are about to drop the column `footerDocuments` on the `SiteConfig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "headCode" TEXT,
    "footerCode" TEXT,
    "accessibilityInfo" TEXT,
    "accessibilityDeclarationContent" TEXT,
    "privacyPolicyContent" TEXT,
    "cookiePolicyContent" TEXT,
    "recaptchaSiteKey" TEXT,
    "recaptchaSecretKey" TEXT,
    "recaptchaVersion" TEXT DEFAULT 'v2',
    "googleAnalyticsId" TEXT,
    "googleCalendarId" TEXT,
    "showEvents" BOOLEAN NOT NULL DEFAULT true,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "isMaintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT
);
INSERT INTO "new_SiteConfig" ("aboutUsGoals", "aboutUsJoinText", "aboutUsSublinks", "aboutUsText", "accessibilityInfo", "cookiePolicyContent", "email", "emailForApplications", "emailForContact", "enableHeroSlider", "facebookUrl", "faviconUrl", "footerCode", "googleAnalyticsId", "googleCalendarId", "headCode", "id", "instagramUrl", "isMaintenanceMode", "logoUrl", "maintenanceMessage", "ogImageUrl", "orgAddress", "orgBankAccount", "orgName", "orgNip", "orgRegon", "phone", "privacyPolicyContent", "recaptchaSecretKey", "recaptchaSiteKey", "seoAuthor", "seoDescription", "seoKeywords", "seoRobots", "seoTitle", "showBoard", "showCollaborators", "showCoordinators", "showEvents", "showHero", "showNews", "showOffice", "showPartners", "showProjects", "showStats", "siteName", "smtpFrom", "smtpHost", "smtpPassword", "smtpPort", "smtpUser", "staticHeroAlignment", "staticHeroAuthor", "staticHeroImage", "staticHeroSubtitle", "staticHeroTitle", "tiktokUrl", "updatedAt") SELECT "aboutUsGoals", "aboutUsJoinText", "aboutUsSublinks", "aboutUsText", "accessibilityInfo", "cookiePolicyContent", "email", "emailForApplications", "emailForContact", "enableHeroSlider", "facebookUrl", "faviconUrl", "footerCode", "googleAnalyticsId", "googleCalendarId", "headCode", "id", "instagramUrl", "isMaintenanceMode", "logoUrl", "maintenanceMessage", "ogImageUrl", "orgAddress", "orgBankAccount", "orgName", "orgNip", "orgRegon", "phone", "privacyPolicyContent", "recaptchaSecretKey", "recaptchaSiteKey", "seoAuthor", "seoDescription", "seoKeywords", "seoRobots", "seoTitle", "showBoard", "showCollaborators", "showCoordinators", "showEvents", "showHero", "showNews", "showOffice", "showPartners", "showProjects", "showStats", "siteName", "smtpFrom", "smtpHost", "smtpPassword", "smtpPort", "smtpUser", "staticHeroAlignment", "staticHeroAuthor", "staticHeroImage", "staticHeroSubtitle", "staticHeroTitle", "tiktokUrl", "updatedAt" FROM "SiteConfig";
DROP TABLE "SiteConfig";
ALTER TABLE "new_SiteConfig" RENAME TO "SiteConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
