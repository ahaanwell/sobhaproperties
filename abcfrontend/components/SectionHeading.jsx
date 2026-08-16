export default function SectionHeading({ title }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <div className="w-10 h-[3px] bg-[#1a2b49]"></div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1a2b49]">
          {title}
        </h2>
      </div>
    </div>
  );
}