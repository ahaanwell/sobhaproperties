import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-white">
      <LoadingSpinner />
    </div>
  );
}