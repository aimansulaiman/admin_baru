import type {
  Banner,
  BannerListResponse,
  BannerResponse,
  DeleteBannerResponse,
} from "@/types/banner";
import { apiSlice } from "./apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<BannerListResponse, string | void>({
      query: (queryString = "") => `/mula/banners${queryString}`,
      providesTags: [{ type: "Banners", id: "LIST" }],
    }),

    getBanner: builder.query<Banner, number | string>({
      query: (id) => `/mula/banners/${id}`,
      transformResponse: (response: BannerResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Banners", id }],
    }),

    createBanner: builder.mutation<Banner, FormData>({
      query: (data) => ({
        url: "/mula/banners",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: BannerResponse) => response.data,
      invalidatesTags: [{ type: "Banners", id: "LIST" }],
    }),

    updateBanner: builder.mutation<
      Banner,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/mula/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: BannerResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Banners", id },
        { type: "Banners", id: "LIST" },
      ],
    }),

    deleteBanner: builder.mutation<DeleteBannerResponse, number | string>({
      query: (id) => ({
        url: `/mula/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Banners", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;