import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentUser } from "@/lib/dal";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader user={user} />
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</div>
      <SiteFooter />
    </div>
  );
}
