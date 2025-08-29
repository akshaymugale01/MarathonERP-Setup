import { RouteObject } from "react-router-dom";
import WorkOrderList from "../../home/Engineering/Work Order/WorkOrderList";
import WorkOrderCreate from "../../home/Engineering/Work Order/WorkOrderCreate";
import ServiceIndentList from "../../home/Engineering/Service Indent/ServiceIndentList";
import ServiceIndentForm from "../../home/Engineering/Service Indent/ServiceIndentForm";

export const engineeringRoutes: RouteObject[] = [
  {
    path: "engineering",
    children: [
      {
        path: "work-order",
        children: [
          { index: true, element: <WorkOrderList /> },
          { path: "create", element: <WorkOrderCreate /> },
          { path: ":id/edit", element: <WorkOrderCreate /> },
          { path: ":id/details", element: <WorkOrderCreate /> },
        ],
      },
      {
        path: "service-indent",
        children: [
          { index: true, element: <ServiceIndentList /> },
          { path: "create", element: <ServiceIndentForm /> },
          { path: ":id/edit", element: <ServiceIndentForm /> },
          { path: ":id/view", element: <ServiceIndentForm /> },
        ],
      },
    ],
  },
];
