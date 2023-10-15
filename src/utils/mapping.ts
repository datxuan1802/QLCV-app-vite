import moment from "moment";
import { EPriority, EStatus } from "./type";

// mapping when send to server
export const mapStatusTask = (status: string) => {
  switch (status) {
    case "todos":
      return EStatus.TODO;
    case "inProgress":
      return EStatus.IN_PROGRESS;
    case "done":
      return EStatus.DONE;
    default:
      return status;
  }
};

export const getBgPriorityColor = (priority: EPriority) => {
  switch (priority) {
    case EPriority.LOW:
      return "bg-green-500";
    case EPriority.MEDIUM:
      return "bg-yellow-500";
    case EPriority.HIGH:
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

export const getBgStatusTask = (status: EStatus) => {
  switch (status) {
    case EStatus.TODO:
      return "bg-blue-500";
    case EStatus.IN_PROGRESS:
      return "bg-yellow-500";
    case EStatus.DONE:
      return "bg-green-500";
    default:
      return "bg-red-500";
  }
};

export const getTimelineGroup = (task: any): ITimelineGroup => {
  return {
    id: task._id,
    title: task.name,
    height: 30,
  };
};

export const getTimeLineItem = (task: any): ITimelineItem => {
  return {
    id: task._id,
    group: task._id,
    title: task.name,
    canMove: true,
    canResize: true,
    start_time: moment(task.startDate).startOf("day"),
    end_time: moment(task.dueDate).endOf("day"),
    useResizeHandle: true,
  };
};
