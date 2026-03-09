import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const floorPlanSchema = new Schema(
  {
    floorPlanImage: { type: String },
    unitType: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    area: { type: Number, required: true },
  },
  { _id: false }
);

const pricePlanSchema = new Schema(
  {
    unitType: { type: String, trim: true },
    price: { type: String },
    area: { type: String },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

// ── SEO Metadata Sub-Schema ────────────────────────────────
const metadataSchema = new Schema(
  {
    // Basic SEO
    title: String,                  // <title> tag
    description: String,            // <meta name="description">
    keywords: String,               // <meta name="keywords"> comma separated
    canonicalUrl: String,           // <link rel="canonical">

    // Open Graph (WhatsApp, Facebook, LinkedIn previews)
    ogTitle: String,
    ogDescription: String,
    ogImage: String,                // 1200x630px recommended

    // Twitter Card
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },

    // Schema.org / JSON-LD
    schemaType: {
      type: String,
      enum: ['Apartment', 'House', 'SingleFamilyResidence', 'RealEstateListing'],
      default: 'Apartment',
    },

    // Address (for local SEO & structured data)
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

// ── Main Project Schema ────────────────────────────────────
const projectSchema = new Schema(
  {
    // ── Core ──────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ── SEO Metadata (all in one object) ───────────────────
    metadata: {
      type: metadataSchema,
      default: () => ({}),
    },

    // ── Project Info ───────────────────────────────────────
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },
    mapLink: String,
    location: {
      type: String,
      required: [true, "Location is required"],
      index: true,
    },
    unitVariant: {
      type: String,
      required: [true, "Unit variant is required"],
    },
    basePrice: {
      type: String,
      required: [true, "Base price is required"],
    },
    totalUnits: Number,
    totalLandArea: Number,
    totalTowers: Number,
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "ongoing",
      index: true,
    },
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "plot", "commercial"],
    },
    reraId: String,
    possessionTime: String,

    // ── Content ────────────────────────────────────────────
    overviewContent: String,
    floorPlanContent: String,
    masterPlanImage: String,
    masterPlanContent: String,
    pricePlanContent: String,
    locationContent: String,
    moreAbout: String,

    // ── Plans & Media ──────────────────────────────────────
    floorPlans: [floorPlanSchema],
    pricePlans: [pricePlanSchema],
    gallery: [{ type: String }],
    faqList: [faqSchema],
  },
  { timestamps: true }
);

// ── Auto-generate slug ─────────────────────────────────────
projectSchema.pre("validate", async function () {
  if (this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true, trim: true });
  } else {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }

  let baseSlug = this.slug;
  let counter = 1;
  while (
    await mongoose.models.Project.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    })
  ) {
    this.slug = `${baseSlug}-${counter++}`;
  }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;