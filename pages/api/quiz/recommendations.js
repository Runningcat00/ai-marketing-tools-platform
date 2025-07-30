import toolsDatabase from '../../../data/tools-database.json'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { answers, category } = req.body
    
    if (!answers) {
      return res.status(400).json({ message: 'Answers are required' })
    }

    // Get tools to analyze (either all or from specific category)
    let tools = []
    if (category && toolsDatabase.categories[category]) {
      tools = toolsDatabase.categories[category].tools
        .map(toolId => toolsDatabase.tools[toolId])
        .filter(Boolean)
    } else {
      tools = Object.values(toolsDatabase.tools)
    }

    const recommendations = calculateRecommendations(answers, tools)
    
    return res.status(200).json({
      recommendations: recommendations,
      total_analyzed: tools.length
    })
    
  } catch (error) {
    console.error('Quiz API Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

function calculateRecommendations(userAnswers, tools) {
  const { business_size, monthly_budget, primary_focus, technical_level, main_goal } = userAnswers
  
  // Initialize scoring for all tools
  let scoring = {}
  tools.forEach(tool => {
    scoring[tool.id] = 0
  })
  
  // Score based on business size (0-3 points)
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
  
  // Score based on budget (0-4 points)
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
  
  // Score based on primary focus (0-4 points)
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
  
  // Score based on technical level (0-3 points)
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
  
  // Score based on main goal (0-3 points)
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
  
  // Add bonus points for highly rated tools (0-2 points)
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