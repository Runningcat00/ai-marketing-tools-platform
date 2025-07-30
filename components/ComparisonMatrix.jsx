import React, { useState, useMemo } from 'react'
import { trackToolEvent } from '../utils/analytics'

const ComparisonMatrix = ({ tools, category }) => {
  const [sortBy, setSortBy] = useState('price')
  const [filterBy, setFilterBy] = useState('all')
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const filteredAndSortedTools = useMemo(() => {
    let filtered = [...tools]

    // Apply filters
    switch (filterBy) {
      case 'free_trial':
        filtered = filtered.filter(tool => tool.pricing.free_trial)
        break
      case 'under_100':
        filtered = filtered.filter(tool => tool.pricing.starting_price < 100)
        break
      case 'enterprise':
        filtered = filtered.filter(tool => tool.features.company_size.includes('Enterprise'))
        break
      case 'free_tier':
        filtered = filtered.filter(tool => tool.pricing.free_tier)
        break
      default:
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricing.starting_price - b.pricing.starting_price
        case 'rating':
          return b.ratings.overall_score - a.ratings.overall_score
        case 'name':
          return a.name.localeCompare(b.name)
        case 'popularity':
          return b.ratings.total_reviews - a.ratings.total_reviews
        default:
          return 0
      }
    })

    // Track comparison view
    trackToolEvent('comparison_matrix_view', {
      tools_count: filtered.length,
      sort_by: sortBy,
      filter_by: filterBy,
      category: category
    })

    return filtered
  }, [tools, sortBy, filterBy, category])

  const handleAffiliateClick = (tool, location) => {
    trackToolEvent('affiliate_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: location,
      expected_commission: tool.affiliate.commission_amount,
      source: 'comparison_matrix'
    })
    
    window.open(tool.affiliate.link, '_blank')
  }

  return (
    <div className="comparison-matrix">
      {/* Controls */}
      <div className="matrix-controls bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="name">Name (A-Z)</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tools</option>
                <option value="free_trial">Free Trial Available</option>
                <option value="free_tier">Has Free Tier</option>
                <option value="under_100">Under $100/month</option>
                <option value="enterprise">Enterprise Ready</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedTools.length} of {tools.length} tools
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/4">
                  Tool
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Starting Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Key AI Features
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Best For
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Free Trial
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedTools.map((tool, index) => (
                <ToolRow 
                  key={tool.id} 
                  tool={tool} 
                  index={index}
                  onAffiliateClick={handleAffiliateClick}
                  showAllFeatures={showAllFeatures}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-xs">i</span>
          </div>
          <span>
            Prices shown are starting prices. Most tools offer multiple tiers. 
            Ratings based on {tools.reduce((sum, tool) => sum + tool.ratings.total_reviews, 0).toLocaleString()} verified reviews.
          </span>
        </div>
      </div>
    </div>
  )
}

const ToolRow = ({ tool, index, onAffiliateClick, showAllFeatures }) => {
  const [expanded, setExpanded] = useState(false)
  
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">☆</span>)
    }
    
    return stars
  }

  const getBadgeColor = (index) => {
    if (index === 0) return 'bg-green-100 text-green-800 border-green-200'
    if (index === 1) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (index === 2) return 'bg-purple-100 text-purple-800 border-purple-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getRankBadge = (index) => {
    if (index === 0) return '🏆 Best Choice'
    if (index === 1) return '🥈 Runner Up'
    if (index === 2) return '🥉 Great Option'
    return null
  }

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-yellow-50/30' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600">
            {tool.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{tool.name}</h4>
              {getRankBadge(index) && (
                <span className={`text-xs px-2 py-1 rounded-full border ${getBadgeColor(index)}`}>
                  {getRankBadge(index)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tool.description}
            </p>
            {tool.pricing.free_tier && (
              <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Free tier available
              </span>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-lg font-bold text-gray-900">
          {tool.pricing.starting_price === 0 ? 'Free' : `$${tool.pricing.starting_price}`}
          {tool.pricing.starting_price > 0 && (
            <span className="text-sm font-normal text-gray-600">/mo</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {tool.pricing.pricing_model}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex">
            {renderStars(tool.ratings.overall_score)}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {tool.ratings.overall_score}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {tool.ratings.total_reviews.toLocaleString()} reviews
        </div>
      </td>
      
      <td className="px-6 py-4">
        <ul className="space-y-1">
          {tool.features.ai_capabilities.slice(0, showAllFeatures ? undefined : 3).map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-700">
              <span className="text-green-500 mr-2 text-xs">✓</span>
              {feature}
            </li>
          ))}
          {!showAllFeatures && tool.features.ai_capabilities.length > 3 && (
            <li className="text-xs text-blue-600 cursor-pointer hover:underline">
              +{tool.features.ai_capabilities.length - 3} more features
            </li>
          )}
        </ul>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700 mb-2">
          {tool.features.target_audience}
        </div>
        <div className="flex flex-wrap gap-1">
          {tool.features.company_size.map(size => (
            <span key={size} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {size}
            </span>
          ))}
        </div>
      </td>
      
      <td className="px-6 py-4">
        {tool.pricing.free_trial ? (
          <div className="text-center">
            <div className="text-sm font-medium text-green-600">
              {tool.pricing.trial_length} days
            </div>
            <div className="text-xs text-gray-500">free trial</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-sm text-gray-400">No free trial</div>
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onAffiliateClick(tool, 'comparison_matrix')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Try {tool.name}
        </button>
        {tool.pricing.free_trial && (
          <div className="text-xs text-gray-500 mt-1">
            Start free trial
          </div>
        )}
      </td>
    </tr>
  )
}

export default ComparisonMatrix