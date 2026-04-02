"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpWithEmail } from "@/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await signUpWithEmail(formData);
      if (result?.error) setError(result.error);
      if (result?.success) setMessage(result.success);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{APP_NAME}</CardTitle>
        <CardDescription>Create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-destructive text-center">{error}</p>
        )}
        {message && (
          <p className="mt-3 text-sm text-green-600 dark:text-green-400 text-center">{message}</p>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
