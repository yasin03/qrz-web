import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

/** Form bileşenlerinin istemci metinleri (messages → forms) yalnızca form içeren sayfalara gönderilir. */
export async function FormMessages({ children }: { children: ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={{ forms: messages.forms }}>
      {children}
    </NextIntlClientProvider>
  );
}
