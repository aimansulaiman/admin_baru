import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

    prepareHeaders: (headers) => {
      const domainName = process.env.NEXT_PUBLIC_LOYALTY_DOMAIN_NAME;

      if (domainName) {
        headers.set("X-Loyalty-Domain-Name", domainName);
      }

      return headers;
    },
  }),

  keepUnusedDataFor: 300,

  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,

  tagTypes: [
    "Dashboard",
    "Users",
    "Customers",
    "Stores",
    "Products",
    "Orders",
    "Taxons",
    "SubTaxons",
    "RewardCampaigns",
    "Missions",
    "SubMissions",
    "Merchandises",
    "Statistics",
    "PointsConfiguration",
    "Banners",
    "CheckinRewards",
    "AdditionalSettings",
    "Whatsapp",
    "BugReports",
    "Profile",
    "StoreManagement",
    "Inventory"
  ],

  endpoints: () => ({}),
});