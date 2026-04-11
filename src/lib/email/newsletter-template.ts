// Newsletter email HTML template
// Clean, mobile-friendly, renders well in Gmail/Outlook/Apple Mail

import { siteConfig } from '@/config/site'

interface NewsletterTemplateProps {
  subject: string
  bodyHtml: string   // the main content — Claude generates this as HTML
  unsubscribeUrl: string
}

// Absolute logo URL — email clients require fully qualified URLs, not relative paths
const LOGO_URL = `${siteConfig.url}/images/logo-tarahut.png`

export function renderNewsletterHtml({ subject, bodyHtml, unsubscribeUrl }: NewsletterTemplateProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
<style>
  body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #0f172a; line-height: 1.6; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9; }
  .logo-img { height: 40px; width: auto; display: inline-block; }
  .badge { display: inline-block; margin-top: 14px; padding: 4px 12px; background: #fef2f2; color: #e53935; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; border-radius: 999px; }
  .content { padding: 32px; }
  .content h1 { margin: 0 0 16px; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3; }
  .content h2 { margin: 28px 0 12px; font-size: 18px; font-weight: 700; color: #0f172a; }
  .content p { margin: 0 0 16px; font-size: 15px; color: #334155; }
  .content ul, .content ol { margin: 0 0 16px; padding-left: 20px; color: #334155; font-size: 15px; }
  .content li { margin-bottom: 6px; }
  .content strong { color: #0f172a; font-weight: 700; }
  .content a { color: #e53935; text-decoration: underline; }
  .section { margin: 24px 0; padding: 20px; background: #fafbfc; border-left: 3px solid #e53935; border-radius: 8px; }
  .section-tag { display: inline-block; margin-bottom: 8px; padding: 2px 8px; background: #ffffff; border: 1px solid #fee2e2; color: #e53935; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; }
  .cta-box { margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%); border-radius: 12px; text-align: center; }
  .cta-box p { margin: 0 0 12px; font-size: 14px; color: #475569; }
  .cta-button { display: inline-block; padding: 12px 24px; background: #e53935; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 8px; }
  .footer { padding: 24px 32px; text-align: center; border-top: 1px solid #f1f5f9; background: #f8fafc; }
  .footer p { margin: 4px 0; font-size: 12px; color: #94a3b8; }
  .footer a { color: #64748b; text-decoration: underline; }
  .footer-links { margin-top: 12px; }
  .footer-links a { margin: 0 8px; }
  @media (max-width: 600px) {
    .header, .content, .footer { padding-left: 20px !important; padding-right: 20px !important; }
    .content h1 { font-size: 20px; }
  }
</style>
</head>
<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;">
<tr><td align="center" style="padding: 32px 16px;">
<table class="wrapper" role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">

  <!-- Header -->
  <tr><td class="header">
    <img src="${LOGO_URL}" alt="TARAhut AI Labs" width="180" height="40" style="height: 40px; width: auto; display: inline-block; border: 0;" />
    <div class="badge">Weekly AI Insights</div>
  </td></tr>

  <!-- Body content (Claude-generated) -->
  <tr><td class="content">
    ${bodyHtml}

    <!-- CTA to courses -->
    <div class="cta-box">
      <p>Want to master these tools hands-on?</p>
      <a href="${siteConfig.url}/courses" class="cta-button">Explore Our Courses →</a>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td class="footer">
    <p><strong>${siteConfig.name}</strong></p>
    <p>${siteConfig.contact.address}</p>
    <p>WhatsApp: <a href="${siteConfig.links.whatsapp}">${siteConfig.contact.phone}</a></p>
    <div class="footer-links">
      <a href="${siteConfig.url}">Visit website</a>
      <a href="${unsubscribeUrl}">Unsubscribe</a>
    </div>
    <p style="margin-top: 16px; font-size: 11px;">You're receiving this because you subscribed to Weekly AI Insights at tarahutailabs.com</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] || c))
}
