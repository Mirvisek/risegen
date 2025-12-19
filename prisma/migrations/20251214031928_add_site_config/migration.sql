-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "orgName" TEXT,
    "orgAddress" TEXT,
    "orgNip" TEXT,
    "orgRegon" TEXT,
    "updatedAt" DATETIME NOT NULL
);
