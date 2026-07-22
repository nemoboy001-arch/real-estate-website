"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail, Loader2, Sparkles, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to send reset link.");
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
            Vertex Brokerage
          </span>
          <h2 className="mt-6 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Enter your email and we will send you a link to reset your password.
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
            <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Reset Link Sent</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Please check your inbox for a password reset link. Click it to set a new password.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex w-full justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-center text-xs uppercase tracking-wider shadow-md transition-all disabled:bg-slate-300 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center mt-6">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
