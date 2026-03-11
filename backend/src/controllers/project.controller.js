import Project from "../models/project.model.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";

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

const buildFloorPlans = async (floorPlansRaw, uploadedFiles = []) => {
  const floorPlans = safeParse(floorPlansRaw)
  const uploadedUrls = await Promise.all(
    uploadedFiles.map(file => uploadFile(file.buffer, 'sobha/floorplans'))
  )
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

    if (!req.files?.mainImage?.length) {
      return res.status(400).json({
        success: false,
        message: "Main image is required",
      })
    }

    // Upload Main Image
    const mainImageUrl = await uploadFile(req.files.mainImage[0].buffer, 'sobha/projects')

    // Master Plan Image
    const masterPlanImageUrl = req.files?.masterPlanImage?.length
      ? await uploadFile(req.files.masterPlanImage[0].buffer, 'sobha/masterplans')
      : ''

    // Gallery Images
    const galleryImages = await Promise.all(
      (req.files?.gallery || []).map(file => uploadFile(file.buffer, 'sobha/gallery'))
    )

    // Floor Plans
    const floorPlans = await buildFloorPlans(
      req.body.floorPlans,
      req.files?.floorPlanImages || [],
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
      updateData.floorPlans = await buildFloorPlans(
        floorPlans,
        req.files?.floorPlanImages || [],
      )
    }

    // New main image
    if (req.files?.mainImage?.length > 0) {
      await deleteFile(project.mainImage)
      updateData.mainImage = await uploadFile(req.files.mainImage[0].buffer, 'sobha/projects')
    }

    // New master plan image
    if (req.files?.masterPlanImage?.length > 0) {
      await deleteFile(project.masterPlanImage)
      updateData.masterPlanImage = await uploadFile(req.files.masterPlanImage[0].buffer, 'sobha/masterplans')
    }

    // Append new gallery images
    if (req.files?.gallery?.length > 0) {
      const newGallery = await Promise.all(
        req.files.gallery.map(file => uploadFile(file.buffer, 'sobha/gallery'))
      )
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

    // Delete all images from Cloudinary
    await deleteFile(project.mainImage)
    await deleteFile(project.masterPlanImage)
    await Promise.all((project.gallery || []).map(img => deleteFile(img)))
    await Promise.all((project.floorPlans || []).map(fp => fp.floorPlanImage ? deleteFile(fp.floorPlanImage) : null))

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
    await deleteFile(imageUrl)
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