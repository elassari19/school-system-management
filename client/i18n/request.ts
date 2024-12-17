import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { headers } from "next/headers";

export default getRequestConfig(async ({ locale }) => {
  const header = await headers();
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(header.get("X-NEXT-INTL-LOCALE") as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
