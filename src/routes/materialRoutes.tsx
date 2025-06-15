import type { RouteObject } from "react-router-dom";
import MaterialList from "../pages/purchase/master/MaterialList";

export const materialRoute: RouteObject[] = [
    {
        path: 'purchase/material',
        children: [
            {index: true, element: <MaterialList />}
        ]
    }
]