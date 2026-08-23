import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/shared/env";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from "../src/shared/rbac/permissions";
import { logger } from "../src/shared/logging/logger";

const prisma = new PrismaClient();

const ROLE_LABELS: Record<string, string> = {
  direcao_geral: "Direção geral",
  gestao_operacao: "Gestão e operação",
};

async function seedPermissions() {
  for (const key of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key },
      update: {},
    });
  }
}

async function seedRoles() {
  for (const [roleName, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      create: { name: roleName, label: ROLE_LABELS[roleName] ?? roleName },
      update: { label: ROLE_LABELS[roleName] ?? roleName },
    });

    for (const key of permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }
}

async function seedUser(email: string | undefined, password: string | undefined, roleName: string) {
  if (!email || !password) {
    logger.warn(
      { roleName },
      "credenciais de seed ausentes - pulando criacao de usuario para este papel",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    create: { name: email, email, passwordHash, status: "ACTIVE" },
    update: { passwordHash },
  });

  const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    create: { userId: user.id, roleId: role.id },
    update: {},
  });
}

async function main() {
  logger.info("seed: iniciando");
  await seedPermissions();
  await seedRoles();
  await seedUser(env.SEED_ROGERIO_EMAIL, env.SEED_ROGERIO_PASSWORD, "direcao_geral");
  await seedUser(env.SEED_LIVIA_EMAIL, env.SEED_LIVIA_PASSWORD, "gestao_operacao");
  logger.info("seed: concluido");
}

main()
  .catch((err) => {
    logger.error({ err }, "seed: falhou");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
