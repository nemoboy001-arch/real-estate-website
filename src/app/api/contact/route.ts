import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const inquiry = {
      id: `inquiry-${Date.now()}`,
      ...result.data,
      receivedAt: new Date().toISOString(),
      ticketId: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    return NextResponse.json({
      success: true,
      message: "Your message has been received! An agent will get back to you shortly.",
      inquiry,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}

