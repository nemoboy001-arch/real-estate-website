"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Agent } from "@/data/mockData";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactAgentFormProps {
  agent?: Agent;
  propertyName?: string;
  propertyId?: string;
}

export default function ContactAgentForm({ agent, propertyName, propertyId }: ContactAgentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: propertyName ? `Hi, I am interested in "${propertyName}". Please send me details.` : "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          propertyName,
          propertyId,
          agentId: agent?.id,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to send inquiry.");
      }

      setTicketId(resData.inquiry?.ticketId || `INQ-${Math.floor(10000 + Math.random() * 90000)}`);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Contact inquiry error:", err);
      setApiError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {agent && (
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-slate-50">
            <Image
              src={agent.photo}
              alt={agent.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Inquiry for {agent.name}</h4>
            <p className="text-xs text-slate-500">{agent.title}</p>
          </div>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Inquiry Submitted!</h4>
          {ticketId && (
            <p className="text-xs font-semibold text-blue-600 my-2">
              Ticket ID: <span className="font-mono">{ticketId}</span>
            </p>
          )}
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            Thank you. We have received your inquiry and an agent will contact you shortly.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-6 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("name")}
              className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {errors.name && <p className="text-3xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              {...register("email")}
              className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {errors.email && <p className="text-3xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. (555) 123-4567"
              {...register("phone")}
              className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {errors.phone && <p className="text-3xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Message</label>
            <textarea
              rows={4}
              placeholder="Tell us what you're looking for..."
              {...register("message")}
              className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 resize-none ${
                errors.message ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {errors.message && <p className="text-3xs text-red-500 mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-slate-800 disabled:bg-slate-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Inquiry...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Inquiry
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
