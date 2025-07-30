// SEO utility functions for schema markup and meta tags

// Generate structured data for tools
export const generateToolSchema = (tool) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
      },
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.ratings.overall_score,
      "reviewCount": tool.ratings.total_reviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "featureList": tool.features.ai_capabilities,
    "screenshot": `https://thevibemarketer.com/images/tools/${tool.id}-screenshot.jpg`,
    "author": {
      "@type": "Organization",
      "name": "The Vibe Marketer",
      "url": "https://thevibemarketer.com"
    },
    "datePublished": tool.updated_at || new Date().toISOString(),
    "dateModified": tool.updated_at || new Date().toISOString()
  }
}

// Generate comparison page schema
export const generateComparisonSchema = (tools, category) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${category.name} Comparison 2025 - The Vibe Marketer`,
    "description": `Compare the best ${category.name.toLowerCase()} for 2025. Expert analysis, pricing, and recommendations from 30,000+ marketing professionals.`,
    "url": `https://thevibemarketer.com/tools/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": category.name,
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": generateToolSchema(tool)
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://thevibemarketer.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "AI Marketing Tools",
          "item": "https://thevibemarketer.com/tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": category.name,
          "item": `https://thevibemarketer.com/tools/${category.slug}`
        }
      ]
    },
    "author": {
      "@type": "Organization",
      "name": "The Vibe Marketer",
      "url": "https://thevibemarketer.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thevibemarketer.com/logo.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Vibe Marketer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thevibemarketer.com/logo.png"
      }
    }
  }
}

// Generate FAQ schema
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Generate review schema
export const generateReviewSchema = (tool, review) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": generateToolSchema(tool),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": tool.ratings.overall_score,
      "bestRating": 5
    },
    "name": `${tool.name} Review - The Vibe Marketer`,
    "reviewBody": review.content,
    "author": {
      "@type": "Organization",
      "name": "The Vibe Marketer"
    },
    "datePublished": review.date || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "The Vibe Marketer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thevibemarketer.com/logo.png"
      }
    }
  }
}

// Generate organization schema
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Vibe Marketer",
    "description": "AI marketing tools and automation platform serving 30,000+ marketing professionals",
    "url": "https://thevibemarketer.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://thevibemarketer.com/logo.png",
      "width": 200,
      "height": 50
    },
    "sameAs": [
      "https://twitter.com/thevibemarketer",
      "https://linkedin.com/company/thevibemarketer",
      "https://facebook.com/thevibemarketer"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@thevibemarketer.com"
    },
    "founders": [
      {
        "@type": "Person",
        "name": "The Vibe Marketer Team"
      }
    ]
  }
}

// Generate meta tags for pages
export const generateMetaTags = (page) => {
  const baseUrl = 'https://thevibemarketer.com'
  
  const defaultMeta = {
    title: 'AI Marketing Tools Hub 2025 - The Vibe Marketer',
    description: 'Compare the best AI marketing automation tools for 2025. Expert reviews, personalized recommendations, and ROI calculators from 30,000+ professionals.',
    keywords: 'AI marketing tools, marketing automation, AI marketing software, marketing tools comparison',
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    type: 'website'
  }
  
  const pageMeta = { ...defaultMeta, ...page }
  
  return {
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords,
    openGraph: {
      title: pageMeta.title,
      description: pageMeta.description,
      type: pageMeta.type,
      url: pageMeta.url,
      image: pageMeta.image,
      siteName: 'The Vibe Marketer'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      image: pageMeta.image,
      creator: '@thevibemarketer'
    },
    canonical: pageMeta.url
  }
}

// Generate category-specific meta tags
export const generateCategoryMeta = (category, tools) => {
  const baseUrl = 'https://thevibemarketer.com'
  
  return generateMetaTags({
    title: `${category.seo.title} | The Vibe Marketer`,
    description: category.seo.description,
    keywords: category.seo.keywords.join(', '),
    url: `${baseUrl}/tools/${category.slug}`,
    image: `${baseUrl}/images/categories/${category.slug}-og.jpg`,
    type: 'article'
  })
}

// Generate tool-specific meta tags
export const generateToolMeta = (tool) => {
  const baseUrl = 'https://thevibemarketer.com'
  
  return generateMetaTags({
    title: `${tool.name} Review 2025 - Features, Pricing & Alternatives | The Vibe Marketer`,
    description: `${tool.description} Read our expert review, compare pricing, and see user ratings for ${tool.name}.`,
    keywords: `${tool.name}, ${tool.name} review, ${tool.name} pricing, ${tool.name} alternatives, AI marketing tools`,
    url: `${baseUrl}/tools/${tool.category}/${tool.id}`,
    image: `${baseUrl}/images/tools/${tool.id}-og.jpg`,
    type: 'article'
  })
}

// Generate sitemap data
export const generateSitemapData = (categories, tools) => {
  const baseUrl = 'https://thevibemarketer.com'
  const currentDate = new Date().toISOString()
  
  const pages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]
  
  // Add category pages
  Object.values(categories).forEach(category => {
    pages.push({
      url: `${baseUrl}/tools/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    })
  })
  
  // Add tool pages
  Object.values(tools).forEach(tool => {
    pages.push({
      url: `${baseUrl}/tools/${tool.category}/${tool.id}`,
      lastModified: tool.updated_at || currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    })
  })
  
  return pages
}

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://thevibemarketer.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /downloads/private/

# Allow important marketing pages
Allow: /tools/
Allow: /resources/
Allow: /guides/`
}