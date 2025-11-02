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

import { Multiselect } from "multiselect-react-dropdown";

import {
  useGetAllContactsQuery,
  useSearchContactMutation,
} from "@/redux/api/contactApiSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearChat,
  setChatData,
  setChatMessage,
  setChatType,
} from "@/redux/features/contactSlice";
import { MdGroupAdd } from "react-icons/md";
import {
  useCreateChannelMutation,
  useGetChannelsQuery,
} from "@/redux/api/channelSlice";

const NewChannel = ({refetch}) => {
  const [openNewChannel, setOpenNewChannel] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const dispatch = useDispatch();

  console.log(selectedContacts);

  const { data: contacts } = useGetAllContactsQuery();
  const [createChannels] = useCreateChannelMutation();
  const { data: myChannels } = useGetChannelsQuery();

  useEffect(() => {
    if (contacts) {
      setAllContacts(contacts);
    }
  }, [contacts]);

  const createChannel = async () => {
    try {
      console.log(selectedContacts);
      const ids = selectedContacts.map((c) => c.value);
      const response = await createChannels({
        name: channelName,
        members: ids,
      }).unwrap();
    } catch (error) {
      toast.error(error?.message || error?.data?.error);
    }
    setChannelName("");
    setOpenNewChannel(false);
    setSelectedContacts([]);
  };

  return (
    <div className="w-full px-5 shadow-sm border-b-[2px] border-first shadow-first h-[60px] flex justify-between items-center gap-2 ">
      <div className="font-serif tracking-wider flex justify-between items-center  text-lg text-white  ">
        Channels
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MdGroupAdd
              onClick={() => setOpenNewChannel(true)}
              className="text-white text-[30px]"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-white z-20 p-2 rounded-md ">
            <p>Add new groups</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewChannel} onOpenChange={setOpenNewChannel}>
        <DialogContent className="w-full  px-0 bg-[#ecf1f5] ">
          <DialogHeader className="bg-[#ecf1f5] px-0 w-full flex justify-center items-center ">
            <DialogTitle className="text-xl text-[#4d555e] tracking-wider  font-sans capitalize">
              Create New Channel
            </DialogTitle>
            <DialogDescription className="w-[85%]  flex flex-col gap-3 justify-center items-center ">
              <Input
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Channel Name"
                className="w-full text-md mt-2 focus-visible:border-none focus-visible:shadow-none focus-visible:ring-offset-0 focus-visible:ring-0 "
              />
              <div className="w-full  text-md mt-2 focus-visible:border-none focus-visible:shadow-none focus-visible:ring-offset-0 focus-visible:ring-0 ">
                <Multiselect
                  options={allContacts}
                  onSelect={(e) => {
                    setSelectedContacts(e);
                    console.log(e);
                  }}
                  onRemove={(e) => setSelectedContacts(e)}
                  placeholder="Select contacts"
                  isObject={true}
                  displayValue="label"
                  className="no-scrollbar"
                />
              </div>
              <button
                onClick={createChannel}
                className="w-full my-2 bg-first text-white px-3 py-2 rounded-md hover:bg-slate-900 "
              >
                Create Channel
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewChannel;
