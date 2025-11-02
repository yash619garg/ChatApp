import { apiSlice } from "./apiSlice";


const channelSlice = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        createChannel: builders.mutation({
            query: (data) => ({
                url: "/api/channel/createChannel",
                body: data,
                method: "POST",
            }),
            invalidatesTags: ["Channel"],
        }),
        getChannels: builders.query({
            query: () => ({
                url: "/api/channel/getUserChannel",
            }),
            providesTags: ["Channel"],
        }),
        getChannelMessages: builders.query({
            query: (id) => ({
                url: `/api/channel/getChannelMessages/${id}`
            }),
            providesTags: ["Channel"],
        }),
    })
})

export const { useCreateChannelMutation, useGetChannelMessagesQuery, useGetChannelsQuery } = channelSlice