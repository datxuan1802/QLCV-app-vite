import React from "react";
import { MainLayout } from "@/components";
import { useParams } from "react-router";
const BoardPage = () => {
  const { boardId } = useParams();

  return (
    <MainLayout>
      <div>BoardPage: {boardId}</div>
    </MainLayout>
  );
};

export default BoardPage;
