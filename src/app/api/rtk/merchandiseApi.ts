import type {
  CreateMerchandiseInput,
  DeleteMerchandiseResponse,
  Merchandise,
  MerchandiseListResponse,
  MerchandiseResponse,
  UpdateMerchandiseInput,
} from "@/types/merchandise";
import { apiSlice } from "./apiSlice";

export const merchandiseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerchandises: builder.query<MerchandiseListResponse, string | void>({
      query: (queryString = "") => `/mula/merchandises${queryString}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((merchandise) => ({
                type: "Merchandises" as const,
                id: merchandise.id,
              })),
              {
                type: "Merchandises" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Merchandises" as const,
                id: "LIST",
              },
            ],
    }),

    getMerchandise: builder.query<Merchandise, number>({
      query: (id) => `/mula/merchandises/${id}`,

      transformResponse: (response: MerchandiseResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Merchandises",
          id,
        },
      ],
    }),

    createMerchandise: builder.mutation<
      Merchandise,
      CreateMerchandiseInput
    >({
      query: (data) => ({
        url: "/mula/merchandises",
        method: "POST",
        body: {
          merchandise: data,
        },
      }),

      transformResponse: (response: MerchandiseResponse) => response.data,

      invalidatesTags: [
        {
          type: "Merchandises",
          id: "LIST",
        },
      ],
    }),

    updateMerchandise: builder.mutation<
      Merchandise,
      {
        id: number;
        data: UpdateMerchandiseInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/merchandises/${id}`,
        method: "PATCH",
        body: {
          merchandise: data,
        },
      }),

      transformResponse: (response: MerchandiseResponse) => response.data,

      invalidatesTags: (_result, _error, arg) => [
        {
          type: "Merchandises",
          id: arg.id,
        },
        {
          type: "Merchandises",
          id: "LIST",
        },
      ],
    }),

    deleteMerchandise: builder.mutation<
      DeleteMerchandiseResponse,
      number
    >({
      query: (id) => ({
        url: `/mula/merchandises/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Merchandises",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetMerchandisesQuery,
  useGetMerchandiseQuery,
  useCreateMerchandiseMutation,
  useUpdateMerchandiseMutation,
  useDeleteMerchandiseMutation,
} = merchandiseApi;