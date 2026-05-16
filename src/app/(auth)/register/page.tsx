import Link from "next/link";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground font-display text-lg font-bold">
              B
            </span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Crear cuenta</h1>
          <p className="mt-1 text-sm text-foreground-secondary">Necesitamos algunos datos para reservar.</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-foreground-secondary">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Ingresa
          </Link>
        </p>
      </div>
    </div>
  );
}
