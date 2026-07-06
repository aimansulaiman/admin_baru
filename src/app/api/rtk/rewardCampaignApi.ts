import type {
  DeleteRewardCampaignResponse,
  RewardCampaign,
  RewardCampaignListResponse,
  RewardCampaignResponse,
} from "@/types/rewardCampaign";
import { apiSlice } from "./apiSlice";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
};

const getDomainName = () => {
  return process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME || "MULA";
};

export const rewardCampaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRewardCampaigns: builder.query<RewardCampaignListResponse, string | void>(
      {
        query: (queryString = "") => `/mula/reward-campaigns${queryString}`,
        providesTags: [{ type: "RewardCampaigns", id: "LIST" }],
      },
    ),

    getRewardCampaign: builder.query<RewardCampaign, number | string>({
      query: (id) => `/mula/reward-campaigns/${id}`,
      transformResponse: (response: RewardCampaignResponse) => response.data,
      providesTags: (_result, _error, id) => [
        { type: "RewardCampaigns", id },
      ],
    }),

    createRewardCampaign: builder.mutation<RewardCampaign, FormData>({
      queryFn: async (formData) => {
        try {
          const response = await fetch(
            `${getBaseUrl()}/mula/reward-campaigns`,
            {
              method: "POST",
              headers: {
                "X-Loyalty-Domain-Name": getDomainName(),
              },
              body: formData,
            },
          );

          const result: RewardCampaignResponse = await response.json();

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: result,
              } as any,
            };
          }

          return {
            data: result.data,
          };
        } catch (error: any) {
          return {
            error: {
              status: "FETCH_ERROR",
              data: {
                message: error?.message || "Failed to create reward campaign.",
              },
            } as any,
          };
        }
      },
      invalidatesTags: [{ type: "RewardCampaigns", id: "LIST" }],
    }),

    updateRewardCampaign: builder.mutation<
      RewardCampaign,
      { id: number | string; data: FormData }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const response = await fetch(
            `${getBaseUrl()}/mula/reward-campaigns/${id}`,
            {
              method: "PATCH",
              headers: {
                "X-Loyalty-Domain-Name": getDomainName(),
              },
              body: data,
            },
          );

          const result: RewardCampaignResponse = await response.json();

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: result,
              } as any,
            };
          }

          return {
            data: result.data,
          };
        } catch (error: any) {
          return {
            error: {
              status: "FETCH_ERROR",
              data: {
                message: error?.message || "Failed to update reward campaign.",
              },
            } as any,
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RewardCampaigns", id },
        { type: "RewardCampaigns", id: "LIST" },
      ],
    }),

    deleteRewardCampaign: builder.mutation<
      DeleteRewardCampaignResponse,
      number | string
    >({
      query: (id) => ({
        url: `/mula/reward-campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "RewardCampaigns", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRewardCampaignsQuery,
  useGetRewardCampaignQuery,
  useCreateRewardCampaignMutation,
  useUpdateRewardCampaignMutation,
  useDeleteRewardCampaignMutation,
} = rewardCampaignApi;