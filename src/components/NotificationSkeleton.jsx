export default function NotificationSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg flex items-start bg-white border border-gray-200">
          <div className="bg-gray-200 rounded-full w-10 h-10 mr-3 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 h-4 rounded w-3/4 animate-pulse"></div>
            <div className="bg-gray-200 h-3 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}