import type { StatisticsResponse } from "@/types/statistics";
import { apiSlice } from "./apiSlice";

export const statisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<StatisticsResponse, string | void>({
      query: (queryString = "") => {
        return `/mula/statistics${queryString}`;
      },

      providesTags: [
        {
          type: "Statistics",
          id: "SUMMARY",
        },
      ],
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi;