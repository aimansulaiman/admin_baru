import type {
  DeleteMissionResponse,
  Mission,
  MissionListResponse,
  MissionResponse,
} from "@/types/mission";
import { apiSlice } from "./apiSlice";

export const missionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMissions: builder.query<MissionListResponse, string | void>({
      query: (queryString = "") => `/mula/missions${queryString}`,
      providesTags: [{ type: "Missions", id: "LIST" }],
    }),

    getMission: builder.query<Mission, number | string>({
      query: (id) => `/mula/missions/${id}`,
      transformResponse: (response: MissionResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Missions", id }],
    }),

    createMission: builder.mutation<Mission, FormData>({
      query: (data) => ({
        url: "/mula/missions",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: MissionResponse) => response.data,
      invalidatesTags: [{ type: "Missions", id: "LIST" }],
    }),

    updateMission: builder.mutation<
      Mission,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/mula/missions/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: MissionResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Missions", id },
        { type: "Missions", id: "LIST" },
      ],
    }),

    deleteMission: builder.mutation<DeleteMissionResponse, number | string>({
      query: (id) => ({
        url: `/mula/missions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Missions", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMissionsQuery,
  useGetMissionQuery,
  useCreateMissionMutation,
  useUpdateMissionMutation,
  useDeleteMissionMutation,
} = missionApi;