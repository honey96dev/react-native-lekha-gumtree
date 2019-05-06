/**
 * Created by Ranjeet on 23/3/18.
 */


export interface UserProfile {
  userId: string | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  suburb: string | null,
  state: string | null,
  postCode: string | null,
  longitude: number | null,
  latitude: number | null,
  phone: string | null,
  isPublic: boolean | null,
  available: DayAvailability[],
};

export type Bookmark = {
  listingId: string,
  userId: string,
}

export type State = {
  loading: boolean,
  isSaving: boolean,
  error: string | null,
  available: DayAvailability[],
  bookmarks: (Bookmark)[]
} & UserProfile;

export type UserLocation = {
  postCode: string | null,
  state: string | null,
  suburb: string | null,
  longitude: number,
  latitude: number,
};

export type DayAvailability = {
  dayOfWeek: number,
  day: boolean,
  night: boolean
};


