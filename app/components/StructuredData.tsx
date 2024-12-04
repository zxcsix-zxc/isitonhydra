export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Is it on Hydra?',
    applicationCategory: 'GameSearchEngine',
    operatingSystem: 'Any',
    description: 'Fast and reliable game search engine with advanced filtering capabilities',
    url: 'https://isitonhydra.xyz',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 