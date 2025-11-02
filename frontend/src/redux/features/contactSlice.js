import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    DMContactsList: [],
    DMChannelsList: [],
}

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        setChatType: (state, action) => {
            state.selectedChatType = action.payload;
            localStorage.setItem("selectedChatType", JSON.stringify(action.payload));
            const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expiryTime", expiryTime);
        },
        setChatData: (state, action) => {
            state.selectedChatData = action.payload;
            localStorage.setItem("selectedChatData", JSON.stringify(action.payload));
            const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expiryTime", expiryTime);
        },
        setChatMessage: (state, action) => {
            state.selectedChatMessages = action.payload;
        },
        setDMContacts: (state, action) => {
            state.DMContactsList = action.payload;
        },
        setDMChannels: (state, action) => {
            state.DMChannelsList = action.payload;
        },
        clearChat: (state, action) => {
            state.selectedChatType = undefined;
            state.selectedChatData = undefined;
            state.selectedChatMessages = [];
        },
        addMessage: (state, action) => {
            const message = action.payload;
            state.selectedChatMessages = [...state.selectedChatMessages, { ...message, recipient: state.selectedChatType === "channel" ? message.recipient : message.recipient._id, sender: state.selectedChatType === "channel" ? message.sender : message.sender._id }]
        }
    }
})

export const { setChatData, setChatMessage, setDMContacts, setChatType, clearChat, addMessage, setDMChannels } = contactSlice.actions;
export default contactSlice.reducer;