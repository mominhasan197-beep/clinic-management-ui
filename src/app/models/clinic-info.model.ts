export interface Location {
    name: string;
    address: string;
    phone: string;
    hours: string;
}

export interface ClinicInfo {
    name: string;
    tagline: string;
    motto: string;
    locations: Location[];
    bookingUrl: string;
}
