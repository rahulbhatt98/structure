import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Image from "next/image";
import { useRouter } from "next/router";
import { unwrapResult } from "@reduxjs/toolkit";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseUrl, validationPatterns } from "../../constants/constant";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import {
  setupProfile,
  uploadThePhoto,
  getTheProfile,
  updateVerifyDetailsAsync,
} from "../../redux/auth/authSlice";
import { selectLoginAuth } from "../../redux/auth/authSlice";
import Error from "../../components/common/Error";
import moment from "moment-timezone";
import Spinner from "../../components/common/Spinner";
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { addYears, subYears } from "date-fns";
import VerifyNumber from "../../components/modals/verifyNumber";
import { TextField } from "@mui/material";
import useLoadGoogleMaps from "../../utilities/useLoadGoogleMaps";

function EditProfile() {
  const router = useRouter();
  // const isLoaded1 = useLoadGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_KEY);
  const toastId = React.useRef(null);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userDetails = useSelector(selectLoginAuth);

  const [loadingLocation, setLoadingLocation] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [phoneNo, setPhoneNo] = useState(userDetails?.phone_number ? userDetails?.phone_number : "");
  const [phoneCode, SetPhoneCode] = useState(userDetails?.phone_code ? userDetails?.phone_code : "44");
  const [loginInfo, setLoginInfo] = useState("")
  const [loginType, setLoginType] = useState("")
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isVerifyModal, setIsVerifyModal] = useState(false);

  const phoneSchema = yup.string()
    .required("Please enter phone number")
    .matches(validationPatterns.phone, "Invalid Phone Number")
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number cannot be more than 15 digits long");

  const Schema = () =>
    yup.object().shape({
      firstName: yup.string().trim().required("Please enter firstname"),
      lastName: yup.string().trim().required("Please enter lastname"),
      dob: yup
        .date()
        .typeError("Please enter a date")
        .required("Please enter Date of Birth")
        .test(
          "dob",
          "You must be 18 years or older",
          (value) => dayjs().diff(dayjs(value), "years") >= 18
        ),
      email: userDetails?.email
        ? yup.string().notRequired()
        : yup
          .string()
          .trim()
          .required("Please enter email")
          .matches(validationPatterns.email, "Invalid Email"),
      // phoneNumber: userDetails?.phone_code ? yup.string().notRequired() : phoneSchema,
      phone: userDetails?.phone_code ? yup.string().notRequired() : phoneSchema,
      phoneNumber: yup.string().notRequired(),
      address: yup.string().trim().required("Please enter address"),
      city: yup.string().trim().required("Please enter city"),
      country: yup.string().trim().required("Please enter country"),
      postcode: yup.string().trim().required("Please enter postcode"),
      longitude: yup.string().trim().required("Please select correct addresss"),
    });

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema()),
    defaultValues: {
      firstName: userDetails?.first_name,
      lastName: userDetails?.last_name,
      email: userDetails?.email,
      phoneNumber: `${userDetails?.phone_code ? userDetails?.phone_code : "44"
        }${userDetails?.phone_number}`,
      address: userDetails?.address,
      city: userDetails?.city,
      country: userDetails?.country,
      postcode: userDetails?.postcode,
      dob: dayjs(userDetails?.dob),
      longitude: userDetails?.longitude,
      latitude: userDetails?.latitude,
    },
  });

  console.log(dayjs(userDetails?.dob), "saaaaaaaaaaaaaaaaaaaaaaa");

  const emailValue = watch("email");
  const phoneValue = watch("phoneNumber");

  console.log(userDetails, "detailssssssssssssssss");

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

  const [selectedImage, setSelectedImage] = useState(
    userDetails?.profile_photo
  );
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const ImageEdit = (file, data) => {
    const formData = new FormData();
    formData.append("image", file);
    setIsLoading(true);
    dispatch(uploadThePhoto(formData))
      .then(unwrapResult)
      .then((obj) => {

        let params = {
          dob: moment(data?.dob).format("YYYY-MM-DD"),
          address: data?.address || undefined,
          city: data?.city || undefined,
          country: data?.country || undefined,
          postcode: data?.postcode || undefined,
          firstName: data?.firstName,
          lastName: data?.lastName,
          profilePhoto: obj?.data?.data?.link || undefined,
          longitude: String(data?.longitude),
          latitude: String(data?.latitude),
        };
        setupProfileFunc(params);
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  };

  const getProfileFunc = () => {
    dispatch(getTheProfile())
      .then(unwrapResult)
      .then((obj) => { })
      .catch((obj) => { });
  };

  const setupProfileFunc = (filteredData) => {
    dispatch(setupProfile(filteredData))
      .then(unwrapResult)
      .then((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
        setIsLoading(false);
        // Cookies.set("profileStatus", true);
        router.push("/Profile");
        getProfileFunc();
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setIsLoading(false);
      });
  };

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
        setValue("latitude", results[0].geometry.location.lat());
        setValue("longitude", results[0].geometry.location.lng());
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

  const onSave = async (data) => {
    if (selectedImageFile) {
      ImageEdit(selectedImageFile, data);
    } else {
      let params = {
        dob: moment(data?.dob).format("YYYY-MM-DD"),
        address: data?.address || undefined,
        city: data?.city || undefined,
        country: data?.country || undefined,
        postcode: data?.postcode || undefined,
        firstName: data?.firstName,
        lastName: data?.lastName,
        longitude: String(data?.longitude),
        latitude: String(data?.latitude),
        profilePhoto: selectedImage ? selectedImage : "",
      };
      setupProfileFunc(params);
    }
  };

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
      setSelectedImage(null);
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

  // if (!isLoaded) return <></>;
  // if (!isLoaded1) return <></>;
  return (
    <>
      <section className="authbg">
        <Header />
        <div>
          <nav className="lg:mt-24 md:mt-44 mt-28 p-4 px-20 bg-[#F0F8FF]">
            <Link
              href="/Profile"
              className="text-[#919EAB] font-medium text-base md:text-lg hover:underline"
            >
              Profile
            </Link>{" "}
            &gt;
            <span className="text-base md:text-lg font-medium">
              {" "}
              Edit Profile
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4">
              Edit Profile
            </h1>
          </nav>
          <div className="mx-auto p-4 flex justify-center items-center">
            <div className="flex flex-col lg:flex-row w-full md:mx-10 shadow-lg rounded-xl border-2 border-[#FFFFFF] overflow-hidden">
              {/* <!-- Sidebar --> */}
              <div className="w-full lg:w-1/4 bg-white p-4">
                <div className="mb-8">
                  <div className="mt-6 mb-6 relative flex justify-center">
                    <div className="xl:w-[243px] xl:h-[243px] w-[200px] h-[200px] relative bg-white border-2 border-[#1B75BC33] rounded-full flex justify-center items-center">
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
                    </div>

                    {/* {(userDetails?.profile_photo || selectedImage) && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-[#00000080] text-white text-sm rounded-md py-1 px-4">
                        Remove
                      </button>
                    )} */}

                    <label htmlFor="image-upload">
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <div className="absolute -bottom-1 cursor-pointer right-10 medmob:right-20 lmob:right-24 md:right-56 lg:right-6 xl:right-8 mid:right-12 2xl:right-24  rounded-full border border-white">
                        <Image
                          src="/assets/camera.svg"
                          alt="whitePencil"
                          width="56"
                          height="56"
                          className="xl:w-[56px] xl:h-[56px] w-11 h-11"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- Main Content --> */}
              <div className="w-full lg:w-3/4 p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

                <form onSubmit={handleSubmit(onSave)}>
                  <div className="   PersonalDetails pb-5 overflow-y-auto">
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
                                    // slots={{
                                    //   textField: (params) => (
                                    //     <TextField {...params} onClick={() => setOpen(true)} />
                                    //   ),
                                    // }}
                                    // open={open}
                                    // onOpen={() => setOpen(true)}
                                    // onClose={() => setOpen(false)}
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
                      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
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
                        <button type='button' disabled={(`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue} onClick={() => handleVerify("phone")} className={`w-40 h-12 mt-6 block text-center font-semibold ${((`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue) ? 'bg-[#c5e29f]' : 'bg-[#8DC63F]'}   text-white   shadow-lg  ${((`${userDetails?.phone_code}${userDetails?.phone_number}`) === phoneValue) ? "" : "shadow-[#8DC63F]"} rounded-xl`}>
                          {(verifyLoading && loginType === "phone") ? <Spinner /> : "Verify"}
                        </button>
                      </div>
                      <div>
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
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="md:px-12 px-7 font-semibold mainblue text-white p-4 blueshadow shadow-lg mt-4 shadow-[#1B75BC] rounded-xl"
                      disabled={IsLoading}
                    >
                      {IsLoading ? <Spinner /> : " Save Profile"}
                    </button>
                  </div>
                </form>
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
        <Footer />
      </section>
    </>
  );
}

export default EditProfile;
