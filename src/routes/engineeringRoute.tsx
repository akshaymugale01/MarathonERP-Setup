import { RouteObject } from "react-router-dom";
import ServiceBoqForm from "../pages/engineering/BOQ/ServiceBoqForm";
import BoqList from "../pages/engineering/BOQ/BoqList";
import ServiceDescriptions from "../pages/engineering/ServiceDescription";
import ServiceActivity from "../pages/engineering/ServiceActivity";
import WorkCategoryMapping from "../pages/engineering/WorkCategoryMapping/WorkCategoryMapping";
import WorkCategoryMappingList from "../pages/engineering/WorkCategoryMapping/WorkCatMappingList";
import ServiceIndentList from "../home/Engineering/Service Indent/ServiceIndentList";
import ServiceIndentForm from "../home/Engineering/Service Indent/ServiceIndentForm";

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
  {
    path: "work-category-mapping",
    children: [{ index: true, element: <WorkCategoryMappingList /> },
      {
        path: 'create',
        element: <WorkCategoryMapping /> 
      }

    ],
  },
  {
    path: 'service-indent',
    children: [
      {
        index: true, element: <ServiceIndentList />
      },
      {
        path: 'create',
        element: <ServiceIndentForm />
      },
       {
        path: ':id/edit',
        element: <ServiceIndentForm />
      },
       {
        path: ':id/view',
        element: <ServiceIndentForm />
      }
    ],
  }
];
