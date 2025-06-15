import type { RouteObject } from "react-router-dom";
import CountriesList from "../pages/general/master/Country/CountriesList";

export const generalRoute: RouteObject[] = [
    {
        path: 'general/countries',
        children: [
            {index: true, element: <CountriesList />}
        ]
    }
]