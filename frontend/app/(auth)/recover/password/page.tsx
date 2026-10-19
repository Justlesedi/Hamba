import { RecoverFooter } from "@/components/auth/recover-footer";
import { RecoverPasswordForm } from "@/components/auth/recover-password-form";
import { BrandMark } from "@/components/layout/brand-mark";

export const metadata = { title: "Forgot password" };

export default function Page() {
  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">Choose a new password.</h1>
      <p className="mt-2 mb-8 text-muted">
        Enter the email you sign in with. If it is on Hamba, we send a link that
        lasts 30 minutes.
      </p>
      <RecoverPasswordForm />
      <RecoverFooter />
    </div>
  );
}
