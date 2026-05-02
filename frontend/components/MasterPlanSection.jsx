import { toLocalImage } from "@/utils/image";

export default function MasterPlanSection({masterPlanContent, masterPlanImage}) {

  return (
    <section className="pt-10" id="master-plan">
      <div className="">
        <div className="flex items-center justify-center mb-8">
          <h4 className="mx-4 text-xl md:text-3xl font-bold">
            Master Plan
          </h4>
        </div>

        {masterPlanContent && (
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: masterPlanContent || "" }}
          />
        )}
        {/* Master Plan Image Card */}
        <div className="w-full md:w-[50%] m-auto h-[300px] md:h-[400px] flex items-center justify-center">
              {masterPlanImage && (
  <img
    src={toLocalImage(masterPlanImage)}
    alt="Master Plan"
    className="w-full h-full object-cover rounded-2xl"
  />
)}
            </div>
      </div>
    </section>
  );
}