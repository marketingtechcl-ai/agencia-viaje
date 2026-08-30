import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function PortalLayout({ children }) {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
        <a href="/portal" className="font-semibold text-brand-dark">
          Mi viaje
        </a>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">
            {profile.full_name || profile.email}
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 bg-zinc-50 px-6 py-8">{children}</main>
    </div>
  );
}
