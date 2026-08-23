import { describe, expect, it, vi, beforeEach } from "vitest";

const queryRawMock = vi.fn();

vi.mock("@/shared/db/prisma", () => ({
  prisma: { $queryRaw: (...args: unknown[]) => queryRawMock(...args) },
}));

vi.mock("@/shared/logging/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

describe("/api/health", () => {
  beforeEach(() => {
    queryRawMock.mockReset();
  });

  it("retorna 200 e status ok quando o banco responde", async () => {
    queryRawMock.mockResolvedValueOnce([{ "?column?": 1 }]);
    const { GET } = await import("./route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.db).toBe("up");
  });

  it("retorna 503 e status error quando o banco falha", async () => {
    queryRawMock.mockRejectedValueOnce(new Error("connection refused"));
    const { GET } = await import("./route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("error");
    expect(body.db).toBe("down");
  });
});
