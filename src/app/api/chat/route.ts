import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const lowerText = message.toLowerCase().trim();

    // 1. If Gemini API Key exists, use live LLM
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the Vertex Realty AI Assistant, a professional real estate chatbot. You assist clients and agents on the Vertex website.
                      
                      Website context:
                      - Features: Search/filters, saved favorites, comparing up to 3 listings side-by-side, 360° virtual tours on property pages, an interactive week-strip Tour Scheduler, direct sidebar messaging with agents, a verified agents program where agents upload their National Identification Number (NIN) to receive a gold shield badge, and an admin panel where admins moderate listings and check deeds.
                      - Contact: phone (555) 124-5678, email info@vertexrealestate.com, office 777 Wilshire Blvd, Los Angeles, CA.
                      - Niche categories: Residential, Luxury, Rentals, Commercial, Land.
                      
                      Answer the user's query professionally, concisely, and supportively in markdown formatting.
                      User question: ${message}`
                    }
                  ]
                }
              ]
            })
          }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ text });
        }
      } catch (err) {
        console.error("Gemini live call error, falling back to local KB:", err);
      }
    }

    // 2. Fallback: Ultra-comprehensive Local Real Estate Knowledge Base (covers all possible queries)
    let replyText = "";
    let suggestions: string[] = [];

    // Keyword checking flags
    const match = (keywords: string[]) => keywords.some((kw) => lowerText.includes(kw));

    if (match(["hello", "hi", "hey", "yo", "greetings", "good morning", "good afternoon"])) {
      replyText = `Hello! I am the Vertex AI Assistant. I can answer questions about finding properties, booking tours, listing uploads, agent verification, commissions, neighborhood walk scores, and more. 

What can I help you with today?`;
      suggestions = ["Browse All Listings", "How to list a property?", "Verify agent account"];
    } 
    
    else if (match(["who are you", "what is this site", "about us", "vertex", "company", "what is vertex"])) {
      replyText = `**Vertex Realty** is a premium, state-of-the-art real estate platform specializing in niche property listings: Residential, Luxury Estates, Rentals, Commercial Hubs, and Land Acreage. 
      
Our platform connects verified agents directly with buyers, offering features like interactive 3D virtual tours, real-time agent chat, neighborhood analytics, and a booking tour scheduler.`;
      suggestions = ["Our Team Directory", "Explore Luxury Estates", "Contact Us"];
    } 
    
    else if (match(["contact", "phone", "email", "number", "call", "office", "address", "hq", "location", "hours", "open"])) {
      replyText = `You can contact the **Vertex Realty** team using any of these channels:
* 📞 **Phone**: (555) 124-5678 (Available Monday - Friday, 9:00 AM - 6:00 PM EST)
* ✉️ **Email**: info@vertexrealestate.com
* 📍 **Office Headquarters**: 777 Wilshire Blvd, Los Angeles, CA 90017
* 🕒 **Business Hours**: Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM (Closed Sundays).`;
      suggestions = ["Visit Contact Page", "Browse Our Team"];
    } 
    
    else if (match(["how to list", "submit listing", "list property", "upload property", "sell my house", "add property", "new listing"])) {
      replyText = `To list a property on Vertex:
1. Log in to your **Agent Portal** (register an account if you don't have one).
2. Click **Submit Listing** in the top navigation bar.
3. Fill out the details (title, description, price, specs, location, and photo URLs).
4. **Mandatory**: Upload a PDF or image of your **Proof of Ownership** (deed, tax clearance, or signed mandate) so our administration can verify it.
5. Once submitted, your listing enters the pending moderation queue.`;
      suggestions = ["Submit a Listing", "How does verification work?"];
    } 
    
    else if (match(["verify", "verification", "gold badge", "gold shield", "verified specialist", "nin", "identity"])) {
      replyText = `**Agent Verification** builds trust on our platform:
1. Head to your **Agent Dashboard** by clicking **Profile** in the navbar.
2. Under **Account Verification**, upload your National Identification Card or NIN certificate.
3. Our admins will review your document. Upon approval, you will receive the golden **Verified Niche Specialist Shield** next to your name and listings, granting you top directory placement.`;
      suggestions = ["Go to Profile Dashboard", "Login to Agent Portal"];
    } 
    
    else if (match(["rejected", "moderation", "memo", "pending", "approved", "status", "why is my listing", "moderator"])) {
      replyText = `All property listings undergo strict administrative review:
* **Pending**: The admin is checking your title deed and property details.
* **Approved**: The listing is active and visible to all visitors.
* **Rejected**: The listing was denied. Check the **My Listings Queue** in your dashboard to view the **Moderation Memo** (e.g., "Proof of ownership document is illegible"). You can edit and correct the submission to request review again.`;
      suggestions = ["Check My Listings", "Go to Profile Dashboard"];
    } 
    
    else if (match(["admin", "admin panel", "admin dashboard", "who approves", "approve"])) {
      replyText = `The **Admin Control Panel** is restricted to site staff. Authorized moderators review listing submissions and check proof-of-ownership deeds to prevent fraud. They also verify agent profile identities via submitted NIN documents. If you are an admin, click the **Admin** button in the navbar.`;
      suggestions = ["Go to Admin Panel", "Login to Agent Portal"];
    } 
    
    else if (match(["book a tour", "schedule", "visit", "viewing", "appointment", "calendar", "book a visit"])) {
      replyText = `Scheduling a viewing is simple:
1. Browse to any property listing detail page.
2. Scroll to the **Schedule a Private Tour** panel.
3. Select your tour type (**In-Person** or **Video Chat**).
4. Pick a convenient date from the week-strip and choose an available time slot.
5. Fill out your details and submit. The listing agent will contact you shortly to confirm.`;
      suggestions = ["Browse All Listings", "Show luxury estates"];
    } 
    
    else if (match(["chat with agent", "direct message", "talk to agent", "contact agent", "chat"])) {
      replyText = `You can chat with the specific listing agent of a property in real-time:
* Open any property detail page.
* In the right-hand sidebar, you'll see a card showing the listing agent's details (photo, specialties, and online status).
* Click **Chat Directly With Agent** to start a messaging thread. The agent will reply contextually to questions about price, schedules, and terms!`;
      suggestions = ["Browse Listings", "Contact Us Page"];
    } 
    
    else if (match(["compare", "favorites", "saved", "heart", "tray", "side-by-side"])) {
      replyText = `We make it easy to compare properties:
* **Saved Favorites**: Click the **Heart icon** on any property card. Access them via **Saved Favorites** in the navbar.
* **Comparison Matrix**: Click **Compare Property** on up to 3 listings. A bar will appear at the bottom. Click **Compare Now** to view a side-by-side comparison of prices, beds, baths, and square footage.`;
      suggestions = ["Browse Listings", "Compare Tray"];
    } 
    
    else if (match(["mortgage", "loan", "down payment", "calculator", "finance", "financing", "monthly payment"])) {
      replyText = `We provide an interactive **Mortgage Calculator** on all property sale listings:
* Select a property for sale.
* Scroll to the calculator, where you can customize the down payment (minimum 10%), interest rate, and amortization term (e.g. 30 years).
* It dynamically computes your estimated principal, interest, property tax, and HOA dues to show your total monthly payment.`;
      suggestions = ["Show luxury estates", "Explore Residential Homes"];
    } 
    
    else if (match(["walk score", "transit score", "bike score", "neighborhood", "schools", "restaurants"])) {
      replyText = `Our property pages include a **Neighborhood Analytics** guide:
* **Scores**: Walk Score, Transit Score, and Bike Score show how easy it is to travel without a car.
* **Amenities**: Tabs for **Schools**, **Food & Drink**, **Transit**, and **Lifestyle** show local spots with exact distances from the property. This data adapts dynamically based on the listing's city (Beverly Hills, Venice, etc.).`;
      suggestions = ["Browse All Listings", "Search Pasadena Properties"];
    } 
    
    else if (match(["commission", "broker fee", "agent fee", "cost to sell", "deposit", "escrow", "earnest"])) {
      replyText = `Here is our general guide on real estate transactions and fees:
* **Agent Commission**: Typically 5% to 6% of the purchase price, split between the buyer's and seller's agents. This is usually paid by the seller.
* **Earnest Money Deposit**: A 1% to 3% deposit placed into escrow by the buyer upon signing to show good faith.
* **Rentals**: Landlords usually require a security deposit equivalent to 1 to 2 months' rent.`;
      suggestions = ["Explore Residential", "Show me rentals"];
    } 
    
    else if (match(["buy or rent", "rent vs buy", "should i buy", "should i rent", "lease vs buy"])) {
      replyText = `Deciding between buying and leasing?
* 🔑 **Buying**: Builds equity, locks in housing costs, provides tax benefits, and offers full design freedom. Ideal for long-term stays (5+ years).
* 🏢 **Leasing**: Offers flexibility, zero maintenance responsibilities, and lower upfront costs. Ideal for short-to-medium stays.
We offer high-quality listings in both sale and lease categories!`;
      suggestions = ["Show homes for sale", "Show rentals for lease"];
    } 
    
    else if (match(["virtual tour", "360", "panorama", "rotate", "look around"])) {
      replyText = `All property pages feature an interactive **3D Virtual Space Tour**:
* Scroll to the 360° tour box on the listing page.
* Click and drag (or swipe on mobile) to pan around the room.
* Use the **Auto Rotate** toggle to trigger automated panning, and the **Zoom In/Out** buttons to view details.`;
      suggestions = ["Browse Listings", "Show luxury estates"];
    } 
    
    else if (match(["luxury", "mansion", "estate", "beverly hills"])) {
      replyText = `Our **Luxury Estates** niche highlights premium listings, such as:
* **The Obsidian Estate** ($12,500,000 in Beverly Hills) - 6 beds, 8 baths, infinity pool, custom marble.
* **Lakeside Zenith Villa** ($8,900,000 in Lake Tahoe) - Waterfront views, ski storage, private pier.
You can view these directly under the **Luxury** filter.`;
      suggestions = ["View Luxury Estates", "Search Beverly Hills"];
    } 
    
    else if (match(["rental", "apartment", "loft", "rent"])) {
      replyText = `Our **Rentals** niche covers luxury apartments and lofts, including:
* **Skyline Penthouse** ($5,200/mo in Downtown LA) - 42nd floor, panoramic views.
* **Boho Venice Beach Loft** ($3,600/mo in Venice) - Steps from the beach, concrete/brick loft.
All leases support monthly payments.`;
      suggestions = ["Show rentals for lease", "Search Venice Beach"];
    } 
    
    else if (match(["commercial", "office", "retail", "shop", "hq"])) {
      replyText = `Our **Commercial** category offers workspaces for companies:
* **The Apex Creative Hub** ($18,500/mo lease in Venice) - High ceilings, executive parking.
* **Downtown HQ Plaza** ($6,400,000 sale in LA) - Standalone Wilshire Blvd headquarters building.`;
      suggestions = ["View Commercial listings", "Search Wilshire Blvd"];
    } 
    
    else if (match(["land", "plot", "acre", "malibu"])) {
      replyText = `Our **Land** category offers premium building plots:
* **Prime Malibu Canyon Acreage** ($3,200,000 in Malibu) - 5 acres with ocean view and geotechnical surveys.
* **Beverly Hills Crest Site** ($8,900,000 in Beverly Hills) - 2-acre cleared double lot.`;
      suggestions = ["Show Land listings", "Search Malibu plots"];
    } 
    
    else {
      // General fallbacks directing users to site features
      replyText = `I am here to help guide you through the Vertex Real Estate website! 
      
You can ask me questions about:
* **Finding Listings**: *"Show me Venice lofts"*, *"Luxury estates in Beverly Hills"*
* **Calculators & Scores**: *"Walk score details"*, *"Mortgage calculator rules"*
* **Scheduling & Direct Chat**: *"How to book a visit"*, *"How to chat with agents"*
* **Agent Submissions**: *"How to list properties"*, *"How does NIN verification work"*

What would you like to explore?`;
      suggestions = ["Browse All Listings", "Agent Portal Sign In", "Contact Us"];
    }

    return NextResponse.json({ text: replyText, suggestions });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}
