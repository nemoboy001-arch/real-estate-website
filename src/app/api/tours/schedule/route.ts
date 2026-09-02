import { NextResponse } from "next/server";
import { z } from "zod";

const tourBookingSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  propertyTitle: z.string().optional(),
  tourType: z.enum(["in-person", "video"]),
  date: z.string().min(1, "Tour date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = tourBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const booking = {
      id: `booking-${Date.now()}`,
      ...result.data,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      confirmationCode: `VTX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    return NextResponse.json({
      success: true,
      message: "Tour appointment scheduled successfully!",
      booking,
    });
  } catch (error) {
    console.error("Tour booking API error:", error);
    return NextResponse.json(
      { error: "Failed to schedule tour appointment" },
      { status: 500 }
    );
  }
}

