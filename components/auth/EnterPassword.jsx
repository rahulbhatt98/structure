import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Error from "../common/Error";
import Cookies from "js-cookie";
import { getServiceStepAsync, loginAsync } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import Link from "next/link"; 
import OneSignal from "react-onesignal";
import runOneSignal from "../../utilities/oneSignal";

const EnterPassword = (props) => {
  const router = useRouter();
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const toastId = useRef(null);

  const schema = yup.object().shape({
    password: yup.string()
      .trim().required("Please enter password"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordVal = watch("password");

  const onSave = async (data) => {
    let params = {
      ...props?.loginInfo,
      "password": passwordVal,
      "onesignalId": OneSignal?.User?.PushSubscription.id
    };
    setLoading(true);
    dispatch(loginAsync(params))
      .then(unwrapResult)
      .then((obj) => {
        setLoading(false);
        toast.success(obj?.data?.message);
        dispatch(getServiceStepAsync(obj?.data?.data[0]?.userDetails?.profile_completed_steps ? (Number(obj?.data?.data[0]?.userDetails?.profile_completed_steps)) : ""))
        Cookies.set("authToken", obj?.data?.data[0]?.token);
        if (obj?.data?.data[0]?.userDetails?.first_name) {
          router.push('/auth/SelectedProfile');
        } else {
          router.push('/auth/SelectedProfile');
        }
      })
      .catch((obj) => {
        setLoading(false);
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
      });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    runOneSignal();
  },[])

  return (
    <>
      <form className="" onSubmit={handleSubmit(onSave)}>
        <div className="relative">
          <label
            htmlFor="password" 
            className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700"
          >
            Password
          </label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password" 
            name="password" 
            maxLength={30}
            {...register("password")}
            className="mt-1 block w-full font-normal p-3 bg-[#FFFFFF] rounded-md blueBordermain placeholder:text-gray-500 shadow-sm outline-none text-sm"
            placeholder="Enter your password"
          />
          {passwordVal && (
            <span
              onClick={togglePasswordVisibility}
              className="text-[11px] absolute right-8 top-11 maingray uppercase cursor-pointer"
            >
              {passwordShown ? "Hide" : "Show"}
            </span>
          )}
        </div>
        {errors.password && <Error error={errors.password?.message} />}
        <div className="mt-3 text-center text-sm font-normal">
          <Link href="/auth/ForgetPassword" className="mainbluetext hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full mt-3 mainblue text-white font-semibold text-base p-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Sign in"}
        </button>
        <div className="flex justify-center">
          <div className="mt-6 flex w-28 justify-center items-center cursor-pointer" onClick={() => props?.setLoginType("")}>
            <Image
              src="/assets/backbtn.svg"
              alt="Back Button"
              className=""
              height="50"
              width="50"
            />
            <span className="maingray block text-sm font-normal mb-2">
              Go back
            </span>
          </div>
        </div>
      </form>
    </>
  );
};

export default EnterPassword;
