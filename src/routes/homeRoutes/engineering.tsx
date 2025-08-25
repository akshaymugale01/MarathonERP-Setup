import { RouteObject } from "react-router-dom";
import WorkOrderList from "../../home/Engineering/Work Order/WorkOrderList";
import WorkOrderCreate from "../../home/Engineering/Work Order/WorkOrderCreate";

export const engineeringRoutes: RouteObject[] = [
    {
        path: 'engineering',
        children: [
            {
                path: 'work-order',
                children: [
                    { index: true, element: <WorkOrderList /> },
                    { path: 'create', element: <WorkOrderCreate /> },
                    { path: ':id/edit', element: <WorkOrderCreate /> },
                    { path: ':id/details', element: <WorkOrderCreate /> }
                ]
            }
        ]
    }
]