import { Input } from "@/components/ui/input";
import { AiOutlineLink } from "react-icons/ai";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { clearChat } from "@/redux/features/contactSlice";
import { useSocket } from "@/context/Socket";
import MessageContainer from "./components/MessageContainer";
import { useSendFileMessageMutation } from "@/redux/api/messageSlice";
import { toast } from "react-toastify";
import ChannelMessage from "./components/ChannelMessage";
// import { Receipt } from "lucide-react";

const ChatContainer = ({ refetch }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const emojiRef = useRef();
  const fileRef = useRef();
  const { socket } = useSocket();
  console.log(socket); // Socket2 {connected: false, recovered: undefined, receiveBuffer: Array(0), sendBuffer: Array(1), _queue: Array(0), …}

  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const dispatch = useDispatch();
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.contact
  );

  const [sendFileMessage] = useSendFileMessageMutation();

  useEffect(() => {
    const clickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [emojiRef]);

  const handleFileClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = async (e) => {
    console.log("file is uploading");
    try {
      const file = e.target.files[0];
      if (!file) {
        throw new Error("please upload a file");
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await sendFileMessage(formData);
      const url = response.data.url;
      const name = response.data.name;
      if (selectedChatType === "contact") {
        socket.current.emit("sendMessage", {
          sender: userInfo._id,
          recipient: selectedChatData._id,
          content: undefined,
          messageType: "file",
          fileUrl: url,
          fileName: name,
        });
      } else if (selectedChatType === "channel") {
        setMessage("");
        socket.current.emit("sendChannelMessage", {
          sender: userInfo._id,
          channel_id: selectedChatData._id,
          content: undefined,
          messageType: "file",
          fileUrl: url,
          fileName: name,
        });
      }
    } catch (error) {
      toast.error(error?.message || error?.data?.error);
    }
    refetch();
  };

  const sendMessageHandler = async () => {
    if (selectedChatType === "contact") {
      setMessage("");
      refetch();
      // refetch2();
      socket.current.emit("sendMessage", {
        sender: userInfo._id,
        recipient: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        fileName: undefined,
      });
    } else if (selectedChatType === "channel") {
      setMessage("");
      socket.current.emit("sendChannelMessage", {
        sender: userInfo._id,
        channel_id: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        fileName: undefined,
      });
    }
  };

  return (
    <div className="w-[70vw] max-md:w-[60vw] max-sm:w-[0vw] left-0 top-0 overflow-hidden bg-[#ecf1f5] relative  h-[100vh] ">
      <header className="border-b-2 bg-[#e1e7ed] items-center h-[10vh] flex justify-between px-5 ">
        <div className="flex items-center gap-3">
          <div className="">
            {selectedChatType === "contact" ? (
              <Avatar className="w-[40px] flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] ">
                {selectedChatData?.image ? (
                  <AvatarImage
                    className="w-[40px] aspect-square h-[50px] object-cover "
                    src={selectedChatData?.image}
                  />
                ) : (
                  <>
                    <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                      {selectedChatData.email[0]}
                    </div>
                  </>
                )}
              </Avatar>
            ) : (
              <Avatar className="w-[40px] flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] ">
                <>
                  <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                    #
                  </div>
                </>
              </Avatar>
            )}
          </div>
          {selectedChatType === "contact" && (
            <div className="flex flex-col gap-0 ">
              <span className=" capitalize font-sans line-clamp-none text-md font-semibold">
                {selectedChatData.firstName} {} {selectedChatData.lastName}
              </span>
              <span className=" tracking-wider">{selectedChatData.email}</span>
            </div>
          )}
          {selectedChatType === "channel" && (
            <div className="flex flex-col gap-0 ">
              <span className=" capitalize font-sans line-clamp-none text-md font-semibold">
                {selectedChatData.name}
              </span>
            </div>
          )}
        </div>
        <div className="">
          <MdClear
            className="text-2xl cursor-pointer"
            onClick={() => {
              dispatch(clearChat());
            }}
          />
        </div>
      </header>
      <div className="w-full">
        {selectedChatType === "channel" ? (
          <ChannelMessage />
        ) : (
          <MessageContainer />
        )}
      </div>
      <div className="flex absolute bg-[#ffffff] left-0 items-center justify-center bottom-0 w-full border-first h-[10vh] px-4 ">
        <button
          onClick={handleFileClick}
          className="w-[35px] h-[35px] mr-4  rounded-full text-[#5e6567] "
        >
          <AiOutlineLink className="text-[35px]" />
          <Input
            onChange={handleFileChange}
            type="file"
            className="hidden"
            name="file"
            ref={fileRef}
          />
        </button>
        <div className=" relative">
          <button className="w-[35px]  h-[35px]  rounded-full text-[#5e6567] ">
            <RiEmojiStickerLine
              onClick={() => setOpenEmoji(true)}
              className="text-[35px]"
            />
          </button>
          <div ref={emojiRef} className="absolute bottom-[80px]">
            <EmojiPicker
              open={openEmoji}
              onEmojiClick={handleAddEmoji}
              className=""
            />
          </div>
        </div>
        <div className="w-[80%] ml-2 flex items-center p-2 h-full  rounded-md ">
          <Input
            className="h-[90%] focus-visible:border-none focus-visible:shadow-none focus-visible:ring-offset-0 focus-visible:ring-0 w-[95%] text-xl border-none px-5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
        </div>
        <button
          onClick={() => {
            sendMessageHandler();
          }}
          className="w-[40px] flex justify-center items-center h-[40px] bg-first rounded-full text-white "
        >
          <IoIosSend className="text-[25px] text-center " />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
