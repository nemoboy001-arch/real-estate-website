"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, X, MessageSquare, Send, Bot, ArrowRight, Home, Building, Key, Compass } from "lucide-react";
import { properties, Property } from "@/data/mockData";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  suggestions?: string[];
  matchedListings?: Property[];
}

// Helpers defined outside component to remain pure
function generateMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getCurrentTimestamp(): Date {
  return new Date();
}

function getInitialMessages(): Message[] {
  return [
    {
      id: "msg-welcome",
      sender: "bot",
      text: `Hello! I am your Vertex AI Assistant. How can I help you navigate listings or agent services today?`,
      timestamp: new Date(),
      suggestions: [
        "Show me rentals under $4,000",
        "Find luxury estates in Beverly Hills",
        "Show available land sites",
        "How do I verify my agent account?",
      ],
    },
  ];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message initialized directly in useState

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleSend = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // Add user message
    const userMsgId = generateMessageId("msg-user");
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: getCurrentTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking and typing latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Compile latest listings (Supabase approved listings + mockData properties)
    let allListings = [...properties];
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "approved");
        if (data && data.length > 0) {
          const mapped: Property[] = data.map((item) => ({
            id: String(item.id),
            title: String(item.title),
            category: item.category as Property["category"],
            listingType: item.listing_type as Property["listingType"],
            price: Number(item.price),
            beds: item.beds ? Number(item.beds) : undefined,
            baths: item.baths ? Number(item.baths) : undefined,
            sqft: Number(item.sqft),
            location: {
              address: String(item.address),
              city: String(item.city),
              zip: String(item.zip),
            },
            images: item.images || [],
            amenities: ["Verified Asset"],
            agentId: String(item.posted_by),
            description: String(item.description),
            featured: true,
          }));
          allListings = [...mapped, ...properties];
        }
      } catch (err) {
        console.error("Assistant search fallback to mock list:", err);
      }
    }

    // AI Parser logic
    const lowerText = text.toLowerCase();
    let replyText = "";
    let matched: Property[] = [];
    let suggestions: string[] = [];

    // Keyword detection
    const isLand = lowerText.includes("land") || lowerText.includes("plot") || lowerText.includes("acre");
    const isLuxury = lowerText.includes("luxury") || lowerText.includes("estate") || lowerText.includes("mansion");
    const isRental = lowerText.includes("rent") || lowerText.includes("lease");
    const isCommercial = lowerText.includes("commercial") || lowerText.includes("office") || lowerText.includes("retail") || lowerText.includes("shop");
    const isResidential = lowerText.includes("residential") || lowerText.includes("home") || lowerText.includes("house") || lowerText.includes("townhouse");

    // Location parsing
    let cityMatch = "";
    if (lowerText.includes("malibu")) cityMatch = "Malibu";
    else if (lowerText.includes("beverly hills")) cityMatch = "Beverly Hills";
    else if (lowerText.includes("los angeles") || lowerText.includes("la")) cityMatch = "Los Angeles";
    else if (lowerText.includes("venice")) cityMatch = "Venice";

    // Max budget parsing (e.g. "under 5000" or "below 1.5M")
    let maxBudget = Infinity;
    const priceRegex = /(?:under|below|less than|max)\s*(?:\$)?\s*([\d,]+)\s*(m|k|million)?/i;
    const priceMatch = lowerText.match(priceRegex);
    if (priceMatch) {
      let numericVal = parseFloat(priceMatch[1].replace(/,/g, ""));
      const multiplier = priceMatch[2]?.toLowerCase();
      if (multiplier === "m" || multiplier === "million") numericVal *= 1000000;
      else if (multiplier === "k") numericVal *= 1000;
      maxBudget = numericVal;
    }

    // Filter properties based on parsed parameters
    if (isLand || isLuxury || isRental || isCommercial || isResidential || cityMatch || maxBudget !== Infinity) {
      matched = allListings.filter((p) => {
        // Filter by category
        if (isLand && p.category !== "land") return false;
        if (isLuxury && p.category !== "luxury") return false;
        if (isRental && p.category !== "rental") return false;
        if (isCommercial && p.category !== "commercial") return false;
        if (isResidential && p.category !== "residential") return false;

        // Filter by location
        if (cityMatch && p.location.city !== cityMatch) return false;

        // Filter by price
        if (p.price > maxBudget) return false;

        return true;
      });
    }

    // Agent verification help
    const isAgentTopic = lowerText.includes("agent") || lowerText.includes("verify") || lowerText.includes("verification") || lowerText.includes("document");

    if (isAgentTopic) {
      replyText = `To verify your agent account, please go to **My Listings** from your top navigation bar. If you are unverified, you will see a box to attach your National Identification Number (NIN). 

For submitting properties, you must also provide proof of ownership (e.g. Certificate of Occupancy or signed mandate).`;
      suggestions = ["Show my listings", "How to list a property?"];
    } else if (matched.length > 0) {
      replyText = `I found ${matched.length} property listing${matched.length > 1 ? "s" : ""} matching your criteria:`;
      suggestions = ["Show me rentals", "Find commercial offices"];
    } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      replyText = `Hi there! I am your AI assistant. I can help search for rentals, land plots, offices, residential properties, or guide you with agent settings. What are you looking for?`;
      suggestions = ["Show me land sites", "Find rentals in LA"];
    } else {
      replyText = `I couldn't find any active properties matching those specific search terms. 

Try asking something like *"Show me Malibu land plots"* or *"Rentals under $5,000"* to search our portfolio.`;
      suggestions = ["Show me rentals under $4,000", "Find land sites"];
    }

    const botMsg: Message = {
      id: generateMessageId("msg-bot"),
      sender: "bot",
      text: replyText,
      timestamp: getCurrentTimestamp(),
      matchedListings: matched.slice(0, 3), // Limit showing max 3 card links inside panel
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* FLOATING ACTION CHAT BUBBLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-slate-900/10 focus:outline-hidden hover:bg-slate-800"
        title="Open AI Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* CHAT PANEL WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[500px] flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">Vertex AI Assistant</h4>
                <p className="text-4xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Online & Ready
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Console */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {msg.sender === "bot" && (
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0 text-3xs font-bold">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white border border-slate-200/60 text-slate-700 rounded-tl-none shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Matched Listings Cards */}
                  {msg.matchedListings && msg.matchedListings.length > 0 && (
                    <div className="space-y-2 pt-1.5">
                      {msg.matchedListings.map((p) => {
                        const Icon = p.category === "land" ? Compass : p.category === "commercial" ? Building : p.category === "rental" ? Key : Home;
                        return (
                          <Link
                            key={p.id}
                            href={`/listings/${p.id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all hover:border-slate-300 shadow-2xs group"
                          >
                            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
                              <img
                                src={p.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&h=150&q=80"}
                                alt={p.title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-[11px] font-bold text-slate-900 truncate flex items-center gap-1">
                                <Icon className="h-3 w-3 text-slate-400" />
                                {p.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 truncate">{p.location.address}, {p.location.city}</p>
                              <p className="text-[11px] font-extrabold text-blue-600 mt-0.5">
                                {p.listingType === "lease"
                                  ? `$${p.price.toLocaleString()}/mo`
                                  : `$${p.price.toLocaleString()}`}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggestions Chips */}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(s)}
                          className="text-[10px] font-bold bg-blue-50/50 hover:bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 hover:border-blue-200 transition-colors shadow-2xs"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border border-slate-200/60 p-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-1 h-8">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="p-3 border-t border-slate-200/80 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-xs outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 transition-colors disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
