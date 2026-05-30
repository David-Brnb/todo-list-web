import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "@/routes/_root";
import AuthLayout from "@/routes/auth/layout";
import Login from "@/routes/auth/login";
import Signup from "@/routes/auth/signup";
import SignupGeneralInfo from "@/routes/auth/signup/general-info";
import SignupConfirm from "@/routes/auth/signup/confirm";
import AppLayout from "@/routes/app/layout";
import Home from "@/routes/app/home";
import Explore from "@/routes/app/explore";
import Account from "@/routes/app/account";
import TaskListDetail from "@/routes/app/tasklist/detail";
import TaskListAdd from "@/routes/app/tasklist/list-add";
import TaskListEdit from "@/routes/app/tasklist/list-edit";
import TaskAdd from "@/routes/app/tasklist/task-add";
import TaskEdit from "@/routes/app/tasklist/task-edit";
import NotFound from "@/routes/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Public (auth) routes — redirect to /home if already signed in.
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          {
            path: "signup",
            children: [
              { index: true, element: <Signup /> },
              { path: "general-info", element: <SignupGeneralInfo /> },
              { path: "confirm", element: <SignupConfirm /> },
            ],
          },
        ],
      },
      // Protected (app) routes — redirect to /login if not signed in.
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: "home", element: <Home /> },
          { path: "explore", element: <Explore /> },
          { path: "account", element: <Account /> },
          { path: "tasklist/add", element: <TaskListAdd /> },
          { path: "tasklist/:id", element: <TaskListDetail /> },
          { path: "tasklist/:id/edit", element: <TaskListEdit /> },
          { path: "tasklist/:id/task/add", element: <TaskAdd /> },
          {
            path: "tasklist/:id/task/:taskId/edit",
            element: <TaskEdit />,
          },
        ],
      },
      // Unknown paths → a dedicated 404 page (shown regardless of auth state).
      { path: "*", element: <NotFound /> },
    ],
  },
]);
