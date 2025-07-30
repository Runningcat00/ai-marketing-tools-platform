import { generateSitemapData } from '../utils/seo'
import toolsDatabase from '../data/tools-database.json'

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map(({ url, lastModified, changeFrequency, priority }) => {
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${lastModified}</lastmod>
           <changefreq>${changeFrequency}</changefreq>
           <priority>${priority}</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Generate sitemap data
  const pages = generateSitemapData(toolsDatabase.categories, toolsDatabase.tools)

  // Generate the XML sitemap
  const sitemap = generateSiteMap(pages)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap