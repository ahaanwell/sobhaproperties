import multer from 'multer'

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WEBP files are allowed'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(), // no disk writes
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
})

export const projectUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'gallery', maxCount: 15 },
  { name: 'floorPlanImages', maxCount: 20 },
  { name: 'masterPlanImage', maxCount: 1 },
])

export const blogUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
])

export const singleUpload = upload.single('image')