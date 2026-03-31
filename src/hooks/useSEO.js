import { useEffect } from 'react'

/**
 * Hook to manage SEO meta tags dynamically
 * @param {Object} options - SEO options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.keywords - Meta keywords
 * @param {string} options.image - OG image URL
 * @param {string} options.url - Canonical URL
 * @param {string} options.type - OG type (website, article, etc.)
 */
export function useSEO({
  title,
  description,
  keywords,
  image = '/dowa_logo.png',
  url = '',
  type = 'website'
}) {
  useEffect(() => {
    const baseUrl = 'https://dgt-sounds.com'
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl

    // Set document title
    document.title = title ? `${title} | DGT Sounds` : 'DGT Sounds - African Music Streaming'

    // Update meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      if (content) {
        meta.setAttribute('content', content)
      }
    }

    // Basic SEO
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', 'DGT Sounds Multimedia')

    // Open Graph
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:site_name', 'DGT Sounds', true)

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:site', '@dgtsounds')

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

    // Cleanup on unmount
    return () => {
      // Optional: Reset to defaults if needed
    }
  }, [title, description, keywords, image, url, type])
}

export default useSEO
