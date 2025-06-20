import type { RouteObject } from "react-router-dom";
import UserList from "../pages/admin/master/users/UserList";
import UserCreate from "../pages/admin/master/users/UserCreate";
// import UserEdit from "../pages/admin/master/users/UserEdit";
import NameTitleList from "../pages/admin/master/nameTitles/NameTitleList";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin/users",
    children: [
      { index: true, element: <UserList /> },
      { path: "create", element: <UserCreate mode="create" isDisabled={false} /> },
      { path: ":id/edit", element: <UserCreate mode="edit" isDisabled={false} /> },
      { path: ":id/details", element: <UserCreate mode="details" isDisabled={true} /> },
    ],
  },
  {
    path: "admin/name-titles",
    children: [{ index: true, element: <NameTitleList /> }],
  },
];
