import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      subject, 
      message, 
      userAgent: clientUserAgent,
      language,
      platform,
      screenResolution,
      timezone,
      timestamp: clientTimestamp
    } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Get server-side IP address
    const serverIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Unknown'

    // Get server-side user agent
    const serverUserAgent = request.headers.get('user-agent') || 'Unknown'

    // Check if Web3Forms API key is configured
    const accessKey = process.env.WEB3_API_KEY
    
    if (!accessKey) {
      console.error('❌ WEB3_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: "Contact form is not properly configured. Please contact support." },
        { status: 500 }
      )
    }

    // Prepare comprehensive data for Web3Forms
    const formData = new FormData()
    formData.append('access_key', accessKey)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('subject', subject)
    formData.append('message', message)
    
    // IP and location data
    formData.append('ip_address', serverIP)
    formData.append('user_agent', serverUserAgent)
    formData.append('client_user_agent', clientUserAgent || 'Unknown')
    formData.append('language', language || 'Unknown')
    formData.append('platform', platform || 'Unknown')
    formData.append('screen_resolution', screenResolution || 'Unknown')
    formData.append('timezone', timezone || 'Unknown')
    
    // No location data captured - IP address only
    
    // Timestamps
    formData.append('server_timestamp', new Date().toISOString())
    formData.append('client_timestamp', clientTimestamp || new Date().toISOString())
    formData.append('source', 'Rentimade Contact Form')

    // Send to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      console.log('✅ Form submitted successfully to Web3Forms:', {
        name,
        email,
        subject,
        serverIP,
        clientUserAgent,
        language,
        platform,
        screenResolution,
        timezone,
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon."
      })
    } else {
      console.error('❌ Web3Forms submission failed:', result)
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}