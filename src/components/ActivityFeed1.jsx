import React from "react";
import { FiCode, FiStar, FiMessageSquare, FiGitPullRequest } from "react-icons/fi";

const ActivityFeed = ({ userId }) => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "commit",
      title: "Pushed a new commit",
      description: "Fixed login page styling issues",
      icon: <FiCode className="text-blue-500" />,
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "star",
      title: "Received a star",
      description: "Your project got starred by a user",
      icon: <FiStar className="text-yellow-500" />,
      time: "1 day ago",
    },
    {
      id: 3,
      type: "comment",
      title: "New comment",
      description: "User left a comment on your post",
      icon: <FiMessageSquare className="text-green-500" />,
      time: "2 days ago",
    },
    {
      id: 4,
      type: "pull_request",
      title: "Merged pull request",
      description: "Your PR was merged into main branch",
      icon: <FiGitPullRequest className="text-purple-500" />,
      time: "1 week ago",
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex-shrink-0 mt-1 mr-4 text-lg">{activity.icon}</div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;