export interface Country {
    id: number,
    name: string,
    created_at: Date,
    country_code: string,
    region: string,
    isd_code: string,
    active: boolean,
    deleted: boolean
}