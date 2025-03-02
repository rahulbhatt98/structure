import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationPatterns } from "../../constants/constant";
import Error from "../../components/common/Error";
import { forgetThePassword } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { UseDispatch, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";

import CryptoJS from 'crypto-js';
import { getCurrentYear } from "../../utilities/helper";
const ForgetPassword = () => {
  const router = useRouter();
  const checkValue = "true";
  const [loading, setLoading] = useState(false);

  const toastId = React.useRef(null);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .required("Please enter email")
      .matches(validationPatterns.email, "Invalid Email"),
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

  const onSave = async (data) => {
    setLoading(true);
    dispatch(forgetThePassword(data))
      .then(unwrapResult)
      .then((obj) => {


        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
        setLoading(false);
        const param = data;
        const secretKey = 'aDS3WD343-23MDFASD';
        const jsonString = JSON.stringify(param);
        const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
        // router.push(`/auth/login?checkValue=${encrypted}`);
        // router.push(`/auth/login?checkValue=${encodeURIComponent(encrypted)}`);
        router.push(`/auth/login?checkValue=${encodeURIComponent(encrypted)}&source=forgetpassword`);
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setLoading(false);
      });

  };
  const goBack = () => {
    router.push("/auth/login");
  }

  return (
    <>
      <section className="authbg relative  flex items-center flex-col justify-center max-h-full h-screen">
        <div className='flex gap-1 xl:gap-3 items-center absolute right-1 mid:right-2 xl:right-8 top-1 mid:top-3 xl:top-6 xl:w-36 px-2 rounded-lg cursor-pointer h-8 xl:h-10  bg-white border border-[#1B75BC26] dropdown'>
          <Image
            src="/assets/english.svg"
            alt="Jobizz Logo"
            height="16"
            width="24"
            className="mx-auto"
          />
          <span>English</span>
          <Image
            src="/assets/arrowdown.svg"
            alt="Jobizz Logo"
            height="18"
            width="18"
            className="mx-auto"
          />
        </div>
        <div className="pinkshadow w-full  md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
          <div className="text-center mb-6">
            <Image
              src="/assets/logo.png"
              alt="Jobizz Logo"
              height="71"
              width="120"
              className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px] cursor-pointer"
              onClick={() => router.push('/')}
            />
            <h2 className="maxmid:text-xl  text-base font-bold mt-3 maxmid:mt-6">Forgot Password</h2>
          </div>
          <form className="" onSubmit={handleSubmit(onSave)}>
            <div className="">
              <label
                htmlFor="email"
                className="block text-sm pb-1 pl-1 font-normal text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                {...register("email")}
                className="mt-1 block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-md blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <Error error={errors.email?.message} />}
            <button
              type="submit"
              className="w-full mainblue text-white p-4 blueshadow shadow-lg mt-6 shadow-[#1B75BC] rounded-xl"
            >
              {loading ? <Spinner /> : " Continue"}
            </button>
            <div className="flex justify-center">
              <div className="mt-6 flex justify-center w-28 items-center cursor-pointer" onClick={goBack}>
                <Image
                  src="/assets/backbtn.svg"
                  alt="Google Icon"
                  className=""
                  height="50"
                  width="50"
                />
                <span className="maingray block text-sm font-normal cursor-pointer mb-2">
                  Go back
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
          © {getCurrentYear()} Jobizz, all rights reserved
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;
