import { useGetUserQuery } from "@/redux/api/userSlice";
import { setCredentials } from "@/redux/features/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const UserRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (userInfo?.profileSetup && data?.user) {
      dispatch(setCredentials({ ...data.user }));
    }
  }, [data]);

  return userInfo ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default UserRoute;
