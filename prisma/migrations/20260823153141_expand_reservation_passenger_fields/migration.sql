-- AlterTable
ALTER TABLE "reservation_passengers" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rg" TEXT;
