import { prisma } from "@/lib/prisma";
import MessageRow from "@/components/admin/messages/MessageRow";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
        Messages
      </h1>
      <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-8">
        {messages.length} message{messages.length > 1 ? "s" : ""}
        {unreadCount > 0 &&
          ` · ${unreadCount} non lu${unreadCount > 1 ? "s" : ""}`}
      </p>

      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageRow
            key={msg.id}
            message={{
              id: msg.id,
              name: msg.name,
              email: msg.email,
              message: msg.message,
              isRead: msg.isRead,
              createdAt: msg.createdAt.toISOString(),
            }}
          />
        ))}
      </div>

      {messages.length === 0 && (
        <p className="text-sm text-[#F4F6F8]/50 text-center py-12">
          Aucun message reçu pour l&apos;instant.
        </p>
      )}
    </div>
  );
}