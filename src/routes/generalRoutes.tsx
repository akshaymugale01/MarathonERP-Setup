import type { RouteObject } from "react-router-dom";
import CountriesList from "../pages/general/master/CountriesList";
import StatesList from "../pages/general/master/States";
import Cities from "../pages/general/master/Cities";
import Locations from "../pages/general/master/Location";
import CompanyList from "../pages/general/master/CompanyMaster/CompanyList";
import CompanyCreate from "../pages/general/master/CompanyMaster/CompanyCreate";

export const generalRoute: RouteObject[] = [
  {
    path: "general/countries",
    children: [{ index: true, element: <CountriesList /> }],
  },
  {
    path: "general/states",
    children: [{ index: true, element: <StatesList /> }],
  },
  {
    path: "general/cities",
    children: [{ index: true, element: <Cities /> }],
  },
  {
    path: "general/locations",
    children: [{ index: true, element: <Locations /> }],
  },
  {
    path: "general/companies",
    children: [
      { index: true, element: <CompanyList /> },
      {
        path: "create",
        element: <CompanyCreate mode="create" />,
      },
      {
        path: ":id/edit",
        element: <CompanyCreate mode="edit" />,
      },
      {
        path: ":id/view",
        element: <CompanyCreate mode="view" />,
      },
    ],
  },
];
