import {
  setChatData,
  setChatMessage,
  setChatType,
} from "@/redux/features/contactSlice";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DMContact = ({ isChannel = false }) => {
  const dispatch = useDispatch();
  const { selectedChatData, DMContactsList: contacts } = useSelector(
    (state) => state.contact
  );
  const handleClick = (contact) => {
      dispatch(setChatType("contact"));
      dispatch(setChatData(contact));
    if (selectedChatData && selectedChatData._id != contact._id) {
      dispatch(setChatMessage([]));
    }
  };

  return (
    <div className="w-full">
      {contacts &&
        contacts.map((c) => {
          return (
            <div
              key={c._id}
              onClick={() => handleClick(c)}
              className="w-full hover:bg-first cursor-pointer flex items-center px-3 py-3 gap-3 border-b-[1px] border-first  bg-[#38424ff7] shadow-sm shadow-first"
            >
              <div className="">
                {!isChannel && (
                  <Avatar className="w-[40px] rounded-full flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] ">
                    {c.image ? (
                      <AvatarImage
                        className="w-[40px] rounded-full aspect-square h-[40px] object-cover "
                        src={c.image}
                      />
                    ) : (
                      <>
                        <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                          {c.email[0]}
                        </div>
                      </>
                    )}
                  </Avatar>
                )}
              </div>
              {!isChannel && (
                <div className="flex flex-col gap-0 ">
                  <span className=" capitalize font-sans text-white line-clamp-none text-md font-semibold">
                    {c?.firstName} {} {c?.lastName}
                  </span>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
export default DMContact;
