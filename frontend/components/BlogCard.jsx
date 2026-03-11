import { toLocalImage } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

function BlogCard({ blog }) {
  return (
    <div
                  key={blog?._id}
                  className="bg-white shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
                >
    
                  {/* Image */}
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={toLocalImage(blog?.thumbnail)}
                      alt={blog?.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
                    />
                  </div>
    
                  {/* Content */}
                  <div className="p-5">
    
                    {/* Title */}
                    <h3 className="text-[17px] font-semibold text-[#1a2b49] mb-4 leading-snug">
                      {blog?.title?.length > 30 
  ? blog.title.substring(0, 30) + "..." 
  : blog.title}
                    </h3>
    
                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
    
                      {/* Learn More Link */}
                      <Link href={`/blog/${blog?.slug}`} className="text-sm text-gray-600 cursor-pointer hover:text-[#1a2b49] flex items-center gap-1">
                        Learn More
                        <span className="text-lg leading-none">›</span>
                      </Link>
    
                      {/* Button */}
                      <Link href={`/blog/${blog?.slug}`} className="bg-primary text-white text-sm px-4 py-2 rounded-3xl cursor-pointer shadow-md hover:bg-primary/90 transition">
                        Read More
                      </Link>
    
                    </div>
    
                  </div>
    
                </div>
  );
}

export default BlogCard;