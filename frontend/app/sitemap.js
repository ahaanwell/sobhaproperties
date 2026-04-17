export default async function sitemap() {
  const baseUrl = "https://www.sobhaproperties.in"; // ✅ FIXED (remove /api/v1)

  let projects = [];
  let blogs = [];

  try {
    const projectsRes = await fetch("https://api.sobhaproperties.in/api/v1/projects", {
      cache: "no-store",
    });

    const blogsRes = await fetch("https://api.sobhaproperties.in/api/v1/blogs", {
      cache: "no-store",
    });

    const projectsData = await projectsRes.json();
    const blogsData = await blogsRes.json();

    // ✅ FIX: Extract array safely
    projects = Array.isArray(projectsData) ? projectsData : projectsData.data || [];
    blogs = Array.isArray(blogsData) ? blogsData : blogsData.data || [];

  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  // Static pages
  const staticRoutes = [
    "",
    "/projects",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Dynamic project pages
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/bangalore/${project.slug}`,
    lastModified: project.updatedAt
      ? new Date(project.updatedAt)
      : new Date(),
  }));

  // Dynamic blog pages
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt
      ? new Date(blog.updatedAt)
      : new Date(),
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}