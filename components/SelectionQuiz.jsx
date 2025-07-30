import React, { useState } from 'react'
import { trackToolEvent } from '../utils/analytics'

const SelectionQuiz = ({ tools, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const questions = [
    {
      id: 'business_size',
      question: 'What\'s your business size?',
      subtitle: 'This helps us recommend tools that scale with your needs',
      options: [
        { 
          value: 'solo', 
          label: 'Solo entrepreneur', 
          description: 'Just me running the business',
          icon: '👤'
        },
        { 
          value: 'small', 
          label: '2-10 employees', 
          description: 'Small team with basic needs',
          icon: '👥'
        },
        { 
          value: 'medium', 
          label: '11-50 employees', 
          description: 'Medium business with complex workflows',
          icon: '🏢'
        },
        { 
          value: 'large', 
          label: '50+ employees', 
          description: 'Large organization needing enterprise features',
          icon: '🏭'
        }
      ]
    },
    {
      id: 'monthly_budget',
      question: 'What\'s your monthly marketing tool budget?',
      subtitle: 'We\'ll recommend tools within your price range',
      options: [
        { 
          value: 'under_100', 
          label: 'Under $100', 
          description: 'Looking for cost-effective solutions',
          icon: '💰'
        },
        { 
          value: '100_500', 
          label: '$100 - $500', 
          description: 'Moderate budget for growth',
          icon: '💳'
        },
        { 
          value: '500_2000', 
          label: '$500 - $2,000', 
          description: 'Serious investment in marketing tech',
          icon: '💎'
        },
        { 
          value: 'over_2000', 
          label: 'Over $2,000', 
          description: 'Enterprise-level budget',
          icon: '🏦'
        }
      ]
    },
    {
      id: 'primary_focus',
      question: 'What\'s your primary marketing focus?',
      subtitle: 'Choose your most important marketing activity right now',
      options: [
        { 
          value: 'email', 
          label: 'Email marketing', 
          description: 'Building and nurturing email lists',
          icon: '📧'
        },
        { 
          value: 'content', 
          label: 'Content creation', 
          description: 'Creating blogs, social posts, and marketing copy',
          icon: '✍️'
        },
        { 
          value: 'social', 
          label: 'Social media', 
          description: 'Managing social media presence and ads',
          icon: '📱'
        },
        { 
          value: 'automation', 
          label: 'Workflow automation', 
          description: 'Streamlining repetitive marketing tasks',
          icon: '⚡'
        },
        { 
          value: 'ecommerce', 
          label: 'E-commerce marketing', 
          description: 'Product recommendations and customer retention',
          icon: '🛒'
        }
      ]
    },
    {
      id: 'technical_level',
      question: 'How technical is your team?',
      subtitle: 'This helps us recommend tools that match your comfort level',
      options: [
        { 
          value: 'beginner', 
          label: 'Beginner', 
          description: 'Need simple, user-friendly tools',
          icon: '🌱'
        },
        { 
          value: 'intermediate', 
          label: 'Intermediate', 
          description: 'Comfortable with most software',
          icon: '🚀'
        },
        { 
          value: 'advanced', 
          label: 'Advanced', 
          description: 'Can handle complex setups and integrations',
          icon: '🔧'
        }
      ]
    },
    {
      id: 'main_goal',
      question: 'What\'s your main goal right now?',
      subtitle: 'Help us understand what success looks like for you',
      options: [
        { 
          value: 'grow_list', 
          label: 'Grow my email list', 
          description: 'Focus on lead generation and list building',
          icon: '📈'
        },
        { 
          value: 'increase_sales', 
          label: 'Increase sales', 
          description: 'Convert more leads into customers',
          icon: '💸'
        },
        { 
          value: 'save_time', 
          label: 'Save time on repetitive tasks', 
          description: 'Automate manual marketing work',
          icon: '⏰'
        },
        { 
          value: 'improve_engagement', 
          label: 'Improve customer engagement', 
          description: 'Better connect with my audience',
          icon: '❤️'
        },
        { 
          value: 'scale_operations', 
          label: 'Scale marketing operations', 
          description: 'Handle more customers without more work',
          icon: '📊'
        }
      ]
    }
  ]

  const handleAnswer = async (questionId, answer) => {
    const updatedAnswers = { ...answers, [questionId]: answer }
    setAnswers(updatedAnswers)
    
    // Track individual question answers
    trackToolEvent('quiz_question_answered', {
      question_id: questionId,
      answer: answer,
      step: currentStep + 1,
      total_steps: questions.length
    })
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Quiz complete - calculate recommendations
      setIsLoading(true)
      
      try {
        const recommendations = await calculateRecommendations(updatedAnswers)
        
        // Track quiz completion
        trackToolEvent('quiz_completion', {
          answers: updatedAnswers,
          recommendations: recommendations.map(r => r.id),
          total_steps: questions.length
        })
        
        onComplete(recommendations, updatedAnswers)
      } catch (error) {
        console.error('Error calculating recommendations:', error)
        // Fallback to simple recommendations
        const fallbackRecommendations = tools.slice(0, 3)
        onComplete(fallbackRecommendations, updatedAnswers)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const calculateRecommendations = async (userAnswers) => {
    const { business_size, monthly_budget, primary_focus, technical_level, main_goal } = userAnswers
    
    // Initialize scoring for all tools
    let scoring = {}
    tools.forEach(tool => {
      scoring[tool.id] = 0
    })
    
    // Score based on business size
    tools.forEach(tool => {
      const companySizes = tool.features.company_size
      if (business_size === 'solo' && companySizes.includes('SMB')) {
        scoring[tool.id] += 3
      }
      if (business_size === 'small' && companySizes.includes('SMB')) {
        scoring[tool.id] += 3
      }
      if ((business_size === 'medium' || business_size === 'large') && companySizes.includes('Enterprise')) {
        scoring[tool.id] += 3
      }
    })
    
    // Score based on budget
    tools.forEach(tool => {
      const price = tool.pricing.starting_price
      let budgetMatch = 0
      
      switch (monthly_budget) {
        case 'under_100':
          if (price <= 100) budgetMatch = 4
          else if (price <= 200) budgetMatch = 2
          break
        case '100_500':
          if (price >= 50 && price <= 500) budgetMatch = 4
          else if (price <= 100) budgetMatch = 3
          break
        case '500_2000':
          if (price >= 200 && price <= 2000) budgetMatch = 4
          else if (price <= 500) budgetMatch = 2
          break
        case 'over_2000':
          if (price >= 500) budgetMatch = 4
          else budgetMatch = 2
          break
      }
      
      scoring[tool.id] += budgetMatch
    })
    
    // Score based on primary focus
    tools.forEach(tool => {
      const capabilities = tool.features.ai_capabilities.join(' ').toLowerCase()
      const useCases = tool.features.use_cases.join(' ').toLowerCase()
      const description = tool.description.toLowerCase()
      
      let focusMatch = 0
      
      switch (primary_focus) {
        case 'email':
          if (capabilities.includes('email') || useCases.includes('email') || description.includes('email')) {
            focusMatch = 4
          }
          break
        case 'content':
          if (capabilities.includes('content') || capabilities.includes('creation') || capabilities.includes('ai content')) {
            focusMatch = 4
          }
          break
        case 'social':
          if (capabilities.includes('social') || useCases.includes('social') || description.includes('social')) {
            focusMatch = 4
          }
          break
        case 'automation':
          if (capabilities.includes('automation') || capabilities.includes('workflow') || description.includes('automation')) {
            focusMatch = 4
          }
          break
        case 'ecommerce':
          if (useCases.includes('e-commerce') || useCases.includes('ecommerce') || description.includes('e-commerce')) {
            focusMatch = 4
          }
          break
      }
      
      scoring[tool.id] += focusMatch
    })
    
    // Score based on technical level
    tools.forEach(tool => {
      const easeOfUse = tool.ratings.ease_of_use
      let techMatch = 0
      
      switch (technical_level) {
        case 'beginner':
          if (easeOfUse >= 4.3) techMatch = 3
          else if (easeOfUse >= 4.0) techMatch = 2
          else techMatch = 1
          break
        case 'intermediate':
          if (easeOfUse >= 3.8) techMatch = 3
          else techMatch = 2
          break
        case 'advanced':
          techMatch = 2 // Advanced users can handle any tool
          break
      }
      
      scoring[tool.id] += techMatch
    })
    
    // Score based on main goal
    tools.forEach(tool => {
      const useCases = tool.features.use_cases.join(' ').toLowerCase()
      const capabilities = tool.features.ai_capabilities.join(' ').toLowerCase()
      
      let goalMatch = 0
      
      switch (main_goal) {
        case 'grow_list':
          if (useCases.includes('lead generation') || capabilities.includes('lead')) {
            goalMatch = 3
          }
          break
        case 'increase_sales':
          if (useCases.includes('sales') || capabilities.includes('conversion') || capabilities.includes('scoring')) {
            goalMatch = 3
          }
          break
        case 'save_time':
          if (capabilities.includes('automation') || capabilities.includes('automated')) {
            goalMatch = 3
          }
          break
        case 'improve_engagement':
          if (capabilities.includes('personalization') || capabilities.includes('engagement')) {
            goalMatch = 3
          }
          break
        case 'scale_operations':
          if (tool.features.company_size.includes('Enterprise') || capabilities.includes('scale')) {
            goalMatch = 3
          }
          break
      }
      
      scoring[tool.id] += goalMatch
    })
    
    // Add bonus points for highly rated tools
    tools.forEach(tool => {
      if (tool.ratings.overall_score >= 4.5) {
        scoring[tool.id] += 2
      } else if (tool.ratings.overall_score >= 4.0) {
        scoring[tool.id] += 1
      }
    })
    
    // Get top 3 recommendations
    const sortedTools = Object.entries(scoring)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([toolId, score]) => ({
        ...tools.find(t => t.id === toolId),
        recommendation_score: score
      }))
    
    return sortedTools
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = ((currentStep + 1) / questions.length) * 100

  if (isLoading) {
    return (
      <div className="quiz-loading text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analyzing Your Needs...
        </h3>
        <p className="text-gray-600">
          We're finding the perfect AI marketing tools for your business
        </p>
      </div>
    )
  }

  return (
    <div className="selection-quiz max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="quiz-progress mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-blue-600">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {questions[currentStep].question}
          </h3>
          <p className="text-gray-600 text-lg">
            {questions[currentStep].subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="quiz-options grid gap-4 mb-8">
          {questions[currentStep].options.map(option => (
            <button
              key={option.value}
              className="quiz-option group p-6 border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
              onClick={() => handleAnswer(questions[currentStep].id, option.value)}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-blue-900">
                    {option.label}
                  </div>
                  <div className="text-gray-600 text-sm group-hover:text-blue-700">
                    {option.description}
                  </div>
                </div>
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-blue-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Choose an option to continue
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectionQuiz