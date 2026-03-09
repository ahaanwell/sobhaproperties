"use client";

import SectionHeading from "./SectionHeading";
// import {
//   Home,
//   Waves,
//   Dumbbell,
//   Baby,
//   Footprints,
//   ShieldCheck,
//   Volleyball,
// } from "lucide-react";

import {
  Home,
  Waves,
  Dumbbell,
  Smile,
  Footprints,
  ShieldCheck,
  Volleyball,
  Trees,
  Car,
  Gamepad2,
  Building2,
  Users,
  Wifi,
  Camera,
  Flame,
  Droplets,
  Flower,
  Bike,
  Activity,
  Armchair
} from "lucide-react";

// const amenities = [
//   { name: "Clubhouse", icon: Home },
//   { name: "Swimming Pool", icon: Waves },
//   { name: "Gym", icon: Dumbbell },
//   { name: "Kids Play Area", icon: Baby },
//   { name: "Jogging Track", icon: Footprints },
//   { name: "24/7 Security", icon: ShieldCheck },
//   { name: "Sports Courts", icon: Volleyball },
// ];


const amenities = [
  { name: "Clubhouse", icon: Home },
  { name: "Swimming Pool", icon: Waves },
  { name: "Gymnasium", icon: Dumbbell },
  { name: "Kids Play Area", icon: Smile },
  { name: "Jogging Track", icon: Footprints },
  { name: "24/7 Security", icon: ShieldCheck },
  { name: "Sports Courts", icon: Volleyball },
  { name: "Landscaped Gardens", icon: Trees },
  { name: "Covered Parking", icon: Car },
  { name: "Indoor Games Room", icon: Gamepad2 },
  { name: "Multipurpose Hall", icon: Building2 },
  { name: "Community Hall", icon: Users },
  { name: "High-Speed Elevators", icon: Activity },
  { name: "CCTV Surveillance", icon: Camera },
  { name: "Power Backup", icon: Flame },
  { name: "Water Supply", icon: Droplets },
  { name: "Yoga Deck", icon: Flower },
  { name: "Cycling Track", icon: Bike },
  { name: "Senior Citizen Area", icon: Armchair },
  { name: "WiFi Connectivity", icon: Wifi },
];
export default function Amenities() {
  return (
    <section className="py-4 bg-white">

      <div className="max-w-[1180px] mx-auto px-4 md:px-16 w-full">

        {/* Heading */}
        <SectionHeading title="𝙇𝙞𝙛𝙚𝙨𝙩𝙮𝙡𝙚 & 𝘼𝙢𝙚𝙣𝙞𝙩𝙞𝙚𝙨" />

        {/* Icons Row */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-8 my-10">

          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center"
              >

                {/* Icon Box */}
                <div className="w-full h-[70px] bg-white rounded-xl shadow-md flex items-center justify-center mb-3 hover:shadow-lg transition">

                  <Icon
                    size={28}
                    className="text-yellow-600"
                    strokeWidth={3}
                  />

                </div>

                {/* Label */}
                <p className="text-sm text-gray-700 font-medium text-center leading-tight">
                  {item.name}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}
