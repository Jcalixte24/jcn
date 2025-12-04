import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 emails per hour per IP/email

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Simple validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100 && !/[<>]/.test(name);
}

function isValidMessage(message: string): boolean {
  return message.length >= 10 && message.length <= 2000;
}

// Check for spam patterns
function isSpamContent(name: string, email: string, message: string): boolean {
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations|click here|free money)\b/i,
    /(http[s]?:\/\/[^\s]+){3,}/i, // Too many URLs
    /(.)\1{10,}/i, // Repeated characters
  ];
  
  const combined = `${name} ${email} ${message}`;
  return spamPatterns.some(pattern => pattern.test(combined));
}

// Rate limit check
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record) {
    rateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  // Reset if window expired
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // Hidden field - should be empty
  timestamp?: number; // Form load timestamp
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactEmailRequest = await req.json();
    const { name, email, message, honeypot, timestamp } = body;

    // 1. Honeypot check - bots often fill hidden fields
    if (honeypot && honeypot.length > 0) {
      console.log("Honeypot triggered - likely bot");
      // Return success to not alert the bot
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 2. Timestamp check - form should take at least 3 seconds to fill
    if (timestamp) {
      const timeDiff = Date.now() - timestamp;
      if (timeDiff < 3000) { // Less than 3 seconds
        console.log("Form submitted too quickly - likely bot");
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // 3. Input validation
    if (!name || typeof name !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: "Le nom est requis" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: "L'email est requis" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: "Le message est requis" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (!isValidName(trimmedName)) {
      return new Response(
        JSON.stringify({ success: false, error: "Nom invalide (2-100 caractères, sans caractères spéciaux)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidEmail(trimmedEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: "Email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidMessage(trimmedMessage)) {
      return new Response(
        JSON.stringify({ success: false, error: "Message invalide (10-2000 caractères)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 4. Spam content check
    if (isSpamContent(trimmedName, trimmedEmail, trimmedMessage)) {
      console.log("Spam content detected");
      return new Response(
        JSON.stringify({ success: false, error: "Votre message a été détecté comme spam" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 5. Rate limiting by email
    const rateLimitResult = checkRateLimit(trimmedEmail);
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for: ${trimmedEmail}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Limite de messages atteinte. Réessayez dans 1 heure." 
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending contact email from:", trimmedName, trimmedEmail);

    // 6. Escape HTML for safe email rendering
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    // Send email to yourself
    const emailResponse = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["japhetndri15@gmail.com"],
      subject: `Nouveau message de ${safeName}`,
      html: `
        <h2>Nouveau message depuis votre portfolio</h2>
        <p><strong>Nom:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Messages restants pour cet email: ${rateLimitResult.remaining}
        </p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Une erreur est survenue. Veuillez réessayer." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
