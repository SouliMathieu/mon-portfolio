import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/nav/Header";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header locale={locale} />
      {/* pt-20 compense la hauteur fixe du header (h-20) pour éviter que le
          contenu ne passe dessous */}
      <div className="pt-20">{children}</div>
    </NextIntlClientProvider>
  );
}