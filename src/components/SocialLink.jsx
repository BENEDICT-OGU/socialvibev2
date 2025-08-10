import React from "react";

const SocialLink = ({ href, icon, color = "text-gray-500" }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 rounded-full flex items-center justify-center ${color} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
    >
      {icon}
    </a>
  );
};

export default SocialLink;