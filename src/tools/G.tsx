interface UserProfile {
    userId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    longitude?: number;
    latitude?: number;
    suburb?: string;
    state?: string;
    postCode?: string;
    isPublic?: true,
    day?: number;
    night?: number;
    available?: object[];
    dateRegistered?: string;
    bookmarks?: object[];
    accessToken?: string;
};

let UserProfile: UserProfile = {};

export default {
    UserProfile
};
