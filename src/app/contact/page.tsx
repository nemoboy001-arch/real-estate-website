"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, Compass } from "lucide-react";
import MapMockup from "@/components/property/MapMockup";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number (min 10 digits)"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error("Contact error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-2xs font-extrabold tracking-widest uppercase text-blue-600 border border-blue-500/20">
            <Compass className="h-3.5 w-3.5" />
            Connect With Us
          </span>
          <h1 className="mt-6 text-3xl font-extrabold font-serif tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s Discuss Your Real Estate Goals
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Whether you want to buy, lease, or consult on commercial investments, our expert team is ready to coordinate a strategic approach.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Office Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Headquarters Office
              </h3>
              
              <ul className="space-y-4 text-xs text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Vertex Realty Group</strong>
                    <br />
                    777 Wilshire Blvd, Suite 100
                    <br />
                    Los Angeles, CA 90017
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                  <a href="tel:5551245678" className="hover:text-blue-600 hover:underline">(555) 124-5678</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                  <a href="mailto:info@vertexrealestate.com" className="hover:text-blue-600 hover:underline">info@vertexrealestate.com</a>
                </li>
              </ul>
            </div>

            {/* Business Hours */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-blue-600" />
                Office Hours
              </h3>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex justify-between pb-2 border-b border-slate-50">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-slate-800">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-slate-50">
                  <span>Saturday</span>
                  <span className="font-semibold text-slate-800">10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-slate-500 italic">By Appointment Only</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-4 mb-6">
                Send Us A Message
              </h3>

              {isSuccess ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-4" />
                  <h4 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                    Thank you for reaching out. We have logged your request and assigned a specialized agent to follow up within one business hour.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                          errors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {errors.name && <p className="text-3xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                          errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {errors.email && <p className="text-3xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...register("phone")}
                        className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                          errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {errors.phone && <p className="text-3xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Buying Consultation"
                        {...register("subject")}
                        className={`w-full rounded-xl border py-2.5 px-4 text-xs outline-hidden focus:ring-1 focus:ring-blue-600/20 ${
                          errors.subject ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {errors.subject && <p className="text-3xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Message Details</label>
                    <textarea
                      rows={5}
                      placeholder="Detail your inquiry (listing IDs, timing, budget, etc.)..."
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
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map Mockup representing Office HQ location */}
            <MapMockup address="777 Wilshire Blvd, Suite 100" city="Los Angeles" />
          </div>

        </div>

      </div>
    </div>
  );
}
