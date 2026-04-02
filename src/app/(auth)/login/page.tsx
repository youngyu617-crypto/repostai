"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signInWithEmail, signInWithMagicLink } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "magic") {
        const result = await signInWithMagicLink(formData);
        if (result?.error) setError(result.error);
        if (result?.success) setMessage(result.success);
      } else {
        const result = await signInWithEmail(formData);
        if (result?.error) setError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={mode === "password" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setMode("password")}
            type="button"
          >
            Password
          </Button>
          <Button
            variant={mode === "magic" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setMode("magic")}
            type="button"
          >
            Magic Link
          </Button>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            required
            autoComplete="email"
          />
          {mode === "password" && (
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
            />
          )}
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "password" ? "Sign In" : "Send Magic Link"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        {message && (
          <p className="text-sm text-green-600 dark:text-green-400 text-center">{message}</p>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
