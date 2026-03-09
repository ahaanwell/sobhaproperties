import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";

async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Footer project fetch error:", error);
    return [];
  }
}

export default async function Footer() {
  const projects = await getProjects();

  return (
    <footer className="bg-[#0f1c2e] text-gray-300 pt-14 pb-6">
      <div className="max-w-[1140px] mx-auto px-4 md:px-16 w-full">

        {/* Top Grid */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <Link
              href="/"
              className="flex flex-col text-white text-2xl font-semibold tracking-[4px] leading-none"
            >
              SOBHA
              <span className="text-xs tracking-[3px] leading-none">
                𝒫𝓇𝑜𝓅𝑒𝓇𝓉𝒾𝑒𝓈
              </span>
            </Link>

            <p className="text-sm leading-6 text-gray-400 mt-3">
              Sobha Realty is one of India’s most trusted real estate
              developers delivering premium residential projects with
              world-class craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/locations">Locations</Link></li>
              <li><Link href="/blogs">Market Insights</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Projects in Bangalore
            </h3>

            <ul className="space-y-2 text-sm">
              {projects?.slice(0, 5).map((project) => (
                <li key={project?._id}>
                  <Link href={`/projects/${project?.slug}`}>
                    {project?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-sm mb-6">

              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 text-gray-400" />
                <p>Bangalore, Karnataka, India</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p>+91 98765 13131</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p>info@sobhaproperties.in</p>
              </div>

            </div>

            {/* Social Media */}
            <div className="flex gap-3">

              <Link href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition">
                <Facebook size={16} />
              </Link>

              <Link href="#" className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition">
                <Instagram size={16} />
              </Link>

              <Link href="#" className="w-9 h-9 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition">
                <Twitter size={16} />
              </Link>

              <Link href="#" className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition">
                <Youtube size={16} />
              </Link>

              <Link href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition">
                <Linkedin size={16} />
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Sobha Properties. All rights reserved.
        </div>

      </div>
    </footer>
  );
}