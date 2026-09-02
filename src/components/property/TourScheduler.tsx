"use client";

import React, { useState } from "react";
import { Calendar, Clock, Video, User, MapPin, Mail, Phone, CheckCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourSchedulerProps {
  propertyId: string;
  propertyTitle: string;
  agentName: string;
}

export default function TourScheduler({ propertyId, propertyTitle, agentName }: TourSchedulerProps) {
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{ confirmationCode?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Generate next 7 days starting from tomorrow
  const daysList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      dateString: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    };
  });

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedTimeSlot) newErrors.timeSlot = "Please choose a time slot";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      propertyId,
      propertyTitle,
      date: daysList[selectedDayOffset].dateString,
      timeSlot: selectedTimeSlot,
      tourType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    };

    try {
      const response = await fetch("/api/tours/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule tour.");
      }

      setConfirmationData(data.booking || { confirmationCode: `VTX-${Date.now().toString().slice(-6)}` });
      setIsSubmitted(true);

      // Also persist to local storage for offline retrieval
      try {
        const currentBookings = JSON.parse(localStorage.getItem("vertex_bookings") || "[]");
        currentBookings.push(data.booking || payload);
        localStorage.setItem("vertex_bookings", JSON.stringify(currentBookings));
      } catch (err) {
        console.warn("Could not write booking to localStorage", err);
      }
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setApiError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Calendar className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-900">Schedule a Private Tour</h3>
          <p className="text-xs text-slate-500">Pick a convenient time to view the property</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSchedule}
            className="space-y-6"
          >
            {apiError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Tour Type Selector */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setTourType("in-person")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  tourType === "in-person"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                In-Person
              </button>
              <button
                type="button"
                onClick={() => setTourType("video")}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  tourType === "video"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Video className="h-4 w-4 text-blue-600" />
                Video Chat
              </button>
            </div>

            {/* Next 7 Days week-strip */}
            <div>
              <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
                Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                {daysList.map((day, idx) => {
                  const isSelected = selectedDayOffset === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDayOffset(idx)}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[64px] border transition-all duration-200 snap-start ${
                        isSelected
                          ? "bg-slate-900 border-slate-900 text-white shadow-md scale-105"
                          : "bg-white border-slate-100 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-blue-400" : "text-slate-400"}`}>
                        {day.dayName}
                      </span>
                      <span className="text-lg font-black mt-1 leading-none">{day.dayNum}</span>
                      <span className="text-[9px] uppercase font-semibold mt-0.5 opacity-80">{day.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Picker */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-2xs font-extrabold uppercase tracking-widest text-slate-400 block">
                  Available Time Slots
                </label>
                {errors.timeSlot && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.timeSlot}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        if (errors.timeSlot) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.timeSlot;
                            return next;
                          });
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold border transition-all duration-150 ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "bg-white border-slate-100 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 opacity-70" />
                      {slot.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Form Information */}
            <div className="space-y-3 pt-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-xs font-medium placeholder-slate-400 outline-none transition-all ${
                    errors.name ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50/50"
                  }`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1 pl-1 font-semibold">{errors.name}</p>}
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-xs font-medium placeholder-slate-400 outline-none transition-all ${
                    errors.email ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50/50"
                  }`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-1 font-semibold">{errors.email}</p>}
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className={`w-full rounded-xl border py-3.5 pl-10 pr-4 text-xs font-medium placeholder-slate-400 outline-none transition-all ${
                    errors.phone ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-200 focus:border-blue-500 focus:bg-white bg-slate-50/50"
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1 pl-1 font-semibold">{errors.phone}</p>}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-75 text-white font-bold py-4 text-xs uppercase tracking-wider transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  Processing Appointment...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  Request Private Tour
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 border border-green-100">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Tour Requested Successfully!</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              We have dispatched your request. Listing specialist <strong className="text-slate-800">{agentName}</strong> will contact you within 2 hours to confirm your appointment.
            </p>

            {confirmationData?.confirmationCode && (
              <div className="my-4 inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800">
                Confirmation Code: <span className="font-mono">{confirmationData.confirmationCode}</span>
              </div>
            )}

            <div className="mt-4 p-4 rounded-xl bg-slate-50 text-left border border-slate-100 space-y-2 text-xs">
              <p className="text-slate-500"><strong className="text-slate-700">Property:</strong> {propertyTitle}</p>
              <p className="text-slate-500">
                <strong className="text-slate-700">Schedule:</strong> {daysList[selectedDayOffset].dayName}, {daysList[selectedDayOffset].month} {daysList[selectedDayOffset].dayNum} @ {selectedTimeSlot}
              </p>
              <p className="text-slate-500">
                <strong className="text-slate-700">Tour Format:</strong> {tourType === "in-person" ? "In-Person Tour" : "Virtual Video Consultation"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedTimeSlot("");
                setFormData({ name: "", email: "", phone: "", notes: "" });
              }}
              className="mt-6 text-xs text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider"
            >
              Schedule Another Tour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
