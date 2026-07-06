import type {
  StoreManagementOrder,
  StoreManagementOrdersResponse,
  StoreManagementSummary,
  StoreManagementSummaryResponse,
} from "@/types/storeManagement";
import { apiSlice } from "./apiSlice";

export const storeManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreManagementSummary: builder.query<
      StoreManagementSummary,
      string | void
    >({
      query: (queryString = "") => `/store-management/summary${queryString}`,

      transformResponse: (response: StoreManagementSummaryResponse) => {
        return response.data;
      },

      providesTags: [
        {
          type: "StoreManagement",
          id: "SUMMARY",
        },
      ],
    }),

    getStoreManagementOrders: builder.query<
      StoreManagementOrder[],
      string | void
    >({
      query: (queryString = "") => `/store-management/orders${queryString}`,

      transformResponse: (response: StoreManagementOrdersResponse) => {
        return response.data;
      },

      providesTags: [
        {
          type: "StoreManagement",
          id: "ORDERS",
        },
      ],
    }),
  }),
});

export const {
  useGetStoreManagementSummaryQuery,
  useGetStoreManagementOrdersQuery,
} = storeManagementApi;