export const revalidate = 60; // refresh every 60 seconds (near instant + safe)

export default async function sitemap() {
  const baseUrl = "https://www.sobhaproperties.in";

  let projects = [];
  let blogs = [];

  try {
    const [projectsRes, blogsRes] = await Promise.all([
      fetch("https://api.sobhaproperties.in/api/v1/projects", {
        next: { revalidate: 60 },
      }),
      fetch("https://api.sobhaproperties.in/api/v1/blogs", {
        next: { revalidate: 60 },
      }),
    ]);

    const projectsData = await projectsRes.json();
    const blogsData = await blogsRes.json();

    projects = Array.isArray(projectsData)
      ? projectsData
      : projectsData?.data || [];

    blogs = Array.isArray(blogsData)
      ? blogsData
      : blogsData?.data || [];
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

  // Project pages
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/bangalore/${project.slug}`,
    lastModified: project.updatedAt
      ? new Date(project.updatedAt)
      : new Date(),
  }));

  // Blog pages
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt
      ? new Date(blog.updatedAt)
      : new Date(),
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}