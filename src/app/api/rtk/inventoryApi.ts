import type {
  CreateInventoryInput,
  DeleteInventoryResponse,
  InventoryListResponse,
  InventoryModifier,
  InventoryResponse,
  UpdateInventoryInput,
} from "@/types/inventory";
import { apiSlice } from "./apiSlice";

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductInventory: builder.query<InventoryListResponse, number | string>({
      query: (productId) => `/mula/products/${productId}/inventory`,
      providesTags: (_result, _error, productId) => [
        { type: "Inventory" as const, id: `PRODUCT-${productId}` },
      ],
    }),

    createProductInventory: builder.mutation<
      InventoryModifier,
      {
        productId: number | string;
        data: CreateInventoryInput;
      }
    >({
      query: ({ productId, data }) => ({
        url: `/mula/products/${productId}/inventory`,
        method: "POST",
        body: {
          inventory_modifier: data,
        },
      }),
      transformResponse: (response: InventoryResponse) => response.data,
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Inventory" as const, id: `PRODUCT-${productId}` },
      ],
    }),

    updateProductInventory: builder.mutation<
      InventoryModifier,
      {
        productId: number | string;
        inventoryId: number | string;
        data: UpdateInventoryInput;
      }
    >({
      query: ({ productId, inventoryId, data }) => ({
        url: `/mula/products/${productId}/inventory/${inventoryId}`,
        method: "PATCH",
        body: {
          inventory_modifier: data,
        },
      }),
      transformResponse: (response: InventoryResponse) => response.data,
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Inventory" as const, id: `PRODUCT-${productId}` },
      ],
    }),

    deleteProductInventory: builder.mutation<
      DeleteInventoryResponse,
      {
        productId: number | string;
        inventoryId: number | string;
      }
    >({
      query: ({ productId, inventoryId }) => ({
        url: `/mula/products/${productId}/inventory/${inventoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Inventory" as const, id: `PRODUCT-${productId}` },
      ],
    }),
  }),
});

export const {
  useGetProductInventoryQuery,
  useCreateProductInventoryMutation,
  useUpdateProductInventoryMutation,
  useDeleteProductInventoryMutation,
} = inventoryApi;