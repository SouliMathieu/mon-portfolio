"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("about.contact");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-navy-light border border-offwhite/10 rounded-xl px-4 py-3 text-sm text-offwhite placeholder-offwhite/30 focus:outline-none focus:border-ndvi transition-colors";

  return (
    <Card className="max-w-md mt-6">
      <h3 className="font-display text-lg font-semibold text-offwhite mb-6">
        {t("title")}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={t("form_name")}
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder={t("form_email")}
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <textarea
          name="message"
          placeholder={t("form_message")}
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className={inputClass + " resize-none"}
        />
        {status === "success" && (
          <p className="text-sm text-ndvi">{t("form_success")}</p>
        )}
        {status === "error" && (
          <p className="text-sm text-nebula-pink">{t("form_error")}</p>
        )}
        <Button
          variant="primary"
          type="submit"
          disabled={status === "loading"}
          className="w-full justify-center"
        >
          {status === "loading" ? "..." : t("form_submit")}
        </Button>
      </form>
    </Card>
  );
}