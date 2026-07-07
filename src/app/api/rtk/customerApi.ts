import type {
  CreateCustomerInput,
  CustomerListResponse,
  CustomerRecord,
  CustomerResponse,
  DeleteCustomerResponse,
  UpdateCustomerInput,
} from "@/types/customer";
import { apiSlice } from "./apiSlice";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerListResponse, string | void>({
      query: (queryString = "") => {
        return `/mula/customers${queryString}`;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((customer) => ({
                type: "Customers" as const,
                id: customer.id,
              })),
              {
                type: "Customers" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Customers" as const,
                id: "LIST",
              },
            ],
    }),

    getCustomer: builder.query<CustomerRecord, number>({
      query: (id) => {
        return `/mula/customers/${id}`;
      },

      transformResponse: (response: CustomerResponse) => {
        return response.data;
      },

      providesTags: (_result, _error, id) => [
        {
          type: "Customers",
          id,
        },
      ],
    }),

    createCustomer: builder.mutation<CustomerRecord, CreateCustomerInput>({
      query: (data) => ({
        url: "/mula/customers",
        method: "POST",
        body: {
          customer: data,
        },
      }),

      transformResponse: (response: CustomerResponse) => {
        return response.data;
      },

      invalidatesTags: [
        {
          type: "Customers",
          id: "LIST",
        },
      ],
    }),

    updateCustomer: builder.mutation<
      CustomerRecord,
      {
        id: number;
        data: UpdateCustomerInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/customers/${id}`,
        method: "PATCH",
        body: {
          customer: data,
        },
      }),

      transformResponse: (response: CustomerResponse) => {
        return response.data;
      },

      invalidatesTags: (_result, _error, arg) => [
        {
          type: "Customers",
          id: arg.id,
        },
        {
          type: "Customers",
          id: "LIST",
        },
      ],
    }),

    deleteCustomer: builder.mutation<DeleteCustomerResponse, number>({
      query: (id) => ({
        url: `/mula/customers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Customers",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;