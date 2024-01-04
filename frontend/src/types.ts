export interface State {
    id: string;
    name: string;
    stateCode: string;
}

export interface City {
    cityId: string;
    name: string;
    countyId: string;
}

export interface Zip {
    code: string;
    zipId: string;
}

export interface PropertyType {
    propertyTypeId: string;
    name: string;
}

export interface User {
    email: string;
    token: string;
    refreshToken: string;
    id: string;
    phoneVerified: boolean;
    role: Role;
}

export interface Role {
    id: string;
    role: string;
}

export interface ServiceRequest {
    serviceTypeId: string;
    details: string;
    propertyName: string;
    timelineId: string;
    detail: string;
    startDate: string;
    endDate: string;
}

export interface PropertyJSON {
    countyId: string | undefined;
    cityId: string | undefined;
    stateId: string;
    zipcodeId: string | undefined;
    userId: string | undefined;
    propertyTypeId: string;
    ownerId: string | undefined;
    name: string;
    streetAddress: string;
    rent: string;
    isPrimary: boolean;
    canTenantInitiate: boolean;
    status: string;
    registrationFee: number;
}

export interface Property {
    id: string;
    name: string;
    streetAddress: string;
}

export interface TenantProperty {
    name: string;
    streetAddress: string;
    owner: string;
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;