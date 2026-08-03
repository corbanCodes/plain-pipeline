import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthForm } from "../auth-form";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Sign in — Plain Pipeline" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/app");
  return <AuthForm mode="login" action={loginAction} />;
}
