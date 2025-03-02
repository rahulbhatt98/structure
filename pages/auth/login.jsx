import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import LoginMain from "../../components/auth/loginMain";
import EnterPassword from "../../components/auth/EnterPassword";
import EnterOtp from "../../components/auth/EnterOtp";
import ChooseRole from "../../components/auth/ChooseRole";
import CheckEmailCard from "../../components/common/CheckEmailCard";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { verifyTheOtp } from "../../redux/auth/authSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import { getCurrentYear } from "../../utilities/helper";


const Login = () => {
  const router = useRouter();
  const toastId = React.useRef(null);
  const [email, setEmail] = useState("")
  const [loginType, setLoginType] = useState("")
  const [loginInfo, setLoginInfo] = useState("");
  const { checkValue, urlData, source, login } = router.query;
  const dispatch = useDispatch();

  // Function to decrypt data
  const decryptData = (ciphertext, key, flag) => {
    try {
      let dataDecode = (flag === "email") ? ciphertext : decodeURIComponent(ciphertext)
      // Decrypt using AES
      const bytes = CryptoJS.AES.decrypt(dataDecode, key);
      // Convert bytes to a UTF-8 string
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      // Parse the JSON string to an object
      const originalObject = JSON.parse(decryptedString);
      return originalObject;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  };

  useEffect(() => {
    if (checkValue) {
      setLoginType("checkEmail");

      let data = decryptData(checkValue, "aDS3WD343-23MDFASD", "email")

      setEmail(data)
    }
    if (urlData) {
      let data = decryptData(urlData, "aDS3WD343-23MDFASD", "verify")

      let params = {
        "email": data?.email,
        "otp": String(data?.otp)
      }
      dispatch(verifyTheOtp(params))
        .then(unwrapResult)
        .then((obj) => {
          Cookies.set("authToken", obj?.data?.data[0]?.token);
          // router.push('/auth/ProfileSetup')
          router.push('/auth/SelectedProfile')
          toast.success(obj?.data?.message);
        })
        .catch((obj) => {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.error(obj?.msg);
          }
        });
    }
  }, [checkValue, urlData]);

  return (
    <>
      <section className="authbg  relative  overflow-y-auto flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
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
          {
            loginType !== "checkEmail" && (
              <div className="text-center mb-4 md:mb-6">
                <Image
                  src="/assets/logo.svg"
                  alt="Jobizz Logo"
                  height="71"
                  width="120"
                  onClick={() => router.push('/')}
                  className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px] cursor-pointer"
                />
                <h2 className="maxmid:text-xl text-base font-bold mt-2 md:mt-4 maxmid:mt-5">{loginType === "email" ? 'Enter Password' : loginType === 'phone' ? `Enter the 6-digits code sent you at ${loginInfo?.phoneCode} ${loginInfo?.phoneNumber} ` : loginType === "login" ? "Sign in to your account" : "Sign in to your account"}</h2>
                {/* <h2 className="maxmid:text-xl text-base font-bold mt-2 maxmid:mt-5">{loginType === "email" ? 'Enter Password' : loginType === 'phone' ? `Enter the 6-digits code sent you at ${loginInfo?.phoneCode} ${loginInfo?.phoneNumber} `  : loginType === "login" ? "Sign in to your account" : "Choose Your Role"}</h2> */}
              </div>
            )
          }
          {loginType === "checkEmail" && <CheckEmailCard setLoginType={setLoginType} email={email} source={source} />}
          {/* {(!loginType && !login) && <ChooseRole setLoginType={setLoginType} />} */}
          {(!loginType && !login) && <LoginMain setLoginType={setLoginType} setLoginInfo={setLoginInfo} />}
          {(loginType === "login" || login) && <LoginMain setLoginType={setLoginType} setLoginInfo={setLoginInfo} />}
          {loginType === "email" && <EnterPassword setLoginType={setLoginType} loginInfo={loginInfo} />}
          {/* {loginType === "phone" && <EnterOtp setLoginType={setLoginType} loginInfo={loginInfo} />} */}
        </div>
        <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
          © {getCurrentYear()} Jobizz, all rights reserved
        </div>
      </section >
    </>
  );
};

export default Login;