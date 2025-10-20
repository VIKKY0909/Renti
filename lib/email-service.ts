// Email service configuration
// This file contains the email service setup for sending contact form emails

export interface EmailData {
  to: string
  from: string
  subject: string
  html: string
  text: string
}

// Example with Nodemailer (most common)
export async function sendEmailWithNodemailer(emailData: EmailData) {
  // Uncomment and configure when ready to use
  /*
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST, // e.g., 'smtp.gmail.com'
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your app password
    },
  })

  return await transporter.sendMail({
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
  })
  */
  
  // For now, just log the email (replace with actual implementation)
  console.log('Email would be sent:', emailData)
  return { messageId: 'mock-message-id' }
}

// Example with Resend (modern, simple)
export async function sendEmailWithResend(emailData: EmailData) {
  try {
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: 'Rentimade Contact <onboarding@resend.dev>', // Use Resend's default domain for now
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    })
    
    console.log('✅ Email sent successfully with Resend:', result)
    return result
  } catch (error) {
    console.error('❌ Error sending email with Resend:', error)
    throw error
  }
}

// Example with SendGrid
export async function sendEmailWithSendGrid(emailData: EmailData) {
  // Uncomment and configure when ready to use
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  return await sgMail.send({
    to: emailData.to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
  })
  */
  
  // For now, just log the email (replace with actual implementation)
  console.log('Email would be sent with SendGrid:', emailData)
  return { statusCode: 202 }
}

// Main function to send email (choose your preferred service)
export async function sendContactEmail(emailData: EmailData) {
  try {
    // Check if Resend API key is available
    if (process.env.RESEND_API_KEY) {
      console.log('📧 Sending email with Resend...')
      return await sendEmailWithResend(emailData)
    }
    
    // Fallback to development mode if no API key
    console.log('📧 Contact form submission received (development mode):')
    console.log('To:', emailData.to)
    console.log('From:', emailData.from)
    console.log('Subject:', emailData.subject)
    console.log('Message:', emailData.text)
    console.log('⚠️  No RESEND_API_KEY found - email not actually sent')
    
    return { success: true, messageId: 'dev-mode' }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
