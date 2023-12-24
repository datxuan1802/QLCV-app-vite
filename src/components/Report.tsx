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
import { ReactNode, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/axios.service";
import { useParams } from "react-router";
import moment from "moment";

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
        <TaskInWeek />
        <PriorityReport />
        <TeamPerformance />
        <TaskDoneBaseOnDueDate />
        <TaskDoneBaseOnPriority />
        <TaskReport />
      </div>
    </MainLayout>
  );
};

const TaskInWeek = () => {
  return (
    <ChartLayout className="col-span-1">
      <div className="flex flex-col items-center">
        <div className="font-semibold text-base">Các nhiệm vụ</div>
        <div className="font-semibold text-base">cần hoàn thành trong tuần</div>
        <div className="font-bold text-[120px] text-blue-400">15</div>
      </div>
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
const TaskDoneLineChart = () => {
  const today = moment();
  const { boardId } = useParams();
  const labels = getDayOrder(today.format("ddd"));
  const [report, setReport] = useState<any>({});
  const dueDate = today.format("YYYY-MM-DD");
  const startDate = today.subtract(6, "days").format("YYYY-MM-DD");
  const { isLoading } = useQuery({
    queryKey: ["task-report-week"],
    queryFn: () => {
      return get(
        `report/personal?boardId=${boardId}&startDate=${startDate}&dueDate=${dueDate}&status=done`
      ).then((data) => {
        return data;
      });
    },
    onSuccess: (tasks) => {
      const result: any = {
        high: Array(7).fill(0),
        medium: Array(7).fill(0),
        low: Array(7).fill(0),
      };

      // Đếm số lượng task đã hoàn thành theo priority và ngày
      tasks.forEach((task: any) => {
        const taskDoneDate = task.doneAt.split("T")[0];
        const dayIndex = moment(taskDoneDate).diff(startDate, "days");
        if (dayIndex >= 0 && dayIndex < 7) {
          result[task.priority][dayIndex]++;
        }
      });

      setReport(result);
    },
  });

  const taskDoneByTeam = {
    labels,
    datasets: [
      {
        label: "High",
        // data: report?.high,
        data: [0, 1, 7, 6, 5, 3, 1],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Medium",
        // data: report?.medium,
        data: [2, 1, 6, 4, 2, 7, 5],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Low",
        data: [4, 6, 3, 1, 7, 5, 2],
        // data: report?.low,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };
  return (
    <ChartLayout className="col-span-2">
      {!isLoading && (
        <Bar options={taskDoneLineChartOptions} data={taskDoneByTeam} />
      )}
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
  const [report, setReport] = useState([0, 0, 0]);
  const { isLoading } = useQuery({
    queryKey: ["task-report"],
    queryFn: () => {
      return get("/report/personal").then((data) => {
        return data;
      });
    },
    onSuccess: (data) => {
      let ToDo = 0;
      let InProgress = 0;
      let Done = 0;

      // Loop through the tasks and count tasks for each priority
      for (const task of data) {
        switch (task.status) {
          case "todo":
            ToDo++;
            break;
          case "in-progress":
            InProgress++;
            break;
          case "done":
            Done++;
            break;
          // Add more cases for other priority levels if needed
        }
      }
      setReport([ToDo, InProgress, Done]);
    },
  });
  const dataDoughnut = {
    label: "Các nhiệm vụ theo trạng thái",
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "# counts",
        data: report,
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
  return (
    <ChartLayout className="col-span-1">
      {!isLoading && (
        <Doughnut
          data={dataDoughnut}
          options={getOptions({
            title: "Các nhiệm vụ theo trạng thái",
          })}
        />
      )}
    </ChartLayout>
  );
};
// TODO: thêm logic kiểm tra theo tuần
const PriorityReport = () => {
  const [report, setReport] = useState([0, 0, 0]);
  const { isLoading } = useQuery({
    queryKey: ["task-by-priority"],
    queryFn: () => {
      return get("/report/personal").then((data) => {
        return data;
      });
    },
    onSuccess: (data) => {
      let highPriorityCount = 0;
      let mediumPriorityCount = 0;
      let lowPriorityCount = 0;

      // Loop through the tasks and count tasks for each priority
      for (const task of data) {
        switch (task.priority) {
          case "high":
            highPriorityCount++;
            break;
          case "medium":
            mediumPriorityCount++;
            break;
          case "low":
            lowPriorityCount++;
            break;
          // Add more cases for other priority levels if needed
        }
      }
      setReport([highPriorityCount, mediumPriorityCount, lowPriorityCount]);
    },
  });
  const dataDoughnutPriority = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "# counts",
        data: report,
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
  return (
    <ChartLayout className="col-span-1 ">
      {!isLoading && (
        <Doughnut
          data={dataDoughnutPriority}
          options={getOptions({ title: "Các nhiệm vụ theo độ ưu tiên" })}
        />
      )}
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
  const { boardId } = useParams();
  const [report, setReport] = useState([0, 0, 0]);
  const { data, isLoading } = useQuery({
    queryKey: ["task-done-by-priority"],
    queryFn: () => {
      return get("/report/personal?boardId=" + boardId + "&status=done").then(
        (data) => {
          return data;
        }
      );
    },
    onSuccess: (data) => {
      let highPriorityCount = 0;
      let mediumPriorityCount = 0;
      let lowPriorityCount = 0;

      // Loop through the tasks and count tasks for each priority
      for (const task of data) {
        switch (task.priority) {
          case "high":
            highPriorityCount++;
            break;
          case "medium":
            mediumPriorityCount++;
            break;
          case "low":
            lowPriorityCount++;
            break;
          // Add more cases for other priority levels if needed
        }
      }
      setReport([highPriorityCount, mediumPriorityCount, lowPriorityCount]);
    },
  });
  const taskDoneBaseOnPriority = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "# counts",
        data: report,
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
  return (
    <ChartLayout className="col-span-1">
      {!isLoading && (
        <Pie
          data={taskDoneBaseOnPriority}
          options={getOptions({
            title: "Các nhiệm vụ đã hoàn thành theo độ ưu tiên",
          })}
        />
      )}
    </ChartLayout>
  );
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

export const taskDoneByDueDate = {
  labels: ["early", "on time", "late"],
  datasets: [
    {
      label: "# counts",
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

function getDayOrder(now: any) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Find the index of the input day
  const startIndex = daysOfWeek.indexOf(now);

  if (startIndex !== -1) {
    // Slice and rearrange the days array
    const output = [
      ...daysOfWeek.slice(startIndex + 1),
      ...daysOfWeek.slice(0, startIndex + 1),
    ];
    return output;
  }

  return daysOfWeek; // Default order if the input is not found
}
