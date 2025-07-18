import type { RouteObject } from "react-router-dom";
import CountriesList from "../pages/general/master/CountriesList";
import StatesList from "../pages/general/master/States";
import Cities from "../pages/general/master/Cities";
import Locations from "../pages/general/master/Location";
import CompanyList from "../pages/general/master/CompanyMaster/CompanyList";
import CompanyCreate from "../pages/general/master/CompanyMaster/CompanyCreate";
import ProjectList from "../pages/general/master/Projects/ProjectList";
import SiteList from "../pages/general/master/SitesMaster/SiteList";
import WingsList from "../pages/general/master/Wings/WingsLIst";
import FloorList from "../pages/general/master/Floor/Floor";
import Organization from "../pages/general/master/Organization/OrganizationList";
import OrganizationForm from "../pages/general/master/Organization/OrganizationForm";

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
    path: "general/organizations",
    children: [
      { index: true, element: <Organization /> }, // list
      {
        path: "create",
        element: <OrganizationForm mode="create" />,
      },
      {
        path: ":id/edit",
        element: <OrganizationForm mode="edit" />,
      },
      {
        path: ":id/view",
        element: <OrganizationForm mode="view" />,
      },
    ],
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
  {
    path: "general/projects",
    children: [
      { index: true, element: <ProjectList /> },
      // {
      //   path: "create",
      //   element: <CompanyCreate mode="create" />,
      // },
      // {
      //   path: ":id/edit",
      //   element: <CompanyCreate mode="edit" />,
      // },
      // {
      //   path: ":id/view",
      //   element: <CompanyCreate mode="view" />,
      // },
    ],
  },
  {
    path: "general/pms-sites",
    children: [{ index: true, element: <SiteList /> }],
  },
  {
    path: "general/wings",
    children: [{ index: true, element: <WingsList /> }],
  },
  {
    path: "general/floors",
    children: [{ index: true, element: <FloorList /> }],
  },
];
