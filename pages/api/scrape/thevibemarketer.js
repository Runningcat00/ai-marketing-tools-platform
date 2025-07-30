import { scrapeVibeMarketerContent, extractBrandInfo } from '../../../utils/firecrawl'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('🔥 Starting Firecrawl scrape of thevibemarketer.com...')
    
    // Scrape The Vibe Marketer content
    const scrapeResult = await scrapeVibeMarketerContent()
    
    if (scrapeResult.success) {
      // Extract brand information from scraped content
      const brandInfo = extractBrandInfo(scrapeResult.data)
      
      // Store the scraped data (in a real app, you'd save to database)
      const scrapedContent = {
        brand_info: brandInfo,
        pages: scrapeResult.data,
        summary: scrapeResult.summary,
        scraped_at: new Date().toISOString()
      }
      
      console.log('✅ Firecrawl scraping completed successfully')
      
      return res.status(200).json({
        success: true,
        message: 'Successfully scraped The Vibe Marketer content',
        data: scrapedContent,
        stats: {
          pages_scraped: Object.keys(scrapeResult.data).length,
          total_content_length: Object.values(scrapeResult.data)
            .reduce((total, page) => total + (page.content?.length || 0), 0),
          brand_elements_extracted: Object.keys(brandInfo).length
        }
      })
    } else {
      console.log('⚠️ Firecrawl scraping failed, using fallback data')
      
      return res.status(200).json({
        success: false,
        message: 'Scraping failed, using demo data',
        error: scrapeResult.error,
        data: scrapeResult.data,
        fallback: true
      })
    }
    
  } catch (error) {
    console.error('❌ Scraping API error:', error)
    
    return res.status(500).json({
      success: false,
      message: 'Failed to scrape content',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}