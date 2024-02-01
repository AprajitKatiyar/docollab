-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled',
    "isShareable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsUsers" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "isOwner" BOOLEAN NOT NULL,

    CONSTRAINT "ProjectsUsers_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "order" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "order" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
