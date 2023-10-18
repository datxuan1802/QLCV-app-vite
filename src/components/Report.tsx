import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Pie, Bar } from "react-chartjs-2";
import { BoardHeader, MainLayout } from ".";
import { ReactNode } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export const ReportLayout = () => {
  return (
    <MainLayout>
      <BoardHeader />
      <div className="grid grid-cols-3 px-6 pt-6 space-x-3 min-h-screen">
        <TaskDoneLineChart />
        <TaskReport />
        <PriorityReport />
        <TeamPerformance />
        <TaskDoneBaseOnDueDate />
        <TaskDoneBaseOnPriority />
      </div>
    </MainLayout>
  );
};

const TaskDoneLineChart = () => {
  return (
    <ChartLayout className="col-span-2">
      <Bar options={taskDoneLineChartOptions} data={taskDoneByTeam} />
    </ChartLayout>
  );
};
const TeamPerformance = () => {
  return (
    <ChartLayout className="col-span-2">
      <Line
        options={getOptions({ title: "Các nhiệm vụ mà team đã hoàn thàn" })}
        data={taskDoneByTeam}
      />
    </ChartLayout>
  );
};
const TaskReport = () => {
  return (
    <ChartLayout className="col-span-1">
      <Doughnut
        data={dataDoughnut}
        options={getOptions({
          title: "Các nhiệm vụ theo trạng thái",
        })}
      />
    </ChartLayout>
  );
};
const PriorityReport = () => {
  return (
    <ChartLayout className="col-span-1 ">
      <Doughnut
        data={dataDoughnutPriority}
        options={getOptions({ title: "Các nhiệm vụ theo độ ưu tiên" })}
      />
    </ChartLayout>
  );
};

const TaskDoneBaseOnDueDate = () => {
  return (
    <ChartLayout className="col-span-1">
      <Pie
        data={taskDoneByDueDate}
        options={getOptions({
          title: "Các nhiệm vụ hoàn thành theo thời gian",
        })}
      />
    </ChartLayout>
  );
};
const TaskDoneBaseOnPriority = () => {
  return (
    <ChartLayout className="col-span-1">
      <Pie
        data={taskDoneBaseOnPriority}
        options={getOptions({
          title: "Các nhiệm vụ đã hoàn thành theo độ ưu tiên",
        })}
      />
    </ChartLayout>
  );
};

const taskDoneLineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      // display: false,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Các nhiệm vụ đã hoàn thành trong tuần",
    },
  },
};
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const taskDoneByTeam = {
  labels,
  datasets: [
    {
      label: "High",
      data: labels.map(() => getRandomNumber(0, 100)),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Medium",
      data: labels.map(() => getRandomNumber(0, 100)),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Low",
      data: labels.map(() => getRandomNumber(0, 100)),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

//
export const dataDoughnut = {
  label: "Các nhiệm vụ theo trạng thái",
  labels: ["To Do", "In Progress", "Done"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
export const dataDoughnutPriority = {
  labels: ["High", "Medium", "Low"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(253, 224, 71, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(253, 224, 71, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
export const taskDoneByDueDate = {
  labels: ["early", "on time", "late"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(253, 224, 71, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(253, 224, 71, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
export const taskDoneBaseOnPriority = {
  labels: ["High", "Medium", "Low"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(253, 224, 71, 0.2)",
        "rgba(75, 192, 192, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(253, 224, 71, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

interface getOptionsProps {
  title: string;
}

const getOptions = ({ title }: getOptionsProps) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        // display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
};

const ChartLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`h-80 border-2 border-slate-300 rounded-xl p-3 flex items-center justify-center mb-6 ${className}`}
    >
      {children}
    </div>
  );
};
