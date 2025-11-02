import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCameraFill } from "react-icons/bs";
import { LuLoader } from "react-icons/lu";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useRemoveProfileMutation,
  useUpdateProfileMutation,
  useUploadProfileMutation,
} from "@/redux/api/userSlice";
import { MdAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "@/redux/features/authSlice";

import IconButton from "@mui/material/IconButton";
import { Box, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPerson from "@mui/icons-material/LockPerson";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CreateIcon from "@mui/icons-material/Create";

const Profile = () => {
  const [image, setImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [hover, setHover] = useState(false);
  const [uploadProfile] = useUploadProfileMutation();
  const [removeProfile] = useRemoveProfileMutation();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const fileInput = useRef(null);
  const dispatch = useDispatch();

  const { search } = useLocation();
  // console.log(search);
  const sp = new URLSearchParams(search);
  // console.log(sp);

  const redirect = sp.get("redirect") || false;
  // console.log(redirect);
  const navigate = useNavigate();

  const [updateProfile] = useUpdateProfileMutation();

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      if (!firstName || !lastName) {
        throw new Error("please provide all the inputs");
      }
      let response = null;
      if (!password) {
        response = await updateProfile({
          firstName,
          lastName,
          image,
          email,
        }).unwrap();
      } else {
        response = await updateProfile({
          firstName,
          lastName,
          image,
          email,
          password,
        }).unwrap();
      }
      dispatch(setCredentials(response.data));
      if (redirect) {
        navigate("/private/chat");
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error?.message || error?.data?.error);
    }
  };

  const handleFileInput = () => {
    fileInput.current.click();
  };

  const handleImageChange = async (e) => {
    setLoading(true);
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadProfile(formData).unwrap();
        setImage(response?.url);
        dispatch(setCredentials({ ...userInfo, image: response?.url }));
        setLoading(false);
      } else throw new Error("please provide image");
    } catch (error) {
      setLoading(false);
      toast.error(error?.message || error?.data?.error);
    }
  };
  const removeImage = async () => {
    try {
      const response = await removeProfile().unwrap();
      dispatch(setCredentials({ ...userInfo, image: null }));
      setImage(null);
      toast.success("image removed successfully");
    } catch (error) {
      toast.error(error?.message || error?.data?.error);
    }
  };

  const navigation = () => {
    if (userInfo?.profileSetup) {
      navigate("/private/chat");
    } else {
      toast.error("please set your profile first");
    }
  };

  useEffect(() => {
    setFirstName(userInfo?.firstName);
    setLastName(userInfo?.lastName);
    setImage(userInfo?.image);
    setEmail(userInfo?.email);
  }, []);
  return (
    <div className="w-[100vw] pb-5 min-h-[100vh] bg-[rgb(248,248,248)] flex justify-center items-center">
      <IoArrowBack
        onClick={navigation}
        className="absolute flex top-5 left-5 z-20 text-white text-2xl max-sm:text-[#263238]"
      />
      <div className="absolute left-0 top-0 w-full h-[25%] max-sm:hidden bg-[#263238]"></div>
      <div className="w-[70%] absolute min-h-[70%] top-[15%] aspect-auto  max-sm:top-0 max-lg:w-[80%] z-10 max-sm:w-full max-sm:h-[100vh] max-sm:max-h-[100vh] max-sm:rounded-none flex  justify-center rounded-xl bg-white items-center shadow-xl shadow-slate-300">
        <div className="w-[50%] object-contain flex justify-center items-center  max-[1024px]:hidden h-full relative">
          <img
            src="/auth9.png"
            className="absolute w-[500px] h-[500px]"
            alt=""
          />
        </div>
        <div className="flex flex-col py-3 px-6 max-[400px]:p-3 h-full w-[50%] max-[1024px]:w-[100%] max-sm:w-[100%] items-center justify-center">
          <div className="w-[100%] flex justify-center p-5 items-center ">
            <div className="w-[100%] z-30 flex flex-col max-sm:flex-col max-sm:gap-5 gap-5  justify-center items-center">
              <div
                className={`flex w-[50%] justify-center items-center ${
                  isLoading ? "cursor-wait" : "cursor-pointer"
                } `}
              >
                <Avatar
                  onMouseEnter={() => {
                    setHover(true);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  className="w-[150px] ml-8 relative aspect-square h-[150px] border-2 border-[#263238] "
                >
                  {image ? (
                    <AvatarImage
                      className="w-[150px] aspect-square h-[150px] object-cover "
                      src={image}
                    />
                  ) : (
                    <>
                      <div className="w-[150px] bg-gray-100 h-[150px] text-[90px] flex justify-center rounded-full items-center text-center text-[#263238] uppercase">
                        {userInfo.email[0]}
                      </div>
                    </>
                  )}
                  <Input
                    type="file"
                    ref={fileInput}
                    className="hidden"
                    onChange={handleImageChange}
                    // accept=".png , .jpg , .jpeg , .svg , .webp"
                    name="image"
                  />
                </Avatar>
                <button
                  disabled={isLoading}
                  onClick={image ? removeImage : handleFileInput}
                  className="relative z-50 top-10 right-10 rounded-full w-[50px] h-[50px] border-2 border-black  py-1 px-3  text-white bg-[#485861] flex justify-center items-center "
                >
                  {/* <MdDelete className=" cursor-pointer text-4xl text-white font-extrabold" /> */}
                  {isLoading ? (
                    <LuLoader className=" cursor-pointer text-3xl text-white font-extrabold" />
                  ) : (
                    <>
                      {image ? (
                        <MdDelete className=" cursor-pointer text-3xl text-white font-extrabold" />
                      ) : (
                        <BsFillCameraFill className=" cursor-pointer text-3xl text-white font-extrabold" />
                      )}
                    </>
                  )}{" "}
                </button>
              </div>
              <div className="w-[100%]  flex flex-col px-4">
                <Tabs defaultValue="Personal" className="w-full mt-5">
                  <TabsList className="w-full bg-transparent shadow-sm stroke-gray-50 ">
                    <TabsTrigger
                      defaultValue={true}
                      className="w-[50%] bg-transparent rounded-none py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] text-[14px] data-[state=active]:text-[16px]  data-[state=active]:shadow-none data-[state=active]:font-semibold"
                      value="Account"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-[50%] bg-transparent  rounded-none py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] data-[state=active]:text-[16px] text-[14px] data-[state=active]:shadow-none data-[state=active]:font-semibold  "
                      value="Personal"
                    >
                      Personal
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    className="flex flex-col w-full  mt-5"
                    value="Account"
                  >
                    <TextField
                      value={email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      label="Email"
                      style={{ marginTop: "30px", width: "100%" }}
                      variant="outlined"
                    />
                    <TextField
                      value={password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new Password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockPerson />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      style={{ marginTop: "30px", width: "100%" }}
                      variant="outlined"
                    />
                  </TabsContent>
                  <TabsContent
                    className="flex flex-col w-full mt-1 "
                    value="Personal"
                  >
                    {/* <Input
                      placeholder="First Name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="outline-none py-2 focus-visible:ring-0 focus-visible:border-[#263238] focus-visible:ring-offset-0 "
                    /> */}
                    <TextField
                      value={firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreateIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      label="First Name"
                      style={{ marginTop: "30px", width: "100%" }}
                      variant="outlined"
                    />
                    <TextField
                      value={lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreateIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      label="Last Name"
                      style={{ marginTop: "30px", width: "100%" }}
                      variant="outlined"
                    />
                    {/* <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      type="name"
                      className="outline-none py-2 focus-visible:ring-0 focus-visible:border-[#263238] focus-visible:ring-offset-0 "
                    /> */}
                  </TabsContent>
                </Tabs>
              </div>
              <Button
                className="bg-[#263238] mt-2 w-[90%] hover:bg-[#182023]"
                onClick={saveChanges}
              >
                save changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
