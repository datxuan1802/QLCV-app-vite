import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// pages
import { path } from "@/utils/path";
import {
  ActiveAcc,
  BoardPage,
  Home,
  Login,
  Register,
  Report,
  Settings,
  TaskDetailPage,
} from "./pages";

// toast container
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./route/PrivateRoute";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: path.home,
    element: <PrivateRoute component={<Home />} />,
  },
  // {
  //   path: path.workspace,
  //   element: <PrivateRoute component={<Workspace />} />,
  // },
  {
    path: path.board,
    element: <PrivateRoute component={<BoardPage />} />,
  },
  {
    path: path.report,
    element: <PrivateRoute component={<Report />} />,
  },
  {
    path: path.settings,
    element: <PrivateRoute component={<Settings />} />,
  },
  {
    path: path.task,
    element: <PrivateRoute component={<TaskDetailPage />} />,
  },
  {
    path: path.login,
    element: <Login />,
  },
  {
    path: path.register,
    element: <Register />,
  },
  {
    path: path.activeAccount,
    element: <ActiveAcc />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
