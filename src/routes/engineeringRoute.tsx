import { RouteObject } from "react-router-dom";
import ServiceBoqForm from "../pages/engineering/BOQ/ServiceBoqForm";
import BoqList from "../pages/engineering/BOQ/BoqList";
import ServiceDescriptions from "../pages/engineering/ServiceDescription";
import ServiceActivity from "../pages/engineering/ServiceActivity";

export const engineeringRoute: RouteObject[] = [
  {
    path: "service-boq",
    children: [
      { index: true, element: <BoqList /> },
      {
        path: "create",
        element: <ServiceBoqForm mode="create" />,
      },
      {
        path: ":id/edit",
        element: <ServiceBoqForm mode="edit" />,
      },
      {
        path: ":id/view",
        element: <ServiceBoqForm mode="view" />,
      },
    ],
  },
  {
    path: "description",
    children: [{ index: true, element: <ServiceDescriptions /> }],
  },
  {
    path: "labour-activity",
    children: [{ index: true, element: <ServiceActivity /> }],
  },
];
