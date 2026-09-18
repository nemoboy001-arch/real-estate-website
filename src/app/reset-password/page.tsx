"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Lock, Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent pointer-events-none" />

        <div className="text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Sparkles className="h-3 w-3" />
            Peculiar Aesthetics
          </span>
          <h2 className="mt-6 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Choose New Password
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Type your new secure password below to complete the reset.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex gap-2.5 items-start">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <p className="font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-650">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Password Updated!</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your password has been changed successfully. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
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

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                    errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-3xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-center text-xs uppercase tracking-wider shadow-md transition-all disabled:bg-slate-300 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
