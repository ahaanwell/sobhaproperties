export const toLocalImage = (url) => {
  if (!url) return ''

  // Production — already on frontend domain, no change needed
  if (url.includes('sobhaproperties.vercel.app') || url.includes('sobhaproperties.in')) {
    return url
  }

  // Hostinger direct URL → rewrite to frontend domain
  if (url.includes('darkblue-owl-129775.hostingersite.com')) {
    return url.replace('https://darkblue-owl-129775.hostingersite.com', '')
  }

  // Local dev — localhost:8081 → relative path
  if (url.includes('localhost:8081')) {
    return url.replace('http://localhost:8081', '')
  }

  return url
}