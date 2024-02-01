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

export interface ServiceProviderDetail {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    distanceCovered: string;
    perHourRate: number;
    isPublic: string;

}

export interface TenantProperty {
    name: string;
    streetAddress: string;
    owner: string;
}

export interface GeneralServiceType {
    count: number;
    id: string;
    serviceType: string;
}

export interface SpecificServiceType {
    id: string;
    parentId: string;
    serviceType: string;
}

export interface Timeline {
    id: string;
    title: string;
}

export interface PropertyDetail {
    name: string;
    cityName: string;
    countyName: string;
    stateName: string;
    propertyType: string;
    isPrimary: boolean;
    isTenantActive: boolean;
    streetAddress: string;
    zipcode: string;
    rent: number;
}

export interface Timeline {
    id: string;
    title: string;
}

export interface ServiceType {
    id: string;
    serviceType: string | null;
}

export interface Proposal {
    id: string;
    serviceRequestId: string;
    initiatorId: string;
    serviceProviderId: string;
}

export interface ServiceRequest {
    id: string;
    property: Property;
    timeline: Timeline;
    serviceType: ServiceType;
    proposals: Proposal | null;
}

export interface ServiceRequestSP {
    createdAt: String;
    id: string;
    status: String;
    timeline: {
      title: String;
    }
    initiator: {
      firstName: String;
      lastName: String;
      id: String;
    }
    property: {
      id: String;
      name: String;
      streetAddress: String
    };
    serviceRequest: {
      detail: String;
    }
    serviceType: {
      id: String;
      serviceType: String;
    }
}

export interface ServiceOffering {
    service: SpecificServiceType | undefined;
    timeline: Timeline | undefined;
    detail: string | undefined;
}

export interface DashboardServiceParent {
    serviceType: string;
    childs: DashboardServiceChild[];
}

export interface DashboardServiceChild {
    serviceType: string;
}

export interface ServiceProviderWrapper {
    serviceProvider: ServiceProvider[]
}

export interface ServiceProvider {
    email: string,
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    spDetail: SPDetail
}

export interface SPDetail {
    address: string,
    cityId: string,
    company: string,
    countyId: string,
    distanceCovered: number,
    id: string,
    isAppliedForPublic: boolean,
    isBGChecked: boolean,
    isPublic: boolean,
    latitude: number,
    longitude: number,
    perHourRate: number,
    stateId: string,
    userId: string,
    zipcodeId: string
}

export interface RequestDetails {
    createdAt: string,
    detail: string,
    id: string,
    isTicket: boolean,
    property: Property,
    proposalCount: number,
    serviceType: ServiceType,
    status: string,
    timeline: Timeline
}

export interface TenantinPropertyDetail {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;
