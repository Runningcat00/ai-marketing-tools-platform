import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function ResourcesHub() {
  const resources = [
    {
      id: 'comparison-checklist',
      title: 'AI Marketing Tools Comparison Checklist',
      description: '25-point evaluation framework used by 30,000+ marketers to compare and select the perfect AI marketing automation platform.',
      type: 'Checklist',
      format: 'PDF',
      pages: '8 pages',
      icon: '📋',
      downloadLink: '/downloads/ai-marketing-tools-comparison-checklist.pdf',
      featured: true
    },
    {
      id: 'roi-calculator',
      title: 'Marketing Automation ROI Calculator',
      description: 'Interactive calculator to determine potential time savings, cost reductions, and revenue increases from AI marketing tools.',
      type: 'Calculator',
      format: 'Interactive',
      pages: 'Web App',
      icon: '📊',
      link: '/tools#roi-calculator',
      featured: true
    },
    {
      id: 'implementation-guide',
      title: 'Implementation Timeline Template',
      description: 'Step-by-step 90-day implementation plan for rolling out AI marketing automation in your business.',
      type: 'Template',
      format: 'Google Sheets',
      pages: '5 sheets',
      icon: '📅',
      downloadLink: '/downloads/implementation-timeline-template.xlsx'
    },
    {
      id: 'budget-planner',
      title: 'Marketing Tool Budget Planner',
      description: 'Plan and track your marketing tool expenses with this comprehensive budget spreadsheet.',
      type: 'Planner',
      format: 'Excel',
      pages: '3 sheets',
      icon: '💰',
      downloadLink: '/downloads/marketing-budget-planner.xlsx'
    },
    {
      id: 'onboarding-checklist',
      title: 'Team Onboarding Checklist',
      description: 'Ensure smooth team adoption of new AI marketing tools with this comprehensive onboarding guide.',
      type: 'Checklist',
      format: 'PDF',
      pages: '6 pages',
      icon: '👥',
      downloadLink: '/downloads/team-onboarding-checklist.pdf'
    },
    {
      id: 'metrics-dashboard',
      title: 'Marketing Metrics Dashboard',
      description: 'Track the performance of your AI marketing automation with key metrics and KPIs.',
      type: 'Dashboard',
      format: 'Google Sheets',
      pages: '4 sheets',
      icon: '📈',
      downloadLink: '/downloads/marketing-metrics-dashboard.xlsx'
    }
  ]

  const guides = [
    {
      title: 'Getting Started with AI Marketing Automation',
      description: 'Complete beginner\'s guide to implementing AI in your marketing strategy.',
      readTime: '12 min read',
      link: '/guides/getting-started-ai-marketing'
    },
    {
      title: 'Email Marketing Automation Best Practices',
      description: 'Advanced strategies for email automation that drive engagement and conversions.',
      readTime: '8 min read',
      link: '/guides/email-automation-best-practices'  
    },
    {
      title: 'Social Media Automation Do\'s and Don\'ts',
      description: 'How to automate social media without losing authenticity and engagement.',
      readTime: '6 min read',
      link: '/guides/social-media-automation'
    },
    {
      title: 'Content Creation with AI Tools',
      description: 'Leverage AI to scale your content creation while maintaining quality and brand voice.',
      readTime: '10 min read',
      link: '/guides/ai-content-creation'
    }
  ]

  return (
    <div className="resources-hub min-h-screen bg-gray-50">
      <Head>
        <title>Free Marketing Automation Resources & Tools | The Vibe Marketer</title>
        <meta name="description" content="Free templates, checklists, calculators and guides for AI marketing automation. Used by 30,000+ marketing professionals to select and implement the perfect tools." />
        <meta name="keywords" content="marketing automation resources, AI marketing templates, ROI calculator, marketing tools checklist, implementation guide" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Marketing Automation Resources Hub",
              "description": "Free resources for AI marketing automation and tool selection",
              "url": "https://thevibemarketer.com/resources",
              "mainEntity": {
                "@type": "ItemList",
                "name": "Marketing Resources",
                "numberOfItems": resources.length,
                "itemListElement": resources.map((resource, index) => ({
                  "@type": "CreativeWork",
                  "position": index + 1,
                  "name": resource.title,
                  "description": resource.description,
                  "fileFormat": resource.format
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Free Marketing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Automation Resources
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Templates, checklists, calculators, and guides used by 30,000+ marketing 
              professionals to select, implement, and optimize AI marketing automation tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#resources"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Browse All Resources
              </a>
              <Link href="/tools">
                <a className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                  Find AI Tools
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section id="resources" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Featured Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our most popular tools and templates, downloaded by thousands of marketers 
                every month to streamline their AI marketing automation journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {resources.filter(r => r.featured).map(resource => (
                <FeaturedResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Complete Resource Library
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to successfully implement AI marketing automation, 
                from planning and budgeting to team onboarding and performance tracking.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guides */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Implementation Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Step-by-step guides and best practices from marketing automation experts 
                and successful implementations across various industries.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {guides.map((guide, index) => (
                <GuideCard key={index} guide={guide} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Personalized Recommendations?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take our 2-minute quiz to get personalized AI marketing tool recommendations 
              based on your specific business needs, budget, and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <a className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors">
                  Take the Quiz
                </a>
              </Link>
              <Link href="/tools">
                <a className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                  Browse All Tools
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Featured Resource Card Component
const FeaturedResourceCard = ({ resource }) => {
  const handleDownload = () => {
    if (resource.downloadLink) {
      window.open(resource.downloadLink, '_blank')
    } else if (resource.link) {
      window.location.href = resource.link
    }
  }

  return (
    <div className="featured-resource-card bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
          {resource.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium uppercase">
              Featured
            </span>
            <span className="text-blue-600 text-sm font-medium">{resource.type}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {resource.format} • {resource.pages}
            </div>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {resource.downloadLink ? 'Download Free' : 'Access Tool'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Resource Card Component
const ResourceCard = ({ resource }) => {
  const handleDownload = () => {
    if (resource.downloadLink) {
      window.open(resource.downloadLink, '_blank')
    } else if (resource.link) {
      window.location.href = resource.link
    }
  }

  return (
    <div className="resource-card bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          {resource.icon}
        </div>
        <span className="text-blue-600 text-sm font-medium">{resource.type}</span>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
      
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-4">
          {resource.format} • {resource.pages}
        </div>
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {resource.downloadLink ? 'Download Free' : 'Access Tool'}
        </button>
      </div>
    </div>
  )
}

// Guide Card Component
const GuideCard = ({ guide }) => {
  return (
    <Link href={guide.link}>
      <a className="guide-card group block bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {guide.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{guide.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 text-sm font-medium">{guide.readTime}</span>
          <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
            Read Guide →
          </span>
        </div>
      </a>
    </Link>
  )
}