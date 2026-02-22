"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

type State = { error?: string; success?: string } | null | undefined;

export default function ResetPasswordPage() {
  const t = useTranslations("common");
  const tr = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [requestState, requestAction, requestPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      return requestPasswordResetAction(formData);
    },
    null
  );

  const [resetState, resetAction, resetPending] = useActionState(
    async (_prev: State, formData: FormData): Promise<State> => {
      return resetPasswordAction(formData);
    },
    null
  );

  // Token present — show new password form
  if (token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{tr("newPasswordTitle")}</CardTitle>
            <CardDescription>{tr("newPasswordDesc")}</CardDescription>
          </CardHeader>
          <form action={resetAction}>
            <input type="hidden" name="token" value={token} />
            <CardContent className="space-y-4">
              {resetState?.error && (
                <p className="text-sm text-destructive">{resetState.error}</p>
              )}
              {resetState?.success && (
                <div>
                  <p className="text-sm text-green-600">{resetState.success}</p>
                  <Link
                    href="/auth/signin"
                    className="mt-2 block text-sm text-primary hover:underline"
                  >
                    {t("signIn")}
                  </Link>
                </div>
              )}
              {!resetState?.success && (
                <div className="space-y-2">
                  <Label htmlFor="password">{tr("newPassword")}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              )}
            </CardContent>
            {!resetState?.success && (
              <CardFooter>
                <Button type="submit" className="w-full" disabled={resetPending}>
                  {tr("setPassword")}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
      </div>
    );
  }

  // No token — show email request form
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{tr("title")}</CardTitle>
          <CardDescription>{tr("description")}</CardDescription>
        </CardHeader>
        <form action={requestAction}>
          <CardContent className="space-y-4">
            {requestState?.error && (
              <p className="text-sm text-destructive">{requestState.error}</p>
            )}
            {requestState?.success && (
              <p className="text-sm text-green-600">{requestState.success}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={requestPending}>
              {tr("sendLink")}
            </Button>
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:underline"
            >
              {tr("backToSignIn")} {t("signIn")}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
