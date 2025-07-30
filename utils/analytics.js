// Analytics tracking utilities
// Supports Google Analytics 4, Facebook Pixel, and custom tracking

export const trackToolEvent = (eventName, eventData = {}) => {
  try {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'tool_interaction',
        event_label: eventData.tool_name || 'unknown',
        custom_parameters: eventData
      })
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', eventName, eventData)
    }
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, eventData)
    }
    
    // Send to custom analytics endpoint if needed
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data: eventData,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
      }).catch(error => {
        console.error('Analytics tracking error:', error)
      })
    }
    
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

// Track page views
export const trackPageView = (url, title) => {
  try {
    if (typeof gtag !== 'undefined') {
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_location: url,
        page_title: title,
      })
    }
    
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView')
    }
    
  } catch (error) {
    console.error('Page view tracking error:', error)
  }
}

// Track conversions (affiliate clicks)
export const trackConversion = (toolName, commission, source) => {
  try {
    const conversionData = {
      tool_name: toolName,
      commission_amount: commission,
      source: source,
      value: commission,
      currency: 'USD'
    }
    
    // Google Analytics conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: `${toolName}-${Date.now()}`,
        value: commission,
        currency: 'USD',
        items: [{
          item_id: toolName.toLowerCase().replace(/\s+/g, '-'),
          item_name: toolName,
          item_category: 'ai_marketing_tool',
          quantity: 1,
          price: commission
        }]
      })
    }
    
    // Facebook Pixel conversion
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', {
        value: commission,
        currency: 'USD',
        content_name: toolName,
        content_category: 'ai_marketing_tool'
      })
    }
    
    trackToolEvent('conversion', conversionData)
    
  } catch (error) {
    console.error('Conversion tracking error:', error)
  }
}

// Track quiz completions
export const trackQuizCompletion = (answers, recommendations) => {
  try {
    const quizData = {
      business_size: answers.business_size,
      budget: answers.monthly_budget,
      focus: answers.primary_focus,
      tech_level: answers.technical_level,
      goal: answers.main_goal,
      top_recommendation: recommendations[0]?.name,
      recommendations_count: recommendations.length
    }
    
    trackToolEvent('quiz_completed', quizData)
    
    // Track as a conversion event for marketing attribution
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        currency: 'USD',
        value: 50, // Estimated lead value
        custom_parameters: quizData
      })
    }
    
  } catch (error) {
    console.error('Quiz completion tracking error:', error)
  }
}

// Track search and filter usage
export const trackSearchFilter = (filterType, filterValue, resultsCount) => {
  trackToolEvent('search_filter', {
    filter_type: filterType,
    filter_value: filterValue,
    results_count: resultsCount
  })
}

// Initialize analytics on page load
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Google Analytics 4 initialization
    if (process.env.NEXT_PUBLIC_GA_ID) {
      window.dataLayer = window.dataLayer || []
      function gtag(){dataLayer.push(arguments)}
      gtag('js', new Date())
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: document.title,
        page_location: window.location.href
      })
    }
    
    // Facebook Pixel initialization
    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID)
      fbq('track', 'PageView')
    }
    
  } catch (error) {
    console.error('Analytics initialization error:', error)
  }
}

// Enhanced event tracking for specific user actions
export const trackUserEngagement = (action, details = {}) => {
  const engagementData = {
    action,
    ...details,
    timestamp: new Date().toISOString(),
    session_duration: getSessionDuration(),
    page_url: typeof window !== 'undefined' ? window.location.href : ''
  }
  
  trackToolEvent('user_engagement', engagementData)
}

// Helper function to calculate session duration
function getSessionDuration() {
  try {
    const sessionStart = sessionStorage.getItem('session_start')
    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString())
      return 0
    }
    return Math.floor((Date.now() - parseInt(sessionStart)) / 1000)
  } catch {
    return 0
  }
}