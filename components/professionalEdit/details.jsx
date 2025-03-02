import React, { useRef } from 'react';
import Image from "next/image";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller } from "react-hook-form";
import { BaseUrl } from "../../constants/constant";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadThePhoto,
  updateVerifyDetailsAsync,
  selectLoginAuth,
} from "../../redux/auth/authSlice";
import Error from "../../components/common/Error";
import Spinner from "../../components/common/Spinner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import { subYears } from "date-fns";
import VerifyNumber from "../../components/modals/verifyNumber";
import { TextField } from "@mui/material";
import { PuffLoader } from 'react-spinners';
import useLoadGoogleMaps from '../../utilities/useLoadGoogleMaps';
import { options } from '../../utilities/helper';

function Details({ setProfileImage, selectedImage, userDetails, trigger, watch, setValue, register, control, errors }) {
  // const isLoaded1 = useLoadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_KEY);
  const toastId = React.useRef(null);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [phoneNo, setPhoneNo] = useState(userDetails?.phone_number ? userDetails?.phone_number : "");
  const [phoneCode, SetPhoneCode] = useState(userDetails?.phone_code ? userDetails?.phone_code : "44");
  const [loginInfo, setLoginInfo] = useState("")
  const [loginType, setLoginType] = useState("")
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const emailValue = watch("email");
  const phoneValue = watch("phoneNumber");



  const onChangePhoneNumber = (value, data) => {
    let phoneCode = data.dialCode;
    let phoneNumber = value.slice(data.dialCode.length);
    // setValue('phoneNumber', value);
    phoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber.substring(1)
      : phoneNumber;

    setValue("phoneNumber", `${phoneCode}${phoneNumber}`);
    setValue("phone", `${phoneNumber}`);
    setPhoneNo(phoneNumber);
    SetPhoneCode(phoneCode);
    trigger("phone");
  };

  // const [selectedImage, setSelectedImage] = useState(
  //   userDetails?.profile_photo
  // );

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // setSelectedImage(URL.createObjectURL(file));
      // setSelectedImageFile(file);
      ImageEdit(file)
    }
  };

  const ImageEdit = (file, data) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsLoading(true);
    dispatch(uploadThePhoto(formData))
      .then(unwrapResult)
      .then((obj) => {
        // let params = {
        //   dob: moment(data?.dob).format("YYYY-MM-DD"),
        //   address: data?.address || undefined,
        //   city: data?.city || undefined,
        //   country: data?.country || undefined,
        //   postcode: data?.postcode || undefined,
        //   firstName: data?.firstName,
        //   lastName: data?.lastName,
        //   profilePhoto: obj?.data?.data?.profilePhoto || undefined,
        //   longitude: String(data?.longitude),
        //   latitude: String(data?.latitude),
        // };
        // setupProfileFunc(params);
        console.log(obj, "ssssssssssssssssssss");
        setIsLoading(false);
        setProfileImage(obj?.data?.data?.link || undefined)
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  };

  // const getProfileFunc = () => {
  //   dispatch(getTheProfile())
  //     .then(unwrapResult)
  //     .then((obj) => { })
  //     .catch((obj) => { });
  // };

  // const setupProfileFunc = (filteredData) => {
  //   dispatch(setupProfile(filteredData))
  //     .then(unwrapResult)
  //     .then((obj) => {
  //       if (!toast.isActive(toastId.current)) {
  //         toastId.current = toast.success(obj?.data?.message);
  //       }
  //       setIsLoading(false);
  //       Cookies.set("profileStatus", true);
  //       router.push("/Profile");
  //       getProfileFunc();
  //     })
  //     .catch((obj) => {
  //       if (!toast.isActive(toastId.current)) {
  //         toastId.current = toast.error(obj?.msg);
  //       }
  //       setIsLoading(false);
  //     });
  // };

  const autoCompleteHandleChange = (address) => {
    if (address === "") {
      setValue("city", "");
      // setStateValue("")
      setValue("country", "");
      setValue("postcode", "");
    }
    setValue("address", address);
  };
  const autoCompleteHandleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        fillAddressDetails(results);
        setValue("latitude", (results[0].geometry.location.lat())?.toString());
        setValue("longitude", (results[0].geometry.location.lng())?.toString());
      })
      .catch((error) => { });
  };
  const fillAddressDetails = (results) => {
    setValue("address", results[0].formatted_address);

    let citySet = false; // Flag to track if the city has been set

    for (let j = 0; j < results[0].address_components.length; j++) {
      const component = results[0].address_components[j];
    
      if (component.types.includes("postal_code")) {
        setValue("postcode", component.short_name);
      } else if (component.types.includes("locality")) {
        setValue("city", component.long_name);
        citySet = true; // Set flag to true if locality is found
      } else if (
        component.types.includes("administrative_area_level_1") ||
        component.types.includes("administrative_area_level_3")
      ) {
        // Handle administrative areas if needed
        // setStateValue(component.long_name);
        // setStateCode(component.short_name);
      } else if (component.types.includes("country")) {
        setValue("country", component.long_name);
        // setCountryCode(component.short_name);
      } else if (component.types.includes("street_number")) {
        // setApt(component.long_name);
      }
    }
    
    // If locality was not found, check for postal_town (if available)
    if (!citySet) {
      const postalTown = results[0].address_components.find(component =>
        component.types.includes("postal_town")
      );
    
      if (postalTown) {
        setValue("city", postalTown.long_name); // Set postal_town as city
      }
    }
    trigger("address");
    trigger("country");
    trigger("city");
    trigger("postcode");
  };

  // const onSave = async (data) => {
  //   if (selectedImageFile) {
  //     ImageEdit(selectedImageFile, data);
  //   } else {
  //     let params = {
  //       dob: moment(data?.dob).format("YYYY-MM-DD"),
  //       address: data?.address || undefined,
  //       city: data?.city || undefined,
  //       country: data?.country || undefined,
  //       postcode: data?.postcode || undefined,
  //       firstName: data?.firstName,
  //       lastName: data?.lastName,
  //       longitude: String(data?.longitude),
  //       latitude: String(data?.latitude),
  //       profilePhoto: selectedImage ? selectedImage : "",
  //     };
  //     setupProfileFunc(params);
  //   }
  // };

  const fetchCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setValue("longitude", longitude);
          setValue("latitude", latitude);
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${BaseUrl?.GOOGLE_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results[0]) {
                const address = data.results[0].formatted_address;
                setValue("address", address);
                autoCompleteHandleSelect(address);
              }
            })
            .catch((error) => console.error("Error fetching location:", error))
            .finally(() => setLoadingLocation(false));
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  };

  const today = new Date();
  const maxDate = dayjs(subYears(today, 18));

  const handleRemoveImage = () => {
    if (selectedImage) {
      setProfileImage(null);
    }
  };

  const handleVerifyOtp = (params) => {
    setVerifyLoading(true);
    dispatch(updateVerifyDetailsAsync(params))
      .then(unwrapResult)
      .then((obj) => {
        toast.success(obj?.data?.message);
        setIsVerifyModal(true);
        setVerifyLoading(false);
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setVerifyLoading(false);
      });
  };

  const handleVerify = (type) => {
    setLoginType(type);
    if (type === "phone") {
      setLoginInfo({
        phoneCode: phoneCode,
        phoneNumber: phoneNo,
      });
      let params = {
        phoneNumber: Number(phoneNo),
        phoneCode: `${phoneCode}`,
      };
      handleVerifyOtp(params);
    } else {
      setLoginInfo({
        email: emailValue,
      });
      let params = {
        email: emailValue,
      };
      handleVerifyOtp(params);
    }
  };

  // useEffect(() => {
  //   const loadGoogleMapsScript = () => {
  //     if (window.google) {
  //       setIsLoaded(true);
  //       return;
  //     }
  //     const script = document.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${BaseUrl?.GOOGLE_KEY}&libraries=places`;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = () => setIsLoaded(true);
  //     script.onerror = () => console.error('Error loading Google Maps API');
  //     document.head.appendChild(script);
  //   };

  //   loadGoogleMapsScript();
  // }, []);

  // console.log(selectedImage, "ssssssssssssssssss");

  // if (!isLoaded) return <></>;

  // if (!isLoaded1) {
  //   return <></>; 
  // }

  return (
    <>
      <section>
        <div>
          <div className="mx-auto">
            <div className=''>
              {/* <!-- Sidebar --> */}
              {/* <!-- Main Content --> */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row w-full rounded-xl">

                  <div className="w-full lg:w-1/4">
                    <div className="mb-8 flex justify-center md:justify-normal 2xl:ml-10">
                      <div className="mt-6 mb-6 ">
                        <div className="xl:w-[243px] xl:h-[243px] w-[200px] h-[200px] relative bg-white border-2 border-[#1B75BC33] rounded-full flex justify-center items-center">

                          {
                            IsLoading ?
                              <div
                                className=" flex justify-center items-center p-2">
                                <PuffLoader
                                  color="#4de527"
                                  loading
                                  size={35}
                                  speedMultiplier={3}
                                />
                              </div>
                              : <>
                                <Image
                                  src={
                                    selectedImage
                                      ? selectedImage
                                      : "/assets/profileman.png"
                                  }
                                  alt="Selected Profile"
                                  className="rounded-full w-full h-full object-fill"
                                  width="243"
                                  height="243"
                                />

                                {selectedImage && (
                                  <div
                                    className="absolute bottom-0 cursor-pointer"
                                    onClick={handleRemoveImage}
                                  >
                                    <Image
                                      src="/assets/Ellipse.svg"
                                      alt="Selected Profile"
                                      className="rounded-full xl:w-[184px] mx-1 xl:h-[39px]  w-[141px] object-fill"
                                      width="184"
                                      height="39"
                                    />
                                  </div>
                                )}
                                <label htmlFor="image-upload">
                                  <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                  />
                                  <div className="absolute -bottom-1 cursor-pointer  right-4 rounded-full border border-white">
                                    <Image
                                      src="/assets/camera.svg"
                                      alt="whitePencil"
                                      width="56"
                                      height="56"
                                      className="xl:w-[56px] xl:h-[56px] w-11 h-11"
                                    />
                                  </div>
                                </label>
                              </>
                          }



                        </div>
                      </div>
                    </div>
                  </div>

                  {/* start */}
                  <div className=" w-full lg:w-3/4">
                    <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block  text-sm pb-1 pl-1 font-normal text-gray-700"
                          >
                            First Name
                          </label>
                          <input
                            {...register("firstName")}
                            placeholder="Enter first name"
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm"
                          />
                          {errors.firstName && (
                            <Error error={errors.firstName?.message} />
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block  text-sm pb-1 pl-1 font-normal text-gray-700"
                          >
                            Last Name
                          </label>
                          <input
                            {...register("lastName")}
                            placeholder="Enter last name"
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm"
                          />
                          {errors.lastName && (
                            <Error error={errors.lastName?.message} />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* const date = moment.utc(auth?.payload?.user?.user_profiles?.dob);
                                          const newDate = date.toDate() */}
                        <div className="w-full ">
                          <label
                            htmlFor="dob"
                            className="block text-sm pb-1 pl-1 font-normal text-gray-700"
                          >
                            Date of Birth
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                              name="dob"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <DatePicker
                                    {...field}
                                    format="DD/MM/YYYY"
                                    className="outline-none pinkshadow bg-white"
                                    // defaultValue={userDetails?.dob ? dayjs(userDetails.dob) : null}
                                    renderInput={(params) => (
                                      <TextField
                                        className="newOne"
                                        {...params}
                                        error={!!errors.dob}
                                      />
                                    )}
                                    sx={{
                                      width: "100%",
                                      background: "white",
                                      borderRadius: "12px",
                                      marginTop: "4px",
                                      borderColor: "transparent !important",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        border: "2px solid #1B75BC1A !important",
                                        borderRadius: "12px",
                                      },
                                      "& .MuiInputBase-input ": {
                                        height: "1rem !important",
                                      },
                                    }}
                                    maxDate={maxDate}
                                  />
                                </>
                              )}
                            />
                          </LocalizationProvider>
                          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="dob"
                            control={control}
                            render={({ field }) => (
                              <div
                                onClick={() => setOpen(true)} // Open calendar when the div is clicked
                                className="w-full "
                              >
                                <DatePicker
                                  {...field}
                                  // open={open}
                                  // onOpen={() => setOpen(true)}
                                  // onClose={() => setOpen(false)}
                                  // closeOnSelect={false}
                                  onChange={(value) => {
                                    setOpen(false);
                                    field.onChange(value);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.dob}
                                      className="newOne"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevents the event from closing the calendar when clicking inside the input
                                        setOpen(true); // Opens calendar when input is clicked
                                      }}
                                    />
                                  )}
                                  sx={{
                                    width: "100%",
                                    background: "white",
                                    borderRadius: "12px",
                                    marginTop: "4px",
                                    cursor: "pointer",
                                    borderColor: "transparent !important",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      border: "none !important",
                                      // cursor:"pointer !important"
                                    },
                                    "& .MuiInputBase-input ": {
                                      height: "1rem !important",
                                      // cursor:"pointer !important"
                                    }
                                  }}
                                  maxDate={maxDate}
                                />
                              </div>
                            )}
                          />
                        </LocalizationProvider> */}
                          {errors.dob && <Error error={errors.dob.message} />}
                        </div>

                        <div>
                          <label htmlFor="email" className="block  text-sm pb-1 pl-1 font-normal text-gray-700">Email Address</label>
                          <div className='flex items-center gap-3'>
                            <input   {...register("email")} placeholder='Enter email' type="text" id="email" name="email" className='mt-1 pinkshadow block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500 outline-none sm:text-sm' />
                            <button type='button' onClick={() => handleVerify("email")} disabled={userDetails?.email === emailValue} className={`md:px-12 px-3 py-3 font-semibold ${(userDetails?.email === emailValue) ? 'bg-[#c5e29f]' : 'bg-[#8DC63F]'}   text-white   shadow-lg  ${(userDetails?.email === emailValue) ? "" : "shadow-[#8DC63F]"} rounded-xl`}>
                              {(verifyLoading && loginType === "email") ? <Spinner /> : "Verify"}
                            </button>
                          </div>
                          {errors.email && (
                            <Error error={errors.email?.message} />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm pb-1 pl-1 font-normal text-gray-700"
                          >
                            Phone Number
                          </label>
                          <div className="flex items-center gap-5 InProfessionalProfile">
                            <Controller
                              name="phoneNumber"
                              control={control}
                              render={({ field }) => (
                                <PhoneInput
                                  country="us"
                                  value={field.value}
                                  onChange={(
                                    value,
                                    data,
                                    event,
                                    formattedValue
                                  ) =>
                                    onChangePhoneNumber(
                                      value,
                                      data,
                                      event,
                                      formattedValue
                                    )
                                  }
                                  placeholder="Phone no."
                                  enableSearch={true}
                                  autoComplete="new-password"
                                // disabled={(`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue}
                                />
                              )}
                            />
                          </div>
                          {errors.phone && (
                            <Error error={errors.phone?.message} />
                          )}
                        </div>
                        <button type='button' disabled={(`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue} onClick={() => handleVerify("phone")} className={`w-40 h-12 mt-4 lg:mt-6 block text-center font-semibold ${((`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue) ? 'bg-[#c5e29f]' : 'bg-[#8DC63F]'}   text-white   shadow-lg  ${((`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue) ? "" : "shadow-[#8DC63F]"} rounded-xl`}>
                          {(verifyLoading && loginType === "phone") ? <Spinner /> : "Verify"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* end */}
                </div>

                <div className='mt-3'>
                  <div className="relative">
                    <label
                      htmlFor="address"
                      className="block text-sm pl-1 font-normal text-gray-700"
                    >
                      Address
                    </label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <PlacesAutocomplete
                          value={field.value || ''}
                          onChange={autoCompleteHandleChange}
                          onSelect={autoCompleteHandleSelect}
                        // searchOptions={{
                        //     componentRestrictions: {
                        //         country: ['us'],
                        //     }
                        // }}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div className="relative">
                              <input
                                {...getInputProps({
                                  placeholder: "Search Location",
                                  className:
                                    "location-search-input  customform-control countrytags_",
                                })}
                                className="mt-1 pinkshadow block w-full text-sm pr-12 font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                              />
                              <Image
                                src="/assets/location.svg"
                                alt="Jobizz Logo"
                                height="24"
                                width="24"
                                className="mx-auto absolute  transform -translate-y-8 right-4 cursor-pointer"
                                onClick={fetchCurrentLocation}
                              />
                              <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion, index) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                      backgroundColor: "#fafafa",
                                      cursor: "pointer",
                                    }
                                    : {
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer",
                                    };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(
                                        suggestion,
                                        {
                                          className,
                                          style,
                                        }
                                      )}
                                      key={index}
                                    >
                                      <span>
                                        {suggestion.description}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      )}
                    />
                  </div>
                  {(errors.address || errors.longitude) && (
                    <Error
                      error={
                        errors?.address?.message
                          ? errors?.address?.message
                          : errors?.longitude?.message
                      }
                    />
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                    <div>
                      <input
                        {...register("city")}
                        placeholder="City"
                        type="text"
                        id="city"
                        name="city"
                        className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                      />
                      {errors.city && (
                        <Error error={errors.city?.message} />
                      )}
                    </div>

                    <div>
                      <input
                        {...register("country")}
                        placeholder="Country"
                        type="text"
                        id="country"
                        name="country"
                        className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                      />
                      {errors.country && (
                        <Error error={errors.country?.message} />
                      )}
                    </div>

                    <div>
                      <input
                        maxLength="8"
                        {...register("postcode")}
                        placeholder="Postcode"
                        type="text"
                        id="postcode"
                        name="postcode"
                        className="block pinkshadow w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl blueBordermain placeholder:text-gray-500  outline-none sm:text-sm"
                      />
                      {errors.postcode && (
                        <Error error={errors.postcode?.message} />
                      )}
                    </div>
                  </div>
                  
            
                </div>
                {/* </div>
                  </div> */}
                {/* <div className="flex justify-end">
                    <button
                      type="submit"
                      className="md:px-12 px-7 font-semibold mainblue text-white p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl"
                      disabled={IsLoading}
                    >
                      {IsLoading ? <Spinner /> : " Save Profile"}
                    </button>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
        {isVerifyModal && (
          <VerifyNumber
            setIsVerifyModal={setIsVerifyModal}
            id={userDetails?.id}
            loginInfo={loginInfo}
            loginType={loginType}
          />
        )}
      </section>
    </>
  )
}

export default Details;