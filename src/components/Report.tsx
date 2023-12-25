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
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/axios.service";
import { useParams } from "react-router";
import moment from "moment";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

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
  // const [startDate, setStartDate] = useState(dayjs().format("DD/MM/YYYY"));
  // const [dueDate, setDueDate] = useState(dayjs().format("DD/MM/YYYY"));

  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [dueDate, setDueDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [data, setData] = useState([]);

  const { boardId } = useParams();

  const getTimeFormat = (str: string) => {
    const parts = str.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const DoSetDate = (dates: any, dateStrings: any) => {
    setStartDate(getTimeFormat(dateStrings[0]));
    setDueDate(getTimeFormat(dateStrings[1]));
  };

  const { isLoading, refetch } = useQuery({
    queryKey: ["task-report-week"],
    queryFn: () => {
      return get(
        `/report/personal?boardId=${boardId}&startDate=${startDate}&dueDate=${dueDate}`
      ).then((data) => {
        return data;
      });
    },
    onSuccess: (tasks) => {
      setData(tasks);
    },
  });
  useEffect(() => {
    refetch();
  }, [startDate, dueDate]);

  return (
    <MainLayout>
      <BoardHeader />
      <RangePicker
        size="large"
        className="w-1/3 mt-6 mx-6"
        format="DD/MM/YYYY"
        defaultValue={[dayjs(), dayjs().add(5, "day")]}
        onChange={DoSetDate}
      />
      <div className="grid grid-cols-3 px-6 pt-6 space-x-3 min-h-screen">
        <TaskDoneLineChart
          data={data}
          startDate={startDate}
          dueDate={dueDate}
          isLoading={isLoading}
        />
        <TaskInWeek />
        <PriorityReport data={data} isLoading={isLoading} />
        <TeamPerformance startDate={startDate} dueDate={dueDate} />
        <TaskDoneBaseOnDueDate data={data} isLoading={isLoading} />
        <TaskLineChartWithPriority
          data={data}
          startDate={startDate}
          dueDate={dueDate}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  );
};

const TaskInWeek = () => {
  return (
    <ChartLayout className="col-span-1">
      <div className="flex flex-col items-center">
        <img src="/leadership.png" alt="" className="w-56 h-56" />
      </div>
    </ChartLayout>
  );
};

const TaskDoneLineChart = ({
  data,
  isLoading,
  startDate,
  dueDate,
}: {
  data: any;
  isLoading: boolean;
  startDate: string;
  dueDate: string;
}) => {
  const [report, setReport] = useState<any>({
    low: [0, 0, 0, 0, 0, 0, 0],
    medium: [0, 0, 0, 0, 0, 0, 0],
    high: [0, 0, 0, 0, 0, 0, 0],
  });
  useEffect(() => {
    const result: any = {
      high: Array(7).fill(0),
      medium: Array(7).fill(0),
      low: Array(7).fill(0),
    };
    const doneTasks = data.filter((task: any) => task.status === "done");
    // Đếm số lượng task đã hoàn thành theo priority và ngày
    doneTasks.forEach((task: any) => {
      const taskDoneDate = task.doneAt.split("T")[0];
      const dayIndex = moment(taskDoneDate).diff(startDate, "days");
      if (dayIndex >= 0 && dayIndex < 7) {
        result[task.priority][dayIndex]++;
      }
    });
    setReport(result);
  }, [data]);

  const taskDoneByDate = {
    labels: getDaysInRange(startDate, dueDate),
    datasets: [
      {
        label: "High",
        data: report?.high,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Medium",
        data: report?.medium,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Low",
        data: report?.low,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };
  return (
    <ChartLayout className="col-span-2">
      {!isLoading && (
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                // display: false,
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Tasks completed by priority",
              },
            },
          }}
          data={taskDoneByDate}
        />
      )}
    </ChartLayout>
  );
};

const TaskLineChartWithPriority = ({
  data,
  isLoading,
  startDate,
  dueDate,
}: {
  data: any;
  isLoading: boolean;
  startDate: string;
  dueDate: string;
}) => {
  const [report, setReport] = useState<any>({
    low: [0, 0, 0],
    medium: [0, 0, 0],
    high: [0, 0, 0],
  });
  useEffect(() => {
    const countStatusForPriorities = (
      tasks: any[]
    ): Record<string, number[]> => {
      const priorityStatusCounts: Record<string, Record<string, number>> = {
        low: { todo: 0, "in-progress": 0, done: 0 },
        medium: { todo: 0, "in-progress": 0, done: 0 },
        high: { todo: 0, "in-progress": 0, done: 0 },
      };

      tasks.forEach((task) => {
        const priority = task.priority;
        const status = task.status;

        if (priorityStatusCounts[priority]) {
          priorityStatusCounts[priority][status]++;
        }
      });

      const priorityStatusArray: Record<string, number[]> = {};

      Object.keys(priorityStatusCounts).forEach((priority) => {
        priorityStatusArray[priority] = Object.values(
          priorityStatusCounts[priority]
        );
      });

      return priorityStatusArray;
    };
    const statusCountsForLowPriority = countStatusForPriorities(data);
    setReport(statusCountsForLowPriority);
  }, [data]);

  const TasksByPriority = {
    labels: ["TODO", "IN PROGRESS", "DONE"],
    datasets: [
      {
        label: "Low",
        data: report?.low,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Medium",
        data: report?.medium,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "High",
        data: report?.high,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <ChartLayout className="col-span-2">
      {!isLoading && (
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                // display: false,
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Task by priority",
              },
            },
          }}
          data={TasksByPriority}
        />
      )}
    </ChartLayout>
  );
};

const TeamPerformance = ({
  startDate,
  dueDate,
}: {
  startDate: string;
  dueDate: string;
}) => {
  const { boardId } = useParams();
  const [labels, setLabels] = useState<string[]>([]);
  const [report, setReport] = useState<any>({});
  const { isLoading, refetch } = useQuery({
    queryKey: ["team-report"],
    queryFn: () => {
      return get(
        `/report/teams?board_id=${boardId}&startDate=${startDate}&dueDate=${dueDate}&status=done`
      ).then((data) => {
        return data;
      });
    },
    onSuccess: (tasks: any) => {
      //NOTE: give assign user
      const assignIdsEmails = tasks.reduce((emails: string, task: any) => {
        const users = task.assignIds.map((assignId: any) => ({
          email: assignId.email,
        }));
        return emails.concat(users);
      }, []);

      const uniqueEmails = assignIdsEmails.filter(
        (email: any, index: number, self: any) =>
          index === self.findIndex((e: any) => e.email === email.email)
      );
      setLabels(uniqueEmails.map((obj: any) => obj.email));
      // NOTE: group tasks by user.email
      const countEmailsByPriority = tasks.reduce((result: any, task: any) => {
        const { priority, assignIds } = task;

        assignIds.forEach(({ email }: { email: any }) => {
          if (!result[email]) {
            result[email] = { low: 0, medium: 0, high: 0 };
          }

          if (!result[email][priority]) {
            result[email][priority] = 0;
          }

          result[email][priority]++;
        });

        return result;
      }, {});

      // Tạo object mới với kết quả đếm số lượng email cho mỗi mức độ ưu tiên
      const countByPriority = {
        low: Object.values(countEmailsByPriority).map(
          (emailObj: any) => emailObj.low ?? 0
        ),
        medium: Object.values(countEmailsByPriority).map(
          (emailObj: any) => emailObj.medium ?? 0
        ),
        high: Object.values(countEmailsByPriority).map(
          (emailObj: any) => emailObj.high ?? 0
        ),
      };
      setReport(countByPriority);
    },
  });
  useEffect(() => {
    refetch();
  }, [startDate, dueDate]);
  const taskDoneByTeam = {
    labels,
    datasets: [
      {
        label: "Low",
        data: report.low,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Medium",
        data: report.medium,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "High",
        data: report.high,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <ChartLayout className="col-span-2">
      <Bar
        options={getOptions({ title: "Team performance" })}
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
const PriorityReport = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const [report, setReport] = useState([0, 0, 0]);
  useEffect(() => {
    let highPriorityCount = 0;
    let mediumPriorityCount = 0;
    let lowPriorityCount = 0;

    const doneTasks = data.filter((task: any) => task.status === "done");
    // Loop through the tasks and count tasks for each priority
    for (const task of doneTasks) {
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
  }, [data]);
  const dataDoughnutPriority = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "# counts",
        data: report,
        backgroundColor: [
          "rgba(255, 99, 132, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(75, 192, 192, 0.4)",
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
    <ChartLayout className="col-span-1 ">
      {!isLoading && (
        <Doughnut
          data={dataDoughnutPriority}
          options={getOptions({ title: "Tasks by priority" })}
        />
      )}
    </ChartLayout>
  );
};

const TaskDoneBaseOnDueDate = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const [report, setReport] = useState<any>([]);
  useEffect(() => {
    const doneTasks = data.filter((item: any) => item.status === "done");
    const counts = {
      soon: 0,
      onTime: 0,
      overDue: 0,
    } as any;
    doneTasks.forEach((task: any) => {
      counts[task.timeDone]++;
    });
    setReport(Object.values(counts));
  }, [data]);
  const taskDoneByDueDate = {
    labels: ["Early", "On time", "Late"],
    datasets: [
      {
        label: "# counts",
        data: report,
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgb(53, 162, 235,0.5)",
          "rgba(255, 99, 132, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgb(53, 162, 235,1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <ChartLayout className="col-span-1">
      <Pie
        data={taskDoneByDueDate}
        options={getOptions({
          title: "Tasks by done date",
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
function getDaysInRange(startDate: any, dueDate: any) {
  const start = new Date(startDate);
  const end = new Date(dueDate);
  const days = [];

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    days.push(`${day}/${month}`);
  }
  return days;
}
