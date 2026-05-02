import React from "react";
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

export default function AmenitiesSection() {
  return (
    <section className="pt-10" id="amenities">
      <div>
        {/* Simple Header - Matching Floor Plans style */}
          <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Amenities
          </h4>
        </div>

        {/* Compact Amenities Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className="group bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100"
              >
                <div className="flex flex-col items-center">
                  {/* Smaller Icon Container */}
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                  </div>
                  
                  {/* Smaller Text */}
                  <h3 className="text-gray-700 font-medium text-xs text-center leading-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}