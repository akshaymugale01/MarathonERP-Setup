import type { RouteObject } from "react-router-dom";
import MaterialList from "../pages/purchase/master/Material/MaterialList";
import MaterialTypeList from "../pages/purchase/material-type/MaterialType";

export const materialRoute: RouteObject[] = [
    {
        path: 'purchase/material',
        children: [
            {index: true, element: <MaterialList />}
        ]
    },
    {
        path: "purchase/material-types",
        children: [{ index: true, element: <MaterialTypeList /> }],
      },

]