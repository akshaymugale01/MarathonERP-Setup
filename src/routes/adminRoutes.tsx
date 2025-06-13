import type { RouteObject } from "react-router-dom";
import UserList from "../pages/admin/master/users/UserList";
import UserCreate from "../pages/admin/master/users/UserCreate";
import UserEdit from "../pages/admin/master/users/UserEdit";

export const adminRoutes: RouteObject[] = [
    {
        path: 'admin/users',
        children: [
            {index: true, element: <UserList />},
            { path: 'create', element: <UserCreate />},
            { path: ':id/edit', element: <UserEdit /> }
        ]
    }
]