import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo />
          {user && (
            <nav className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                render={<Link href="/" />}
                nativeButton={false}
              >
                Generate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                render={<Link href="/history" />}
                nativeButton={false}
              >
                History
              </Button>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
