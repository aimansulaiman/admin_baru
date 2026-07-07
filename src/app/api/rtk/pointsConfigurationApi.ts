import type {
  PointsConfiguration,
  PointsConfigurationResponse,
  UpdatePointsConfigurationInput,
} from "@/types/pointsConfiguration";
import { apiSlice } from "./apiSlice";

export const pointsConfigurationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPointsConfiguration: builder.query<
      PointsConfiguration,
      string | void
    >({
      query: (queryString = "") => `/mula/points-configuration${queryString}`,

      transformResponse: (response: PointsConfigurationResponse) =>
        response.data,

      providesTags: [
        {
          type: "PointsConfiguration",
          id: "CONFIG",
        },
      ],
    }),

    updatePointsConfiguration: builder.mutation<
      PointsConfiguration,
      UpdatePointsConfigurationInput
    >({
      query: (data) => ({
        url: "/mula/points-configuration",
        method: "PATCH",
        body: {
          loyalty_client: data,
        },
      }),

      transformResponse: (response: PointsConfigurationResponse) =>
        response.data,

      invalidatesTags: [
        {
          type: "PointsConfiguration",
          id: "CONFIG",
        },
        {
          type: "Statistics",
          id: "OVERVIEW",
        },
      ],
    }),
  }),
});

export const {
  useGetPointsConfigurationQuery,
  useUpdatePointsConfigurationMutation,
} = pointsConfigurationApi;