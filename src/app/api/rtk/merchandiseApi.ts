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

    createMerchandise: builder.mutation<Merchandise, FormData>({
  query: (formData) => ({
    url: "/mula/merchandises",
    method: "POST",
    body: formData,
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
    formData: FormData;
  }
>({
  query: ({ id, formData }) => ({
    url: `/mula/merchandises/${id}`,
    method: "PATCH",
    body: formData,
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