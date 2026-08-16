export const toLocalImage = (url) => {
  if (!url) return ''
  if (url.includes('res.cloudinary.com')) {
    return url.replace(
      'https://res.cloudinary.com/dmz316wxm/image/upload',
      '/images'
    )
  }
  return url
}