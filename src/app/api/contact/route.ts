import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    // Sauvegarde en base
    const saved = await prisma.contactMessage.create({
      data: { name, email, message },
    });
   

    // Envoi email
    const emailResult = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "mathieusouli35@gmail.com",
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message depuis le portfolio</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur API contact :", error);
    return NextResponse.json(
      { error: "Erreur serveur, réessaie plus tard." },
      { status: 500 }
    );
  }
}