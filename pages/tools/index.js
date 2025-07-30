import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import toolsDatabase from '../../data/tools-database.json'
import { trackToolEvent } from '../../utils/analytics'

export default function ToolsHubPage({ categories, featuredTools, totalTools }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    trackToolEvent('category_filter', {
      category: categoryId,
      total_categories: Object.keys(categories).length
    })
  }

  const handleToolClick = (tool) => {
    trackToolEvent('tool_card_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      source: 'tools_hub'
    })
  }

  const filteredTools = selectedCategory === 'all' 
    ? featuredTools 
    : featuredTools.filter(tool => tool.category === selectedCategory)

  return (
    <div className="tools-hub-page min-h-screen bg-gray-50">
      {/* SEO Head */}
      <Head>
        <title>AI Marketing Tools Hub 2025 - Compare Top Marketing Automation Platforms | The Vibe Marketer</title>
        <meta name="description" content="Discover the best AI marketing tools for 2025. Compare features, pricing, and reviews of top marketing automation platforms. Used by 30,000+ professionals." />
        <meta name="keywords" content="AI marketing tools, marketing automation, marketing software, AI tools comparison, marketing platforms" />
        <meta property="og:title" content="AI Marketing Tools Hub 2025 - The Vibe Marketer" />
        <meta property="og:description" content="Compare top AI marketing tools and automation platforms. Expert reviews and recommendations from 30,000+ marketing professionals." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "AI Marketing Tools Hub",
              "description": "Comprehensive directory of AI marketing tools and automation platforms",
              "url": "https://thevibemarketer.com/tools",
              "mainEntity": {
                "@type": "ItemList",
                "name": "AI Marketing Tools",
                "numberOfItems": totalTools,
                "itemListElement": Object.values(categories).map((category, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "name": category.name,
                  "description": category.description,
                  "url": `https://thevibemarketer.com/tools/${category.slug}`
                }))
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block bg-blue-500 bg-opacity-30 text-blue-100 px-6 py-3 rounded-full text-lg font-medium mb-6">
                🚀 The Ultimate AI Marketing Tools Directory
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  AI Marketing Stack
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                Compare {totalTools}+ AI-powered marketing tools across {Object.keys(categories).length} categories. 
                Expert reviews, real pricing, and personalized recommendations from The Vibe Marketer community.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">{totalTools}+</div>
                <div className="text-blue-200">Tools Reviewed</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">30K+</div>
                <div className="text-blue-200">Community Members</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">3.5X</div>
                <div className="text-blue-200">Average ROI</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">2025</div>
                <div className="text-blue-200">Updated Daily</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#categories">
                <a className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
                  🎯 Browse Categories
                </a>
              </Link>
              <Link href="#featured">
                <a className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                  ⭐ See Top Picks
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Explore Tool Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect tools for your specific marketing needs. Each category includes 
                expert analysis, pricing comparisons, and personalized recommendations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.values(categories).map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section id="featured" className="featured-tools-section py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Top-Rated AI Marketing Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Hand-picked by our team and validated by 30,000+ marketing professionals. 
                These tools consistently deliver exceptional results.
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  All Tools ({featuredTools.length})
                </button>
                {Object.values(categories).map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category.name.replace(' Tools', '')} ({category.tools.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  rank={index + 1}
                  onToolClick={handleToolClick}
                />
              ))}
            </div>

            {/* View All CTA */}
            {selectedCategory !== 'all' && (
              <div className="text-center mt-12">
                <Link href={`/tools/${selectedCategory}`}>
                  <a className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg">
                    View All {categories[selectedCategory]?.name} →
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How We Help You Choose
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our systematic approach ensures you find the perfect AI marketing tools for your business needs and budget.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Take Our Quiz</h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer 5 simple questions about your business size, budget, goals, and technical level. 
                  Get personalized recommendations in under 2 minutes.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Compare Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use our interactive comparison matrix to evaluate features, pricing, and ratings side-by-side. 
                  Filter by your specific needs and budget.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Start Free Trial</h3>
                <p className="text-gray-600 leading-relaxed">
                  Most tools offer 7-30 day free trials. Test your top choices risk-free and see which one 
                  delivers the best results for your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof-section py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">
              Trusted by Marketing Professionals Worldwide
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-5xl font-bold mb-2">30,000+</div>
                <div className="text-blue-200">Community Members</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.8/5</div>
                <div className="text-blue-200">Average Tool Rating</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$2.4M+</div>
                <div className="text-blue-200">Revenue Generated</div>
              </div>
            </div>
            
            {/* Newsletter CTA */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Get Weekly AI Marketing Insights
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join The Vibe Marketer newsletter for the latest AI tool reviews, 
                marketing strategies, and exclusive discounts from our partners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                  Subscribe
                </button>
              </div>
              <div className="text-sm text-blue-200 mt-3">
                ✓ No spam, unsubscribe anytime ✓ 30,000+ subscribers
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Category Card Component
const CategoryCard = ({ category, index, onClick }) => {
  const icons = ['🤖', '📧', '📱', '📊', '🎯', '⚡']
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ]

  return (
    <Link href={`/tools/${category.slug}`}>
      <a className="category-card group block bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className={`w-16 h-16 bg-gradient-to-r ${colors[index % colors.length]} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
          {icons[index % icons.length]}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {category.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-600 font-medium">
            {category.tools.length} tools available
          </span>
          <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
            Explore →
          </span>
        </div>

        {/* Market stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Market: ${category.market_stats.market_size} by 2033</div>
            <div>Growth: {category.market_stats.growth_rate} annually</div>
          </div>
        </div>
      </a>
    </Link>
  )
}

// Tool Card Component  
const ToolCard = ({ tool, rank, onToolClick }) => {
  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: '🏆', text: 'Best Choice', color: 'bg-yellow-100 text-yellow-800' }
    if (rank === 2) return { emoji: '🥈', text: 'Top Pick', color: 'bg-gray-100 text-gray-800' }
    if (rank === 3) return { emoji: '🥉', text: 'Great Option', color: 'bg-orange-100 text-orange-800' }
    return { emoji: '⭐', text: 'Recommended', color: 'bg-blue-100 text-blue-800' }
  }

  const badge = getRankBadge(rank)

  const handleClick = () => {
    onToolClick(tool)
  }

  const handleAffiliateClick = (e) => {
    e.preventDefault()
    trackToolEvent('affiliate_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: 'tools_hub',
      expected_commission: tool.affiliate.commission_amount,
      source: 'tools_hub'
    })
    window.open(tool.affiliate.link, '_blank')
  }

  return (
    <div className="tool-card bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-600">
              {tool.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                  {badge.emoji} {badge.text}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(tool.ratings.overall_score) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {tool.ratings.overall_score} ({tool.ratings.total_reviews.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {tool.pricing.starting_price === 0 ? 'Free' : `$${tool.pricing.starting_price}`}
              {tool.pricing.starting_price > 0 && (
                <span className="text-sm font-normal text-gray-600">/mo</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {tool.description}
        </p>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Key AI Features:</h4>
          <ul className="space-y-1">
            {tool.features.ai_capabilities.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-700">
                <span className="text-blue-500 mr-2">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Best For */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Best For:</h4>
          <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            {tool.features.target_audience}
          </div>
        </div>

        {/* Trial Info */}
        {tool.pricing.free_trial && (
          <div className="mb-6 bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-sm text-green-800 font-medium">
              ✓ {tool.pricing.trial_length}-day free trial available
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link href={`/tools/${tool.category}`}>
            <a 
              onClick={handleClick}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
            >
              View Details
            </a>
          </Link>
          <button
            onClick={handleAffiliateClick}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {tool.pricing.free_trial ? 'Try Free' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps = async () => {
  const categories = toolsDatabase.categories
  const tools = toolsDatabase.tools
  
  // Get featured tools (top-rated from each category)
  const featuredTools = []
  Object.values(categories).forEach(category => {
    const categoryTools = category.tools
      .map(toolId => tools[toolId])
      .filter(Boolean)
      .sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)
    
    // Add top 2 tools from each category
    featuredTools.push(...categoryTools.slice(0, 2))
  })

  // Sort featured tools by rating
  featuredTools.sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)

  const totalTools = Object.keys(tools).length

  return {
    props: {
      categories,
      featuredTools: featuredTools.slice(0, 12), // Show top 12
      totalTools
    },
    revalidate: 86400 // Revalidate daily
  }
}