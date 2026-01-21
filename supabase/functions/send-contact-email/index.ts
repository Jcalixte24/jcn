import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

// HTML escape for XSS prevention
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Disposable email domains
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

// Known bot user agents
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python',
  'java', 'perl', 'ruby', 'go-http-client', 'httpclient', 'mechanize',
  'phantom', 'selenium', 'headless', 'puppeteer', 'playwright'
];

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

function isSpamContent(name: string, email: string, message: string): boolean {
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations|click here|free money|bitcoin|crypto)\b/i,
    /(http[s]?:\/\/[^\s]+){3,}/i,
    /(.)\1{10,}/i,
    /\b(SEO|backlink|ranking|traffic|promotion)\b/i,
  ];
  
  const combined = `${name} ${email} ${message}`;
  return spamPatterns.some(pattern => pattern.test(combined));
}

function isBotUserAgent(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lowerUA.includes(bot));
}

// Verify security token
function verifySecurityToken(timestamp: number, nonce: string, token: string): boolean {
  const data = `${timestamp}-${nonce}-portfolio-jcn`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const complexHash = Math.abs(hash).toString(36) + 
    timestamp.toString(36) + 
    nonce.split('').reverse().join('');
  const expectedToken = btoa(complexHash);
  
  return token === expectedToken;
}

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record) {
    rateLimitMap.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
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
  honeypot1?: string;
  honeypot2?: string;
  honeypot3?: string;
  timestamp?: number;
  nonce?: string;
  securityToken?: string;
  mouseMovements?: number;
  keystrokes?: number;
  userAgent?: string;
  screenResolution?: string;
  timezone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactEmailRequest = await req.json();
    const { 
      name, email, message, 
      honeypot1, honeypot2, honeypot3,
      timestamp, nonce, securityToken,
      mouseMovements, keystrokes, userAgent,
      screenResolution, timezone
    } = body;

    // 1. Multiple honeypot check
    if ((honeypot1 && honeypot1.length > 0) || 
        (honeypot2 && honeypot2.length > 0) || 
        (honeypot3 && honeypot3.length > 0)) {
      console.log("Honeypot triggered - bot detected");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 2. User agent check
    if (userAgent && isBotUserAgent(userAgent)) {
      console.log("Bot user agent detected:", userAgent);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // 3. Timestamp validation (minimum 3 seconds)
    if (timestamp) {
      const timeDiff = Date.now() - timestamp;
      if (timeDiff < 3000) {
        console.log("Form submitted too quickly:", timeDiff, "ms");
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      // Also check for impossibly old timestamps (> 1 hour)
      if (timeDiff > 3600000) {
        console.log("Form timestamp too old:", timeDiff, "ms");
        return new Response(
          JSON.stringify({ success: false, error: "Session expirée. Veuillez rafraîchir la page." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // 4. Security token verification
    if (timestamp && nonce && securityToken) {
      if (!verifySecurityToken(timestamp, nonce, securityToken)) {
        console.log("Invalid security token");
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // 5. Behavior analysis (bots usually have no mouse/keyboard interaction)
    if (mouseMovements !== undefined && keystrokes !== undefined) {
      if (mouseMovements < 3 && keystrokes < 2) {
        console.log("Suspicious behavior - low interaction:", { mouseMovements, keystrokes });
        // Don't reject, but log for monitoring
      }
    }

    // 6. Screen resolution check (bots often have unusual resolutions)
    if (screenResolution) {
      const [width] = screenResolution.split('x').map(Number);
      if (width < 320 || width > 7680) {
        console.log("Unusual screen resolution:", screenResolution);
      }
    }

    // 7. Input validation
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
        JSON.stringify({ success: false, error: "Nom invalide (2-100 caractères)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidEmail(trimmedEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: "Email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (isDisposableEmail(trimmedEmail)) {
      console.log("Disposable email detected:", trimmedEmail);
      return new Response(
        JSON.stringify({ success: false, error: "Les emails temporaires ne sont pas acceptés." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidMessage(trimmedMessage)) {
      return new Response(
        JSON.stringify({ success: false, error: "Message invalide (10-2000 caractères)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 8. Spam content check
    if (isSpamContent(trimmedName, trimmedEmail, trimmedMessage)) {
      console.log("Spam content detected");
      return new Response(
        JSON.stringify({ success: false, error: "Votre message a été détecté comme spam" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 9. Rate limiting
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
    console.log("Security metrics:", { mouseMovements, keystrokes, timezone });

    // 10. Escape HTML
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    // Send notification email
    const notificationEmail = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["japhetndri15@gmail.com"],
      subject: `Nouveau message de ${safeName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            📬 Nouveau message depuis votre portfolio
          </h2>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>👤 Nom:</strong> ${safeName}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #6366f1;">
              ${safeMessage}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <div style="color: #666; font-size: 12px;">
            <p><strong>📊 Métriques anti-spam:</strong></p>
            <ul>
              <li>Messages restants: ${rateLimitResult.remaining}</li>
              <li>Mouvements souris: ${mouseMovements || 'N/A'}</li>
              <li>Frappes clavier: ${keystrokes || 'N/A'}</li>
              <li>Timezone: ${timezone || 'N/A'}</li>
              <li>Résolution: ${screenResolution || 'N/A'}</li>
            </ul>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email
    const confirmationEmail = await resend.emails.send({
      from: "Japhet Calixte N'DRI <onboarding@resend.dev>",
      to: [trimmedEmail],
      subject: "Merci pour votre message !",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0;">Merci ${safeName} !</h1>
            <p style="color: #666;">Votre message a bien été reçu</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.
          </p>
          
          <div style="background: linear-gradient(135deg, #f4f4f5 0%, #e5e7eb 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;"><strong>📝 Récapitulatif de votre message :</strong></p>
            <p style="color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #555; margin-bottom: 15px;">En attendant, retrouvez-moi sur :</p>
            <a href="https://github.com/Jcalixte24" style="display: inline-block; background: #333; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 5px;">
              🔗 GitHub
            </a>
            <a href="https://www.linkedin.com/in/japhet-calixte-n'dri-0b73832a0" style="display: inline-block; background: #0077b5; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 5px;">
              💼 LinkedIn
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
          
          <div style="text-align: center;">
            <p style="color: #333; margin-bottom: 5px;">
              <strong>Japhet Calixte N'DRI</strong>
            </p>
            <p style="color: #6366f1; margin: 0; font-size: 14px;">
              Data Scientist & Développeur Web
            </p>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 30px;">
            Cet email a été envoyé automatiquement. Si vous n'avez pas envoyé ce message, veuillez l'ignorer.
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { notification: notificationEmail, confirmation: confirmationEmail } 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
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
