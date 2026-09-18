"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { UserPlus, Mail, Lock, Phone, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Graceful local sign-up mockup
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
      setSuccess(true);
      return;
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred during registration.");
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
            Peculiar Aesthetics
          </span>
          <h2 className="mt-6 text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Create Agent Account
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Join Peculiar Aesthetics to list premium properties and manage clients.
          </p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex gap-2.5 items-start">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold">Supabase is not configured yet.</p>
              <p className="mt-1 opacity-90 leading-relaxed">
                The sign-up will run in demo/mock mode. Set up `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your environment variables to connect.
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

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Registration Successful!</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your agent profile has been created. If Supabase is active, please check your inbox for a confirmation email, then log in.
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Sarah Jenkins"
                  {...register("fullName")}
                  className={`w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                    errors.fullName ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-3xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="(555) 124-5678"
                  {...register("phone")}
                  className={`w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-3xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="agent@peculiaraesthetics.com"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
