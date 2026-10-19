import Link from "next/link";
import { RecoverFooter } from "@/components/auth/recover-footer";
import { BrandMark } from "@/components/layout/brand-mark";
import { isLocalMailboxOpen } from "@backend/lib/mail";
import { RECOVERY } from "@backend/lib/security";

export const metadata = { title: "Check your inbox" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  const { for: kind } = await searchParams;
  const password = kind === "password";

  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">Look in the inbox.</h1>
      <p className="mt-2 mb-8 text-muted">{RECOVERY.sentMessage}</p>
      <p className="text-sm text-muted">
        {password
          ? "The note has a link to choose a new password. It expires in 30 minutes."
          : "The note has the email you use to sign in."}
      </p>
      {isLocalMailboxOpen() ? (
        <p className="mt-6 text-sm text-muted">
          On this computer, recovery notes also wait in the{" "}
          <Link href="/recover/mailbox" className="font-medium text-foreground">
            local mailbox
          </Link>
          .
        </p>
      ) : null}
      <RecoverFooter />
    </div>
  );
}
