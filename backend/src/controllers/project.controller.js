import Project from "../models/project.model.js";
import { saveFile, deleteFile } from "../utils/saveFile.js";

const safeParse = (data) => {
  if (!data) return [];
  if (typeof data === "object") return data;
  try { return JSON.parse(data) } catch { return [] }
}

const safeParseObject = (data) => {
  if (!data) return {};
  if (typeof data === "object") return data;
  try { return JSON.parse(data) } catch { return {} }
}

const buildFloorPlans = (floorPlansRaw, uploadedFiles = [], slug) => {
  const floorPlans = safeParse(floorPlansRaw)
  const uploadedUrls = uploadedFiles.map(file => saveFile(file, slug))

  return floorPlans.map((fp) => {
    const { _imageIndex, ...rest } = fp
    if (typeof _imageIndex === 'number' && _imageIndex >= 0 && uploadedUrls[_imageIndex]) {
      return { ...rest, floorPlanImage: uploadedUrls[_imageIndex] }
    }
    return rest
  })
}

// @desc    Add Project
// @route   POST /api/v1/projects
// @access  Private
export const addProject = async (req, res) => {
  try {
    const {
      name, slug, mapLink, location,
      unitVariant, basePrice, totalUnits, totalLandArea, totalTowers,
      status, propertyType, reraId, possessionTime,
      overviewContent, floorPlanContent, masterPlanContent,
      pricePlanContent, locationContent, moreAbout,
    } = req.body

    if (!name || !location || !unitVariant || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "Name, location, unitVariant and basePrice are required",
      })
    }

    // Generate slug early so we can use it as folder name
    const projectSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Upload Main Image
    if (!req.files?.mainImage?.length) {
      return res.status(400).json({
        success: false,
        message: "Main image is required",
      })
    }
    const mainImageUrl = saveFile(req.files.mainImage[0], projectSlug)

    // Master Plan Image
    const masterPlanImageUrl = req.files?.masterPlanImage?.length
      ? saveFile(req.files.masterPlanImage[0], projectSlug)
      : ''

    // Gallery Images
    const galleryImages = (req.files?.gallery || []).map(file =>
      saveFile(file, projectSlug)
    )

    // Floor Plans
    const floorPlans = buildFloorPlans(
      req.body.floorPlans,
      req.files?.floorPlanImages || [],
      projectSlug
    )

    // Metadata
    const metadata = safeParseObject(req.body.metadata)

    const project = await Project.create({
      name, slug, mapLink, location,
      unitVariant, basePrice,
      totalUnits, totalLandArea, totalTowers,
      status, propertyType, reraId, possessionTime,
      overviewContent, floorPlanContent, masterPlanContent,
      pricePlanContent, locationContent, moreAbout,
      mainImage: mainImageUrl,
      masterPlanImage: masterPlanImageUrl,
      floorPlans,
      pricePlans: safeParse(req.body.pricePlans),
      faqList: safeParse(req.body.faqList),
      gallery: galleryImages,
      metadata,
    })

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    })
  } catch (error) {
    console.error("Add Project Error:", error)
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating project",
    })
  }
}

// @desc    Get All Projects
// @route   GET /api/v1/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, propertyType, location, search, isActive } = req.query

    const query = {}
    if (status) query.status = status
    if (propertyType) query.propertyType = propertyType
    if (location) query.location = { $regex: location, $options: "i" }
    if (isActive !== undefined) query.isActive = isActive === "true"
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { reraId: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-floorPlans -pricePlans -faqList -gallery -overviewContent -floorPlanContent -masterPlanContent -pricePlanContent -locationContent -moreAbout"),
      Project.countDocuments(query),
    ])

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: projects,
    })
  } catch (error) {
    console.error("Get All Projects Error:", error)
    return res.status(500).json({ success: false, message: "Server error while fetching projects" })
  }
}

// @desc    Get Project by Slug
// @route   GET /api/v1/projects/slug/:slug
// @access  Public
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }
    return res.status(200).json({ success: true, data: project })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Get Project by ID
// @route   GET /api/v1/projects/id/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }
    return res.status(200).json({ success: true, data: project })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Update Project
// @route   PUT /api/v1/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }

    // Use existing slug as folder name (keep images in same folder)
    const projectSlug = project.slug

    const { metadata, floorPlans, pricePlans, faqList, ...rest } = req.body

    const updateData = {
      ...rest,
      pricePlans: pricePlans ? safeParse(pricePlans) : project.pricePlans,
      faqList: faqList ? safeParse(faqList) : project.faqList,
    }

    // Merge metadata
    if (metadata) {
      const incoming = safeParseObject(metadata)
      const existing = project.metadata?.toObject?.() ?? {}
      updateData.metadata = { ...existing, ...incoming }
    }

    // Floor plans
    if (floorPlans) {
      updateData.floorPlans = buildFloorPlans(
        floorPlans,
        req.files?.floorPlanImages || [],
        projectSlug
      )
    }

    // New main image
    if (req.files?.mainImage?.length > 0) {
      deleteFile(project.mainImage)
      updateData.mainImage = saveFile(req.files.mainImage[0], projectSlug)
    }

    // New master plan image
    if (req.files?.masterPlanImage?.length > 0) {
      deleteFile(project.masterPlanImage)
      updateData.masterPlanImage = saveFile(req.files.masterPlanImage[0], projectSlug)
    }

    // Append new gallery images
    if (req.files?.gallery?.length > 0) {
      const newGallery = req.files.gallery.map(file => saveFile(file, projectSlug))
      updateData.gallery = [...(project.gallery || []), ...newGallery]
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    })
  } catch (error) {
    console.error("Update Project Error:", error)
    return res.status(500).json({ success: false, message: "Server error while updating project" })
  }
}

// @desc    Delete Project
// @route   DELETE /api/v1/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }

    // Delete all images
    deleteFile(project.mainImage)
    deleteFile(project.masterPlanImage)
    for (const img of project.gallery || []) deleteFile(img)
    for (const fp of project.floorPlans || []) {
      if (fp.floorPlanImage) deleteFile(fp.floorPlanImage)
    }

    // Also delete the entire project folder
    try {
      const folderPath = path.join(process.cwd(), 'public', project.slug)
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true })
      }
    } catch (err) {
      console.error('Folder delete error:', err)
    }

    await Project.findByIdAndDelete(req.params.id)
    return res.status(200).json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error while deleting project" })
  }
}

// @desc    Toggle Project Active Status
// @route   PATCH /api/v1/projects/:id/toggle-status
// @access  Private
export const toggleProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }
    project.isActive = !project.isActive
    await project.save()
    return res.status(200).json({
      success: true,
      message: `Project ${project.isActive ? "activated" : "deactivated"} successfully`,
      data: { isActive: project.isActive },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Delete Gallery Image
// @route   DELETE /api/v1/projects/:id/gallery
// @access  Private
export const deleteGalleryImage = async (req, res) => {
  try {
    const { imageUrl } = req.body
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }
    deleteFile(imageUrl)
    project.gallery = project.gallery.filter(img => img !== imageUrl)
    await project.save()
    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
      data: project.gallery,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Get dashboard stats
// @route   GET /api/v1/projects/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const [total, ongoing, upcoming, completed, apartments, villas, plots, commercial] =
      await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: "ongoing" }),
        Project.countDocuments({ status: "upcoming" }),
        Project.countDocuments({ status: "completed" }),
        Project.countDocuments({ propertyType: "apartment" }),
        Project.countDocuments({ propertyType: "villa" }),
        Project.countDocuments({ propertyType: "plot" }),
        Project.countDocuments({ propertyType: "commercial" }),
      ])

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name location status propertyType createdAt mainImage")

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          total,
          byStatus: { ongoing, upcoming, completed },
          byType: { apartments, villas, plots, commercial },
        },
        recentProjects,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error while fetching stats" })
  }
}