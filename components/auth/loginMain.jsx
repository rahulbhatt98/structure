import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Error from '../common/Error';
import { validationPatterns } from '../../constants/constant';
import Image from 'next/image';
import Link from 'next/link';
import { getServiceStepAsync, socialLoginAsync } from '../../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from "js-cookie";
import { listofCode } from '../../redux/auth/authSlice';
import OneSignal from 'react-onesignal';
import runOneSignal from '../../utilities/oneSignal';

const LoginMain = (props) => {
  const router = useRouter()
  const toastId = useRef(null);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [flagOldcode, setOldflagcode] = useState([]);
  const [flagcode, setflagcode] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+44');
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const emailSchema = yup.string()
    .trim().required("Please enter phone or email")
    .matches(validationPatterns.email, "Invalid Email");

  const phoneSchema = yup.string()
    .required("Phone number is required")
    .matches(validationPatterns.phone, "Invalid Phone Number")
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number cannot be more than 15 digits long");

  const getSchema = () => yup.object().shape({
    email: showPhoneInput ? phoneSchema : emailSchema,
    phone: yup.string().notRequired(),
  });


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: {
      email: "",
      phone: `1${props?.loginInfo?.email}`,
    },
  });

  const emailValue = watch('email');
  const onSave = async (data) => {

    if (showPhoneInput) {
      let params = {
        "phoneNumber": Number(data?.email),
        "phoneCode": selectedCode,
      }
      props?.setLoginInfo(params);
      props?.setLoginType("email");
      router.replace({
        pathname: router.pathname,
        query: {},
      })
    } else {
      let params = {}
      params.email = emailValue.toLowerCase();
      props?.setLoginType("email");
      router.replace({
        pathname: router.pathname,
        query: {},
      })
      props?.setLoginInfo(params);
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
  }, [emailValue, setValue, showPhoneInput]);


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;

        const userProfileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userProfile = await userProfileResponse.json();

        const params = {
          socialType: "1",
          socialId: userProfile.id,
          email: userProfile?.email.toLowerCase(),
          firstName: userProfile?.given_name,
          profilePhoto: userProfile?.picture,
          "onesignalId": OneSignal?.User?.PushSubscription.id
        };

        await dispatch(socialLoginAsync(params))
          .then(unwrapResult)
          .then((obj) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success(obj?.data?.message);
            }
            Cookies.set("authToken", obj?.data?.data[0]?.token);

            dispatch(getServiceStepAsync(obj?.data?.data[0]?.userDetails?.profile_completed_steps ? (Number(obj?.data?.data[0]?.userDetails?.profile_completed_steps)) : ""))
            if (obj?.data?.data[0]?.userDetails?.first_name && obj?.data?.data[0]?.userDetails?.last_name) {
              router.push('/auth/SelectedProfile')
            }
            else {
              Cookies.set("authToken", obj?.data?.data[0]?.token);
              router.push('/auth/SelectedProfile')
            }
          })
          .catch((obj) => {
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.error(obj?.msg);
            }
          });


      } catch (error) {
      }
    },
    onError: () => {
    },
  });

  const [search, setSearch] = useState();

  const getCodeList = () => {
    let params = {}

    if (search && search != "") {
      params.keyword = search
    }

    dispatch(listofCode(params))
      .then((obj) => {
        setflagcode(obj?.payload?.data?.data);
      })
      .catch((obj) => {
      })
  };

  const getOldCodeList = () => {
    dispatch(listofCode())
      .then((obj) => {
        setOldflagcode(obj?.payload?.data?.data);
      })
      .catch((obj) => {
      })
  };

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
    getCodeList();
  }, [search])

  useEffect(() => {
    getOldCodeList();
  }, [])

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
              <div onClick={handleDivClick} className='flex items-center relative bg-white mainblueBorder gap-1 w-32 justify-center py-2.5 rounded-xl cursor-pointer'>
                <Image
                  src={flagOldcode?.find(flags => flags.country_code === selectedCode)?.flag}
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
                  <div className="">

                    {flagcode?.length > 0 ? flagcode?.map((flags, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200'
                        onClick={() => handleSelect(flags?.country_code)}
                      >
                        <Image
                          src={flags?.flag}
                          alt="Country Flag"
                          height="24"
                          width="24"
                        />
                        <span className='text-xs md:text-sm'>{flags.country_code}</span>
                        <span className=' text-xs md:text-sm'>{flags.country_name}</span>
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
        <button
          type="submit"
          className="w-full mainblue text-white px-2 py-2 maxmid:p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl"
        >
          Continue
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
            className="w-full pinkshadow font-bold bg-white border-2 border-[#FFFFFF] text-gray-700 p-3 rounded-xl flex items-center justify-center outline-none"
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
          <span className="maingray"> New to Jobizz? </span>
          <Link href="/auth/signup" className="mainbluetext hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </>
  );
};

export default LoginMain;
