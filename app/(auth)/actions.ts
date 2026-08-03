"use server";

import { redirect } from "next/navigation";
import { createUser, verifyLogin, startSession, endSession } from "@/lib/auth";

export type AuthState = { error?: string };

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const result = await createUser(name, email, password);
  if (result.error) return { error: result.error };

  await startSession(result.userId!);
  redirect("/app");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const userId = await verifyLogin(email, password);
  if (!userId) return { error: "Invalid email or password." };

  await startSession(userId);
  redirect("/app");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/login");
}
