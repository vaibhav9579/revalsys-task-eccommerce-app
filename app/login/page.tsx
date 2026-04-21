import type { Metadata } from "next";
import { LoginClient } from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Mock login page that stores your profile in localStorage.",
};

export default function LoginPage() {
  return <LoginClient />;
}

