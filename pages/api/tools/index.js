import toolsDatabase from '../../../data/tools-database.json'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { category } = req.query
    
    if (category) {
      // Return tools for specific category
      const categoryData = toolsDatabase.categories[category]
      if (!categoryData) {
        return res.status(404).json({ message: 'Category not found' })
      }
      
      const tools = categoryData.tools
        .map(toolId => toolsDatabase.tools[toolId])
        .filter(Boolean)
      
      return res.status(200).json({
        category: categoryData,
        tools: tools
      })
    } else {
      // Return all tools
      return res.status(200).json({
        tools: Object.values(toolsDatabase.tools),
        categories: toolsDatabase.categories
      })
    }
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}