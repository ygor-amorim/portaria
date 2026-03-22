const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (date) =>
    new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo',
    });

const sendRegistrationConfirmation = async ({ to, participantName, eventName, startDate, endDate, eventLocation, qrCodeDataUrl }) => {
    const safeName = escapeHtml(participantName);
    const safeEventName = escapeHtml(eventName);
    const safeLocation = eventLocation ? escapeHtml(eventLocation) : '';
    // Extract raw PNG buffer from the base64 data URL stored in DB
    const base64 = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64, 'base64');

    const dateRange = startDate === endDate
        ? formatDate(startDate)
        : `${formatDate(startDate)} – ${formatDate(endDate)}`;

    await resend.emails.send({
        from: `Portaria Events <${process.env.SMTP_FROM}>`,
        to,
        subject: `Inscrição confirmada — ${safeEventName}`,
        attachments: [{
            filename: 'credencial.png',
            content: qrBuffer,
            content_id: 'qrcode',
        }],
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:32px;text-align:center;">
            <p style="margin:0;color:#f59e0b;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;">◉ Portaria Events</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:1.4rem;font-weight:700;">Inscrição Confirmada</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 16px;color:#333;font-size:1rem;">Olá, <strong>${safeName}</strong>!</p>
            <p style="margin:0 0 24px;color:#555;font-size:0.95rem;line-height:1.6;">
              Sua inscrição no evento abaixo está confirmada. Apresente o QR code na entrada.
            </p>

            <!-- Event details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:1rem;font-weight:700;color:#111;">${safeEventName}</p>
                <p style="margin:0 0 4px;font-size:0.85rem;color:#555;">📅 ${dateRange}</p>
                ${safeLocation ? `<p style="margin:0;font-size:0.85rem;color:#555;">📍 ${safeLocation}</p>` : ''}
              </td></tr>
            </table>

            <!-- QR Code -->
            <p style="margin:0 0 12px;color:#333;font-size:0.9rem;font-weight:600;text-align:center;">Seu QR Code de acesso</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:20px;background:#111;border-radius:6px;">
                <img src="cid:qrcode" alt="QR Code de credencial" width="180" height="180" style="display:block;" />
              </td></tr>
            </table>

            <p style="margin:16px 0 0;font-size:0.8rem;color:#888;text-align:center;">
              Caso o QR code não apareça, utilize o arquivo em anexo neste email.
            </p>
            <p style="margin:8px 0 0;font-size:0.8rem;color:#888;text-align:center;">
              Guarde este email. O QR code é pessoal e intransferível.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0f0f0;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
            <p style="margin:0;font-size:0.75rem;color:#999;">Este é um email automático. Por favor, não responda.</p>
            <p style="margin:4px 0 0;font-size:0.75rem;color:#bbb;">© ${new Date().getFullYear()} Portaria Events. Todos os direitos reservados.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
};

module.exports = { sendRegistrationConfirmation };
