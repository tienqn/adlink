import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

import Loadable from "../layouts/full/shared/loadable/Loadable";

import AuthGuard from "./guard/AuthGuard";
import GuestGuard from "./guard/GuestGuard";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank/BlankLayout"))
);

/* ****Dashboard***** */
const Dashboard = Loadable(lazy(() => import("@/features/dashboard")));

/* ****Ad management***** */
/*        ****Creative*****      */
const Creatives = Loadable(
  lazy(() => import("@/features/ad-management/creatives"))
);
const CreateCreative = Loadable(
  lazy(() => import("@/features/ad-management/creatives/CreateCreative"))
);
const EditCreative = Loadable(
  lazy(() => import("@/features/ad-management/creatives/EditCreative"))
);
/*        ****Site*****      */
const Sites = Loadable(lazy(() => import("@/features/ad-management/sites")));
const CreateSite = Loadable(
  lazy(() => import("@/features/ad-management/sites/CreateSite"))
);
const EditSite = Loadable(
  lazy(() => import("@/features/ad-management/sites/EditSite"))
);

/*        ****Ad Units*****      */
const AdUnits = Loadable(
  lazy(() => import("@/features/ad-management/ad-units"))
);
const CreateAdUnit = Loadable(
  lazy(() => import("@/features/ad-management/ad-units/CreateAdUnit"))
);
const EditAdUnit = Loadable(
  lazy(() => import("@/features/ad-management/ad-units/EditAdUnit"))
);

/* ****User management***** */
/*        ****Users*****      */
const Users = Loadable(lazy(() => import("@/features/user-management/users")));
const CreateUser = Loadable(
    lazy(() => import("@/features/user-management/users/CreateUser"))
);
const EditUser = Loadable(
    lazy(() => import("@/features/user-management/users/EditUser"))
);
const RolesPermissions = Loadable(
  lazy(() => import("@/features/user-management/roles-permissions"))
);

// authentication
const Login = Loadable(lazy(() => import("@/features/auth/login")));
const Register = Loadable(lazy(() => import("@/features/auth/register")));
const ForgotPassword = Loadable(
  lazy(() => import("@/features/auth/forgot-password"))
);

// authentication
const Login2 = Loadable(
  lazy(() => import("../views/authentication/auth2/Login2"))
);
const Register2 = Loadable(
  lazy(() => import("../views/authentication/auth2/Register2"))
);
const ForgotPassword2 = Loadable(
  lazy(() => import("../views/authentication/auth2/ForgotPassword2"))
);
const TwoSteps = Loadable(
  lazy(() => import("../views/authentication/auth1/TwoSteps"))
);
const TwoSteps2 = Loadable(
  lazy(() => import("../views/authentication/auth2/TwoSteps2"))
);
const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Maintenance = Loadable(
  lazy(() => import("../views/authentication/Maintenance"))
);
/*        ****Student*****      */
const Students = Loadable(lazy(() => import("@/features/student-management/students")));
const CreateStudent = Loadable(
  lazy(() => import("@/features/student-management/students/CreateStudent"))
);
const EditStudent = Loadable(
  lazy(() => import("@/features/student-management/students/EditStudent"))
);

const Router = [
  {
    path: "/",
    // element: <FullLayout />,
    element: (
      <AuthGuard>
        <FullLayout />
      </AuthGuard>
    ),
    children: [
      // { path: '/', element: <Navigate to="/dashboards/modern" /> },
      { path: "/", element: <Navigate to="/dashboards" /> },

      // dashboard
      { path: "/dashboards", exact: true, element: <Dashboard /> },

      // creatives
      { path: "/ad-management/creatives", exact: true, element: <Creatives /> },
      {
        path: "/ad-management/creatives/add-new",
        exact: true,
        element: <CreateCreative />,
      },
      {
        path: "/ad-management/creatives/edit/:id",
        exact: true,
        element: <EditCreative />,
      },

      // sites
      { path: "/ad-management/sites", exact: true, element: <Sites /> },
      {
        path: "/ad-management/sites/add-new",
        exact: true,
        element: <CreateSite />,
      },
      {
        path: "/ad-management/sites/edit/:id",
        exact: true,
        element: <EditSite />,
      },

      // ad units
      { path: "/ad-management/ad-units", exact: true, element: <AdUnits /> },
      {
        path: "/ad-management/ad-units/add-new",
        exact: true,
        element: <CreateAdUnit />,
      },
      {
        path: "/ad-management/ad-units/edit/:id",
        exact: true,
        element: <EditAdUnit />,
      },

      // users
      { path: "/user-management/users", exact: true, element: <Users /> },
      {
        path: "/user-management/users/add-new",
        exact: true,
        element: <CreateUser />,
      },
      {
        path: "/user-management/users/edit/:id",
        exact: true,
        element: <EditUser />,
      },
      {
        path: "/user-management/role-permission",
        exact: true,
        element: <RolesPermissions />,
      },
      // students
      { path: "/student-management/students", exact: true, element: <Students /> },
      {
        path: "/student-management/students/add-new",
        exact: true,
        element: <CreateStudent />,
      },
      {
        path: "/student-management/students/edit/:id",
        exact: true,
        element: <EditStudent />,
      },

      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/",
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: "/auth/404", element: <Error /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/login2", element: <Login2 /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/register2", element: <Register2 /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },
      { path: "/auth/forgot-password2", element: <ForgotPassword2 /> },
      { path: "/auth/two-steps", element: <TwoSteps /> },
      { path: "/auth/two-steps2", element: <TwoSteps2 /> },
      { path: "/auth/maintenance", element: <Maintenance /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
