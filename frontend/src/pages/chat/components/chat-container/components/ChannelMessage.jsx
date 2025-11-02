import Loader from "@/components/app/Loader";
import { useGetMessagesQuery } from "@/redux/api/messageSlice";
import { setChatMessage } from "@/redux/features/contactSlice";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFile } from "react-icons/fa";
import { CiSaveDown1 } from "react-icons/ci";
import { IoMdDownload } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useGetChannelMessagesQuery } from "@/redux/api/channelSlice";
import { Avatar } from "@radix-ui/react-avatar";

const ChannelMessage = () => {
  const scrollRef = useRef();
  const { userInfo } = useSelector((state) => state.auth);
  console.log("new ", userInfo);

  const [imageUrl, setImageUrl] = useState(false);
  const [imageName, setImageName] = useState("");
  const [showImage, setShowImage] = useState(false);
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType, selectedChatMessages } =
    useSelector((state) => state.contact);

  const { data: messages, refetch } = useGetChannelMessagesQuery(
    selectedChatData?._id
  );
  console.log(messages);

  function isImage(fileName) {
    const imageRegex = /.*\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg)$/i;
    return imageRegex.test(fileName);
  }

  console.log(selectedChatMessages);

  useEffect(() => {
    refetch();
  }, [selectedChatData, selectedChatMessages]);

  const downloadHandler = async (url, name) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = blobUrl;
    aTag.setAttribute("download", name);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    if (messages) {
      dispatch(setChatMessage([...messages]));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((msg, index) => {
      const msgDate = moment(msg.createdAt).format("YYYY-MM-DD");
      const showDate = msgDate !== lastDate;
      lastDate = msgDate;
      return (
        <div key={index} className="flex flex-col w-full gap-3">
          {showDate && (
            <div className="flex justify-center text-first font-sans font-semibold text-center ">
              {moment(msgDate).format("LL")}
            </div>
          )}
          <div
            className={`flex w-full  ${
              msg.sender._id !== userInfo._id ? "justify-start" : "justify-end"
            }`}
          >
            {selectedChatType === "channel" && renderDmMessages(msg)}
          </div>
        </div>
      );
    });
  };
  const renderDmMessages = (message) => {
    return (
      <div className="flex gap-2">
        {message.sender._id !== userInfo._id && (
          <div className="flex  mt-3">
            <Avatar className="w-[30px] rounded-full border-2 border-first flex justify-center items-center cursor-pointer  relative aspect-square h-[30px] ">
              {message.sender.image ? (
                <AvatarImage
                  className="w-[30px] aspect-square h-[30px] object-cover "
                  src={message.sender?.image}
                />
              ) : (
                <>
                  <div className="w-[30px] bg-gray-100 h-[30px] text-[15px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                    {message.sender.email[0]}
                  </div>
                </>
              )}
            </Avatar>
          </div>
        )}
        <div
          className={`
        flex-col flex mt-2 text-left`}
        >
          {message.messageType === "text" && (
            <div
              className={`${
                message.sender._id !== userInfo._id
                  ? "justify-start bg-white text-first shadow-sm shadow-slate-300  "
                  : " bg-[#329af7]  justify-end text-white shadow-sm shadow-white w-fit"
              }  w-fit font-serif text-md px-3 py-1 max-w-[200px] flex flex-col flex-wrap rounded-md font-medium `}
            >
              {message.sender._id !== userInfo._id && (
                <div className="">
                  <span className="capitalize text-[12px] text-[#329af7] font-light font-sans line-clamp-none text-md ">
                    {message.sender.firstName}
                  </span>
                </div>
              )}
              {message.content}
            </div>
          )}
          {message.messageType === "file" && (
            <div
              className={`${
                message.sender._id !== userInfo._id
                  ? "justify-start bg-white text-first shadow-sm shadow-slate-300  "
                  : " bg-[#329af7]  justify-end text-white shadow-sm shadow-white w-fit"
              }  w-fit font-serif text-md px-1 py-1 flex flex-col flex-wrap rounded-md font-medium `}
            >
              {message.sender._id !== userInfo._id && (
                <div className="">
                  <span className="capitalize ml-3 text-[12px] text-[#329af7] font-light font-sans line-clamp-none text-md ">
                    {message.sender.firstName}
                  </span>
                </div>
              )}
              {isImage(message.fileUrl) ? (
                <div
                  onClick={() => {
                    setImageUrl(message.fileUrl);
                    setShowImage(true);
                    setImageName(message.fileName);
                  }}
                  className=""
                >
                  <img className="w-[200px]" src={message.fileUrl} alt="" />
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 px-3">
                  <FaFile className="text-[25px]" />
                  <span>
                    {message.fileName.length > 30
                      ? message.fileName.slice(0, 30) + "..."
                      : message.fileName}
                  </span>
                  <IoMdDownload
                    onClick={() =>
                      downloadHandler(message.fileUrl, message.fileName)
                    }
                    className="text-[25px] cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}
          <div
            className={`text-sm  mt-1 ${
              message.sender._id !== userInfo._id
                ? "justify-start"
                : "justify-end"
            } flex gap-3   `}
          >
            {moment(message.createdAt).format("LT")}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full overflow-y-auto p-5 no-scrollbar overflow-x-hidden h-[80vh] gap-2 flex flex-col ">
      {renderMessage()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="w-[100vw] fixed left-0 top-0 bg-black/95 aspect-square z-[1000] h-[100vh] ">
          <div className="h-[10vh] text-[30px] text-white w-full flex justify-end px-5 items-center gap-4 bg-black ">
            <div className="flex gap-3">
              <IoMdDownload
                onClick={() => downloadHandler(imageUrl, imageName)}
              />
              <RxCross2 onClick={() => setShowImage(false)} />
            </div>
          </div>
          <div className="w-full  h-[90vh] flex justify-center items-center ">
            <img
              className="w-fit  object-contain aspect-square h-[80vh]"
              src={imageUrl}
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelMessage;
