import { apiSlice } from "./apiSlice";
import { contactUrl } from "../constant";

const contactSlice = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        searchContact: builders.mutation({
            query: (data) => ({
                url: `${contactUrl}/searchContact`,
                body: data,
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),
        getDMContacts: builders.query({
            query: (id) => ({
                url: `${contactUrl}/getDMContacts/${id}`,
            }),
            providesTags: ["Contact"],
        }),
        getAllContacts: builders.query({
            query: () => ({
                url: `${contactUrl}/getAllContacts`,
            }),
            providesTags: ["Contact"],
        })
    })
})
export const { useSearchContactMutation, useGetDMContactsQuery, useGetAllContactsQuery } = contactSlice;