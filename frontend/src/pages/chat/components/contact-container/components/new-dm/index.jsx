import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoIosPersonAdd } from "react-icons/io";
import { Input } from "@/components/ui/input";
import "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useSearchContactMutation } from "@/redux/api/contactApiSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearChat,
  setChatData,
  setChatMessage,
  setChatType,
} from "@/redux/features/contactSlice";

const NewDm = () => {
  const [openNewContact, setOpenNewContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContact] = useSearchContactMutation();
  const [contactList, setContactList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleContact = async () => {
      try {
        if (searchTerm) {
          const response = await searchContact({ searchTerm }).unwrap();
          setContactList(response);
        } else {
          setContactList([]);
        }
      } catch (error) {
        toast.error(error?.message || error?.data?.error);
      }
    };
    handleContact();
  }, [searchTerm]);

  const selectNewContact = (c) => {
    setOpenNewContact(false);
    setSearchTerm("");
    setContactList([]);
    dispatch(clearChat());
    dispatch(setChatData(c));
    dispatch(setChatType("contact"));
  };

  return (
    <div className="w-full px-5 shadow-sm border-b-[2px] border-first shadow-first h-[60px] flex justify-between items-center gap-2 ">
      <div className="font-serif tracking-wider flex justify-between items-center  text-lg text-white  ">
        Friends
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IoIosPersonAdd
              onClick={() => setOpenNewContact(true)}
              className="text-white text-[30px]"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-white z-20 p-2 rounded-md ">
            <p className="text-sm">Add new Friends</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContact} onOpenChange={setOpenNewContact}>
        <DialogContent className="w-full  px-0 bg-[#ecf1f5] ">
          <DialogHeader className="bg-[#ecf1f5] px-0 w-full flex justify-center items-center ">
            <DialogTitle className="text-xl text-[#4d555e] tracking-wider  font-sans capitalize">
              Search new contact{" "}
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="w-[85%] flex flex-col justify-center items-center ">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contact"
                className="w-full text-md focus-visible:border-none focus-visible:shadow-none focus-visible:ring-offset-0 focus-visible:ring-0 "
              />
              {contactList.length == 0 ? (
                <div className="w-[200px] max-sm:h-[50vh] flex flex-col gap-5 items-center h-[300px]">
                  <dotlottie-player
                    src="https://lottie.host/bffeda67-47f4-4507-bebb-85f84761f76d/usGhPHJwsT.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                  ></dotlottie-player>

                  <div className="text-xl font-sans font-semibold">
                    Search new{" "}
                    <span className="text-purple-500"> contact </span>
                  </div>
                </div>
              ) : (
                <ScrollArea className="w-full h-[200px] rounded-md mt-3 mb-2  ">
                  {contactList.map((c) => {
                    return (
                      <div
                        onClick={() => selectNewContact(c)}
                        className="flex cursor-pointer items-center p-2 gap-3 mt-1 shadow-sm shadow-slate-200 "
                        key={c._id}
                      >
                        <div className="">
                          <Avatar className="w-[40px] flex justify-center items-center cursor-pointer  relative aspect-square h-[40px] border-2 border-[#263238] ">
                            {c?.image ? (
                              <AvatarImage
                                className="w-[40px] aspect-square h-[50px] object-cover "
                                src={c?.image}
                              />
                            ) : (
                              <>
                                <div className="w-[40px] bg-gray-100 h-[40px] text-[25px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                                  {c.email[0]}
                                </div>
                              </>
                            )}
                          </Avatar>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className=" capitalize font-sans text-md font-semibold">
                            {c.firstName} {} {c.lastName}
                          </span>
                          <span className=" tracking-wider">{c.email}</span>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDm;
