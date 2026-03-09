import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const metadataSchema = new Schema(
  {
    title: String,
    description: String,
    keywords: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
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
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    metadata: {
      type: metadataSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug ─────────────────────────────────────
blogSchema.pre("validate", async function () {
  if (this.slug) {
    this.slug = slugify(this.slug, { lower: true, strict: true, trim: true });
  } else {
    this.slug = slugify(this.title, { lower: true, strict: true, trim: true });
  }

  let baseSlug = this.slug;
  let counter = 1;
  while (
    await mongoose.models.Blog.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    })
  ) {
    this.slug = `${baseSlug}-${counter++}`;
  }
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;