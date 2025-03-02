import Image from "next/image";
import React, { useEffect, useState } from "react";
import SetPassword from "../../components/auth/SetPassword";
import { useRouter } from "next/router";
import CryptoJS from 'crypto-js';
import { getCurrentYear } from "../../utilities/helper";

function ResetPassword() {
  const router = useRouter();
  const { urlData } = router.query;

  const [userId, setUserId] = useState("")

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
      setUserId(data?._id)
    }
  }, [urlData]);

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

        <div className="pinkshadow w-full md:w-[28rem] 2xl:w-[460px] py-3 maxmid:pt-5 px-3 md:px-6 bg-[#FFFFFF66] border-2 border-[#FFFFFF] rounded-2xl 2xl:mb-16">
          <div className="text-center mb-6">
            <Image
              src="/assets/logo.svg"
              alt="Jobizz Logo"
              height="71"
              width="120"
              className="mx-auto cursor-pointer"
              onClick={() => router.push('/')}
            />
            <h2 className="text-xl font-bold mt-4">Reset Password</h2>
          </div>
          <SetPassword fromForget={true} userId={userId} />
        </div>
        <div className="text-center text-xs mid:text-sm text-gray-500  fixed left-0 w-full bottom-1 mid:bottom-2 2xl:bottom-8">
          © {getCurrentYear()} Jobizz, all rights reserved
        </div>
      </section>

    </>
  );
}

export default ResetPassword;
