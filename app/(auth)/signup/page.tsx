import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AuthForm } from "../auth-form";
import { signupAction } from "../actions";

export const metadata: Metadata = { title: "Sign up — Plain Pipeline" };

export default async function SignupPage() {
  if (await getSessionUser()) redirect("/app");
  return <AuthForm mode="signup" action={signupAction} />;
}
