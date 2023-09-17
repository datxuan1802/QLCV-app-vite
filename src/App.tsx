import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// pages
import { path } from "@/utils/path";
import { Home, Login } from "./pages";

// toast container
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: path.home,
    element: <Home />,
  },
  {
    path: path.login,
    element: <Login />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
