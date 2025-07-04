export interface Location{
    id: number,
    location: string;
    pms_countries_id: number;
    pms_cities_id: number;
    city_states_id: number;
    active: boolean;
    deleted: boolean;
    location_code: string;
    state_name: string;
    city_name: string;
    country_name: string;
}