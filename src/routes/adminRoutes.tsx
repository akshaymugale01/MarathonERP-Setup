import type { RouteObject } from "react-router-dom";
import UserList from "../pages/admin/master/users/UserList";
import UserCreate from "../pages/admin/master/users/UserCreate";
// import UserEdit from "../pages/admin/master/users/UserEdit";
import NameTitleList from "../pages/admin/master/nameTitles/NameTitleList";
import Department from "../pages/admin/master/department/Department";
import Designation from "../pages/admin/master/designation/Designation";
import Division from "../pages/admin/master/division/Divisions";
import DevelopmentType from "../pages/admin/master/developmentType/Development";
import Band from "../pages/admin/master/band/Band";
import Branches from "../pages/admin/master/branch/Branch";
import GateNumber from "../pages/admin/template/gateNo/GateNo";
import IpConfigIndex from "../pages/admin/settings/ipConfiguration/IpConfigList";
import UserGroupsPage from "../pages/admin/master/UserGroupsPage";
import ApprovalMatrixPage from "../pages/admin/master/ApprovalMatrixPage";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin/users",
    children: [
      { index: true, element: <UserList /> },
      {
        path: "create",
        element: <UserCreate mode="create" isDisabled={false} />,
      },
      {
        path: ":id/edit",
        element: <UserCreate mode="edit" isDisabled={false} />,
      },
      {
        path: ":id/details",
        element: <UserCreate mode="details" isDisabled={true} />,
      },
    ],
  },
  {
    path: "admin/name-titles",
    children: [{ index: true, element: <NameTitleList /> }],
  },
  {
    path: "admin/department",
    children: [{ index: true, element: <Department /> }],
  },
  {
    path: "admin/designation",
    children: [{ index: true, element: <Designation /> }],
  },
  {
    path: "admin/division",
    children: [{ index: true, element: <Division /> }],
  },
  {
    path: "admin/dev-type",
    children: [{ index: true, element: <DevelopmentType /> }],
  },
  {
    path: "admin/band",
    children: [{ index: true, element: <Band /> }],
  },
   {
    path: "admin/branch",
    children: [{ index: true, element: <Branches /> }],
  },
  {
    path: "admin/user-groups",
    children: [{ index: true, element: <UserGroupsPage /> }],
  },
  {
    path: "admin/approval-matrix",
    children: [{ index: true, element: <ApprovalMatrixPage /> }],
  },
   {
    path: "admin/gate-number",
    children: [{ index: true, element: <GateNumber /> }],
  },
   {
    path: "admin/ip-configurations",
    children: [{ index: true, element: <IpConfigIndex /> }],
  },
];
