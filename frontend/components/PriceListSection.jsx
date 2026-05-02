import ViewDetailsBtn from "./ViewDetailsBtn";

export default function PriceListSection({ pricePlanContent, pricePlans, projectName }) {

  return (
    <section className="pt-12 pb-16" id="price">
      <div>

        {/* Header */}
        <div className="text-center mb-6">
          <h4 className="text-xl md:text-3xl font-bold">Price List</h4>
        </div>

        <div
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: pricePlanContent || "" }}
        />

        {/* ── Desktop Table (md and above) ── */}
        <div className=" overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-primary text-white">
              <tr>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Unit Type</th>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Area</th>
                <th className="border border-gray-300 py-3 px-4 text-left text-sm font-semibold">Starting Price</th>
                <th className="border border-gray-300 py-3 px-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {pricePlans?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 py-4 px-4 font-medium text-gray-800">{item.unitType}</td>
                  <td className="border border-gray-300 py-4 px-4 text-gray-600">{item.area}</td>
                  <td className="border border-gray-300 py-4 px-4 font-semibold text-gray-900">{item.price}</td>
                  <td className="border border-gray-300 py-4 px-4 text-center">
                    <ViewDetailsBtn item={item} projectName={projectName} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}