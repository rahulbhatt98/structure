import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import OtpInput from "react-otp-input";
import Error from "../common/Error";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resendOtpAsync, selectLoginAuth, updateVerifyDetailsAsync, verifyTheOtp } from "../../redux/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import Spinner from "../common/Spinner";

const VerifyNumber = ({ setIsVerifyModal, isProfile, loginInfo, id, loginType }) => {
    const router = useRouter();
    const toastId = useRef(null);
    const [IsLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const userDetails = useSelector(selectLoginAuth);

    console.log(userDetails,"saaaaaaaaaaaaaaaaaaaaaaa");

    const handleVerifyOtp = (params) => {
        dispatch(updateVerifyDetailsAsync(params))
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

    const resendOtp = () => {
        setOtp("");
        let params = {};
        if (loginType === "phone") {
            params = {
                "phoneNumber": loginInfo?.phoneNumber,
                "phoneCode": loginInfo?.phoneCode
            };
        } else {
            params = {
                "email": loginInfo?.email,
            };
        }
        // dispatch(resendOtpAsync(params))
        //     .then(unwrapResult)
        //     .then((obj) => {
        //         toast.success(obj?.data?.message);
        //     })
        //     .catch((obj) => {
        //         if (!toast.isActive(toastId.current)) {
        //             toastId.current = toast.error(obj?.msg);
        //         }
        //     });
        handleVerifyOtp(params)
    };

    const handleResendClick = () => {
        if (!isDisabled) {
            setIsDisabled(true);
            setCountdown(30);
        }
        resendOtp();
    };

    const handleSubmit = (e) => {
        // e.preventDefault();
        if (!otp) {
            setError("Please enter your OTP");
            return;
        }
        if (otp?.length <= 5) {
            setError("Please enter a valid OTP");
            return;
        }
        const containsOnlyNumbers = /^\d+$/.test(otp);
        if (!containsOnlyNumbers) {
            setError("Only numbers are allowed");
            return;
        }

        let params = {};
        if (loginType === "phone") {
            params = {
                "id": id,
                "phoneNumber": loginInfo?.phoneNumber,
                "phoneCode": loginInfo?.phoneCode,
                otp: otp
            };
        } else {
            params = {
                "id": id,
                "email": loginInfo?.email,
                otp: otp
            };
        }
        setIsLoading(true);
        dispatch(verifyTheOtp(params))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                // Cookies.set("authToken", obj?.data?.data[0]?.token);
                setIsVerifyModal(false);
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setIsLoading(false);
            });
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
        <div className="pinkshadow w-full md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="authbg relative bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                    <button
                        type='button'
                        onClick={() => setIsVerifyModal(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        &#x2715;
                    </button>

                    <div className="text-center mb-4 md:mb-6">
                        <Image
                            src="/assets/logo.svg"
                            alt="Jobizz Logo"
                            height="71"
                            width="120"
                            onClick={() => router.push('/')}
                            className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px] cursor-pointer"
                        />
                        <h2 className="maxmid:text-xl text-base font-bold mt-2 md:mt-4 maxmid:mt-5">
                            Verify your {loginType === "phone" ? 'phone number' : "email"}
                        </h2>
                        <h2 className="maxmid:text-xl text-base font-bold mt-2 maxmid:mt-5">
                            {loginType === 'phone'
                                ? `Enter the 6-digit code sent to ${loginInfo?.phoneCode} ${loginInfo?.phoneNumber}`
                                : `Enter the 6-digit code sent to ${loginInfo?.email}`
                            }
                        </h2>
                    </div>
                    <form >
                        <div className="flex justify-center otpinput">
                            <OtpInput
                                value={otp}
                                isInputNum={true}
                                data-cy="pin-field"
                                onChange={(val) => {
                                    setOtp(val);
                                    setError(null);
                                }}
                                numInputs={6}
                                className="otp-input"
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        className={`otp-field ${props.value ? "has-value" : ""}`}
                                    />
                                )}
                                inputStyle={{
                                    borderRadius: "15px"
                                }}
                            />
                        </div>
                        {error && <Error error={error} />}
                        <div className="mt-4 text-center text-sm font-normal">
                            <span className="maingray">Didn&apos;t receive? </span>
                            <button className="mainbluetext" type="button" disabled={isDisabled} onClick={handleResendClick}>
                                Resend code
                            </button>
                        </div>
                        {isDisabled && (
                            <div className="flex justify-center items-center mt-2">
                                <div className="text-center text-sm my-3 bg-white font-normal w-32 flex justify-center items-center rounded-full">
                                    <span className="maingray">Resend after: </span>
                                    <span> {countdown}</span>
                                </div>
                            </div>
                        )}
                        <button
                            disabled={IsLoading}
                            onClick={() => handleSubmit()}
                            type="button"
                            className="w-full mt-3 mainblue text-white font-semibold text-base p-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl"
                        >
                            {IsLoading ? <Spinner /> : `${isProfile ? 'Verify' : 'Continue'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyNumber;
