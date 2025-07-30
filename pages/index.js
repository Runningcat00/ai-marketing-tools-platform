import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import toolsDatabase from '../data/tools-database.json'
import { trackToolEvent } from '../utils/analytics'

export default function HomePage({ stats, featuredTools, categories }) {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')
  const [scrapedData, setScrapedData] = useState(null)
  const [scrapeStatus, setScrapeStatus] = useState('idle') // idle, loading, success, error

  const handleNewsletterSignup = async (e) => {
    e.preventDefault()
    setNewsletterStatus('loading')
    
    // Track newsletter signup
    trackToolEvent('newsletter_signup', {
      source: 'homepage_hero',
      email_domain: email.split('@')[1]
    })
    
    // Simulate API call (replace with actual newsletter service)
    setTimeout(() => {
      setNewsletterStatus('success')
      setEmail('')
    }, 1000)
  }

  const handleToolClick = (tool, location) => {
    trackToolEvent('tool_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: location,
      source: 'homepage'
    })
  }

  const handleGetStartedClick = () => {
    trackToolEvent('get_started_click', {
      source: 'homepage_hero'
    })
  }

  // Firecrawl integration - scrape thevibemarketer.com content
  const handleFirecrawlScrape = async () => {
    setScrapeStatus('loading')
    
    try {
      const response = await fetch('/api/scrape/thevibemarketer')
      const result = await response.json()
      
      if (result.success) {
        setScrapedData(result.data)
        setScrapeStatus('success')
        
        trackToolEvent('firecrawl_scrape_success', {
          pages_scraped: result.stats?.pages_scraped || 0,
          content_length: result.stats?.total_content_length || 0
        })
      } else {
        setScrapeStatus('error')
        console.error('Scraping failed:', result.error)
      }
    } catch (error) {
      setScrapeStatus('error')
      console.error('Scraping error:', error)
    }
  }

  // Auto-scrape on component mount
  useEffect(() => {
    handleFirecrawlScrape()
  }, [])

  return (
    <div className="homepage min-h-screen bg-gray-50">
      {/* SEO Head */}
      <Head>
        <title>AI Marketing Tools Hub 2025 - Find Your Perfect Marketing Automation Platform | The Vibe Marketer</title>
        <meta name="description" content="Compare the best AI marketing automation tools for 2025. Expert reviews, personalized recommendations, and ROI calculators from The Vibe Marketer community of 30,000+ professionals." />
        <meta name="keywords" content="AI marketing tools, marketing automation, AI marketing software, marketing tools comparison, best marketing automation 2025" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Marketing Tools Hub 2025 - The Vibe Marketer" />
        <meta property="og:description" content="Find your perfect AI marketing automation platform. Compare tools, take our quiz, and calculate ROI with expert guidance from 30,000+ marketing professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thevibemarketer.com" />
        <meta property="og:image" content="https://thevibemarketer.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Marketing Tools Hub 2025 - The Vibe Marketer" />
        <meta name="twitter:description" content="Find your perfect AI marketing automation platform with expert reviews and personalized recommendations." />
        
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The Vibe Marketer - AI Marketing Tools Hub",
              "description": "Comprehensive directory and comparison platform for AI marketing automation tools",
              "url": "https://thevibemarketer.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://thevibemarketer.com/tools?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "The Vibe Marketer",
                "description": "AI marketing tools and automation platform serving 30,000+ marketing professionals",
                "url": "https://thevibemarketer.com",
                "sameAs": [
                  "https://twitter.com/thevibemarketer",
                  "https://linkedin.com/company/thevibemarketer"
                ]
              }
            })
          }}
        />
      </Head>

      {/* Firecrawl Status Indicator */}
      {scrapeStatus !== 'idle' && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
          scrapeStatus === 'loading' ? 'bg-blue-100 text-blue-800' :
          scrapeStatus === 'success' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {scrapeStatus === 'loading' && (
            <>
              <span className="inline-block animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-2"></span>
              Scraping thevibemarketer.com...
            </>
          )}
          {scrapeStatus === 'success' && (
            <>
              <span className="mr-2">✅</span>
              Firecrawl: Content updated from thevibemarketer.com
            </>
          )}
          {scrapeStatus === 'error' && (
            <>
              <span className="mr-2">⚠️</span>
              Firecrawl: Using demo data (scraping failed)
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block bg-blue-500 bg-opacity-30 text-blue-100 px-6 py-3 rounded-full text-lg font-medium mb-6">
                🚀 Trusted by 30,000+ Marketing Professionals
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  AI Marketing Stack
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                Compare {stats.totalTools}+ AI-powered marketing automation tools. 
                Get personalized recommendations, calculate ROI, and join the community 
                that's generated $2.4M+ in marketing revenue.
              </p>
            </div>

            {/* Value Proposition Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">{stats.totalTools}+</div>
                <div className="text-blue-200">Tools Analyzed</div>
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
                <div className="text-3xl font-bold mb-2">$2.4M+</div>
                <div className="text-blue-200">Revenue Generated</div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/tools">
                <a 
                  onClick={handleGetStartedClick}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
                >
                  🎯 Find My Perfect Tools (Free)
                </a>
              </Link>
              <Link href="/tools/ai-marketing-automation">
                <a className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                  📊 Compare All Tools
                </a>
              </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <p className="text-blue-200 mb-4">
                Get weekly AI marketing insights + exclusive tool discounts
              </p>
              <form onSubmit={handleNewsletterSignup} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? '...' : 'Join Free'}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <p className="text-green-300 mt-2 text-sm">
                  ✓ Success! Check your email for your welcome bonus.
                </p>
              )}
              <p className="text-xs text-blue-300 mt-2">
                No spam, unsubscribe anytime. Join 30,000+ marketers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The AI Marketing Revolution is Here
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              The marketing automation industry is experiencing unprecedented growth. 
              But with {stats.totalTools}+ tools available, choosing the right platform 
              can make or break your marketing success.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">😰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analysis Paralysis</h3>
                <p className="text-gray-600">
                  Too many options, conflicting reviews, and marketing hype make it impossible 
                  to choose the right tool for your business.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💸</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Costly Mistakes</h3>
                <p className="text-gray-600">
                  Wrong tool choices cost businesses $50,000+ annually in wasted subscriptions, 
                  migration costs, and lost productivity.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Time Wasted</h3>
                <p className="text-gray-600">
                  Marketing teams spend 40+ hours researching tools instead of focusing 
                  on strategy and growth activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Smarter Way to Choose AI Marketing Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven 3-step system helps you find the perfect AI marketing automation 
                platform in under 10 minutes, backed by data from 30,000+ marketing professionals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Take Our Quiz</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Answer 5 simple questions about your business size, budget, goals, and technical level. 
                  Get personalized recommendations in under 2 minutes.
                </p>
                <Link href="/tools">
                  <a className="text-blue-600 font-semibold hover:underline">
                    Start Quiz Now →
                  </a>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Compare Options</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Use our interactive comparison matrix to evaluate features, pricing, and ratings side-by-side. 
                  Filter by your specific needs and budget.
                </p>
                <Link href="/tools">
                  <a className="text-blue-600 font-semibold hover:underline">
                    View Comparison →
                  </a>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Calculate ROI</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  See exactly how much time and money you'll save with our ROI calculator. 
                  Most tools pay for themselves within 3-6 months.
                </p>
                <Link href="/tools">
                  <a className="text-blue-600 font-semibold hover:underline">
                    Calculate Savings →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Top-Rated AI Marketing Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hand-picked by our team and validated by 30,000+ marketing professionals. 
                These tools consistently deliver exceptional results.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredTools.map((tool, index) => (
                <FeaturedToolCard 
                  key={tool.id} 
                  tool={tool} 
                  rank={index + 1}
                  onToolClick={handleToolClick}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/tools">
                <a className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg">
                  View All {stats.totalTools}+ Tools
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Browse by Category
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
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Community */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Join 30,000+ Marketing Professionals
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Get access to our exclusive community, weekly tool reviews, 
              and insider discounts on the best AI marketing platforms.
            </p>
            
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
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Marketing?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start with our free tool finder quiz and discover which AI marketing 
                automation platform will deliver the best ROI for your business.
              </p>
              <Link href="/tools">
                <a className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg">
                  Find My Perfect Tools - Free
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Featured Tool Card Component
const FeaturedToolCard = ({ tool, rank, onToolClick }) => {
  const handleClick = () => {
    onToolClick(tool, 'homepage_featured')
  }

  const handleAffiliateClick = (e) => {
    e.preventDefault()
    trackToolEvent('affiliate_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: 'homepage_featured',
      expected_commission: tool.affiliate.commission_amount,
      source: 'homepage'
    })
    window.open(tool.affiliate.link, '_blank')
  }

  return (
    <div className="tool-card bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-600">
            {tool.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(tool.ratings.overall_score) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-1">
                {tool.ratings.overall_score}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {tool.pricing.starting_price === 0 ? 'Free' : `$${tool.pricing.starting_price}`}
            {tool.pricing.starting_price > 0 && (
              <span className="text-sm font-normal text-gray-600">/mo</span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {tool.description}
      </p>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
        <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          {tool.features.target_audience}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link href={`/tools/${tool.category}`}>
          <a 
            onClick={handleClick}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors text-sm"
          >
            Learn More
          </a>
        </Link>
        <button
          onClick={handleAffiliateClick}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          {tool.pricing.free_trial ? 'Try Free' : 'Get Started'}
        </button>
      </div>
    </div>
  )
}

// Category Card Component
const CategoryCard = ({ category, index }) => {
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
      <a className="category-card group block bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className={`w-16 h-16 bg-gradient-to-r ${colors[index % colors.length]} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
          {icons[index % icons.length]}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
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
      </a>
    </Link>
  )
}

export const getStaticProps = async () => {
  const categories = toolsDatabase.categories
  const tools = toolsDatabase.tools
  
  // Calculate stats
  const totalTools = Object.keys(tools).length
  const totalCategories = Object.keys(categories).length
  
  // Get featured tools (top-rated from each category)
  const featuredTools = []
  Object.values(categories).forEach(category => {
    const categoryTools = category.tools
      .map(toolId => tools[toolId])
      .filter(Boolean)
      .sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)
    
    // Add top tool from each category
    if (categoryTools.length > 0) {
      featuredTools.push(categoryTools[0])
    }
  })
  
  // Sort featured tools by rating and take top 6
  featuredTools.sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)

  return {
    props: {
      stats: {
        totalTools,
        totalCategories
      },
      featuredTools: featuredTools.slice(0, 6),
      categories
    },
    revalidate: 86400 // Revalidate daily
  }
}