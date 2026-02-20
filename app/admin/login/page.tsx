"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
          placeholder="admin@fredoburger.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-zinc-300">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-white placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-orange-600 py-2.5 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="w-full max-w-md rounded-2xl bg-zinc-800 p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Fredo Burger
        </h1>
        <p className="mb-8 text-center text-zinc-400">Panel de Administración</p>
        <Suspense fallback={<div className="text-center text-zinc-400">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
