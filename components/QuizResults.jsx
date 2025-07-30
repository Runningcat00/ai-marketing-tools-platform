import React, { useState } from 'react'
import { trackToolEvent } from '../utils/analytics'

const QuizResults = ({ recommendations, answers, onClose, onRetakeQuiz }) => {
  const [selectedTool, setSelectedTool] = useState(null)

  const handleAffiliateClick = (tool, location) => {
    trackToolEvent('affiliate_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: location,
      expected_commission: tool.affiliate.commission_amount,
      source: 'quiz_results',
      recommendation_rank: recommendations.findIndex(r => r.id === tool.id) + 1
    })
    
    window.open(tool.affiliate.link, '_blank')
  }

  const getAnswerLabels = () => {
    const labels = {
      business_size: {
        solo: 'Solo entrepreneur',
        small: '2-10 employees', 
        medium: '11-50 employees',
        large: '50+ employees'
      },
      monthly_budget: {
        under_100: 'Under $100/month',
        '100_500': '$100-500/month',
        '500_2000': '$500-2000/month',
        over_2000: 'Over $2000/month'
      },
      primary_focus: {
        email: 'Email marketing',
        content: 'Content creation',
        social: 'Social media',
        automation: 'Workflow automation',
        ecommerce: 'E-commerce marketing'
      },
      technical_level: {
        beginner: 'Beginner',
        intermediate: 'Intermediate', 
        advanced: 'Advanced'
      },
      main_goal: {
        grow_list: 'Grow email list',
        increase_sales: 'Increase sales',
        save_time: 'Save time',
        improve_engagement: 'Improve engagement',
        scale_operations: 'Scale operations'
      }
    }

    return Object.keys(answers).reduce((acc, key) => {
      acc[key] = labels[key]?.[answers[key]] || answers[key]
      return acc
    }, {})
  }

  const getRankBadge = (index) => {
    const badges = [
      { emoji: '🏆', text: 'Best Match', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      { emoji: '🥈', text: 'Great Option', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      { emoji: '🥉', text: 'Good Choice', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    ]
    return badges[index] || { emoji: '⭐', text: 'Recommended', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  }

  const getRecommendationReason = (tool, index) => {
    const reasons = []
    
    // Budget match
    const price = tool.pricing.starting_price
    if (answers.monthly_budget === 'under_100' && price <= 100) {
      reasons.push('fits your budget perfectly')
    } else if (answers.monthly_budget === '100_500' && price >= 50 && price <= 500) {
      reasons.push('great value for your budget range')
    }
    
    // Business size match
    if (answers.business_size === 'solo' && tool.features.company_size.includes('SMB')) {
      reasons.push('designed for solo entrepreneurs')
    } else if (answers.business_size === 'large' && tool.features.company_size.includes('Enterprise')) {
      reasons.push('scales with enterprise needs')
    }
    
    // Primary focus match
    const capabilities = tool.features.ai_capabilities.join(' ').toLowerCase()
    if (answers.primary_focus === 'email' && capabilities.includes('email')) {
      reasons.push('excellent for email marketing')
    } else if (answers.primary_focus === 'content' && capabilities.includes('content')) {
      reasons.push('perfect for content creation')
    } else if (answers.primary_focus === 'automation' && capabilities.includes('automation')) {
      reasons.push('powerful automation features')
    }
    
    // Technical level match
    if (answers.technical_level === 'beginner' && tool.ratings.ease_of_use >= 4.3) {
      reasons.push('very user-friendly')
    } else if (answers.technical_level === 'advanced') {
      reasons.push('offers advanced customization')
    }
    
    // Free trial
    if (tool.pricing.free_trial) {
      reasons.push(`includes ${tool.pricing.trial_length}-day free trial`)
    }
    
    return reasons.slice(0, 3) // Show top 3 reasons
  }

  const answerLabels = getAnswerLabels()

  return (
    <div className="quiz-results max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Perfect! Here Are Your Personalized Recommendations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your answers, we've found the best AI marketing tools that match your specific needs and budget.
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-blue-50 rounded-xl p-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Your Profile Summary:</h3>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <span className="bg-white px-3 py-1 rounded-full border">
              👥 {answerLabels.business_size}
            </span>
            <span className="bg-white px-3 py-1 rounded-full border">
              💰 {answerLabels.monthly_budget}
            </span>
            <span className="bg-white px-3 py-1 rounded-full border">
              🎯 {answerLabels.primary_focus}
            </span>
            <span className="bg-white px-3 py-1 rounded-full border">
              🔧 {answerLabels.technical_level}
            </span>
            <span className="bg-white px-3 py-1 rounded-full border">
              📈 {answerLabels.main_goal}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-8 mb-12">
        {recommendations.map((tool, index) => {
          const badge = getRankBadge(index)
          const reasons = getRecommendationReason(tool, index)
          
          return (
            <div key={tool.id} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-600">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{tool.name}</h3>
                        <span className={`text-sm px-3 py-1 rounded-full border font-medium ${badge.color}`}>
                          {badge.emoji} {badge.text}
                        </span>
                      </div>
                      <p className="text-gray-600 text-lg mb-3">{tool.description}</p>
                      
                      {/* Why Recommended */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          Why we recommend this for you:
                        </h4>
                        <ul className="space-y-1">
                          {reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center text-green-800 text-sm">
                              <span className="text-green-500 mr-2">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {tool.pricing.starting_price === 0 ? 'Free' : `$${tool.pricing.starting_price}`}
                      {tool.pricing.starting_price > 0 && (
                        <span className="text-lg font-normal text-gray-600">/mo</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(tool.ratings.overall_score) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {tool.ratings.overall_score} ({tool.ratings.total_reviews.toLocaleString()})
                      </span>
                    </div>
                    
                    {/* CTA Button */}
                    <button
                      onClick={() => handleAffiliateClick(tool, 'quiz_results')}
                      className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:shadow-xl' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {tool.pricing.free_trial ? `Start ${tool.pricing.trial_length}-Day Free Trial` : `Try ${tool.name}`}
                    </button>
                    
                    {tool.pricing.free_tier && (
                      <div className="text-sm text-green-600 mt-2 font-medium">
                        Free tier available
                      </div>
                    )}
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key AI Features</h4>
                    <ul className="space-y-2">
                      {tool.features.ai_capabilities.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <span className="text-blue-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Best For</h4>
                    <div className="space-y-2">
                      {tool.best_for.slice(0, 3).map((use, idx) => (
                        <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                          {use}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {tool.pros.slice(0, 3).map((pro, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <span className="text-green-500 mr-2">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expert Opinion */}
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    The Vibe Marketer Take:
                  </h4>
                  <p className="text-gray-700 italic">"{tool.expert_opinion}"</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          We recommend starting with your #1 match and taking advantage of their free trial. 
          You can always add more tools as your business grows.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => handleAffiliateClick(recommendations[0], 'next_steps_cta')}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Start with {recommendations[0].name}
          </button>
          <button
            onClick={onRetakeQuiz}
            className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Want More Marketing Insights?
        </h3>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Join 30,000+ marketing professionals getting AI-powered strategies and tool recommendations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe to The Vibe Marketer
            </button>
            <button 
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResults