import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            { status: 405, headers: corsHeaders }
        );
    }

    try {
        const { email, name } = await req.json();

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                { status: 400, headers: corsHeaders }
            );
        }

        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
            console.error("RESEND_API_KEY not configured");
            return new Response(
                JSON.stringify({ error: "Email service not configured" }),
                { status: 500, headers: corsHeaders }
            );
        }

        const firstName = name?.split(" ")[0] || "there";

        // Send email via Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Skyrafi <noreply@mail.skyrafi.com>",
                to: [email],
                subject: "Welcome to Skyrafi! 🚀",
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <tr>
      <td style="background: linear-gradient(135deg, #0066FF 0%, #0044CC 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Skyrafi</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 24px;">Hey ${firstName}! 👋</h2>
        <p style="color: #4a4a68; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">
          Thank you for completing our survey and joining the Skyrafi waitlist! We're thrilled to have you on board.
        </p>
        <p style="color: #4a4a68; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">
          Your feedback is incredibly valuable to us as we build something amazing. We'll keep you updated on our progress and let you know as soon as early access becomes available.
        </p>
        <div style="background: #f8f9fb; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
            🎉 You're on the list! We'll be in touch soon.
          </p>
        </div>
        <p style="color: #4a4a68; line-height: 1.6; font-size: 16px; margin: 0;">
          Best,<br>
          <strong>The Skyrafi Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background: #f8f9fb; padding: 20px 30px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2026 Skyrafi. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Resend API error:", errorData);
            return new Response(
                JSON.stringify({ error: "Failed to send email", details: errorData }),
                { status: 500, headers: corsHeaders }
            );
        }

        const data = await res.json();
        console.log("Email sent successfully:", data);

        return new Response(
            JSON.stringify({ success: true, id: data.id }),
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: corsHeaders }
        );
    }
});
