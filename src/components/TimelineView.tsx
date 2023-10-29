import React, { useState } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
import moment from "moment";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { get, patch } from "@/services/axios.service";
import {
  getBgStatusTask,
  getTimelineGroup,
  getTimeLineItem,
} from "@/utils/mapping";
import { Avatar } from "antd";
import { AvatarCus } from ".";
import { successToast } from "@/utils/toast";

interface TimelineLayoutProps {
  tasks: any;
  setTasks: React.Dispatch<any>;
}
export const TimelineLayout: React.FC<TimelineLayoutProps> = ({
  tasks,
  setTasks,
}) => {
  const { boardId } = useParams();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["groups", boardId],
  //   queryFn: () => get(`task/findByBoardId/${boardId}`),
  // });
  const [data, setData] = useState([
    ...tasks.todos,
    ...tasks.inProgress,
    ...tasks.done,
  ]);
  const queryClient = useQueryClient();
  const { mutate, error: err } = useMutation({
    mutationFn: async ({ taskId, data }: any) => {
      return await patch(`task/update/${taskId}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", boardId],
      });
      successToast("Cập nhật thành công");
    },
  });
  const DoItemMove = (itemId: any, dragTime: any, newGroupOrder: any) => {
    const item = data.find((task: any) => task._id === itemId);
    const startDate = moment(item.startDate);
    const dueDate = moment(item.dueDate);
    const duration = moment.duration(dueDate.diff(startDate));
    setData((pre) => {
      return pre.map((task: any) => {
        if (task._id === itemId) {
          return {
            ...task,
            startDate: moment(dragTime),
            dueDate: moment(dragTime).add(duration),
          };
        }
        return task;
      });
    });
    mutate({
      taskId: itemId,
      data: {
        startDate: moment(dragTime),
        dueDate: moment(dragTime).add(duration),
      },
    });
  };
  const DoItemResize = (itemId: any, time: any, edge: any) => {
    if (edge === "right") {
      setData((pre) => {
        return pre.map((task: any) => {
          if (task._id === itemId) {
            return {
              ...task,
              dueDate: moment(time),
            };
          }
          return task;
        });
      });
      mutate({
        taskId: itemId,
        data: {
          dueDate: moment(time),
        },
      });
    }
  };

  return (
    <div>
      {
        <Timeline
          itemRenderer={ItemRenderer}
          groups={data.map((task: any) => getTimelineGroup(task))}
          items={data.map((task: any) => getTimeLineItem(task))}
          defaultTimeStart={moment()}
          defaultTimeEnd={moment().endOf("month")}
          onItemMove={DoItemMove}
          onItemResize={DoItemResize}
          className="pt-16"
        >
          <TimelineHeaders className="fixed top-32 z-50">
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div
                    {...getRootProps()}
                    className="text-center font-semibold bg-blue-400 pt-5 text-base"
                  >
                    Tên nhiệm vụ
                  </div>
                );
              }}
            </SidebarHeader>
            {/* <SidebarHeader variant="right" headerData={{ someData: "extra" }}>
              {({ getRootProps, data }) => {
                return (
                  <div {...getRootProps()} className="bg-blue-400">
                    Right {data.someData}
                  </div>
                );
              }}
            </SidebarHeader> */}
            <DateHeader unit="primaryHeader" className="bg-blue-500" />
            <DateHeader />
          </TimelineHeaders>
        </Timeline>
      }
    </div>
  );
};

const ItemRenderer = ({
  item,
  timelineContext,
  itemContext,
  getItemProps,
  getResizeProps,
}: any) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const backgroundColor = itemContext.selected
    ? itemContext.dragging
      ? "bg-blue-400"
      : "bg-blue-300"
    : getBgStatusTask(item.status);
  const borderColor = itemContext.resizing
    ? "border-blue-400"
    : "border-blue-300";

  const borderSelectColor = itemContext.selected ? "border-r-8" : "border";
  return (
    <div
      {...getItemProps({
        style: {
          background: "rgba(255, 255, 255, 0.0)",
          border: "rgba(255, 255, 255, 0.0)",
          zIndex: 30,
        },
        onMouseDown: () => {},
      })}
    >
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
      <div
        className={`flex items-center flex-row  text-black font-semibold text-sm px-1 py-1 rounded-full space-x-1 ${backgroundColor} ${borderColor} ${borderSelectColor}`}
      >
        <Avatar.Group>
          {item?.assignIds.map((user: any) => (
            <AvatarCus user={user} key={user._id} />
          ))}
        </Avatar.Group>
        <div>{itemContext.title}</div>
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
    </div>
  );
};
