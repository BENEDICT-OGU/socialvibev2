import React from 'react';

export default function Badges({ badges }) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) => (
        <span key={i} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
          🏅 {badge}
        </span>
      ))}
    </div>
  );
}

// import Badges from './components/Badges';

// <Badges badges={userData.badges} />
