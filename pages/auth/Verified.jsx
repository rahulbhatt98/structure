import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { verifyTheOtp } from '../../redux/auth/authSlice';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

function Verified() {
  const router = useRouter();
  const { urlData } = router.query;
  const [accountVerified, setAccountVerified] = useState(false)
  const toastId = React.useRef(null);
  const dispatch = useDispatch()
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

    if (urlData) {
      let data = decryptData(urlData, "aDS3WD343-23MDFASD", "verify")

      let params = {
        "email": data?.email,
        "otp": String(data?.otp)
      }
      dispatch(verifyTheOtp(params))
        .then(unwrapResult)
        .then((obj) => {
          //   Cookies.set("authToken", obj?.data?.data[0]?.token);
          //   // router.push('/auth/ProfileSetup')
          //   router.push('/auth/SelectedProfile')

          console.log(obj, "successssssssssssss responseeeeeeeeeeeeeeeeeee");
          
          if(obj?.data?.message === "Your account is already verified"){
            setAccountVerified(true)
          }
          else{
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.success(obj?.data?.message);
            }
            setAccountVerified(false)
          }

        })
        .catch((obj) => {
          // if (!toast.isActive(toastId.current)) {
          //   toastId.current = toast.error(obj?.msg);
          // }
          router.push("/")
        });
    }
  }, [urlData]);
  return (
    <>
      <section className="authbg  relative  overflow-y-auto flex items-center flex-col justify-center max-h-full min-h-screen bg-cover bg-center">
        <div className="pinkshadow w-full  md:w-[28rem] 2xl:w-[460px] mx-auto py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
          <div className="text-center mb-6">
            <Image
              src="/assets/logo.svg"
              alt="Jobizz Logo"
              height="71"
              width="120"
              className="mx-auto w-[90px] h-[60px] maxmid:w-[120px] maxmid:h-[71px]"
            />
            <h2 className="text-2xl font-bold mt-4">{accountVerified ? "Your account is already verified" :"Thanks! your account has been verified."}</h2>
          </div>
        </div>
      </section>
    </>
  )
}

export default Verified