// Email HTML templates with Innobiz-K branding
// Clean, modern design matching professional email standards
// Brand Colors: Yellow #FFC300, Teal #28C3BE, Blue #056EDC

export const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Innobiz-K Ethiopia</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <!-- Header with Brand Colors -->
          <tr>
            <td style="background: linear-gradient(135deg, #FFC300 0%, #28C3BE 50%, #056EDC 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">innobiz-K</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; letter-spacing: 0.5px; opacity: 0.95;">Ethiopia</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f0f; padding: 30px 40px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Innobiz-K Ethiopia. All rights reserved.
              </p>
              <p style="margin: 12px 0 0 0; color: #666666; font-size: 11px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

export const button = (text: string, url: string, color: string = '#28C3BE') => `
  <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
    <tr>
      <td style="border-radius: 8px; background-color: ${color}; box-shadow: 0 2px 8px rgba(40, 195, 190, 0.3);">
        <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`

export const statusBadge = (status: string, color: string) => `
  <span style="display: inline-block; padding: 6px 14px; background-color: ${color}; color: #ffffff; border-radius: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
    ${status}
  </span>
`

export const infoBox = (content: string, borderColor: string = '#28C3BE') => `
  <div style="background-color: #242424; border-left: 4px solid ${borderColor}; border-radius: 8px; padding: 20px; margin: 25px 0;">
    ${content}
  </div>
`

export const heading = (text: string) => `
  <h2 style="color: #ffffff; margin: 0 0 24px 0; font-size: 24px; font-weight: 600; letter-spacing: -0.3px;">
    ${text}
  </h2>
`

export const paragraph = (text: string) => `
  <p style="color: #b0b0b0; line-height: 1.7; margin: 0 0 16px 0; font-size: 15px;">
    ${text}
  </p>
`

export const tip = (text: string) => `
  <p style="color: #808080; font-size: 13px; margin: 25px 0 0 0; line-height: 1.6; font-style: italic;">
    💡 Tip: ${text}
  </p>
`
