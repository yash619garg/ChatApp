import { React, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { IoIosPersonAdd } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";
import { MdPowerSettingsNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/redux/api/userSlice";
import { setCredentials } from "@/redux/features/authSlice";
import { toast } from "react-toastify";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NewDm from "./components/new-dm";
import { clearChat, setDMContacts } from "@/redux/features/contactSlice";
import DMContact from "./components/DMcontact";
import NewChannel from "./components/group";
import DMChannels from "./components/channelList.jsx";

const ContactContainer = ({ refetch, refetch2 }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [logout1] = useLogoutMutation();
  const [openNewContact, setOpenNewContact] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await logout1().unwrap();
      dispatch(setCredentials(null));
      dispatch(clearChat());
      navigate("/auth");
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || error.data.error);
    }
  };

  return (
    <>
      <div className="w-[30vw] max-md:w-[40vw] max-sm:w-[100vw] relative h-[100vh] bg-[#2c3641] border-r-2 border-first ">
        <div className="w-full  bg-[#222b36] px-3  h-[10vh] flex items-center justify-between ">
          <div className="flex gap-3 items-center">
            <div className="">
              <HiMiniChatBubbleLeftRight className="text-white text-[45px] max-lg:text-[35px]" />
            </div>
            <div className="font-sans text-center text-2xl max-lg:text-lg text-white font-semibold ">
              AnonConvo
            </div>
          </div>
        </div>
        <NewDm refetch={refetch} />
        <div className="w-full max-h-[40vh] overflow-y-auto no-scrollbar">
          <DMContact />
        </div>
        <NewChannel refetch={refetch2} />
        <div className="w-full max-h-[30vh] pb-[10vh] overflow-y-auto no-scrollbar">
          <DMChannels />
        </div>
        <div className="absolute px-3 left-0 flex items-center justify-between bottom-0 h-[10vh] w-full  bg-[#222b36]">
          <div className="flex  gap-3 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar
                    onClick={() => navigate("/private/profile")}
                    className="w-[40px] flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] "
                  >
                    {userInfo?.image ? (
                      <AvatarImage
                        className="w-[40px] aspect-square h-[50px] object-cover "
                        src={userInfo?.image}
                      />
                    ) : (
                      <>
                        <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                          {userInfo.email[0]}
                        </div>
                      </>
                    )}
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <MdPowerSettingsNew
                    onClick={logoutHandler}
                    className="text-white text-[40px]"
                  />{" "}
                </TooltipTrigger>
                <TooltipContent>
                  <p>logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className=" capitalize text-xl text-gray-400 tracking-wider font-sans font-semibold flex flex-col ">
            {userInfo?.firstName} {userInfo?.lastName}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactContainer;
