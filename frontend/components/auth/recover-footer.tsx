import Link from "next/link";

export function RecoverFooter() {
  return (
    <>
      <p className="mt-6 text-sm text-muted">
        <Link href="/sign-in" className="font-medium text-foreground">
          Sign in
        </Link>
        {" · "}
        <Link href="/sign-up" className="font-medium text-foreground">
          Create an account
        </Link>
      </p>
      <p className="mt-8 text-xs text-muted">
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/privacy">Privacy</Link>
        {" · "}
        <Link href="/terms">Terms</Link>
      </p>
    </>
  );
}
