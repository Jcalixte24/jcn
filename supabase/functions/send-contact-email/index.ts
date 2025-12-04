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

// List of disposable/temporary email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  'temp-mail.org', 'fakeinbox.com', 'getnada.com', 'trashmail.com',
  '10minutemail.com', 'yopmail.com', 'mohmal.com', 'maildrop.cc',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'spam4.me',
  'dispostable.com', 'mailnesia.com', 'tempail.com', 'tempr.email',
  'discard.email', 'spamgourmet.com', 'mytrashmail.com', 'mt2009.com',
  'throwawaymail.com', 'jetable.org', 'anonymbox.com', 'emailondeck.com',
  'fakemailgenerator.com', 'mintemail.com', 'mailcatch.com'
];

// Simple validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
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

    // Check for disposable emails
    if (isDisposableEmail(trimmedEmail)) {
      console.log("Disposable email detected:", trimmedEmail);
      return new Response(
        JSON.stringify({ success: false, error: "Les emails temporaires ne sont pas acceptés. Veuillez utiliser une adresse email valide." }),
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

    // Send email to yourself (notification)
    const notificationEmail = await resend.emails.send({
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

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the sender
    const confirmationEmail = await resend.emails.send({
      from: "Japhet Calixte N'DRI <onboarding@resend.dev>",
      to: [trimmedEmail],
      subject: "Merci pour votre message !",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            Merci pour votre message, ${safeName} !
          </h2>
          
          <p style="color: #555; line-height: 1.6;">
            J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.
          </p>
          
          <div style="background: #f4f4f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #666; margin: 0 0 10px 0;"><strong>Récapitulatif de votre message :</strong></p>
            <p style="color: #333; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            En attendant, n'hésitez pas à consulter mes projets sur 
            <a href="https://github.com/Jcalixte24" style="color: #6366f1;">GitHub</a> 
            ou à me suivre sur 
            <a href="https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0" style="color: #6366f1;">LinkedIn</a>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Cet email a été envoyé automatiquement depuis mon portfolio. Si vous n'avez pas envoyé ce message, veuillez ignorer cet email.
          </p>
          
          <p style="color: #333; margin-top: 20px;">
            Cordialement,<br>
            <strong>Japhet Calixte N'DRI</strong><br>
            <span style="color: #666;">Data Scientist & Développeur Web</span>
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(JSON.stringify({ success: true, data: { notification: notificationEmail, confirmation: confirmationEmail } }), {
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
