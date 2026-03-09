import express from 'express'
import {
  addBlog, getAllBlogs, getBlogBySlug, getBlogById,
  updateBlog, deleteBlog, toggleBlogStatus, toggleBlogFeatured
} from '../controllers/blog.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { blogUpload } from '../middlewares/upload.middleware.js'

const router = express.Router()

router.get('/', getAllBlogs)
router.get('/slug/:slug', getBlogBySlug)
router.get('/id/:id', protect, getBlogById)
router.post('/', protect, blogUpload, addBlog)
router.put('/:id', protect, blogUpload, updateBlog)
router.delete('/:id', protect, deleteBlog)
router.patch('/:id/toggle-status', protect, toggleBlogStatus)
router.patch('/:id/toggle-featured', protect, toggleBlogFeatured)

export default router