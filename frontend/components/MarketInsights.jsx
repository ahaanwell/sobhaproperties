"use client";

import Image from "next/image";
import SectionHeading from "./SectionHeading";
import BlogCard from "./BlogCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBlogs } from "@/redux/slices/blogSlice";

export default function MarketInsights({blogsList}) {
  // const dispatch = useDispatch();
  const scrollRef = useRef(null);
  // const {blogsList} = useSelector((state)=>state.blog);
  // console.log("blogsList", blogsList);

  // useEffect(()=>{
  //   dispatch(fetchBlogs())
  // }, []);


  // scroll left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -380, // card width
      behavior: "smooth",
    });
  };

  // scroll right
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 380,
      behavior: "smooth",
    });
  };
  return (
    <section className="py-8 bg-[#fff6f6]">
      <div className="max-w-[1140px] mx-auto px-4 md:px-16 w-full">
        {/* Heading */}
        <SectionHeading title="𝙎𝙤𝙗𝙝𝙖 𝙈𝙖𝙧𝙠𝙚𝙩 𝙄𝙣𝙨𝙞𝙜𝙝𝙩𝙨" />

        <div className=" relative mt-4">
          {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Cards */}
        <div ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {blogsList.map((item) => (
            <div key={item._id} className="snap-start shrink-0 w-[290px] md:w-[330px]">
              <BlogCard blog={item} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
