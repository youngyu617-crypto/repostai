import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <p className="text-xs text-muted-foreground">
            Made with &hearts; for creators
          </p>
        </div>
      </div>
    </footer>
  );
}
