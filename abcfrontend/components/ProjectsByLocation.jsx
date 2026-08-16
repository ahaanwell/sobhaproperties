
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const locations = [
  { id: 1, name: "Bangalore", image: "/images/bangalore.jpg" },
  { id: 2, name: "Chennai", image: "/images/chennai.jpg" },
  { id: 3, name: "Hyderabad", image: "/images/hyderabad.jpg" },
  { id: 4, name: "Delhi NCR", image: "/images/delhi.jpg" },
  { id: 5, name: "Dubai", image: "/images/dubai.jpg" },
];

export default function ProjectsByLocation() {
  return (
    <section className="py-16 bg-[#fafafa]">
      <div className="max-w-[1140px] mx-auto px-6 md:px-16">
        <SectionHeading title="𝙋𝙧𝙤𝙟𝙚𝙘𝙩𝙨 𝙗𝙮 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣" />

        <div className="flex gap-3 mt-8 overflow-x-auto scroll-smooth scrollbar-hide pb-2">
          {[...locations, ...locations].map((location, index) => (
            <div
              key={index}
              className="group min-w-[240px] cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative w-full h-[180px] overflow-hidden">
                
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Location Name */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-lg font-semibold tracking-wide">
                    {location.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}