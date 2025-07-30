export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, source, timestamp } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required' })
    }

    // Log subscription attempt
    console.log('Newsletter subscription:', {
      email: email.replace(/(.{3}).*@/, '$1***@'), // Mask email for privacy
      source,
      timestamp,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    })

    // Here you would integrate with your email service provider
    // Examples: Mailchimp, ConvertKit, SendGrid, etc.
    
    // Mailchimp integration example:
    /*
    const mailchimp = require('@mailchimp/mailchimp_marketing')
    
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
    })
    
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
      tags: [source],
      merge_fields: {
        SOURCE: source,
        SIGNUP_DATE: timestamp
      }
    })
    */

    // ConvertKit integration example:
    /*
    const convertKitResponse = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.CONVERTKIT_API_KEY,
        email: email,
        tags: [source],
        fields: {
          source: source,
          signup_timestamp: timestamp
        }
      })
    })
    */

    // SendGrid integration example:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    // Add to contacts
    const contactData = {
      contacts: [{
        email: email,
        custom_fields: {
          source: source,
          signup_date: timestamp
        }
      }]
    }
    
    await sgMail.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: contactData
    })
    
    // Send welcome email
    const welcomeEmail = {
      to: email,
      from: 'welcome@thevibemarketer.com',
      templateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
      dynamic_template_data: {
        subscriber_name: email.split('@')[0],
        welcome_bonus_link: 'https://thevibemarketer.com/downloads/ai-marketing-tools-comparison-checklist.pdf'
      }
    }
    
    await sgMail.send(welcomeEmail)
    */

    // For demo purposes, we'll simulate success
    // In production, replace this with actual email service integration
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email: email,
        source: source,
        timestamp: timestamp,
        welcome_email_sent: true,
        bonus_content_available: true
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    // Handle specific email service errors
    if (error.status === 400 && error.title === 'Member Exists') {
      return res.status(200).json({
        success: true,
        message: 'Email already subscribed',
        data: { already_subscribed: true }
      })
    }
    
    return res.status(500).json({
      message: 'Failed to subscribe to newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// Helper function to validate email domains
function isValidEmailDomain(email) {
  const disposableEmailDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ]
  
  const domain = email.split('@')[1]
  return !disposableEmailDomains.includes(domain.toLowerCase())
}

// Helper function to detect bot submissions
function detectBotSubmission(req) {
  const userAgent = req.headers['user-agent'] || ''
  const referer = req.headers.referer || ''
  
  // Basic bot detection
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}