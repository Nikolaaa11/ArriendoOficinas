import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground font-display text-lg font-bold">
              B
            </span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Ingresar a BLOQUE</h1>
          <p className="mt-1 text-sm text-foreground-secondary">Usa tu correo y contraseña.</p>
        </div>
        <Suspense fallback={<div className="grid place-items-center h-32"><LoadingSpinner /></div>}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-foreground-secondary">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
