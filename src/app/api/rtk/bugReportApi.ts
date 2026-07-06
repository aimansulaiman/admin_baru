import type {
  BugReport,
  BugReportFilters,
  BugReportListResponse,
  BugReportResponse,
  CreateBugReportInput,
  UpdateBugReportInput,
} from "@/types/bugReport";
import { apiSlice } from "./apiSlice";

export const bugReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBugReports: builder.query<BugReportListResponse, BugReportFilters | void>(
      {
        query: (filters) => {
          const params = new URLSearchParams();

          params.set(
            "domain_name",
            filters?.domainName ||
              process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME ||
              "MULA",
          );

          params.set("page", String(filters?.page || 1));
          params.set("per_page", String(filters?.perPage || 20));

          if (filters?.status) {
            params.set("status", filters.status);
          }

          if (filters?.priority) {
            params.set("priority", filters.priority);
          }

          if (filters?.category) {
            params.set("category", filters.category);
          }

          if (filters?.search) {
            params.set("search", filters.search);
          }

          return `/mula/bug-reports?${params.toString()}`;
        },

        providesTags: (result) =>
          result
            ? [
                ...result.data.map((bugReport) => ({
                  type: "BugReports" as const,
                  id: bugReport.id,
                })),
                {
                  type: "BugReports" as const,
                  id: "LIST",
                },
              ]
            : [
                {
                  type: "BugReports" as const,
                  id: "LIST",
                },
              ],
      },
    ),

    getBugReport: builder.query<BugReport, number | string>({
      query: (id) => `/mula/bug-reports/${id}`,

      transformResponse: (response: BugReportResponse) => response.data,

      providesTags: (_result, _error, id) => [
        {
          type: "BugReports",
          id,
        },
      ],
    }),

    createBugReport: builder.mutation<BugReport, CreateBugReportInput>({
      query: (data) => ({
        url: "/mula/bug-reports",
        method: "POST",
        body: {
          bug_report: data,
        },
      }),

      transformResponse: (response: BugReportResponse) => response.data,

      invalidatesTags: [
        {
          type: "BugReports",
          id: "LIST",
        },
      ],
    }),

    updateBugReport: builder.mutation<
      BugReport,
      {
        id: number | string;
        data: UpdateBugReportInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/mula/bug-reports/${id}`,
        method: "PATCH",
        body: {
          bug_report: data,
        },
      }),

      transformResponse: (response: BugReportResponse) => response.data,

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "BugReports",
          id,
        },
        {
          type: "BugReports",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetBugReportsQuery,
  useGetBugReportQuery,
  useCreateBugReportMutation,
  useUpdateBugReportMutation,
} = bugReportApi;