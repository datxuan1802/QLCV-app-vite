import React from "react";
// components
import { MainLayout } from "@/components";
// hooks
import { useParams } from "react-router";
const Workspace = () => {
  const { workspaceId } = useParams();
  return <MainLayout>{workspaceId}</MainLayout>;
};

export default Workspace;
