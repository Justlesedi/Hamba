import { RecoverFooter } from "@/components/auth/recover-footer";
import { RecoverEmailForm } from "@/components/auth/recover-email-form";
import { BrandMark } from "@/components/layout/brand-mark";

export const metadata = { title: "Forgot email" };

export default function Page() {
  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">Find the sign-in email.</h1>
      <p className="mt-2 mb-8 text-muted">
        Hamba has no separate username — the email is how you come back. Enter
        the name on the account and we send that email to the inbox.
      </p>
      <RecoverEmailForm />
      <RecoverFooter />
    </div>
  );
}
