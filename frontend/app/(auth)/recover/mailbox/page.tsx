import Link from "next/link";
import { notFound } from "next/navigation";
import { RecoverFooter } from "@/components/auth/recover-footer";
import { BrandMark } from "@/components/layout/brand-mark";
import { isLocalMailboxOpen, listRecoveryMail } from "@backend/lib/mail";

export const metadata = { title: "Local mailbox" };

function linkFromBody(body: string) {
  const match = body.match(/https?:\/\/\S+/);
  return match?.[0];
}

export default function Page() {
  if (!isLocalMailboxOpen()) {
    notFound();
  }

  const notes = listRecoveryMail();

  return (
    <div>
      <BrandMark href="/" size="auth" />
      <h1 className="mt-6 font-display text-4xl">Local mailbox.</h1>
      <p className="mt-2 mb-8 text-muted">
        Recovery notes live here while Hamba runs on this computer. Live Hamba
        sends them only to the inbox.
      </p>
      {notes.length === 0 ? (
        <p className="text-sm text-muted">No recovery notes yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => {
            const href = linkFromBody(note.body);
            return (
              <li
                key={note.id}
                className="rounded-3xl border border-border bg-card px-5 py-4"
              >
                <p className="text-xs uppercase tracking-wide text-muted">
                  {note.purpose === "password" ? "Password" : "Email"} ·{" "}
                  {note.toEmail}
                </p>
                <p className="mt-2 font-medium">{note.subject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                  {note.body}
                </p>
                {href ? (
                  <Link
                    href={href}
                    className="mt-3 inline-block text-sm font-medium text-foreground"
                  >
                    Open this link
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <RecoverFooter />
    </div>
  );
}
