import Link from "next/link";
import { RecoverFooter } from "@/components/auth/recover-footer";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { BrandMark } from "@/components/layout/brand-mark";
import { isResetTokenOpen } from "@backend/server/recovery";
import { RECOVERY } from "@backend/lib/security";

export const metadata = { title: "Reset password" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const open = isResetTokenOpen(token);

  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">
        {open ? "A new door in." : "This link has closed."}
      </h1>
      <p className="mt-2 mb-8 text-muted">
        {open
          ? "Choose a strong password. Then sign in with it."
          : RECOVERY.expiredMessage}
      </p>
      {open ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm text-muted">
          <Link href="/recover/password" className="font-medium text-foreground">
            Request a new link
          </Link>
        </p>
      )}
      <RecoverFooter />
    </div>
  );
}
