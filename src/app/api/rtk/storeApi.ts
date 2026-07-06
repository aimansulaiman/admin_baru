import type {
  DeleteStoreResponse,
  Store,
  StoreListResponse,
  StoreResponse,
} from "@/types/store";
import { apiSlice } from "./apiSlice";

export const storeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<StoreListResponse, string | void>({
      query: (queryString = "") => `/mula/stores${queryString}`,
      providesTags: [{ type: "Stores", id: "LIST" }],
    }),

    getStore: builder.query<Store, number | string>({
      query: (id) => `/mula/stores/${id}`,
      transformResponse: (response: StoreResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Stores", id }],
    }),

    createStore: builder.mutation<Store, FormData>({
      query: (data) => ({
        url: "/mula/stores",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: StoreResponse) => response.data,
      invalidatesTags: [{ type: "Stores", id: "LIST" }],
    }),

    updateStore: builder.mutation<
      Store,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/mula/stores/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: StoreResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Stores", id },
        { type: "Stores", id: "LIST" },
      ],
    }),

    deleteStore: builder.mutation<DeleteStoreResponse, number | string>({
      query: (id) => ({
        url: `/mula/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Stores", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApi;