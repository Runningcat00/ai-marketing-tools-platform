import React, { useState } from 'react'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import toolsDatabase from '../../data/tools-database.json'
import ComparisonMatrix from '../../components/ComparisonMatrix'
import SelectionQuiz from '../../components/SelectionQuiz'
import QuizResults from '../../components/QuizResults'
import ROICalculator from '../../components/ROICalculator'
import { trackToolEvent } from '../../utils/analytics'

export default function CategoryPage({ category, tools, marketStats }) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState(null)

  const handleQuizStart = () => {
    setShowQuiz(true)
    trackToolEvent('quiz_started', {
      category: category.id,
      tools_count: tools.length
    })
  }

  const handleQuizComplete = (recommendations, answers) => {
    setQuizResults(recommendations)
    setQuizAnswers(answers)
    setShowQuiz(false)
    
    trackToolEvent('quiz_completed', {
      category: category.id,
      recommendations: recommendations.map(r => r.id),
      answers: answers
    })
  }

  const handleQuizClose = () => {
    setShowQuiz(false)
    trackToolEvent('quiz_closed', {
      category: category.id
    })
  }

  const handleRetakeQuiz = () => {
    setQuizResults(null)
    setQuizAnswers(null)
    setShowQuiz(true)
    trackToolEvent('quiz_retaken', {
      category: category.id
    })
  }

  const handleAffiliateClick = (tool, location) => {
    trackToolEvent('affiliate_click', {
      tool_name: tool.name,
      tool_category: tool.category,
      click_location: location,
      expected_commission: tool.affiliate.commission_amount,
      source: 'category_page'
    })
    
    window.open(tool.affiliate.link, '_blank')
  }

  return (
    <div className="category-page min-h-screen bg-gray-50">
      {/* SEO Head */}
      <Head>
        <title>{category.seo.title}</title>
        <meta name="description" content={category.seo.description} />
        <meta name="keywords" content={category.seo.keywords.join(', ')} />
        <meta property="og:title" content={category.seo.title} />
        <meta property="og:description" content={category.seo.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={category.seo.title} />
        <meta name="twitter:description" content={category.seo.description} />
        
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": category.name,
              "description": category.description,
              "url": `https://thevibemarketer.com/tools/${category.slug}`,
              "mainEntity": {
                "@type": "ItemList",
                "name": category.name,
                "numberOfItems": tools.length,
                "itemListElement": tools.map((tool, index) => ({
                  "@type": "SoftwareApplication",
                  "position": index + 1,
                  "name": tool.name,
                  "description": tool.description,
                  "url": tool.website,
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Any",
                  "offers": {
                    "@type": "Offer",
                    "price": tool.pricing.starting_price,
                    "priceCurrency": "USD",
                    "priceSpecification": {
                      "@type": "UnitPriceSpecification",
                      "price": tool.pricing.starting_price,
                      "priceCurrency": "USD",
                      "billingDuration": "P1M"
                    }
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": tool.ratings.overall_score,
                    "reviewCount": tool.ratings.total_reviews,
                    "bestRating": 5,
                    "worstRating": 1
                  }
                }))
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block bg-blue-500 bg-opacity-30 text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
                Trusted by 30,000+ Marketing Professionals
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {category.name}
                <span className="block text-blue-200 text-3xl md:text-4xl font-normal mt-2">
                  Complete 2025 Guide & Comparison
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Compare the top {tools.length} AI-powered marketing automation platforms. 
                Expert analysis, real user reviews, and personalized recommendations to find your perfect tool.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleQuizStart}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
              >
                🎯 Find My Perfect Tool (2-min quiz)
              </button>
              <a 
                href="#comparison"
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                📊 Compare All Tools
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 text-blue-200 text-sm">
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>Based on {tools.reduce((sum, tool) => sum + tool.ratings.total_reviews, 0).toLocaleString()} reviews</span>
                </div>
                <div>✓ Updated July 2025</div>
                <div>✓ Free trials available</div>
                <div>✓ No spam, just value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="market-overview py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                The AI Marketing Revolution is Here
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The marketing automation industry is experiencing unprecedented growth. 
                Here's what the data tells us about the current market landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="stat-card text-center bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${marketStats.market_size}
                </div>
                <div className="text-blue-800 font-medium mb-1">Market Size by 2033</div>
                <div className="text-sm text-blue-600">Growing rapidly from $1.99B in 2024</div>
              </div>
              <div className="stat-card text-center bg-green-50 p-8 rounded-2xl border border-green-100">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {marketStats.growth_rate}
                </div>
                <div className="text-green-800 font-medium mb-1">Annual Growth Rate</div>
                <div className="text-sm text-green-600">Fastest growing marketing category</div>
              </div>
              <div className="stat-card text-center bg-purple-50 p-8 rounded-2xl border border-purple-100">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {marketStats.adoption_rate}
                </div>
                <div className="text-purple-800 font-medium mb-1">Current Adoption Rate</div>
                <div className="text-sm text-purple-600">Among marketing professionals</div>
              </div>
              <div className="stat-card text-center bg-orange-50 p-8 rounded-2xl border border-orange-100">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {marketStats.avg_roi}
                </div>
                <div className="text-orange-800 font-medium mb-1">Average ROI</div>
                <div className="text-sm text-orange-600">Return on AI marketing investment</div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Market Insights</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📈 What's Driving Growth</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>84% of marketers using AI to identify trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>75% report reduced time on manual tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>52% see improved performance with AI tools</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 What Marketers Want</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Time savings (60% content creation automation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Better personalization and targeting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Data-driven insights and optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Quiz Modal */}
      {showQuiz && (
        <div className="quiz-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect AI Marketing Tool</h2>
                <button 
                  onClick={handleQuizClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <SelectionQuiz 
                tools={tools}
                onComplete={handleQuizComplete} 
                onClose={handleQuizClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quiz Results */}
      {quizResults && (
        <section className="quiz-results-section py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <QuizResults 
              recommendations={quizResults}
              answers={quizAnswers}
              onClose={() => setQuizResults(null)}
              onRetakeQuiz={handleRetakeQuiz}
            />
          </div>
        </section>
      )}

      {/* Tool Comparison Matrix */}
      <section id="comparison" className="comparison-section py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Compare All {category.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Side-by-side comparison of features, pricing, and capabilities. 
                Sort and filter to find exactly what you need.
              </p>
            </div>
            <ComparisonMatrix tools={tools} category={category.id} />
          </div>
        </div>
      </section>

      {/* Detailed Tool Reviews */}
      <section className="reviews-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                In-Depth Tool Analysis
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed reviews from The Vibe Marketer team. Real insights from hands-on testing 
                and feedback from our community of 30,000+ marketing professionals.
              </p>
            </div>
            
            <div className="space-y-12">
              {tools.slice(0, 6).map((tool, index) => (
                <ToolReview 
                  key={tool.id} 
                  tool={tool} 
                  rank={index + 1}
                  onAffiliateClick={handleAffiliateClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="calculator-section py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your ROI
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See exactly how much time and money you could save with AI marketing automation. 
                Get personalized ROI calculations based on your business metrics.
              </p>
            </div>
            <ROICalculator tools={tools} onToolSelect={handleAffiliateClick} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Common questions about {category.name.toLowerCase()} and our recommendations.
              </p>
            </div>
            <FAQSection category={category} tools={tools} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who've already upgraded their marketing stack with AI-powered tools. 
              Start with a free trial and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleQuizStart}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Take the 2-Minute Quiz
              </button>
              <button
                onClick={() => handleAffiliateClick(tools[0], 'cta_section')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Try {tools[0].name} Free
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Tool Review Component
const ToolReview = ({ tool, rank, onAffiliateClick }) => {
  const [expanded, setExpanded] = useState(false)
  
  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: '🏆', text: 'Best Overall', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    if (rank === 2) return { emoji: '🥈', text: 'Runner Up', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    if (rank === 3) return { emoji: '🥉', text: 'Great Choice', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    return { emoji: '⭐', text: `#${rank}`, color: 'bg-blue-100 text-blue-800 border-blue-200' }
  }

  const badge = getRankBadge(rank)

  return (
    <div className="tool-review bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="flex items-start gap-6 mb-6 lg:mb-0">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-600 flex-shrink-0">
              {tool.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold text-gray-900">{tool.name}</h3>
                <span className={`text-sm px-3 py-1 rounded-full border font-medium ${badge.color}`}>
                  {badge.emoji} {badge.text}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">{tool.description}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{tool.ratings.overall_score}</span>
                  <span className="text-gray-500">({tool.ratings.total_reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">👥</span>
                  <span>{tool.features.target_audience}</span>
                </div>
                {tool.pricing.free_trial && (
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span>{tool.pricing.trial_length}-day free trial</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-right flex-shrink-0">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {tool.pricing.starting_price === 0 ? 'Free' : `$${tool.pricing.starting_price}`}
              {tool.pricing.starting_price > 0 && (
                <span className="text-xl font-normal text-gray-600">/mo</span>
              )}
            </div>
            
            <button
              onClick={() => onAffiliateClick(tool, 'detailed_review')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors transform hover:scale-105 shadow-lg mb-3"
            >
              {tool.pricing.free_trial ? `Try ${tool.pricing.trial_length} Days Free` : `Get ${tool.name}`}
            </button>
            
            {tool.pricing.free_tier && (
              <div className="text-sm text-green-600 font-medium">
                Free tier available
              </div>
            )}
          </div>
        </div>

        {/* The Vibe Marketer Take */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            The Vibe Marketer Take:
          </h4>
          <p className="text-blue-800 leading-relaxed italic">"{tool.expert_opinion}"</p>
        </div>

        {/* Features & Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🤖 AI Capabilities</h4>
            <ul className="space-y-2">
              {tool.features.ai_capabilities.slice(0, expanded ? undefined : 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                  <span>{feature}</span>
                </li>
              ))}
              {!expanded && tool.features.ai_capabilities.length > 4 && (
                <button 
                  onClick={() => setExpanded(true)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  +{tool.features.ai_capabilities.length - 4} more features
                </button>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🎯 Best For</h4>
            <div className="space-y-2">
              {tool.best_for.map((use, idx) => (
                <div key={idx} className="text-sm bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
                  {use}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">🔗 Integrations</h4>
            <div className="flex flex-wrap gap-2">
              {tool.features.integrations.slice(0, 6).map((integration, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {integration}
                </span>
              ))}
              {tool.features.integrations.length > 6 && (
                <span className="text-xs text-gray-500">
                  +{tool.features.integrations.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">
              <span>✅</span> Pros
            </h4>
            <ul className="space-y-2">
              {tool.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-1 flex-shrink-0">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
              <span>❌</span> Cons
            </h4>
            <ul className="space-y-2">
              {tool.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-500 mt-1 flex-shrink-0">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// FAQ Component
const FAQSection = ({ category, tools }) => {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      question: `What are ${category.name.toLowerCase()}?`,
      answer: `${category.name} are software platforms that use artificial intelligence to automate and optimize marketing tasks. They can help with email marketing, content creation, lead scoring, personalization, and campaign optimization, saving time while improving results.`
    },
    {
      question: "How do I choose the right tool for my business?",
      answer: "Consider your business size, budget, primary marketing focus, and technical expertise. Our quiz can help match you with the best options, or you can use our comparison matrix to evaluate features side-by-side."
    },
    {
      question: "Do these tools really provide ROI?",
      answer: `Yes! Our research shows AI marketing tools deliver an average ${category.market_stats.avg_roi} return on investment. Most businesses see time savings of 25-60% on marketing tasks, plus improved conversion rates and revenue growth.`
    },
    {
      question: "Can I try before I buy?",
      answer: `Most tools offer free trials ranging from 7-30 days. ${tools.filter(t => t.pricing.free_trial).length} of the ${tools.length} tools we recommend have free trials, and ${tools.filter(t => t.pricing.free_tier).length} offer free tiers for getting started.`
    },
    {
      question: "What if I'm not technical?",
      answer: "Many modern AI marketing tools are designed for non-technical users. Tools like HubSpot, Mailchimp, and ConvertKit are particularly beginner-friendly. Our recommendations include ease-of-use ratings to help you choose."
    },
    {
      question: "How accurate are your recommendations?",
      answer: "Our recommendations are based on hands-on testing, real user reviews, and feedback from our community of 30,000+ marketing professionals. We update our analysis regularly and only recommend tools we'd use ourselves."
    }
  ]

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
              <span className="text-gray-400 flex-shrink-0">
                {openFaq === index ? '−' : '+'}
              </span>
            </div>
          </button>
          {openFaq === index && (
            <div className="px-6 pb-6">
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const getStaticPaths = async () => {
  const categories = Object.keys(toolsDatabase.categories)
  const paths = categories.map(category => ({
    params: { category }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const { category: categoryId } = params
  const category = toolsDatabase.categories[categoryId]
  
  if (!category) {
    return {
      notFound: true
    }
  }

  const tools = category.tools.map(toolId => toolsDatabase.tools[toolId]).filter(Boolean)
  const marketStats = category.market_stats

  return {
    props: {
      category,
      tools,
      marketStats
    },
    revalidate: 86400 // Revalidate daily
  }
}