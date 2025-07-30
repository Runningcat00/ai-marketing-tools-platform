import React, { useState } from 'react'
import { trackEmailInteraction } from '../utils/analytics'

// Main Newsletter Signup Component
export const NewsletterSignup = ({ 
  variant = 'default', 
  title = 'Join 30,000+ Marketing Professionals',
  description = 'Get weekly AI marketing insights and exclusive tool discounts.',
  buttonText = 'Subscribe Free',
  source = 'newsletter_component'
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('') // '', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    try {
      // Track the signup attempt
      trackEmailInteraction('newsletter_signup_attempt', email, {
        source,
        variant
      })
      
      // Call newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        setStatus('success')
        setEmail('')
        
        // Track successful signup
        trackEmailInteraction('newsletter_signup_success', email, {
          source,
          variant
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Subscription failed')
      }
      
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
      
      // Track signup error
      trackEmailInteraction('newsletter_signup_error', email, {
        source,
        variant,
        error: error.message
      })
    }
  }

  const variants = {
    default: 'bg-white border border-gray-200 rounded-2xl p-8',
    hero: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8',
    inline: 'bg-blue-50 border border-blue-200 rounded-xl p-6',
    sidebar: 'bg-gray-50 rounded-xl p-6',
    footer: 'bg-gray-800 text-white rounded-xl p-6'
  }

  const inputStyles = {
    default: 'border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    hero: 'border-0 rounded-lg px-4 py-3 text-gray-900 focus:ring-4 focus:ring-white focus:ring-opacity-30',
    inline: 'border border-blue-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    sidebar: 'border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    footer: 'border border-gray-600 bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
  }

  const buttonStyles = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors',
    hero: 'bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors',
    inline: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors',
    sidebar: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors',
    footer: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors'
  }

  if (status === 'success') {
    return (
      <div className={variants[variant]}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-xl font-bold mb-2">
            Welcome to The Vibe Marketer!
          </h3>
          <p className={variant === 'hero' || variant === 'footer' ? 'text-blue-100' : 'text-gray-600'}>
            Check your email for your welcome bonus and exclusive content.
          </p>
          <div className="mt-4">
            <span className={`text-sm ${variant === 'hero' || variant === 'footer' ? 'text-blue-200' : 'text-gray-500'}`}>
              ✓ Free AI Marketing Tools Checklist sent
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={variants[variant]}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className={variant === 'hero' || variant === 'footer' ? 'text-blue-100' : 'text-gray-600'}>
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`w-full ${inputStyles[variant]}`}
            required
            disabled={status === 'loading'}
          />
        </div>
        
        {status === 'error' && (
          <div className="text-red-600 text-sm">
            {errorMessage}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`flex-1 ${buttonStyles[variant]} disabled:opacity-50`}
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </div>
        
        <div className={`text-xs ${variant === 'hero' || variant === 'footer' ? 'text-blue-200' : 'text-gray-500'} text-center`}>
          <p>✓ No spam, unsubscribe anytime</p>
          <p>✓ Join 30,000+ marketing professionals</p>
          <p>✓ Get exclusive tool discounts</p>
        </div>
      </form>
    </div>
  )
}

// Compact Newsletter Signup (for sidebars, etc.)
export const CompactNewsletter = ({ source = 'compact_newsletter' }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      trackEmailInteraction('newsletter_signup_attempt', email, { source })
      
      // Simulate API call
      setTimeout(() => {
        setStatus('success')
        setEmail('')
        trackEmailInteraction('newsletter_signup_success', email, { source })
      }, 1000)
      
    } catch (error) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <p className="text-green-800 font-medium">Subscribed!</p>
        <p className="text-green-700 text-sm">Check your email for goodies.</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="text-center mb-3">
        <h4 className="font-bold text-gray-900 mb-1">Weekly AI Insights</h4>
        <p className="text-sm text-gray-600">
          Join 30,000+ marketers getting tool reviews & growth tips.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full border border-blue-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : 'Join Free'}
        </button>
      </form>
    </div>
  )
}

// Newsletter Exit Intent Popup
export const NewsletterExitIntent = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
        >
          ×
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Wait! Don't Leave Empty-Handed
            </h3>
            <p className="text-gray-600">
              Get our free AI Marketing Tools Comparison Checklist plus weekly insights 
              from 30,000+ marketing professionals.
            </p>
          </div>

          <NewsletterSignup 
            variant="default"
            title="Get Your Free Checklist"
            description="Join The Vibe Marketer community and get instant access to our tool comparison framework."
            buttonText="Get Free Checklist"
            source="exit_intent_popup"
          />
        </div>
      </div>
    </div>
  )
}

export default NewsletterSignup