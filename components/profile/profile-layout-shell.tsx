import { ProfileSidebar } from "@/components/profile/profile-sidebar";

export function ProfileLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <ProfileSidebar />
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
