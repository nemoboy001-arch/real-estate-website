"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Graceful local sign-in mockup
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
      router.push("/");
      return;
    }

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) throw signInError;

      if (signInData.user) {
        // Fetch profile to check where to redirect
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", signInData.user.id)
          .single();

        if (profile?.is_admin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent pointer-events-none" />

        <div className="text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Sparkles className="h-3 w-3" />
            Vertex Brokerage
          </span>
          <h2 className="mt-6 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Agent Sign In
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sign in to submit properties and access agent dashboard.
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex gap-2.5 items-start">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">Supabase is not configured yet.</p>
              <p className="mt-1 opacity-90 leading-relaxed">
                The sign-in will run in demo/mock mode. Set up `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to connect.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex gap-2.5 items-start">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <p className="font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="agent@vertexrealestate.com"
                {...register("email")}
                className={`w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                }`}
              />
            </div>
            {errors.email && <p className="text-3xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <Link
                href="/forgot-password"
                className="text-3xs font-extrabold uppercase tracking-wider text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                }`}
              />
            </div>
            {errors.password && <p className="text-3xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-center text-xs uppercase tracking-wider shadow-md transition-all disabled:bg-slate-300 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Don&apos;t have an agent account?{" "}
            <Link href="/signup" className="font-bold text-blue-600 hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
