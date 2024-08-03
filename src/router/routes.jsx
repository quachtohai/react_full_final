import { lazy } from "react";

import { Navigate } from "react-router-dom";

const Logout = lazy(() => import("@/pages/Logout.jsx"));
const NotFound = lazy(() => import("@/pages/NotFound.jsx"));
const login = lazy(()=> import ("@/pages/Login.jsx"));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const GeneralPage = lazy(() => import('@/pages/GeneralPage'));
const GeneralPageCreate = lazy(() => import( "@/pages/GeneralPage/GeneralPageCreate"));
const GeneralPageUpdate = lazy(() => import( "@/pages/GeneralPage/GeneralPageUpdate"));
const Order = lazy(()=>import('@/pages/Order') )

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
      path: "/invoice",
      element: <Invoice  entity="invoice" />,
    },
    {
      path: '/',
      element: <Invoice entity="invoice" />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate entity="invoice" />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead  entity="invoice"/>,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate entity="invoice"/>,
    },
    {
      path: '/order',
      element: <Order />,
    },
    {
      path: '/userinfo',
      element: <GeneralPage entity="userinfo" />,
    },    
    {
      path: '/userinfo/create',
      element: <GeneralPageCreate entity = "userinfo" />,
    },
    {
      path: '/userinfo/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/userinfo/update/:id',
      element: <GeneralPageUpdate entity = "userinfo"/>,
    },
    {
      path: '/userinfomenu',
      element: <GeneralPage entity="userinfo"  detail = "userinfomenu"/>,
    },    
    {
      path: '/userinfomenu/create',
      element: <GeneralPageCreate entity = "userinfo" />,
    },
    {
      path: '/userinfomenu/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/userinfomenu/update/:id',
      element: <GeneralPageUpdate entity = "userinfo" detail = "userinfomenu" />,
    },
    {
      path: '/userinfoaction',
      element: <GeneralPage entity="userinfo"  detail = "userinfoaction"/>,
    },    
    {
      path: '/userinfoaction/create',
      element: <GeneralPageCreate entity = "userinfo" />,
    },
    {
      path: '/userinfoaction/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/userinfoaction/update/:id',
      element: <GeneralPageUpdate entity = "userinfo" detail = "userinfoaction" />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};
export default routes;