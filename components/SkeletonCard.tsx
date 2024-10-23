export default function SkeletonCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-muted h-48 rounded-lg mb-2"></div>
          <div className="h-4 bg-muted w-3/4 mb-1 rounded"></div>
          <div className="h-4 bg-muted w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  );
}
