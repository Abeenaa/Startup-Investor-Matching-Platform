import { Resend } from 'resend'
import { env } from '../../config/env'
import { emailLayout, button, statusBadge, infoBox, heading, paragraph, tip } from '../templates/email-templates'

class EmailService {
  private resend: Resend | null = null
  private readonly baseUrl = env.CORS_ORIGIN

  constructor() {
    this.initialize()
  }

  private initialize() {
    try {
      if (env.RESEND_API_KEY) {
        this.resend = new Resend(env.RESEND_API_KEY)
        console.log('✅ Resend email service initialized')
        console.log(`📧 Sending emails from: ${env.EMAIL_FROM}`)
      } else {
        console.warn('⚠️ RESEND_API_KEY not configured. Email notifications disabled.')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Resend:', error)
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      console.warn('⚠️ Resend not initialized. Email not sent to:', to)
      return false
    }

    try {
      console.log(`📤 Attempting to send email to: ${to}`)
      console.log(`📋 Subject: ${subject}`)
      
      const result = await this.resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      })
      
      console.log(`✅ Email sent successfully!`)
      console.log(`📧 Recipient: ${to}`)
      console.log(`🆔 Email ID: ${result.data?.id || 'N/A'}`)
      
      if (result.error) {
        console.error('⚠️ Resend error:', result.error)
        console.log('\n💡 TIP: In test mode, you can only send to your verified email.')
        console.log('   Either use your verified email or verify a domain at resend.com/domains\n')
      }
      
      return true
    } catch (error: any) {
      console.error('❌ Failed to send email:', error)
      console.error('Error details:', error.message)
      
      // Check if it's a 403 validation error
      if (error.statusCode === 403 || error.name === 'validation_error') {
        console.log('\n💡 SOLUTION: In Resend test mode, you can only send emails to your verified email address.')
        console.log('   Register with your verified email to receive test emails.\n')
      }
      
      return false
    }
  }

  // ============================================================================
  // WELCOME EMAILS
  // ============================================================================

  async sendWelcomeStartup(to: string, name: string) {
    const content = `
      ${heading('Welcome to Innobiz-K! 🎉')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${name}</strong>,`)}
      ${paragraph('Welcome to <strong style="color: #28C3BE;">Innobiz-K Ethiopia</strong>, the premier platform connecting innovative startups with investors and funding opportunities.')}
      ${infoBox(`
        <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">Your Next Steps:</p>
        <ol style="margin: 0; padding-left: 20px; color: #b0b0b0; line-height: 1.8;">
          <li>Complete your startup profile with detailed information</li>
          <li>Wait for profile approval (usually 24-48 hours)</li>
          <li>Browse available programs and submit applications</li>
        </ol>
      `, '#28C3BE')}
      ${button('Complete Your Profile', `${this.baseUrl}/dashboard/startup/profile`)}
      ${tip('Completing your profile increases your chances of getting matched with the right programs and investors.')}
    `
    return this.sendEmail(to, 'Welcome to Innobiz-K Ethiopia', emailLayout(content))
  }

  async sendWelcomeInvestor(to: string, name: string) {
    const content = `
      ${heading('Welcome to Innobiz-K! 🎉')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${name}</strong>,`)}
      ${paragraph('Thank you for joining <strong style="color: #28C3BE;">Innobiz-K Ethiopia</strong> as an investor. We\'re excited to connect you with innovative startups.')}
      ${infoBox(`
        <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">Your Next Steps:</p>
        <ol style="margin: 0; padding-left: 20px; color: #b0b0b0; line-height: 1.8;">
          <li>Complete your investor profile</li>
          <li>Wait for profile verification (usually 24-48 hours)</li>
          <li>Discover startups matching your investment interests</li>
        </ol>
      `, '#056EDC')}
      ${button('Complete Your Profile', `${this.baseUrl}/dashboard/investor/profile`, '#056EDC')}
      ${tip('Set your investment preferences to receive personalized startup recommendations.')}
    `
    return this.sendEmail(to, 'Welcome to Innobiz-K Ethiopia', emailLayout(content))
  }

  async sendWelcomeReviewer(to: string, name: string, tempPassword: string) {
    const content = `
      ${heading('Welcome to the Innobiz-K Review Team! 👋')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${name}</strong>,`)}
      ${paragraph('You have been added as a reviewer on the Innobiz-K platform. Your expertise will help evaluate startup applications and support Ethiopia\'s innovation ecosystem.')}
      ${infoBox(`
        <p style="margin: 0 0 10px 0; color: #ffffff; font-weight: 600;">Your Login Credentials:</p>
        <p style="margin: 5px 0; color: #b0b0b0;">Email: <strong style="color: #ffffff;">${to}</strong></p>
        <p style="margin: 5px 0; color: #b0b0b0;">Temporary Password: <strong style="color: #FFC300;">${tempPassword}</strong></p>
      `, '#FFC300')}
      <div style="background-color: #2a1a1a; border-left: 4px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #fca5a5; font-size: 14px;">⚠️ <strong>Important:</strong> Please change your password immediately after first login for security.</p>
      </div>
      ${button('Login to Dashboard', `${this.baseUrl}/login`)}
    `
    return this.sendEmail(to, 'Your Innobiz-K Reviewer Account', emailLayout(content))
  }

  // ============================================================================
  // STARTUP PROFILE NOTIFICATIONS
  // ============================================================================

  async sendStartupProfileApproved(to: string, startupName: string) {
    const content = `
      ${heading('Profile Approved! ✅')}
      ${paragraph(`Congratulations <strong style="color: #ffffff;">${startupName}</strong>!`)}
      ${paragraph('Great news! Your startup profile has been approved and is now visible in the Innobiz-K directory.')}
      ${infoBox(`
        <div style="text-align: center;">
          <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">✓ PROFILE APPROVED</p>
          </div>
        </div>
      `, '#10b981')}
      ${paragraph('<strong style="color: #ffffff;">What You Can Do Now:</strong>')}
      <ul style="color: #b0b0b0; line-height: 1.8; margin: 0 0 20px 0;">
        <li>Browse and apply to available funding programs</li>
        <li>Connect with investors in the ecosystem</li>
        <li>Update your profile anytime with new achievements</li>
      </ul>
      ${button('Browse Programs', `${this.baseUrl}/dashboard/startup/programs`, '#28C3BE')}
    `
    return this.sendEmail(to, '🎉 Your Startup Profile Has Been Approved', emailLayout(content))
  }

  async sendStartupProfileRejected(to: string, startupName: string, reason: string) {
    const content = `
      ${heading('Profile Review Update')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${startupName}</strong>,`)}
      ${paragraph('Thank you for your interest in Innobiz-K. After reviewing your profile, we need some additional information or corrections before approval.')}
      ${infoBox(`
        <p style="margin: 0 0 10px 0; color: #fca5a5; font-weight: 600;">Reason for Review:</p>
        <p style="margin: 0; color: #fecaca; line-height: 1.6;">${reason}</p>
      `, '#ef4444')}
      ${paragraph('Please update your profile with the requested information and resubmit for review. Our team is here to help you succeed!')}
      ${button('Update Profile', `${this.baseUrl}/dashboard/startup/profile`, '#056EDC')}
      ${tip('Need help? Contact our support team for guidance on completing your profile.')}
    `
    return this.sendEmail(to, 'Action Required: Update Your Startup Profile', emailLayout(content))
  }

  // ============================================================================
  // INVESTOR PROFILE NOTIFICATIONS
  // ============================================================================

  async sendInvestorProfileApproved(to: string, investorName: string) {
    const content = `
      ${heading('Profile Approved! ✅')}
      ${paragraph(`Congratulations <strong style="color: #ffffff;">${investorName}</strong>!`)}
      ${paragraph('Your investor profile has been approved. You now have full access to the startup directory and can connect with innovative Ethiopian companies.')}
      ${infoBox(`
        <div style="text-align: center;">
          <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700;">✓ VERIFIED INVESTOR</p>
          </div>
        </div>
      `, '#10b981')}
      ${button('Discover Startups', `${this.baseUrl}/dashboard/investor/discover`, '#28C3BE')}
    `
    return this.sendEmail(to, '🎉 Your Investor Profile Has Been Approved', emailLayout(content))
  }

  async sendInvestorProfileRejected(to: string, investorName: string, reason: string) {
    const content = `
      ${heading('Profile Verification Update')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${investorName}</strong>,`)}
      ${paragraph('We need some additional information to complete your investor profile verification.')}
      ${infoBox(`
        <p style="margin: 0 0 10px 0; color: #fca5a5; font-weight: 600;">Additional Information Needed:</p>
        <p style="margin: 0; color: #fecaca; line-height: 1.6;">${reason}</p>
      `, '#ef4444')}
      ${button('Update Profile', `${this.baseUrl}/dashboard/investor/profile`, '#056EDC')}
    `
    return this.sendEmail(to, 'Action Required: Complete Your Investor Profile', emailLayout(content))
  }

  // ============================================================================
  // APPLICATION NOTIFICATIONS
  // ============================================================================

  async sendApplicationSubmitted(to: string, startupName: string, programName: string) {
    const content = `
      ${heading('Application Submitted Successfully! 📝')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${startupName}</strong>,`)}
      ${paragraph(`Your application to <strong style="color: #28C3BE;">${programName}</strong> has been successfully submitted and is now under review.`)}
      ${infoBox(`
        <div style="text-align: center;">
          <div style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">✓ APPLICATION RECEIVED</p>
          </div>
        </div>
      `, '#3b82f6')}
      ${paragraph('<strong style="color: #ffffff;">What Happens Next?</strong>')}
      <ol style="color: #b0b0b0; line-height: 1.8; margin: 0 0 20px 0;">
        <li>Our team will review your application</li>
        <li>Expert reviewers will evaluate your submission</li>
        <li>You'll receive an email notification with the decision</li>
        <li>Typical review time: 2-4 weeks</li>
      </ol>
      ${button('View Application Status', `${this.baseUrl}/dashboard/startup/applications`)}
      ${tip('You can track your application status anytime from your dashboard.')}
    `
    return this.sendEmail(to, `Application Submitted: ${programName}`, emailLayout(content))
  }

  async sendApplicationStatusChanged(to: string, startupName: string, programName: string, status: string) {
    const statusColors: Record<string, string> = {
      UNDER_REVIEW: '#f59e0b',
      APPROVED: '#10b981',
      REJECTED: '#ef4444',
    }
    const color = statusColors[status] || '#6b7280'
    const statusText = status.replace('_', ' ')

    const content = `
      ${heading('Application Status Update')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${startupName}</strong>,`)}
      ${paragraph(`Your application to <strong style="color: #28C3BE;">${programName}</strong> status has been updated.`)}
      ${infoBox(`
        <div style="text-align: center;">
          <p style="margin: 0 0 10px 0; color: #b0b0b0;">New Status:</p>
          <div style="display: inline-block; padding: 10px 20px; background-color: ${color}; border-radius: 8px;">
            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600; text-transform: uppercase;">${statusText}</p>
          </div>
        </div>
      `, color)}
      ${button('View Details', `${this.baseUrl}/dashboard/startup/applications`)}
    `
    return this.sendEmail(to, `Application Update: ${programName}`, emailLayout(content))
  }

  async sendApplicationApproved(to: string, startupName: string, programName: string) {
    const content = `
      ${heading('Congratulations! 🎉')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${startupName}</strong>,`)}
      <p style="color: #b0b0b0; line-height: 1.7; margin: 0 0 20px 0; font-size: 17px;">
        We're <strong style="color: #10b981;">thrilled</strong> to inform you that your application to <strong style="color: #28C3BE;">${programName}</strong> has been <strong style="color: #10b981;">approved</strong>!
      </p>
      ${infoBox(`
        <div style="text-align: center; padding: 20px 0;">
          <p style="margin: 0; font-size: 48px;">🎊</p>
          <p style="margin: 15px 0 0 0; color: #10b981; font-size: 24px; font-weight: 700;">APPLICATION APPROVED!</p>
        </div>
      `, '#10b981')}
      ${paragraph('Our team will contact you shortly with the next steps, program details, and onboarding information.')}
      ${paragraph('This is an exciting milestone for your startup journey. Congratulations on your achievement!')}
      ${button('View Application', `${this.baseUrl}/dashboard/startup/applications`, '#10b981')}
    `
    return this.sendEmail(to, `🎉 Application Approved: ${programName}`, emailLayout(content))
  }

  async sendApplicationRejected(to: string, startupName: string, programName: string, reason?: string) {
    const content = `
      ${heading('Application Decision')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${startupName}</strong>,`)}
      ${paragraph(`Thank you for your application to <strong style="color: #28C3BE;">${programName}</strong>. After careful review by our evaluation team, we regret to inform you that your application was not selected at this time.`)}
      ${reason ? infoBox(`
        <p style="margin: 0 0 10px 0; color: #fca5a5; font-weight: 600;">Feedback from Reviewers:</p>
        <p style="margin: 0; color: #fecaca; line-height: 1.6;">${reason}</p>
      `, '#ef4444') : ''}
      ${paragraph('We encourage you to:')}
      <ul style="color: #b0b0b0; line-height: 1.8; margin: 0 0 20px 0;">
        <li>Review the feedback and strengthen your application</li>
        <li>Apply to other programs that may be a better fit</li>
        <li>Continue building your startup and reapply in the future</li>
      </ul>
      ${paragraph('This decision doesn\'t reflect on your startup\'s potential. Keep innovating!')}
      ${button('Browse Other Programs', `${this.baseUrl}/dashboard/startup/programs`)}
    `
    return this.sendEmail(to, `Application Decision: ${programName}`, emailLayout(content))
  }

  // ============================================================================
  // REVIEWER NOTIFICATIONS
  // ============================================================================

  async sendReviewerAssigned(to: string, reviewerName: string, startupName: string, programName: string, applicationId: string) {
    const content = `
      ${heading('New Review Assignment 📋')}
      ${paragraph(`Hi <strong style="color: #ffffff;">${reviewerName}</strong>,`)}
      ${paragraph('You have been assigned to review a new application. Your expertise is valuable in helping us identify promising startups for our programs.')}
      ${infoBox(`
        <p style="margin: 0 0 15px 0; color: #ffffff; font-weight: 600; font-size: 16px;">Application Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #808080; font-size: 14px;">Startup:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600; text-align: right;">${startupName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #808080; font-size: 14px;">Program:</td>
            <td style="padding: 8px 0; color: #28C3BE; font-weight: 600; text-align: right;">${programName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #808080; font-size: 14px;">Application ID:</td>
            <td style="padding: 8px 0; color: #b0b0b0; font-size: 12px; text-align: right;">${applicationId}</td>
          </tr>
        </table>
      `, '#28C3BE')}
      ${paragraph('Please review the application and submit your evaluation at your earliest convenience. Your thorough assessment helps us make informed decisions.')}
      ${button('Start Review', `${this.baseUrl}/dashboard/reviewer/submissions`, '#28C3BE')}
      ${tip('Access the scoring guide from your dashboard for evaluation criteria.')}
    `
    return this.sendEmail(to, `New Review Assignment: ${startupName}`, emailLayout(content))
  }
}

export const emailService = new EmailService()
