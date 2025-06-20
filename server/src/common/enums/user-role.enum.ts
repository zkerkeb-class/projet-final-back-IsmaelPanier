export enum UserRole {
    User ='user',
    RESTAURANT = 'restaurant',
    ADMIN = 'admin',
}

export interface UserAddress {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface PartialUserAddress {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
}

