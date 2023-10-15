import React, { useState } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { get } from "@/services/axios.service";
import { getTimelineGroup, getTimeLineItem } from "@/utils/mapping";

export const TimelineLayout = () => {
  const { boardId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", boardId],
    queryFn: () => get(`task/findByBoardId/${boardId}`),
  });

  return (
    <div>
      {!isLoading && (
        <Timeline
          groups={data.map((task: any) => getTimelineGroup(task))}
          items={data.map((task: any) => getTimeLineItem(task))}
          defaultTimeStart={moment()}
          defaultTimeEnd={moment().endOf("month")}
          //   timeSteps={{ hour: 1, day: 1, month: 1 }}
          // visibleTimeStart={}
          // itemRenderer={(item) => (

          // )}
        />
      )}
    </div>
  );
};
