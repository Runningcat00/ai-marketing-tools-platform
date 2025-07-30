import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { initializeAnalytics, trackPageView } from '../utils/analytics'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Initialize analytics on app load
    initializeAnalytics()

    // Track page views on route change
    const handleRouteChange = (url) => {
      trackPageView(url, document.title)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Load Inter font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift during font load */
            html { font-family: 'Inter', system-ui, sans-serif; }
          `
        }} />
      </Head>
      
      <Component {...pageProps} />
    </>
  )
}