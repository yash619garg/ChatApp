import { apiSlice } from "./apiSlice";
import {messageUrl } from "../constant";

const messageSlice = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        getMessages: builders.query({
            query: (id) => ({
                url: `${messageUrl}/getMessage/${id}`,
            }),
            providesTags: ["Message"],
        }),
        sendFileMessage: builders.mutation({
            query: (data) => ({
                url: `${messageUrl}/sendFileMessage`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Message"],
        })
    })
})
export const { useGetMessagesQuery, useSendFileMessageMutation } = messageSlice;