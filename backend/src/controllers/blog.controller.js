import Blog from "../models/blog.model.js";
import { saveFile, deleteFile } from "../utils/saveFile.js";

// @desc    Add Blog
// @route   POST /api/v1/blogs
// @access  Private
export const addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, isActive, isFeatured } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Generate slug early for folder name
    const blogSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
      : title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    // Upload thumbnail
    if (!req.files?.thumbnail?.length) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }
    const thumbnailUrl = saveFile(req.files.thumbnail[0], blogSlug);

    // Parse metadata
    const metadata = req.body.metadata
      ? JSON.parse(req.body.metadata)
      : {};

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      thumbnail: thumbnailUrl,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Add Blog Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating blog",
    });
  }
};

// @desc    Get All Blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      isFeatured,
    } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-content"), // exclude heavy content from listing
      Blog.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: blogs,
    });
  } catch (error) {
    console.error("Get All Blogs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching blogs",
    });
  }
};

// @desc    Get Blog by Slug
// @route   GET /api/v1/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching blog",
    });
  }
};

// @desc    Get Blog by ID
// @route   GET /api/v1/blogs/id/:id
// @access  Private
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching blog",
    });
  }
};

// @desc    Update Blog
// @route   PUT /api/v1/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { metadata, ...rest } = req.body;

    const updateData = { ...rest };

    // Boolean fields — FormData sends strings
    if (rest.isActive !== undefined) {
      updateData.isActive = rest.isActive === "true" || rest.isActive === true;
    }
    if (rest.isFeatured !== undefined) {
      updateData.isFeatured = rest.isFeatured === "true" || rest.isFeatured === true;
    }

    // Merge metadata
    if (metadata) {
      const incoming = JSON.parse(metadata);
      const existing = blog.metadata?.toObject?.() ?? {};
      updateData.metadata = { ...existing, ...incoming };
    }

    // New thumbnail
    if (req.files?.thumbnail?.length > 0) {
      deleteFile(blog.thumbnail);
      updateData.thumbnail = saveFile(req.files.thumbnail[0], blog.slug);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating blog",
    });
  }
};

// @desc    Delete Blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete thumbnail
    deleteFile(blog.thumbnail);

    // Delete entire blog folder
    try {
      import('fs').then(fs => {
        import('path').then(path => {
          const folderPath = path.join(process.cwd(), 'public', blog.slug)
          if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true })
          }
        })
      })
    } catch (err) {
      console.error('Folder delete error:', err)
    }

    await Blog.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting blog",
    });
  }
};

// @desc    Toggle Blog Active Status
// @route   PATCH /api/v1/blogs/:id/toggle-status
// @access  Private
export const toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    blog.isActive = !blog.isActive;
    await blog.save();
    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isActive ? "activated" : "deactivated"} successfully`,
      data: { isActive: blog.isActive },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Toggle Blog Featured Status
// @route   PATCH /api/v1/blogs/:id/toggle-featured
// @access  Private
export const toggleBlogFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    blog.isFeatured = !blog.isFeatured;
    await blog.save();
    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isFeatured ? "featured" : "unfeatured"} successfully`,
      data: { isFeatured: blog.isFeatured },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};