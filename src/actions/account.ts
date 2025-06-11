"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

type FormData = {
  name: string;
  email: string;
  location: string;
  phone: string;
  address?: string | undefined;
};

export async function createAccount(formData: FormData) {
  const result = await api.userAccount.createUserAccount(formData);

  if (!result) {
    return { success: false, msg: "Failed to create account." };
  }

  revalidatePath("/");
  revalidatePath("/accounts");

  return { success: true, msg: "Account deleted successfully." };
}
