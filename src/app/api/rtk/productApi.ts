import type {
  DeleteProductResponse,
  Product,
  ProductListResponse,
  ProductResponse,
} from "@/types/product";
import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, string | void>({
      query: (queryString = "") => `/mula/products${queryString}`,
      providesTags: [{ type: "Products", id: "LIST" }],
    }),

    getProduct: builder.query<Product, number | string>({
      query: (id) => `/mula/products/${id}`,
      transformResponse: (response: ProductResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    createProduct: builder.mutation<Product, FormData>({
      query: (data) => ({
        url: "/mula/products",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ProductResponse) => response.data,
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/mula/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ProductResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<DeleteProductResponse, number | string>({
      query: (id) => ({
        url: `/mula/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;