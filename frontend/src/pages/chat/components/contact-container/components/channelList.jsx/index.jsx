import {
  setChatData,
  setChatMessage,
  setChatType,
} from "@/redux/features/contactSlice";
import { Avatar } from "@radix-ui/react-avatar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DMChannels = () => {
  const dispatch = useDispatch();
  const { selectedChatData, DMChannelsList: channels } = useSelector(
    (state) => state.contact
  );
  const handleClick = (channel) => {
    dispatch(setChatType("channel"));
    dispatch(setChatData(channel));
    if (selectedChatData && selectedChatData._id != channel._id) {
      dispatch(setChatMessage([]));
    }
  };

  return (
    <div className="w-full">
      {channels &&
        channels.map((c) => {
          return (
            <div
              key={c._id}
              onClick={() => handleClick(c)}
              className="w-full hover:bg-first cursor-pointer flex items-center px-3 py-3 gap-3 border-b-[1px] border-first  bg-[#38424ff7] shadow-sm shadow-first"
            >
              <div className="">
                <Avatar className="w-[40px] rounded-full flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] ">
                  <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                    #
                  </div>
                </Avatar>
              </div>

              <div className="flex flex-col gap-0 ">
                <span className=" capitalize font-sans text-white line-clamp-none text-md font-semibold">
                  {c.name}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default DMChannels;
