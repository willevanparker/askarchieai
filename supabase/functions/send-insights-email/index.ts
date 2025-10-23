// INSIGHTS_EMAIL_CAPTURE: Edge function to send Insights report via email
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InsightsEmailRequest {
  email: string;
  analysis: {
    summary: string;
    rating: number;
    verdict: string;
    trade_in_note?: string;
    negotiation_tip?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, analysis }: InsightsEmailRequest = await req.json();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email address");
    }

    // Store email in contacts table
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    await supabase
      .from("contacts")
      .upsert(
        { 
          email, 
          source: "insights_report",
          updated_at: new Date().toISOString()
        },
        { onConflict: "email" }
      );

    console.log("Contact saved:", email);

    // Create email content
    const getRatingColor = (rating: number) => {
      if (rating >= 7) return "#10b981";
      if (rating >= 4) return "#f59e0b";
      return "#ef4444";
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Archie Insights Report</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0A64BC 0%, #0849A0 100%); padding: 40px 40px 30px; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                        Ask<span style="color: #ffffff;">Archie</span>.ai
                      </h1>
                      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; text-align: center;">
                        Your Car Deal Insights Report
                      </p>
                    </td>
                  </tr>

                  <!-- Rating Badge -->
                  <tr>
                    <td style="padding: 30px 40px 20px;">
                      <div style="text-align: center; margin-bottom: 20px;">
                        <div style="display: inline-block; background-color: ${getRatingColor(analysis.rating)}; color: white; padding: 12px 24px; border-radius: 50px; font-size: 24px; font-weight: 700;">
                          ${analysis.rating}/10
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Summary -->
                  <tr>
                    <td style="padding: 0 40px 20px;">
                      <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px; font-weight: 600;">Deal Summary</h2>
                      <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        ${analysis.summary}
                      </p>
                    </td>
                  </tr>

                  <!-- Verdict -->
                  <tr>
                    <td style="padding: 0 40px 20px;">
                      <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px; font-weight: 600;">Verdict</h2>
                      <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        ${analysis.verdict}
                      </p>
                    </td>
                  </tr>

                  ${analysis.trade_in_note ? `
                  <!-- Trade-in Note -->
                  <tr>
                    <td style="padding: 0 40px 20px;">
                      <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px; font-weight: 600;">Trade-in Assessment</h2>
                      <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                        ${analysis.trade_in_note}
                      </p>
                    </td>
                  </tr>
                  ` : ''}

                  ${analysis.negotiation_tip ? `
                  <!-- Negotiation Tip -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #f0f9ff; border-left: 4px solid #0A64BC; padding: 16px; border-radius: 4px;">
                        <h2 style="margin: 0 0 8px; color: #0A64BC; font-size: 18px; font-weight: 600;">💡 Negotiation Tip</h2>
                        <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
                          ${analysis.negotiation_tip}
                        </p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 40px 30px; text-align: center;">
                      <a href="https://askarchie.ai/premium" style="display: inline-block; background-color: #0A64BC; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                        Analyze Another Deal
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                        This report was generated by AskArchie.ai<br>
                        Questions about your car? <a href="https://askarchie.ai/chat" style="color: #0A64BC; text-decoration: none;">Ask Archie</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Archie <insights@askarchie.ai>",
      to: [email],
      subject: "Your Archie Insights Report",
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in send-insights-email function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
