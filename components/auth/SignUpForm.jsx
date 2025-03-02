import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm, Controller } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationPatterns } from "../../constants/constant";
import Error from "../common/Error";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { listofCode, signupAsync, socialLoginAsync } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { UseDispatch, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import Cookies from "js-cookie";
import { useGoogleLogin } from '@react-oauth/google';
import OneSignal from "react-onesignal";
import runOneSignal from "../../utilities/oneSignal";


const SignUpForm = (props) => {
  const router = useRouter();
  const [IsLoading, setIsLoading] = useState(false);

  const toastId = React.useRef(null);
  const dispatch = useDispatch();

  const [phoneNo, setPhoneNo] = useState("");
  const [phoneCode, setPhoneCode] = useState("44");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [flagcode, setflagcode] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+44');
  const dropdownRef = useRef(null);
  const [flagOldcode, setOldflagcode] = useState([]);
  const [search, setSearch] = useState();
  const [oneSignalId, setOneSignalId] = useState("")  
  // Define Yup schemas for each case
  const emailSchema = yup.string()
    .trim().required("Please enter phone or email")
    .matches(validationPatterns.email, "Invalid Email");

  const phoneSchema = yup.string()
    .required("Phone number is required")
    .matches(validationPatterns.phone, "Invalid Phone Number")
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number cannot be more than 15 digits long");

  // Create schema based on the condition
  const getSchema = () => yup.object().shape({
    email: showPhoneInput ? phoneSchema : emailSchema,
    phone: yup.string().notRequired(),
    terms: yup.boolean().oneOf([true], 'Please accept terms and services'),
    // phoneNumber: showPhoneInput ? phoneSchema : yup.string().notRequired()
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema())
  });

  const signUp = (data) => {
    let params = {
      role: "customer"
    };
    props?.setLoginInfo(data);
    setIsLoading(true);
    dispatch(signupAsync(data))
      .then(unwrapResult)
      .then((obj) => {
        let params = {
          role: "customer"
        };
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
        params.phoneNumber = Number(data?.phoneNumber ? data?.phoneNumber : phoneNo);
        params.phoneCode = `+${phoneCode}`;
        const { role, ...paramsWithoutRole } = params;
        props?.setLoginInfo(paramsWithoutRole);
        setIsLoading(false);
        props?.setLoginType("phone");
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  };

  // const onChangePhoneNumber = (value, data) => {
  //   setValue('phone', value);
  //   let phoneCode = data.dialCode;
  //   let phoneNumber = value.slice(data.dialCode.length);
  //   setPhoneNo(phoneNumber);
  //   setPhoneCode(phoneCode);
  //   if (value === "") {
  //     setShowPhoneInput(false);
  //     setPhoneNo("");
  //     setPhoneCode("");
  //     reset({ email: "" });
  //   }
  // };

  const onChangePhoneNumber = (value, data) => {
    let phoneCode = data.dialCode;
    let phoneNumber = value.slice(data.dialCode.length);
    // trigger('phoneNumber');
    phoneNumber = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber
    setValue('phone', `${phoneCode}${phoneNumber}`);
    setValue('phoneNumber', `${phoneNumber}`)
    setPhoneNo(phoneNumber);
    setPhoneCode(phoneCode);
    if (value === "") {
      setShowPhoneInput(false);
      setPhoneNo("");
      setPhoneCode("");
      reset({ email: "" });
    }
    trigger('phoneNumber');
  };

  const emailValue = watch("email");
  const phoneInputRef = useRef(null);


  const cleanPhoneNumbers = (phone) => {
    const cleaned = phone
      .replace(/^\+\d+\s*/, '')
      .replace(/[()\s-]/g, '');
    return cleaned;
  };

  const handleInput = (e) => {
    const value = e.target.value;
    if (/[^0-9+\s()-]/.test(value)) {
      let newValue = cleanPhoneNumbers(value)
      setValue('email', newValue)
      setShowPhoneInput(false);
    } else {
    }
  };

  useEffect(() => {
    if (emailValue?.length >= 2
      && /^\d+$/.test(emailValue)) {
      setShowPhoneInput(true);
    } else {
      setShowPhoneInput(false);
    }
    let email = emailValue?.startsWith('0') ? emailValue?.substring(1) : emailValue

    setValue('phone', `44${email}`);
    setValue('phoneNumber', `${email}`)
    setPhoneNo(email)
  }, [emailValue]);

  // useEffect(() => {
  //   if (showPhoneInput) {
  //     const inputElement = document.querySelector('.phone-input input');
  //     if (inputElement) {
  //       inputElement.focus();
  //       const handleKeyDown = (event) => {
  //         if (event.key === 'Enter') {
  //           event.preventDefault(); // Prevent default form submission
  //           handleSubmit(onSave)(); // Trigger form submission manually
  //         }
  //       };

  //       inputElement.addEventListener('keydown', handleKeyDown);

  //       // Clean up the event listener
  //       return () => {
  //         inputElement.removeEventListener('keydown', handleKeyDown);
  //       };
  //     }
  //   }
  //   else {
  //     const inputElement = document.querySelector('.email-input');
  //     if (inputElement) {
  //       inputElement.focus();
  //     }
  //   }
  // }, [showPhoneInput]);

  const onSave = async (data) => {
    if (showPhoneInput) {
      let params = {
        // role: "customer"
      };
      params.phoneNumber = Number(data?.email);
      params.phoneCode = selectedCode;
      props?.setLoginType("email");
      props?.setLoginInfo(params);
      // signUp(params);
      // Exclude role when sending phone-related data

    } else {
      let params = {
        // role: "customer"
      };
      params.email = emailValue.toLowerCase();
      props?.setLoginType("email");

      // Include role when sending email-related data
      props?.setLoginInfo(params);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      try {
        const { access_token } = tokenResponse;

        // Fetch user profile data
        const userProfileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userProfile = await userProfileResponse.json();

        const params = {
          socialType: "1",
          socialId: userProfile.id,
          email: userProfile?.email?.toLowerCase(),
          firstName: userProfile?.given_name,
          profilePhoto: userProfile?.picture,
          "onesignalId": OneSignal?.User?.PushSubscription.id
        };

        await dispatch(socialLoginAsync(params))
          .then(unwrapResult)
          .then((obj) => {
            console.log(obj, "response login");
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success(obj?.data?.message);
            }
            Cookies.set("authToken", obj?.data?.data[0]?.token);
            if (obj?.data?.data[0]?.userDetails?.first_name && obj?.data?.data[0]?.userDetails?.last_name) {
              // router.push('/')
              router.push('/auth/SelectedProfile')
              // Cookies.set("profileStatus", true)
            }
            else {
              Cookies.set("authToken", obj?.data?.data[0]?.token);
              // router.push('/auth/ProfileSetup')
              router.push('/auth/SelectedProfile')
            }
          })
          .catch((obj) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(obj?.msg);
            }
          });


      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    onError: () => {
      console.log('Login Failed');
      // Handle login error here
    },
  });

  const getCodeList = () => {
    let params = {}

    if (search && search != "") {
      params.keyword = search
    }
    dispatch(listofCode(params))
      .then((obj) => {
        console.log(obj)
        setflagcode(obj?.payload?.data?.data);
      })
      .catch((obj) => {
        // Handle error
      })

  };

  const getOldCodeList = () => {
    dispatch(listofCode())
      .then((obj) => {
        setOldflagcode(obj?.payload?.data?.data);
      })
      .catch((obj) => {
        // Handle error
      })
  };

  useEffect(() => {
    getCodeList();
  }, [search]);


  const handleDivClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (code) => {
    setSelectedCode(code);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    getOldCodeList();
  }, [])

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
        <div className="insignup">
          <label
            htmlFor="email"
            className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700"
          >
            Phone Number or Email
          </label>

          <div className='flex items-center gap-2 ' ref={dropdownRef}>

            {showPhoneInput && <div>
              <div onClick={handleDivClick} className='flex items-center bg-white mainblueBorder gap-1 w-32 justify-center py-2.5 rounded-xl cursor-pointer'>
                <Image
                  src={flagOldcode?.find(flags => flags?.country_code === selectedCode)?.flag}
                  alt="Country Flag"
                  className="mr-2 w-5 h-5 rounded-full"
                  height="18"
                  width="18"
                />
                <span className='font-medium text-base'>{selectedCode}</span>
                <Image
                  src="/assets/arrowdown.svg"
                  alt="Google Icon"
                  className="mr-2"
                  height="18"
                  width="18"
                />
              </div>
              {isOpen && (
                <div className='absolute w-56 md:w-80 mt-2 bg-white border border-gray-300 z-20 h-40 overflow-y-auto rounded-xl shadow-lg'>
                  <div className="sticky top-0 bg-white z-10 p-2">
                    <input
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      placeholder="Search here"
                      className="block w-full text-xs font-medium p-2 bg-gray-50 rounded-lg blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
                    />
                  </div>
                  <div>

                    {flagcode?.length > 0 ? flagcode?.map((flags, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200'
                        onClick={() => handleSelect(flags.country_code)}
                      >
                        <Image
                          src={flags?.flag}
                          alt="Country Flag"
                          height="24"
                          width="24"
                        />
                        <span className='text-xs md:text-sm'>{flags.country_code}</span>
                        <span className='text-xs md:text-sm'>{flags.country_name}</span>
                      </div>
                    )) : <div className='ms-2'> No Code Found</div>}
                  </div>
                </div>
              )}
            </div>}

            <input
              type="text"
              id="email"
              {...register("email")}
              spellCheck={false}
              autoCorrect="off"
              inputMode="email"
              className="email-input mt-1 block w-full text-xs font-medium p-2 py-2.5 maxmid:p-3 bg-[#FFFFFF] rounded-lg blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
              placeholder="Enter your phone number or email"
            />
          </div>

        </div>
        {errors.email && <Error error={errors.email?.message} />}
        <div className="flex gap-4 my-1 mid:my-2">
          <label className="custom-checkbox">
            <input   {...register("terms")} type="checkbox" className="mid:w-5 w-3 border-gray-400 border" />
            <span className="checkmark"></span>
          </label>
          <p className="text-xs medmob:mt-5 mid:text-sm maingray font-normal mt-3 md:mt-5 lg:mt-3">
            I read and agree to the{" "}
            <Link target="_blank" rel="noopener noreferrer" href="/TermsAndConditions" className="text-[#01204E] mr-1 underline cursor-pointer">
              Terms of service
            </Link>
            and the
            <br className="hidden lg:block" />
            <Link target="_blank" rel="noopener noreferrer" href="/Policy" className="text-[#01204E] ml-1 underline cursor-pointer">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        {errors.terms && <Error error={errors.terms?.message} />}

        <button
          disabled={IsLoading}
          type="submit"
          className="w-full mainblue text-white px-2 py-2 maxmid:p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl"
        >
          {IsLoading ? <Spinner /> : "Continue"}
        </button>
        <div className="mt-4 flex items-center justify-center relative">
          <div className="flex-grow border-t border-dashed border-[#9FC7E7]"></div>
          <span className="mx-4 text-sm text-gray-500 z-1">Or</span>
          <div className="flex-grow border-t border-dashed border-[#9FC7E7]"></div>
        </div>

        <div className="maxmid:mt-4 mt-2">
          <button
            onClick={() => login()}
            type="button"
            className="w-full font-bold pinkshadow bg-white border-2 border-[#FFFFFF] text-gray-700 p-1 md:p-3 rounded-xl flex items-center justify-center outline-none"
          >
            <Image
              src="/assets/googleIcon.svg"
              alt="Google Icon"
              className="mr-2"
              height="24"
              width="24"
            />
            <span>Continue with Google</span>
          </button>
        </div>
        <div className="mt-3 maxmid:mt-6 text-center text-sm maxmid:text-base font-normal">
          <span className="maingray">Already have an account? </span>
          <Link href="/auth/login?login=true" className="mainbluetext hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
