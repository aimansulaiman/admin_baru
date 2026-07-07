import type { AdminProfile, ProfileResponse } from "@/types/profile";
import { apiSlice } from "./apiSlice";

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<AdminProfile, string | void>({
      query: (queryString = "") => {
        return `/mula/profile${queryString}`;
      },

      transformResponse: (response: ProfileResponse) => {
        return response.data;
      },

      providesTags: [
        {
          type: "Profile",
          id: "CURRENT",
        },
      ],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;