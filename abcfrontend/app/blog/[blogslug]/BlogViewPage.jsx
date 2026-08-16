
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/MainLayout";
import { toLocalImage } from "@/utils/image";
import Link from "next/link";

function BlogViewPage({ blogData}) {

  return (
    <MainLayout>
      <main className="min-h-[80vh]">
        <div
  className="w-full h-[250px] bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/hero.png')",
  }}
>
  <div className="text-center text-white">
    <p className="text-sm mb-2">
      <Link href="/" className="hover:text-gray-300">
        Home
      </Link>
      <span className="mx-1">/</span>

      <Link href="/blogs" className="hover:text-gray-300">
        Blogs
      </Link>
      <span className="mx-1">/</span>

      <span className="text-gray-300">{blogData?.title}</span>
    </p>
  </div>
</div>
<div className="max-w-4xl m-auto py-12 px-4 md:px-0">
    <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 mb-6">
          {blogData?.title}
        </h1>
      <img 
      className="md:rounded mb-4"
      src={toLocalImage(blogData?.thumbnail)} alt={blogData?.title} />
      <div
  className="rich-content"
  dangerouslySetInnerHTML={{ __html: blogData?.content }}
/>
</div>
      </main>
    </MainLayout>
  );
}

export default BlogViewPage;