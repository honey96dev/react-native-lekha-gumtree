interface UserProfile {
    userId?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    longitude?: number,
    latitude?: number,
    suburb?: string,
    state?: string,
    postCode?: string,
    isPublic?: boolean,
    day?: number,
    night?: number,
    available?: DayAvailability[],
    dateRegistered?: string,
    bookmarks?: object[],
    accessToken?: string,
};

export interface AddressType  {
    suburb?: string,
    state?: string,
    postCode?: string,
    longitude?: number,
    latitude?: number,
}

export interface DayAvailability {
    dayOfWeek: number,
    day: boolean,
    night: boolean,
};

export interface PostListItem {
    id?: string,
    title: string,
    description: string,
    isActive?: boolean,
    shiftTypeName?: string,
    shifyTypeId?: number,
    shiftDate?: string,
    priceModelId?: number,
    priceModelName?: string,
    suburb?: string,
    state?: string,
    postCode?: string,
    longitude?: number,
    latitude?: number,
    carTypeName?: string,
    carTypeId?: number,
    carMake?: string,
    carModel?: string,
    isPrestige?: boolean,
    deactivatedAt?: string,
    activatedAt?: string,
    price?: number,
    vendorNames?: string,
    views?: number,
    likesCount?: number,
    isBookmarked?: boolean,
    postedByName?: string,
    postedByUserId?: string,
    postedDate?: string,
}
// let UserProfile: UserProfile = {};

export interface GalleryItem {
    recentStore?: number,
    id?: string,
    title: string,
    description: string,
    shiftTypeName?: string,
    shifyTypeId?: number,
    shiftDate?: string,
    priceModelId?: number,
    priceModelName?: string,
    suburb?: string,
    state?: string,
    postCode?: string,
    longitude?: number,
    latitude?: number,
    carTypeName?: string,
    carTypeId?: number,
    carMake?: string,
    carModel?: string,
    isPrestige?: boolean,
    deactivatedAt?: string,
    activatedAt?: string,
    price?: number,
    vendorNames?: string,
    views?: number,
    likesCount?: number,
    isBookmarked?: boolean,
    postedByName?: string,
    postedByUserId?: string,
    postedDate?: string,
}

export default class G {
    static ListPageSize = 50;
    static ListItemCountLimit = 100;
    static UserProfile: UserProfile = {};
    static AppAuthConfig = {
        issuer: 'https://identity.lekha.com.au',
        clientId: 'lekha-mobile-app',
        redirectUrl: 'com.lekha.mobile:/callback',
        scopes: ['openid', 'profile', 'email', 'offline_access', 'test-mobile-api']

        // serviceConfiguration: {
        //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
        //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
        //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
        // }
    };
}

// export default {
//     UserProfile,
//     AppAuthConfig,
// };
