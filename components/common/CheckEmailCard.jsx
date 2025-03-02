import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

function CheckEmailCard(props) {
  const router = useRouter();

  return (
    <>
      <div>
        <div className="text-center mb-6">
          <Image
            src="/assets/emailIcon.png"
            alt="Jobizz Logo"
            height="71"
            width="120"
            className="mx-auto"
          />
          <h2 className="text-2xl font-bold mt-4">Check your email</h2>
        </div>
        <div>
          {props.source ? (

            <p className="maingray text-base font-medium text-center">
              We sent a password recovery instructions to your email.
              <span className="text-black">{props?.email?.email}</span>
            </p>
          ) : (
            <p className="maingray text-base font-medium text-center">
              Check your inbox click on the link we send to  <span className="text-black"> {props?.email?.email}</span> within the next 5 minutes

            </p>
          )
          }
        </div>
        <div className="flex justify-center ">
          <button
            onClick={() => {props?.setLoginType(""); router.replace({
              pathname: router.pathname,
              query: {},
            })}}
            type="button"
            className="w-40 mainblue text-white p-4 blueshadow shadow-lg font-semibold mt-8 mb-5 shadow-[#1B75BC] rounded-xl"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}

export default CheckEmailCard;
