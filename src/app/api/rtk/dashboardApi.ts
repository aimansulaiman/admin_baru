import type { DashboardSummary } from "@/types/dashboard";
import { apiSlice } from "./apiSlice";

type DashboardSummaryResponse = {
  success: boolean;
  data: DashboardSummary;
};

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => "/dashboard/summary",

      transformResponse: (response: DashboardSummaryResponse) => {
        return response.data;
      },

      providesTags: [
        {
          type: "Dashboard",
          id: "SUMMARY",
        },
      ],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;