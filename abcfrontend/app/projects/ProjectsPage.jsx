
import MainLayout from "@/components/MainLayout";
import ProjectCard from "@/components/ProjectCard";

async function fetchProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();
  return data.data;
}

async function ProjectsPage() {
  const projects = await fetchProjects();

  return (
    <MainLayout>
      <div className="min-h-[80vh]">
        <div
          className="w-full h-[250px] bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/hero.png')",
          }}
        >
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold">
              Book Your Dream
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl m-auto">
          {projects?.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default ProjectsPage;