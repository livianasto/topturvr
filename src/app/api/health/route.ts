import { NextResponse } from "next/server";
import { prisma } from "@/shared/db/prisma";
import { logger } from "@/shared/logging/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "health check failed");
    return NextResponse.json(
      { status: "error", db: "down", timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}
