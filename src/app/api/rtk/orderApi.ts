import type {
  DeleteOrderResponse,
  Order,
  OrderListResponse,
  OrderResponse,
  UpdateOrderInput,
} from "@/types/order";
import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, string | void>({
      query: (queryString = "") => `/mula/orders${queryString}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((order) => ({
                type: "Orders" as const,
                id: order.id,
              })),
              {
                type: "Orders" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Orders" as const,
                id: "LIST",
              },
            ],
    }),

    getOrder: builder.query<Order, number>({
      query: (id) => `/mula/orders/${id}`,

      transformResponse: (response: OrderResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Orders",
          id,
        },
      ],
    }),

    updateOrder: builder.mutation<
      Order,
      {
        id: number;
        data: UpdateOrderInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/orders/${id}`,
        method: "PATCH",
        body: {
          order: data,
        },
      }),

      transformResponse: (response: OrderResponse) => response.data,

      invalidatesTags: (_result, _error, arg) => [
        {
          type: "Orders",
          id: arg.id,
        },
        {
          type: "Orders",
          id: "LIST",
        },
      ],
    }),

    deleteOrder: builder.mutation<DeleteOrderResponse, number>({
      query: (id) => ({
        url: `/mula/orders/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Orders",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;