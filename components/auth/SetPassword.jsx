import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationPatterns } from "../../constants/constant";
import Error from "../common/Error";
import { resetPasswordAsync, signupAsync } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { UseDispatch, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import CryptoJS from 'crypto-js';
import OneSignal from "react-onesignal";
import runOneSignal from "../../utilities/oneSignal";


const SetPassword = (props) => {
  const router = useRouter();
  const toastId = React.useRef(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [oneSignalId, setOneSignalId] = useState("")  
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  const dispatch = useDispatch();
  const [passwordShown, setPasswordShown] = useState(false);
  const [ConfirmpasswordShown, setConfirmpasswordShown] = useState(false);
  const checkValue = "true";


  const schema = yup.object().shape({
    password: yup
      .string()
      .trim().required("Please enter password")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        passwordRegex,
        "Password must contain at least one uppercase letter, one special character & one number"
      ),
    confirmpassword: yup
      .string()
      .required("Please enter confirm password")
      .test("passwords-match", "Passwords must match", function (value) {
        return value === this.parent.password;
      }),
  });


  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const passwordVal = watch("password");
  const comfirmpasswordVal = watch("confirmpassword");

  const signupFun = (data) => {
    let params = {
      ...props?.loginInfo,
      password: data.password,
      "onesignalId": OneSignal?.User?.PushSubscription.id
    }
    setIsLoading(true);
    dispatch(signupAsync(params))
      .then(unwrapResult)
      .then((obj) => {
        setIsLoading(false);
        if (params?.email) {
          const secretKey = 'aDS3WD343-23MDFASD';
          const data = { email: props?.loginInfo?.email };

          const jsonString = JSON.stringify(data);
          const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
          // router.push(`/auth/login?checkValue=${encrypted}`);
          router.push(`/auth/login?checkValue=${encodeURIComponent(encrypted)}`);
        }
        else {
          props?.setLoginType("phone")
        }
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  }

  const resetFun = (data) => {
    let params = {
      id: props?.userId,
      newPassword: data.password,
    }
    setIsLoading(true);
    dispatch(resetPasswordAsync(params))
      .then(unwrapResult)
      .then((obj) => {
        setIsLoading(false);
        router.push(`/auth/login`);
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  }

  const onSave = async (data) => {
    if (props?.fromForget) {
      resetFun(data)
    }
    else {
      signupFun(data)
    }
  };

  const goBack = () => {
    if (props.fromForget) {
      router.push("/auth/ForgetPassword")
    } else {
      props?.setLoginType("");
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePasswordVisibility2 = () => {
    setConfirmpasswordShown(!ConfirmpasswordShown)
  };

  useEffect(() => {
    if (OneSignal) {
      setOneSignalId(OneSignal?.User?.PushSubscription.id)
    }
  }, [OneSignal]);

  useEffect(() => {
    runOneSignal();
  },[])

  return (
    <>
      <form className="" onSubmit={handleSubmit(onSave)}>
        <div className="relative">
          <label
            htmlFor="email"
            className="block  text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700"
          >
            Password
          </label>
          <input
            type={passwordShown ? "text" : "password"}
            id="password"
            maxLength={30}
            placeholder="Enter Password"
            name="password"
            className="block w-full text-sm font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
            {...register("password")}
          />
          {passwordVal && (
            <span
              onClick={togglePasswordVisibility}
              className="text-[11px] absolute right-8  top-8  maxmid:top-10 maingray uppercase cursor-pointer"
            >
              {passwordShown ? "Hide" : "Show"}
            </span>
          )}
        </div>

        {errors.password && <Error error={errors.password?.message} />}
        <div className="relative mt-2 medmob:mt-4 maxmid:mt-4">
          <label
            htmlFor="confirmpassword"
            className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type={ConfirmpasswordShown ? "text" : "password"}
            placeholder="Confirm Password"
            id="password"
            name="confirmpassword"
            maxLength={30}
            className="block w-full text-sm font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
            {...register("confirmpassword")}
          />
          {comfirmpasswordVal && (
            <span
              onClick={togglePasswordVisibility2}
              className="text-[11px] absolute right-8 top-8  maxmid:top-10 maingray uppercase cursor-pointer"
            >
              {ConfirmpasswordShown ? "Hide" : "Show"}
            </span>
          )}
        </div>
        {errors.confirmpassword && (
          <Error error={errors.confirmpassword?.message} />
        )}

        <button
          disabled={IsLoading}
          type="submit"
          className="w-full font-bold mainblue text-white px-2 py-2 maxmid:p-4 blueshadow shadow-lg mt-6 shadow-[#1B75BC] rounded-xl"
        >
          {IsLoading ? <Spinner /> : "Sign up"}
        </button>
        <div className="flex justify-center">
          <div className="mt-6 flex w-28 justify-center items-center cursor-pointer" onClick={goBack}>
            <Image
              src="/assets/backbtn.svg"
              alt="Google Icon"
              className="maxmid:w-[50px] maxmid:h-[50px] w-[35px] h-[35px]"
              height="50"
              width="50"
            />
            <span className="maingray block text-sm font-normal cursor-pointer mb-2">
              Go back
            </span>
          </div>
        </div>
      </form>
    </>
  );
};

export default SetPassword;
