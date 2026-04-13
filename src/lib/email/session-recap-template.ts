interface SessionRecapProps {
  studentName: string;
  sessionNumber: number;
  sessionTitle: string;
  deliverable: string;
  nextChallenge: string;
  nextChallengeTime?: string;
  streak: number;
  dashboardUrl: string;
}

export function renderSessionRecapHtml({
  studentName,
  sessionNumber,
  sessionTitle,
  deliverable,
  nextChallenge,
  nextChallengeTime,
  streak,
  dashboardUrl,
}: SessionRecapProps): string {
  const firstName = studentName ? studentName.split(' ')[0] : 'Student';
  const streakLabel = streak === 1 ? '1 day' : `${streak} days`;
  const timeLabel = nextChallengeTime ? ` (${nextChallengeTime})` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0A0F1C;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#059669;">TARAhut AI Labs</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#64748B;">India's First Offline AI Training Center</p>
    </div>

    <!-- Main Card -->
    <div style="background-color:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px 32px;">

      <!-- Greeting -->
      <p style="margin:0 0 6px;font-size:16px;color:#E5E7EB;">Hey ${firstName}! 🎉</p>
      <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
        You just completed Session ${sessionNumber}: ${sessionTitle}!
      </p>

      <!-- What you built -->
      <div style="background-color:rgba(5,150,105,0.1);border:1px solid rgba(5,150,105,0.2);border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:11px;color:#059669;font-weight:600;text-transform:uppercase;letter-spacing:1px;">What you built</p>
        <p style="margin:0;font-size:15px;color:#E5E7EB;line-height:1.5;">${deliverable}</p>
      </div>

      <!-- Today's Challenge -->
      <div style="background-color:rgba(0,240,255,0.06);border:1px solid rgba(0,240,255,0.15);border-radius:12px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:11px;color:#00f0ff;font-weight:600;text-transform:uppercase;letter-spacing:1px;">🎯 Today's Challenge${timeLabel}</p>
        <p style="margin:0;font-size:14px;color:#E5E7EB;line-height:1.6;">${nextChallenge}</p>
      </div>

      <!-- Streak -->
      <div style="background-color:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.2);border-radius:12px;padding:14px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:#f97316;">🔥 Your streak: ${streakLabel}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#9CA3AF;">Keep going — streaks build habits that build careers.</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:8px;">
        <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(90deg,#059669,#00f0ff);color:#06060e;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:10px;">
          Continue Learning →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="margin:0 0 4px;font-size:12px;color:#4B5563;">
        <a href="https://wa.me/919200882008" style="color:#059669;text-decoration:none;">WhatsApp: +91 92008-82008</a>
      </p>
      <p style="margin:0 0 4px;font-size:12px;color:#4B5563;">Kotkapura, Punjab, India</p>
      <p style="margin:0;font-size:11px;color:#374151;">
        © ${new Date().getFullYear()} TARAhut AI Labs. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>`;
}
