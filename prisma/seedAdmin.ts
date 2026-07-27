import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

// Email utilisé pour se connecter au backoffice.
// Modifie cette valeur si tu veux un email différent de celui de contact.
const ADMIN_EMAIL = "souli.mathieu@etu.uae.ac.ma";

function generateTempPassword(length = 14): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

async function main() {
  const existing = await prisma.admin.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log("\n⚠️  Un admin existe déjà avec cet email :", ADMIN_EMAIL);
    console.log(
      "   Aucun changement effectué. Supprime-le manuellement (Prisma Studio) si tu veux le régénérer.\n"
    );
    return;
  }

  const tempPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.admin.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
    },
  });

  console.log("\n✅ Compte admin créé avec succès !");
  console.log("─────────────────────────────────────────");
  console.log("Email    :", ADMIN_EMAIL);
  console.log("Password :", tempPassword);
  console.log("─────────────────────────────────────────");
  console.log(
    "⚠️  Note ce mot de passe maintenant, il ne sera plus jamais affiché.\n"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });