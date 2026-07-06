import type {
  CreateUserInput,
  DeleteUserResponse,
  UpdateUserInput,
  User,
  UserListResponse,
  UserResponse,
  VerifyCreateUserUnlockInput,
  VerifyCreateUserUnlockResponse,
} from "@/types/user";
import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, string | void>({
      query: (queryString = "") => `/mula/user-records${queryString}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((user) => ({
                type: "Users" as const,
                id: user.id,
              })),
              {
                type: "Users" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Users" as const,
                id: "LIST",
              },
            ],
    }),

    getUser: builder.query<User, number | string>({
      query: (id) => `/mula/user-records/${id}`,

      transformResponse: (response: UserResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "Users",
          id,
        },
      ],
    }),

    verifyCreateUserUnlock: builder.mutation<
      VerifyCreateUserUnlockResponse,
      VerifyCreateUserUnlockInput
    >({
      query: (data) => ({
        url: "/mula/user-records/verify-create-unlock",
        method: "POST",
        body: data,
      }),
    }),

    createUser: builder.mutation<User, CreateUserInput>({
      query: (data) => ({
        url: "/mula/user-records",
        method: "POST",
        body: {
          user: data,
        },
      }),

      transformResponse: (response: UserResponse) => response.data,

      invalidatesTags: [
        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),

    updateUser: builder.mutation<
      User,
      {
        id: number | string;
        data: UpdateUserInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/user-records/${id}`,
        method: "PATCH",
        body: {
          user: data,
        },
      }),

      transformResponse: (response: UserResponse) => response.data,

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Users",
          id,
        },
        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number | string>({
      query: (id) => ({
        url: `/mula/user-records/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Users",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useVerifyCreateUserUnlockMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;