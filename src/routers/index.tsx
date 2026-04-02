import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ErrorPage from "../pages/error-page";
import DashboardView from "../pages/dashboard/dashboardView";
import LoginView from "../pages/auth/Login";
import RegisterView from "../pages/auth/Register";
import ProfileView from "../pages/myProfile/Index";
import ChatView from "../pages/chat/ChatView";
import AuthLayout from "../layouts/AuthLayout";
import { useToken } from "../hooks/token";
import ListDeviceView from "../pages/devices/ListDeviceView";
import DetailDeviceView from "../pages/devices/DetailDeviceView";
import ListSchedulerView from "../pages/scheduler/ListSchedulerView";
import ListLoggerView from "../pages/logger/ListLoggerView";
import ListEmbeddingView from "../pages/embedding/ListEmbeddingView";
import ListAdminView from "../pages/admins/ListAdminsView";
import SettingsView from "../pages/setting/SettingsView";

export default function AppRouters() {
  const routers: { path: string; element: JSX.Element }[] = [];
  const authRouters: { path: string; element: JSX.Element }[] = [
    {
      path: "/",
      element: <LoginView />,
    },
    {
      path: "/login",
      element: <LoginView />,
    },
    {
      path: "/register",
      element: <RegisterView />,
    },
  ];

  const mainRouters: { path: string; element: JSX.Element }[] = [
    {
      path: "/",
      element: <DashboardView />,
    },

    {
      path: "/devices",
      element: <ListDeviceView />,
    },
    {
      path: "/devices/:deviceId",
      element: <DetailDeviceView />,
    },
    {
      path: "/scheduller",
      element: <ListSchedulerView />,
    },
    {
      path: "/logger",
      element: <ListLoggerView />,
    },
    {
      path: "/indexing",
      element: <ListEmbeddingView />,
    },

    {
      path: "/admin",
      element: <ListAdminView />,
    },

    //my profile routers
    {
      path: "/my-profile",
      element: <ProfileView />,
    },
    {
      path: "/my-profile/edit/:userId",
      element: <ProfileView />,
    },
    {
      path: "/settings",
      element: <SettingsView />,
    },
  ];

  const { getToken } = useToken();

  const isAuth = getToken();

  if (isAuth) {
    routers.push(...mainRouters);
  } else {
    routers.push(...authRouters);
  }

  const appRouters = createBrowserRouter([
    {
      path: "/",
      element: isAuth ? <AppLayout /> : <AuthLayout />,
      errorElement: <ErrorPage />,
      children: routers,
    },
    {
      path: "/chat",
      element: <ChatView />,
    },
  ]);

  return <RouterProvider router={appRouters} />;
}
