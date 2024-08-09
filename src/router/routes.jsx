import { lazy } from "react";

import { Navigate } from "react-router-dom";

const Logout = lazy(() => import("@/pages/Logout.jsx"));
const NotFound = lazy(() => import("@/pages/NotFound.jsx"));
const login = lazy(() => import("@/pages/Login.jsx"));
const GeneralPage = lazy(() => import('@/pages/GeneralPage'));
const GeneralPageCreate = lazy(() => import("@/pages/GeneralPage/GeneralPageCreate"));
const GeneralPageUpdate = lazy(() => import("@/pages/GeneralPage/GeneralPageUpdate"));
const GeneralPageRead = lazy(() => import("@/pages/GeneralPage/GeneralPageRead"));
const GeneralMasterPage = lazy(() => import("@/pages/GeneralMasterPage"));
const GeneralMultipleTabPage = lazy(() => import('@/pages/GeneralMultipleTabPage'))

let routes = {
  expense: [],
  default: [
    {
      path: "/login",
      element: <Navigate to="/" />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    
    {
      path: '/',
      element: <GeneralMasterPage entity="companyinfo" />,
    },
    
    {
      path: '/order',
      element: <GeneralMultipleTabPage entity = "order" />,
    },
    {
      path: '/userinfo',
      element: <GeneralPage entity="userinfo" />,
    },
    {
      path: '/userinfo/create',
      element: <GeneralPageCreate entity="userinfo" />,
    },
    {
      path: '/userinfo/read/:id',
      element: <GeneralPageRead entity="userinfo" />,
    },
    {
      path: '/userinfo/update/:id',
      element: <GeneralPageUpdate entity="userinfo" />,
    },
    {
      path: '/userinfomenu',
      element: <GeneralPage entity="userinfo" detail="userinfomenu" />,
    },
    {
      path: '/userinfomenu/create',
      element: <GeneralPageCreate entity="userinfo" />,
    },
    {
      path: '/userinfomenu/read/:id',
      element: <GeneralPageRead entity="userinfo" detail="userinfomenu" />
    },
    {
      path: '/userinfomenu/update/:id',
      element: <GeneralPageUpdate entity="userinfo" detail="userinfomenu" />,
    },
    {
      path: '/userinfoaction',
      element: <GeneralPage entity="userinfo" detail="userinfoaction" />,
    },
    {
      path: '/userinfoaction/create',
      element: <GeneralPageCreate entity="userinfo" />,
    },
    {
      path: '/userinfoaction/read/:id',
      element: <GeneralPageRead entity="userinfo" detail="userinfoaction" />
    },
    {
      path: '/userinfoaction/update/:id',
      element: <GeneralPageUpdate entity="userinfo" detail="userinfoaction" />,
    },
    {
      path: '/company',
      element: <GeneralMasterPage entity ="companyinfo" />
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};
export default routes;