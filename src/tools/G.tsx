interface UserProfile {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    longitude?: number;
    latitude?: number;
    suburb?: string;
    state?: string;
    postCode?: string;
    isPublic?: boolean,
    day?: number;
    night?: number;
    available?: object[];
    dateRegistered?: string;
    bookmarks?: object[];
    accessToken?: string;
};

export interface AddressType  {
    suburb?: string;
    state?: string;
    postCode?: string;
    longitude?: number;
    latitude?: number;
}

// let UserProfile: UserProfile = {};

export default class G {
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
