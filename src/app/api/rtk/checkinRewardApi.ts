import type {
  CheckinReward,
  CheckinRewardListResponse,
  CheckinRewardResponse,
  CreateCheckinRewardInput,
  DeleteCheckinRewardResponse,
  UpdateCheckinRewardInput,
} from "@/types/checkinReward";
import { apiSlice } from "./apiSlice";

export const checkinRewardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheckinRewards: builder.query<CheckinRewardListResponse, string | void>({
      query: (queryString = "") => `/mula/check-in-rewards${queryString}`,
      providesTags: [{ type: "CheckinRewards", id: "LIST" }],
    }),

    getCheckinReward: builder.query<CheckinReward, number | string>({
      query: (id) => `/mula/check-in-rewards/${id}`,
      transformResponse: (response: CheckinRewardResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "CheckinRewards", id }],
    }),

    createCheckinReward: builder.mutation<
      CheckinReward,
      CreateCheckinRewardInput
    >({
      query: (data) => ({
        url: "/mula/check-in-rewards",
        method: "POST",
        body: {
          checkin_reward: data,
        },
      }),
      transformResponse: (response: CheckinRewardResponse) => response.data,
      invalidatesTags: [{ type: "CheckinRewards", id: "LIST" }],
    }),

    updateCheckinReward: builder.mutation<
      CheckinReward,
      { id: number | string; data: UpdateCheckinRewardInput }
    >({
      query: ({ id, data }) => ({
        url: `/mula/check-in-rewards/${id}`,
        method: "PATCH",
        body: {
          checkin_reward: data,
        },
      }),
      transformResponse: (response: CheckinRewardResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CheckinRewards", id },
        { type: "CheckinRewards", id: "LIST" },
      ],
    }),

    deleteCheckinReward: builder.mutation<
      DeleteCheckinRewardResponse,
      number | string
    >({
      query: (id) => ({
        url: `/mula/check-in-rewards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CheckinRewards", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCheckinRewardsQuery,
  useGetCheckinRewardQuery,
  useCreateCheckinRewardMutation,
  useUpdateCheckinRewardMutation,
  useDeleteCheckinRewardMutation,
} = checkinRewardApi;