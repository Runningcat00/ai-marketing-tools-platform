import React, { useState } from 'react'
import { trackToolEvent } from '../utils/analytics'

// Tool Comparison Checklist Lead Magnet
export const ComparisonChecklist = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  if (!isVisible) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    trackToolEvent('lead_magnet_conversion', {
      magnet_type: 'comparison_checklist',
      email_domain: email.split('@')[1],
      source: 'popup'
    })
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        onClose()
        // Trigger download
        downloadChecklist()
      }, 2000)
    }, 1000)
  }

  const downloadChecklist = () => {
    // Create and download checklist PDF
    const element = document.createElement('a')
    element.setAttribute('href', '/downloads/ai-marketing-tools-comparison-checklist.pdf')
    element.setAttribute('download', 'AI-Marketing-Tools-Comparison-Checklist.pdf')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Free Tool Comparison Checklist
          </h3>
          <p className="text-gray-600">
            Get our proven 25-point checklist used by 30,000+ marketers to evaluate 
            and compare AI marketing automation tools.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Check Your Email!</h4>
            <p className="text-gray-600">
              Your checklist is on its way. Download link sent to {email}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  25-point evaluation framework
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Pricing comparison worksheet
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  ROI calculation template
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Implementation timeline guide
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Bonus: Common mistakes to avoid
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Get Free Checklist'}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                No spam. Unsubscribe anytime. Used by 30,000+ marketers.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ROI Calculator Lead Magnet
export const ROICalculatorPopup = ({ isVisible, onClose, calculatedROI }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  if (!isVisible) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    trackToolEvent('lead_magnet_conversion', {
      magnet_type: 'roi_report',
      email_domain: email.split('@')[1],
      calculated_roi: calculatedROI,
      source: 'roi_calculator'
    })
    
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get Your Detailed ROI Report
          </h3>
          <p className="text-gray-600">
            Receive a personalized PDF report with your ROI calculations, 
            implementation timeline, and optimization strategies.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Report Sent!</h4>
            <p className="text-gray-600">
              Your personalized ROI report is in your inbox.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-green-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {calculatedROI > 0 ? '+' : ''}{Math.round(calculatedROI)}% ROI
                </div>
                <div className="text-sm text-green-800">
                  Based on your business metrics
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Your Report Includes:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Detailed ROI breakdown and projections
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  30/60/90-day implementation plan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Optimization strategies for maximum ROI
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Tool-specific setup guides
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Generating Report...' : 'Get My ROI Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// Newsletter Signup Popup
export const NewsletterPopup = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  if (!isVisible) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    trackToolEvent('newsletter_signup', {
      source: 'exit_intent_popup',
      email_domain: email.split('@')[1]
    })
    
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        onClose()
      }, 3000)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Wait! Don't Miss Out
          </h3>
          <p className="text-blue-100">
            Join 30,000+ marketers getting weekly AI tool reviews, 
            exclusive discounts, and growth strategies.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-white text-4xl mb-4">✓</div>
            <h4 className="text-xl font-bold mb-2">Welcome to the Community!</h4>
            <p className="text-blue-100">
              Check your email for your welcome bonus and exclusive content.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="font-semibold mb-3">What You'll Get:</h4>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span>
                  Weekly AI marketing tool reviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span>
                  Exclusive subscriber discounts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span>
                  Growth strategies and case studies
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">✓</span>
                  Early access to new tool comparisons
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border-0 rounded-lg px-4 py-3 mb-4 text-gray-900 focus:ring-4 focus:ring-white focus:ring-opacity-30"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join Free - Get Bonus Content'}
              </button>
              <p className="text-xs text-blue-200 mt-2 text-center">
                No spam ever. Unsubscribe with one click.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// Exit Intent Hook
export const useExitIntent = (callback) => {
  React.useEffect(() => {
    let hasTriggered = false
    
    const handleMouseLeave = (e) => {
      if (!hasTriggered && e.clientY <= 0) {
        hasTriggered = true
        setTimeout(() => {
          callback()
        }, 500)
      }
    }
    
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [callback])
}