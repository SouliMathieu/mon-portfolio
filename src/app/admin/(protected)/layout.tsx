import Sidebar from "@/components/admin/Sidebar";

// Les pages admin sont protégées par authentification et affichent des
// données toujours à jour (projets, messages, etc.) — elles ne doivent
// jamais être pré-générées statiquement au moment du build.
export const dynamic = "force-dynamic";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#1B2838]">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}