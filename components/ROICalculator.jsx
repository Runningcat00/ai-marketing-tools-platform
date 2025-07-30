import React, { useState, useEffect } from 'react'
import { trackToolEvent } from '../utils/analytics'

const ROICalculator = ({ tools, onToolSelect }) => {
  const [inputs, setInputs] = useState({
    current_monthly_spend: 500,
    hours_per_week: 10,
    hourly_rate: 50,
    monthly_revenue: 10000,
    conversion_rate: 2.5,
    email_list_size: 1000,
    monthly_website_visitors: 5000
  })
  
  const [selectedTool, setSelectedTool] = useState(tools[0]?.id || '')
  const [calculations, setCalculations] = useState({})
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    calculateROI()
  }, [inputs, selectedTool])

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }))
    
    // Track calculator usage
    trackToolEvent('roi_calculator_input', {
      field: field,
      value: numValue,
      selected_tool: selectedTool
    })
  }

  const calculateROI = () => {
    const tool = tools.find(t => t.id === selectedTool)
    if (!tool) return

    const {
      current_monthly_spend,
      hours_per_week,
      hourly_rate,
      monthly_revenue,
      conversion_rate,
      email_list_size,
      monthly_website_visitors
    } = inputs

    // Calculate current costs
    const monthly_time_cost = (hours_per_week * 4.33 * hourly_rate) // 4.33 weeks per month
    const total_current_cost = current_monthly_spend + monthly_time_cost

    // Calculate tool cost
    const tool_monthly_cost = tool.pricing.starting_price

    // Calculate expected improvements based on tool capabilities
    const improvements = calculateImprovements(tool, inputs)
    
    // Calculate savings and gains
    const time_savings_hours = hours_per_week * (improvements.time_saved_percentage / 100)
    const monthly_time_savings = time_savings_hours * 4.33 * hourly_rate
    
    const revenue_increase = monthly_revenue * (improvements.revenue_increase_percentage / 100)
    const conversion_improvement = monthly_website_visitors * ((conversion_rate * improvements.conversion_improvement_percentage / 100) / 100) * (monthly_revenue / (monthly_website_visitors * conversion_rate / 100))
    
    const total_monthly_gains = monthly_time_savings + revenue_increase + conversion_improvement
    const net_monthly_benefit = total_monthly_gains - (tool_monthly_cost - current_monthly_spend)
    const annual_roi = ((net_monthly_benefit * 12) / (tool_monthly_cost * 12)) * 100

    setCalculations({
      tool_monthly_cost,
      total_current_cost,
      monthly_time_savings,
      revenue_increase,
      conversion_improvement,
      total_monthly_gains,
      net_monthly_benefit,
      annual_roi,
      payback_period: tool_monthly_cost > 0 ? tool_monthly_cost / Math.max(net_monthly_benefit, 1) : 0,
      improvements
    })
  }

  const calculateImprovements = (tool, inputs) => {
    let improvements = {
      time_saved_percentage: 0,
      revenue_increase_percentage: 0,
      conversion_improvement_percentage: 0
    }

    // Base improvements on tool capabilities
    const capabilities = tool.features.ai_capabilities.join(' ').toLowerCase()
    
    // Time savings based on automation features
    if (capabilities.includes('automation') || capabilities.includes('automated')) {
      improvements.time_saved_percentage += 25
    }
    if (capabilities.includes('ai content') || capabilities.includes('content creation')) {
      improvements.time_saved_percentage += 35
    }
    if (capabilities.includes('workflow')) {
      improvements.time_saved_percentage += 20
    }
    
    // Revenue improvements based on marketing features
    if (capabilities.includes('personalization') || capabilities.includes('targeting')) {
      improvements.revenue_increase_percentage += 15
      improvements.conversion_improvement_percentage += 25
    }
    if (capabilities.includes('lead scoring') || capabilities.includes('predictive')) {
      improvements.revenue_increase_percentage += 20
      improvements.conversion_improvement_percentage += 30
    }
    if (capabilities.includes('email') && inputs.email_list_size > 500) {
      improvements.revenue_increase_percentage += 12
    }
    
    // Cap improvements at realistic levels
    improvements.time_saved_percentage = Math.min(improvements.time_saved_percentage, 60)
    improvements.revenue_increase_percentage = Math.min(improvements.revenue_increase_percentage, 35)
    improvements.conversion_improvement_percentage = Math.min(improvements.conversion_improvement_percentage, 45)
    
    return improvements
  }

  const handleToolChange = (toolId) => {
    setSelectedTool(toolId)
    trackToolEvent('roi_calculator_tool_change', {
      previous_tool: selectedTool,
      new_tool: toolId
    })
  }

  const handleGetStarted = () => {
    const tool = tools.find(t => t.id === selectedTool)
    if (tool) {
      trackToolEvent('affiliate_click', {
        tool_name: tool.name,
        tool_category: tool.category,
        click_location: 'roi_calculator',
        expected_commission: tool.affiliate.commission_amount,
        source: 'roi_calculator',
        calculated_roi: calculations.annual_roi
      })
      
      if (onToolSelect) {
        onToolSelect(tool)
      } else {
        window.open(tool.affiliate.link, '_blank')
      }
    }
  }

  const selectedToolData = tools.find(t => t.id === selectedTool)

  return (
    <div className="roi-calculator bg-white rounded-2xl shadow-lg border p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ROI Calculator
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Calculate your potential return on investment with AI marketing automation tools.
          See exactly how much time and money you could save.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Tell us about your business
          </h3>
          
          {/* Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a tool to analyze
            </label>
            <select
              value={selectedTool}
              onChange={(e) => handleToolChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tools.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.name} - ${tool.pricing.starting_price}/mo
                </option>
              ))}
            </select>
          </div>

          {/* Current Spending */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current monthly marketing tool spend
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.current_monthly_spend}
                onChange={(e) => handleInputChange('current_monthly_spend', e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500"
              />
            </div>
          </div>

          {/* Time Spent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours per week on marketing tasks
            </label>
            <input
              type="number"
              value={inputs.hours_per_week}
              onChange={(e) => handleInputChange('hours_per_week', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your hourly rate (or team average)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
              />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly revenue
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={inputs.monthly_revenue}
                onChange={(e) => handleInputChange('monthly_revenue', e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10000"
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.conversion_rate}
                onChange={(e) => handleInputChange('conversion_rate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email list size
              </label>
              <input
                type="number"
                value={inputs.email_list_size}
                onChange={(e) => handleInputChange('email_list_size', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly website visitors
            </label>
            <input
              type="number"
              value={inputs.monthly_website_visitors}
              onChange={(e) => handleInputChange('monthly_website_visitors', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="5000"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your ROI Analysis
          </h3>

          {selectedToolData && calculations.net_monthly_benefit && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {calculations.annual_roi > 0 ? '+' : ''}{Math.round(calculations.annual_roi)}%
                  </div>
                  <div className="text-sm text-green-800">Annual ROI</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    ${Math.round(calculations.net_monthly_benefit).toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-800">Monthly net benefit</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Monthly Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tool cost ({selectedToolData.name})</span>
                    <span className="font-medium text-red-600">
                      -${calculations.tool_monthly_cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time savings</span>
                    <span className="font-medium text-green-600">
                      +${Math.round(calculations.monthly_time_savings).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue increase</span>
                    <span className="font-medium text-green-600">
                      +${Math.round(calculations.revenue_increase).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion improvements</span>
                    <span className="font-medium text-green-600">
                      +${Math.round(calculations.conversion_improvement).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center font-semibold">
                    <span className="text-gray-900">Net monthly benefit</span>
                    <span className={calculations.net_monthly_benefit > 0 ? 'text-green-600' : 'text-red-600'}>
                      {calculations.net_monthly_benefit > 0 ? '+' : ''}${Math.round(calculations.net_monthly_benefit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expected Improvements */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Expected Improvements</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Time saved per week</span>
                    <span className="font-medium text-blue-900">
                      {calculations.improvements.time_saved_percentage}% 
                      ({Math.round(inputs.hours_per_week * calculations.improvements.time_saved_percentage / 100)} hours)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Revenue increase</span>
                    <span className="font-medium text-blue-900">
                      {calculations.improvements.revenue_increase_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Conversion improvement</span>
                    <span className="font-medium text-blue-900">
                      {calculations.improvements.conversion_improvement_percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Payback Period */}
              {calculations.payback_period > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-sm text-yellow-800">
                    <strong>Payback Period:</strong> {Math.round(calculations.payback_period)} months
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="text-center pt-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {selectedToolData.pricing.free_trial 
                    ? `Start ${selectedToolData.pricing.trial_length}-Day Free Trial` 
                    : `Get Started with ${selectedToolData.name}`
                  }
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  {calculations.annual_roi > 100 
                    ? `Potential to more than double your investment!` 
                    : `Estimated ${Math.round(calculations.annual_roi)}% return on investment`
                  }
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p>
          * Calculations are estimates based on typical improvements seen with AI marketing automation tools. 
          Actual results may vary depending on implementation, industry, and business model. 
          ROI projections are for planning purposes only.
        </p>
      </div>
    </div>
  )
}

export default ROICalculator