"use server";

import { signOut } from "~/server/auth";

export default async function signOutAction() {
  console.log("Signing out user...");
  await signOut();
}
