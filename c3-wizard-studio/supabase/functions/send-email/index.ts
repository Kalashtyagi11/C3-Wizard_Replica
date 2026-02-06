import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  template: string;
  data: Record<string, any>;
  attachments?: Array<{
    content: string; // Base64 encoded
    filename: string;
    type: string;
  }>;
}

interface EmailTemplate {
  template_key: string;
  template_name: string;
  subject: string;
  html_body: string;
  text_body: string | null;
  from_module: string;
  variables: string[];
}

// ============================================================
// SENDER IDENTITY CONFIGURATION
// ============================================================
//
// All sender addresses are defined HERE inside the function.
// To change a sender, update this mapping directly.
//
// FORMAT: "Display Name <email@domain.com>"
// ============================================================

type EmailCategory = "registration" | "payment" | "notification" | "system";

/**
 * Maps template keys to their email category for sender selection.
 * Add new templates here to assign them to a sender category.
 */
function getEmailCategory(templateKey: string): EmailCategory {
  // Registration-related emails (OTP, activation, welcome)
  const registrationTemplates = [
    "otp_verification",
    "registration_welcome",
    "registration_admin_alert",
    "account_activation",
    "account_verification",
    "email_verification",
    "password_reset",
  ];

  // Payment-related emails (receipts, alerts)
  const paymentTemplates = ["payment_receipt", "payment_admin_alert", "payment_confirmation"];

  // Notification emails (general alerts, updates)
  const notificationTemplates = ["account_status_change", "contact_us_confirmation", "complaint_received"];

  if (registrationTemplates.includes(templateKey)) {
    return "registration";
  }
  if (paymentTemplates.includes(templateKey)) {
    return "payment";
  }
  if (notificationTemplates.includes(templateKey)) {
    return "notification";
  }

  return "system";
}

/**
 * Returns the appropriate sender address based on email category.
 *
 * ⚠️ TO UPDATE SENDER ADDRESSES:
 * Edit the return values below. Each category has its own sender.
 */
function getSenderAddress(category: EmailCategory): string {
  switch (category) {
    case "registration":
      // Used for: OTP, account activation, welcome emails, password reset
      return "C3 Wizard Registration <registration@secureserve.biz>";

    case "payment":
      // Used for: Payment receipts, payment alerts
      return "C3 Wizard Payments <payments@secureserve.biz>";

    case "notification":
      // Used for: Account status changes, contact form confirmations
      return "C3 Wizard Notifications <notifications@secureserve.biz>";

    case "system":
    default:
      // Used for: Any other system emails
      return "C3 Wizard <noreply@secureserve.biz>";
  }
}

/**
 * Determines the "From" address dynamically based on the template/event type.
 */
function getFromAddress(templateKey: string): string {
  const category = getEmailCategory(templateKey);
  return getSenderAddress(category);
}

// ============================================================
// TEST EMAIL CONFIGURATION
// ============================================================
//
// Test mode redirects ALL emails to a test recipient.
//
// ⚠️ TO ENABLE TEST MODE:
// Set TEST_MODE_ENABLED to true and update TEST_RECIPIENT below.
//
// ⚠️ FOR PRODUCTION:
// Set TEST_MODE_ENABLED to false.
// ============================================================

/**
 * Test mode configuration - edit these values directly.
 */
function getTestConfig(): { enabled: boolean; recipient: string } {
  return {
    // Set to TRUE to redirect all emails to test recipient
    // Set to FALSE for production (emails go to real recipients)
    enabled: true,

    // Test recipient email - all emails redirect here when enabled
    // Change this to your test email address
    recipient: "tester@yopmail.com",
  };
}

// Replace template variables with actual data
function processTemplate(template: string, data: Record<string, any>): string {
  let result = template;

  // Replace {{variable}} patterns
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, value?.toString() || "");
  }

  // Handle conditional blocks like {{#if variable}}...{{/if}}
  const conditionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  result = result.replace(conditionalRegex, (match, variable, content) => {
    return data[variable] ? content : "";
  });

  return result;
}

// Replace subject variables (simpler pattern)
function processSubject(subject: string, data: Record<string, any>): string {
  let result = subject;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, value?.toString() || "");
  }
  return result;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const emailRequest: EmailRequest = await req.json();
    const { to, cc, bcc, template, data, attachments } = emailRequest;

    // Validate required fields
    if (!to || !template) {
      throw new Error("Missing required fields: 'to' and 'template' are required");
    }

    // Fetch template from database
    const { data: templateData, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("template_key", template)
      .eq("is_active", true)
      .eq("is_deleted", false)
      .single();

    if (templateError || !templateData) {
      console.error(`Template not found: ${template}`, templateError);
      throw new Error(`Email template '${template}' not found or inactive`);
    }

    const emailTemplate = templateData as EmailTemplate;

    // Get dynamic sender based on template/event type
    const fromAddress = getFromAddress(template);
    const emailCategory = getEmailCategory(template);

    // Process template with data
    const subject = processSubject(emailTemplate.subject, data);
    const html = processTemplate(emailTemplate.html_body, data);

    // Get test configuration
    const testConfig = getTestConfig();

    // Store original recipients for logging
    const originalTo = Array.isArray(to) ? to : [to];

    // Apply test mode if enabled
    const finalTo = testConfig.enabled ? [testConfig.recipient] : originalTo;

    // Log email routing for debugging
    console.log(`[Email Config] From: ${fromAddress}`);
    console.log(`[Email Config] Template: ${template}`);
    console.log(`[Email Config] Category: ${emailCategory}`);
    console.log(`[Email Config] Original Recipients: ${originalTo.join(", ")}`);
    console.log(`[Email Config] Final Recipients: ${finalTo.join(", ")}`);
    console.log(
      `[Email Config] Test Mode: ${testConfig.enabled ? "ACTIVE → " + testConfig.recipient : "OFF (production)"}`,
    );

    // Build email payload
    const emailPayload: any = {
      from: fromAddress,
      to: finalTo,
      subject: testConfig.enabled ? `[TEST] ${subject} (Original: ${originalTo.join(", ")})` : subject,
      html,
    };

    // In test mode, skip CC/BCC to prevent sending to real addresses
    if (!testConfig.enabled) {
      if (cc) {
        emailPayload.cc = Array.isArray(cc) ? cc : [cc];
      }
      if (bcc) {
        emailPayload.bcc = Array.isArray(bcc) ? bcc : [bcc];
      }
    }

    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send(emailPayload);

    console.log("Email sent successfully:", emailResponse);

    // Log to audit table
    await supabase.from("c3_audit_logs").insert({
      action: "EMAIL_SENT",
      event_type: "EMAIL",
      new_value: JSON.stringify({
        template,
        to: originalTo,
        from: fromAddress,
        subject,
        status: "sent",
      }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailResponse.data?.id,
        template,
        category: emailCategory,
        fromAddress,
        testMode: testConfig.enabled,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
