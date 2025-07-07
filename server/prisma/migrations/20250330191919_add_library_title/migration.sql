-- CreateTable
CREATE TABLE "LibraryTitle" (
    "id" SERIAL NOT NULL,
    "idInSource" INTEGER NOT NULL,
    "sourceName" TEXT NOT NULL,
    "urlInSource" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LibraryTitle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LibraryTitle" ADD CONSTRAINT "LibraryTitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
