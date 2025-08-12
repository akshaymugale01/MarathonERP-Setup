import { RouteObject } from "react-router-dom";
import CompanyList from "../pages/general/master/CompanyMaster/CompanyList";
import ServiceBoqForm from "../pages/engineering/BOQ/ServiceBoqForm";
import BoqList from "../pages/engineering/BOQ/BoqList";

export const engineeringRoute: RouteObject[] = [
  {
    path: "engineering/service-boq",
    children: [
      // { index: true, element: <BoqList /> },
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
];
