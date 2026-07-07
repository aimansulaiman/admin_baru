import type {
  CreateSubTaxonInput,
  CreateTaxonInput,
  DeleteSubTaxonResponse,
  DeleteTaxonResponse,
  SubTaxon,
  SubTaxonListResponse,
  SubTaxonResponse,
  Taxon,
  TaxonListResponse,
  TaxonResponse,
  UpdateSubTaxonInput,
  UpdateTaxonInput,
} from "@/types/taxon";
import { apiSlice } from "./apiSlice";

export const taxonApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTaxons: builder.query<TaxonListResponse, string | void>({
      query: (queryString = "") => `/mula/taxons${queryString}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((taxon) => ({
                type: "Taxons" as const,
                id: taxon.id,
              })),
              {
                type: "Taxons" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Taxons" as const,
                id: "LIST",
              },
            ],
    }),

    getTaxon: builder.query<Taxon, number>({
      query: (id) => `/mula/taxons/${id}`,

      transformResponse: (response: TaxonResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Taxons",
          id,
        },
      ],
    }),

    createTaxon: builder.mutation<Taxon, CreateTaxonInput>({
      query: (data) => ({
        url: "/mula/taxons",
        method: "POST",
        body: {
          taxon: data,
        },
      }),

      transformResponse: (response: TaxonResponse) => response.data,

      invalidatesTags: [
        {
          type: "Taxons",
          id: "LIST",
        },
      ],
    }),

    updateTaxon: builder.mutation<
      Taxon,
      {
        id: number;
        data: UpdateTaxonInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/taxons/${id}`,
        method: "PATCH",
        body: {
          taxon: data,
        },
      }),

      transformResponse: (response: TaxonResponse) => response.data,

      invalidatesTags: (_result, _error, arg) => [
        {
          type: "Taxons",
          id: arg.id,
        },
        {
          type: "Taxons",
          id: "LIST",
        },
        {
          type: "SubTaxons",
          id: "LIST",
        },
      ],
    }),

    deleteTaxon: builder.mutation<DeleteTaxonResponse, number>({
      query: (id) => ({
        url: `/mula/taxons/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Taxons",
          id: "LIST",
        },
        {
          type: "SubTaxons",
          id: "LIST",
        },
      ],
    }),

    getSubTaxons: builder.query<SubTaxonListResponse, string | void>({
      query: (queryString = "") => `/mula/sub-taxons${queryString}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((subTaxon) => ({
                type: "SubTaxons" as const,
                id: subTaxon.id,
              })),
              {
                type: "SubTaxons" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "SubTaxons" as const,
                id: "LIST",
              },
            ],
    }),

    getSubTaxon: builder.query<SubTaxon, number>({
      query: (id) => `/mula/sub-taxons/${id}`,

      transformResponse: (response: SubTaxonResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "SubTaxons",
          id,
        },
      ],
    }),

    createSubTaxon: builder.mutation<SubTaxon, CreateSubTaxonInput>({
      query: (data) => ({
        url: "/mula/sub-taxons",
        method: "POST",
        body: {
          sub_taxon: data,
        },
      }),

      transformResponse: (response: SubTaxonResponse) => response.data,

      invalidatesTags: [
        {
          type: "SubTaxons",
          id: "LIST",
        },
        {
          type: "Taxons",
          id: "LIST",
        },
      ],
    }),

    updateSubTaxon: builder.mutation<
      SubTaxon,
      {
        id: number;
        data: UpdateSubTaxonInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/sub-taxons/${id}`,
        method: "PATCH",
        body: {
          sub_taxon: data,
        },
      }),

      transformResponse: (response: SubTaxonResponse) => response.data,

      invalidatesTags: (_result, _error, arg) => [
        {
          type: "SubTaxons",
          id: arg.id,
        },
        {
          type: "SubTaxons",
          id: "LIST",
        },
        {
          type: "Taxons",
          id: "LIST",
        },
      ],
    }),

    deleteSubTaxon: builder.mutation<DeleteSubTaxonResponse, number>({
      query: (id) => ({
        url: `/mula/sub-taxons/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "SubTaxons",
          id: "LIST",
        },
        {
          type: "Taxons",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetTaxonsQuery,
  useGetTaxonQuery,
  useCreateTaxonMutation,
  useUpdateTaxonMutation,
  useDeleteTaxonMutation,

  useGetSubTaxonsQuery,
  useGetSubTaxonQuery,
  useCreateSubTaxonMutation,
  useUpdateSubTaxonMutation,
  useDeleteSubTaxonMutation,
} = taxonApi;