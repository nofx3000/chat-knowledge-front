import React from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import BaseList from "../pages/BaseList";
import BaseDetail from "../pages/BaseDetail";
import Dialogue from "../pages/Dialogue";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <BaseList />,
  },
  {
    path: "/base/:baseid",
    element: <BaseDetail />,
  },
  {
    path: "/dialogue/:baseid",
    element: <Dialogue />,
  },
];

const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

export default AppRoutes;
