import type {
  SendWhatsappInput,
  SendWhatsappResponse,
  WhatsappResponse,
} from "@/types/whatsapp";
import { apiSlice } from "./apiSlice";

export const whatsappApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWhatsapp: builder.query<WhatsappResponse, string | void>({
      query: (queryString = "") => `/mula/whatsapp${queryString}`,
      providesTags: [{ type: "Whatsapp", id: "PAGE" }],
    }),

    sendWhatsappMessages: builder.mutation<
      SendWhatsappResponse,
      SendWhatsappInput
    >({
      query: (data) => ({
        url: "/mula/whatsapp/send-messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Whatsapp", id: "PAGE" }],
    }),
  }),
});

export const {
  useGetWhatsappQuery,
  useSendWhatsappMessagesMutation,
} = whatsappApi;