import React from 'react';

const ReelsGrid = () => {
  const reels = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', views: '12.4K' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', views: '8.7K' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', views: '24.1K' },
  ];

  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
      {reels.map(reel => (
        <div key={reel.id} className="relative aspect-[9/16] group">
          <img 
            src={reel.thumbnail} 
            alt="Reel" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-2 left-2 text-white flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{reel.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsGrid;