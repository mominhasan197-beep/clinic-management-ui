export interface BookAppointmentRequest {
    patientName?: string;
    age: number;
    mobile?: string;
    email?: string;
    bloodGroup?: string;
    doctorId: number;
    locationId: number;
    appointmentDate?: string;
    appointmentTime?: string;
    remarks?: string;
}

export interface LoginRequest {
    username?: string;
    password?: string;
}

export interface Doctor {
    doctorId: number;
    name: string;
    qualifications: string;
    experience?: string;
    specializations?: string[];
    description?: string;
    image?: string;
    locations?: string[];
}

export interface Location {
    locationId: number;
    locationName: string;
    address?: string;
    availableHours?: string;
}

export interface TimeSlot {
    time: string;
    isAvailable: boolean;
}

export interface DashboardStats {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    // Legacy properties for backward compatibility
    totalPatients?: number;
    appointmentsToday?: number;
    totalAppointments?: number;
}
