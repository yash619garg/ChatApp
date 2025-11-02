import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { useLoginMutation, useSignupMutation } from "@/redux/api/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/redux/features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import Loader from "@/components/app/Loader";

// mui

import IconButton from "@mui/material/IconButton";
import { Box, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockPerson from "@mui/icons-material/LockPerson";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CreateIcon from "@mui/icons-material/Create";

const Auth = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // password handlers
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // console.log(userInfo);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup] = useSignupMutation();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // login handler
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log(response.data);
      dispatch(setCredentials({ ...response.data }));
      console.log(response.message);
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message || error.data.error);
    }
  };

  // sign up handler
  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== password2) {
        throw new Error("password not matched");
      }
      const response = await signup({ email, password }).unwrap();
      console.log(response.data);
      dispatch(setCredentials({ ...response.data }));
      console.log(response.message);
      toast.success(response.message);
    } catch (error) {
      console.log(error);

      toast.error(error.message || error.data.error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/private/chat");
    } else {
      setLoading(false);
    }
  }, [userInfo, navigate]);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-[100vw] h-[100vh] min-h-[100vh] bg-[#f8f8f8] flex justify-center items-center">
      <div className="absolute left-0 top-0 w-full h-[25%] max-sm:hidden bg-[#263238]"></div>
      <div className="w-[70%] absolute top-[15%] min-h-[80%] aspect-auto max-h-[600px] max-sm:top-0 max-lg:w-[80%] z-10 max-sm:w-full max-sm:h-[100vh] max-sm:max-h-[100vh] max-sm:rounded-none flex  justify-center rounded-xl bg-white items-center shadow-lg shadow-slate-300">
        <div className="w-[50%] object-contain flex justify-center items-center  max-[1050px]:hidden h-full relative">
          <img
            src="/auth8.png"
            className="absolute aspect-auto  w-[400px] h-[400px]"
            alt=""
          />
        </div>
        <div className="flex flex-col p-4 px-6 max-[400px]:p-3 h-full w-[50%] max-[1050px]:w-[70%] max-sm:w-[90%] items-center justify-center">
          <div className="">
            <HiMiniChatBubbleLeftRight className="text-[#263238] text-[60px] my-3" />
          </div>
          <div className="font-sans text-center text-2xl text-[#263238] font-semibold ">
            Welcome to AnonConvo
          </div>
          <Tabs defaultValue="Login" className="w-full mt-5">
            <TabsList className="w-full bg-transparent shadow-sm stroke-gray-50 ">
              <TabsTrigger
                defaultValue={true}
                className="w-[50%] bg-transparent rounded-none py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] text-[14px] data-[state=active]:text-[16px]  data-[state=active]:shadow-none data-[state=active]:font-semibold"
                value="Login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="w-[50%] bg-transparent  rounded-none py-2 data-[state=active]:border-b-2 data-[state=active]:border-[#263238] data-[state=active]:text-[#263238] data-[state=active]:text-[16px] text-[14px] data-[state=active]:shadow-none data-[state=active]:font-semibold  "
                value="Register"
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col w-full mt-5" value="Login">
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
                style={{ marginTop: "20px", width: "100%" }}
                variant="outlined"
              />
              <TextField
                value={password}
                type={showPassword ? "text" : "password"}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                style={{ marginTop: "30px", width: "100%" }}
                variant="outlined"
              />
              <Button
                className="bg-[#263238] mt-[20px] hover:bg-[#182023]"
                onClick={loginHandler}
              >
                Login
              </Button>
            </TabsContent>
            <TabsContent className="flex flex-col w-full mt-5" value="Register">
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
                style={{ marginTop: "20px", width: "100%" }}
                variant="outlined"
              />
              <TextField
                value={password}
                type={showPassword ? "text" : "password"}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                style={{ marginTop: "20px", width: "100%" }}
                variant="outlined"
              />
              <TextField
                value={password2}
                type={showPassword ? "text" : "password"}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPassword2(e.target.value)}
                label="Confirm Password"
                style={{ marginTop: "20px", width: "100%" }}
                variant="outlined"
              />

              <Button
                className="bg-[#263238] mt-[20px] hover:bg-[#182023]"
                onClick={signUpHandler}
              >
                Register
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
