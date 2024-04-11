-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "forgetPassword" TEXT NOT NULL,
    "validity" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "room_id" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "resolverId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "transaction_id" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Room_resolverId_key" ON "Room"("resolverId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_ownerId_key" ON "Review"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_aboutId_key" ON "Review"("aboutId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_ownerId_key" ON "Payment"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transaction_id_key" ON "Payment"("transaction_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_resolverId_fkey" FOREIGN KEY ("resolverId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
