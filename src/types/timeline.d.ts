interface ITimelineItem {
  id: string;
  group: string;
  title: string;
  canMove: boolean;
  canResize: boolean;
  //   canChangeGroup: true,
  start_time: any;
  end_time: any;
  useResizeHandle?: boolean;
  assignIds?: any[];
  status: any;
  itemProps?: any;
}
interface ITimelineGroup {
  id: string;
  title: string;
  rightTitle?: string;
  stackItems?: boolean;
  height: number;
}
