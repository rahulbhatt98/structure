import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import OtpInput from "react-otp-input";
import Error from "../common/Error";
import Cookies from "js-cookie";
import Spinner from "../common/Spinner";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { resendOtpAsync, verifyTheOtp } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";

const EnterOtp = (props) => {
  const router = useRouter();
  const toastId = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter your OTP");
      return;
    }
    if (otp?.length <= 5) {
      setError("Please enter a valid OTP");
      return;
    }

    let params = {
      "phoneNumber": Number(props?.loginInfo?.phoneNumber),
      "phoneCode": `${props?.loginInfo?.phoneCode}`,
      "otp": otp
    };
    setLoading(true);
    dispatch(verifyTheOtp(params))
      .then(unwrapResult)
      .then((obj) => {
        setLoading(false);
        Cookies.set("authToken", obj?.data?.data[0]?.token);
        toast.success(obj?.data?.message);
        if (obj?.data?.data[0]?.userDetails?.first_name) {
          router.push('/auth/SelectedProfile');
        } else {
          router.push('/auth/SelectedProfile');
        }
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setLoading(false);
      });
  };

  const resendOtp = () => {
    setOtp("");
    let params = {
      "phoneNumber": Number(props?.loginInfo?.phoneNumber),
      "phoneCode": `${props?.loginInfo?.phoneCode}`,
    };
    dispatch(resendOtpAsync(params))
      .then(unwrapResult)
      .then((obj) => {
        toast.success(obj?.data?.message);
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
      });
  };

  const handleResendClick = () => {
    if (!isDisabled) {
      setIsDisabled(true);
      setCountdown(30);
    }
    resendOtp();
  };

  useEffect(() => {
    let timer;

    if (isDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setIsDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDisabled, countdown]);

  return (
    <>
      <form className="" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex justify-center">
          <OtpInput
            value={otp}
            isInputNum={true}
            data-cy="pin-field"
            onChange={(val) => {
              setOtp(val);
              setError(null);
            }}
            numInputs={6}
            inputStyle={{
              border: "2px solid #1B75BC1A"
            }}
            className="otp-input"
          />
        </div>
        {error && <Error error={error} />}
        <div className="mt-4 text-center text-sm font-normal">
          <span className="maingray">Didn&apos;t receive? </span>
          <button type="button" className="mainbluetext" onClick={() => handleResendClick()} disabled={isDisabled}>Resend code</button>
        </div>
        {isDisabled && <div className="flex justify-center items-center mt-2">
          <div className="text-center text-sm my-3 bg-white font-normal w-32 flex justify-center items-center rounded-full">
            <span className="maingray">Resend after: </span>
            <span> {countdown}</span>
          </div>
        </div>}
        <button
          type="submit"
          className="w-full mt-3 mainblue text-white font-semibold text-base p-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl"
        >
          {loading ? <Spinner /> : "Sign in"}
        </button>
        <div className="flex justify-center">
          <div className="mt-6 flex justify-center w-28 items-center cursor-pointer" onClick={() => props?.setLoginType("")}>
            <Image
              src="/assets/backbtn.svg"
              alt="Back Button"
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
    </>
  );
};

export default EnterOtp;
