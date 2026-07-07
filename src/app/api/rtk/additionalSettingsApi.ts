import type {
  AdditionalSetting,
  AdditionalSettingResponse,
  UpdateAdditionalSettingInput,
} from "@/types/additionalSettings";
import { apiSlice } from "./apiSlice";

export const additionalSettingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdditionalSetting: builder.query<AdditionalSetting, string | void>({
      query: (queryString = "") => `/mula/additional-settings${queryString}`,

      transformResponse: (response: AdditionalSettingResponse) =>
        response.data,

      providesTags: [
        {
          type: "AdditionalSettings",
          id: "SETTING",
        },
      ],
    }),

    updateAdditionalSetting: builder.mutation<
      AdditionalSetting,
      UpdateAdditionalSettingInput
    >({
      query: (data) => ({
        url: "/mula/additional-settings",
        method: "PATCH",
        body: {
          additional_setting: data,
        },
      }),

      transformResponse: (response: AdditionalSettingResponse) =>
        response.data,

      invalidatesTags: [
        {
          type: "AdditionalSettings",
          id: "SETTING",
        },
      ],
    }),
  }),
});

export const {
  useGetAdditionalSettingQuery,
  useUpdateAdditionalSettingMutation,
} = additionalSettingApi;