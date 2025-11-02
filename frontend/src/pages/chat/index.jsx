import Loader from "@/components/app/Loader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChatContainer from "./components/chat-container";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import { useSocket } from "@/context/Socket";
import { useGetDMContactsQuery } from "@/redux/api/contactApiSlice";
import { setDMChannels, setDMContacts } from "@/redux/features/contactSlice";
import DMContact from "./components/contact-container/components/DMcontact";
import { useGetChannelsQuery } from "@/redux/api/channelSlice";

const Chat = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { otherChatMessage } = useSocket();
  // console.log(otherChatMessage);

  const { selectedChatType } = useSelector((state) => state.contact);
  const {
    data: contacts,
    isLoading,
    refetch,
  } = useGetDMContactsQuery(userInfo._id);

  const {
    data: channels,
    isLoading: isLoading2,
    refetch: refetch2,
  } = useGetChannelsQuery();

  useEffect(() => {
    refetch();
    refetch2();
  }, [otherChatMessage]);

  useEffect(() => {
    dispatch(setDMContacts(contacts));
    dispatch(setDMChannels(channels));
  }, [contacts, channels]);

  useEffect(() => {
    if (!userInfo.profileSetup) {
      navigate("/private/profile?redirect=true");
    } else {
      setLoading(false);
    }
  }, [userInfo, navigate]);
  return loading || isLoading || isLoading2 ? (
    <Loader />
  ) : (
    <div className="w-[100vw] flex h-[100vh] min-h-[100vh] ">
      <ContactContainer refetch={refetch} refetch2={refetch2} />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer refetch={refetch} refetch2={refetch2} />
      )}
    </div>
  );
};

export default Chat;
