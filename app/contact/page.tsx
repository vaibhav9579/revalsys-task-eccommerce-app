import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact form UI (no backend).",
};

export default function ContactPage() {
  return <ContactClient />;
}

