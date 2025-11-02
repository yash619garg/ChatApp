import { HOST } from "@/redux/constant";
import { addMessage, setDMContacts } from "@/redux/features/contactSlice";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [otherChatMessage, setOtherChatMessages] = useState([]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userID: userInfo?._id },
      });

      socket.current.on("connect", () => {
        console.log("connected to socket server");
        console.log(socket);
      });

      const handleReceiverMessage = (message) => {
        const chatData = JSON.parse(localStorage.getItem("selectedChatData"));
        const chatType = JSON.parse(localStorage.getItem("selectedChatType"));
        if (
          chatType !== undefined &&
          (chatData?._id === message?.sender?._id ||
            chatData?._id === message?.recipient?._id)
        ) {

          dispatch(addMessage(message));
        } else {
          toast.info(`new message from ${message.sender.firstName} `);
          setOtherChatMessages([...otherChatMessage, message]);
        }
      };

      const handleReceiverChannelMessage = (message) => {
        const chatData = JSON.parse(localStorage.getItem("selectedChatData"));
        const chatType = JSON.parse(localStorage.getItem("selectedChatType"));
        if (chatType !== undefined && chatData?._id === message?.channelId) {
          dispatch(addMessage(message));
        } else {
          toast.info(`new message from ${message.sender.firstName} `);
        }
      };

      socket.current.on("receiveMessage", handleReceiverMessage);
      socket.current.on("receiveChannelMessage", handleReceiverChannelMessage);
      return () => {
        socket.current.disconnect();
        console.log("disconnected");
      };
    }
  }, [userInfo]);

  return (
    <socketContext.Provider
      value={{ socket, otherChatMessage }}
      // value={{ socket: socket.current, otherChatMessage }}
    >
      {children}
    </socketContext.Provider>
  );
};
