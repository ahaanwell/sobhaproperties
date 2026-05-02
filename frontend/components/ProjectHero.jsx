import Image from "next/image";
import { toLocalImage } from "@/utils/image";
import LeadForm from "./LeadForm";
import HeroBtn from "./HeroBtn";


export default function ProjectHero({mainImg, name, location, basePrice, unitVariant, totalUnits, totalLandArea, totalTowers}) {
  return (
    <>
    <section className="relative w-full h-[80vh] md:h-[100vh] flex items-center pt-20">

      {/* Background Image */}
      {mainImg && (
  <Image
    src={toLocalImage(mainImg || "")}
    alt={name || "Project Image"}
    fill
    priority
    className="object-cover"
  />
)}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1c2e]/40 via-[#0f1c2e]/30 to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto px-6 md:px-20 w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE CONTENT */}
        <div className="text-white">

          <h1 className="text-2xl md:text-4xl md:text-5xl font-semibold mb-4">
            {name}
          </h1>

          <p className="text-lg md:text-xl w-fit px-3 py-1 rounded bg-[#0000007d] text-gray-200 mb-3 font-medium">
            {location}
          </p>

          <p className="text-lg md:text-xl px-3 py-1 rounded w-fit bg-[#0000007d] text-gray-200 mb-3 font-medium">
            {unitVariant}
          </p>

          <p className="text-2xl md:text-3xl font-semibold mb-6">
            ₹ {basePrice}
          </p>

          {/* Buttons */}
          <HeroBtn project_name={name}/>

          <div className="flex justify-between items-center mt-10">
            <div>
              <p className="text-4xl font-bold text-yellow-500">{totalUnits}</p>
              <p>Total Units</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">{totalLandArea}</p>
              <p>Area</p>
            </div>
            {
              totalTowers ? (
                <div>
              <p className="text-4xl font-bold text-yellow-500">{totalTowers}</p>
              <p>Towers</p>
            </div>

              )
              :
              null
            }
          
          </div>

        </div>

        {/* RIGHT SIDE FORM */}
        <LeadForm projectName={name}/>

      </div>

    </section>

      </>
  );
}
