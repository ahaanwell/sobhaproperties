export const toLocalImage = (url) => {
  if (!url) return ''
  if (url.includes('res.cloudinary.com')) {
    return url.replace(
      'https://res.cloudinary.com/djdp6aloi/image/upload',
      '/images'
    )
  }
  return url
}