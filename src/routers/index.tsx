import React from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import Index from "../pages/Index";
import BaseList from "../pages/BaseList";
import Generator from "../pages/Generator";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    children: [{
      path: "/",
      element: <BaseList />,
    }, {
      path: "/generator/:baseid",
      element: <Generator />,
    },]
  },
];

const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

export default AppRoutes;
