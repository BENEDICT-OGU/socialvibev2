import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SkillChart = ({ skills }) => {
  // Generate random data for demonstration
  const data = {
    labels: skills,
    datasets: [
      {
        data: skills.map(() => Math.floor(Math.random() * 50) + 20),
        backgroundColor: [
          "#EC4899", // pink-500
          "#8B5CF6", // violet-500
          "#3B82F6", // blue-500
          "#10B981", // emerald-500
          "#F59E0B", // amber-500
          "#EF4444", // red-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#6B7280", // gray-500
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  );
};

export default SkillChart;