import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "capital_news_admin";

export function isValidAdminPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

export async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return session === "logged_in";
}