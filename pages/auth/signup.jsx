import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import SignUpForm from "../../components/auth/SignUpForm";
import OtpSignUp from "../../components/auth/OtpSignUp";
import SetPassword from "../../components/auth/SetPassword";
import CheckEmailCard from "../../components/common/CheckEmailCard";
import { getCurrentYear } from "../../utilities/helper";


const SignUp = () => {
  const router = useRouter();
  const [loginType, setLoginType] = useState("");
  const [loginInfo, setLoginInfo] = useState("")

  return (
    <>  
      <section className="authbg  relative overflow-y-auto  flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
        <div className='flex gap-1 xl:gap-3 items-center absolute right-2 xl:right-8 top-3 xl:top-6 xl:w-36 px-2 rounded-lg cursor-pointer h-8 xl:h-10  bg-white border border-[#1B75BC26] dropdown'>
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
        <div className="w-full md:w-[28rem] 2xl:w-[460px]  pinkshadow mx-auto  py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
          <div className="text-center maxmid:mb-6">
            <Image
              src="/assets/logo.svg"
              alt="Jobizz Logo"
              height="71"
              width="120"
              className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px] cursor-pointer"
              onClick={() => router.push('/')}
            />
            <h2 className="maxmid:text-xl text-base font-bold mt-2 md:mt-4 maxmid:mt-5">{loginType === "email" ? "Set Password" : loginType === "phone" ? "Verify your phone number" : "Create your account"}</h2>
            <h3 className="text-xs maingray mt-1 mb-2">{loginType === "email" ? "Create your account password below." : loginType === "phone" ? `Enter the 6-digits code sent you at ${loginInfo?.phoneCode} ${loginInfo?.phoneNumber} ` : ""}</h3>
          </div>
          {!loginType && <SignUpForm setLoginType={setLoginType} setLoginInfo={setLoginInfo} />}
          {loginType === "email" && <SetPassword setLoginType={setLoginType} loginInfo={loginInfo}/>}
          {/* {loginType === "email" && <SetPassword setLoginType={setLoginType} loginInfo={loginInfo}/>} */}
          {loginType === "phone" && <OtpSignUp setLoginType={setLoginType} loginInfo={loginInfo}/>}
        </div>
        <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
          © {getCurrentYear()} Jobizz, all rights reserved
        </div>
      </section>
    </>
  );
};

export default SignUp; 