import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { api } from "@/utils/api";

interface ProgressChartProps {
  goalId: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ goalId }) => {
  const { data: session } = useSession();
  const store = useStore();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      borderWidth: number;
      fill: boolean;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/api/progress/${goalId}`);
        setChartData({
          labels: data.map((item: any) => item.date),
          datasets: [
            {
              label: "Progress",
              data: data.map((item: any) => item.progress),
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };
    if (session && goalId) {
      fetchData();
    }
  }, [session, goalId]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Progress Chart</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;