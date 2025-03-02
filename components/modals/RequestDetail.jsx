import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Error from "../common/Error";
import moment from "moment-timezone";
import { selectLoginAuth, uploadTheDocuments } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";
import { createPersonalRequest } from "../../redux/customer/customerSlice";
import { useRef } from "react";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from "@mui/material";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

function RequestDetail({ isOpen, onClose, selectedServices, onRemoveService, id, setSelectedServices }) {

  const userTimeZone = dayjs.tz.guess();
  const currentTime = dayjs().tz(userTimeZone);
  const twoHoursLater = currentTime.add(2, 'hour');
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [UploadedUrls, setUploadedUrls] = useState([]);
  const [address, setAddress] = useState("");

  const [addresserror, setaddresserror] = useState("");
  const [time, settime] = useState("");
  const [latLng, setLatLng] = useState({});
  const toastId = useRef(null);
  const [Loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [requestType, setRequestType] = useState("door_step")
  const minDate = dayjs();
  const auth = useSelector(selectLoginAuth)

  const totalAmount = selectedServices.reduce((total, service) => {
    const amount = service.totalAmount || Number(service.price);
    return total + amount;
  }, 0);

  const displayedPrice = (service) => {
    return service.totalAmount
      ? service.totalAmount
      : Number(service.price);
  };


  const schema = yup.object().shape({
    details: yup.string().required("This is required field"),
    title: yup.string().required("This is required field"),
    date: yup
      .date()
      .nullable()
      .required("This is a required field")
      .typeError("Invalid date")
      .min(moment().startOf('day').toDate(), "Date cannot be in the past")
      .transform((value, originalValue) => {
        return originalValue === "" ? null : new Date(originalValue);
      }),
    time: yup
      .string()
      .required("This is a required field")
      .test("is-two-hours-ahead", "You can book service only two hours prior", function (value) {
        const { date } = this.parent; // Get the date from the form
        if (!date) return true; // If no date is selected, skip this validation

        const selectedDate = moment(date).startOf('day'); // Get the start of the selected date
        const currentDate = moment().startOf('day'); // Get the start of the current date

        // If the selected date is not today, skip the time validation
        if (!selectedDate.isSame(currentDate)) return true;

        // Parse the selected time in 12-hour format with AM/PM
        const selectedTime = moment(value, "h:mm A");
        const currentTime = moment(); // Current time

        console.log("Selected Time:", selectedTime.format("h:mm A"));
        console.log("Current Time + 2 hours:", currentTime.add(2, 'hours').format("h:mm A"));

        // Ensure that the selected time is at least 2 hours ahead of the current time
        if (selectedTime.isBefore(moment().add(2, 'hours'))) {
          return false; // Fail the validation
        }

        return true; // Pass the validation
      }),
    budget: yup.string().notRequired(),
    address: requestType === "door_step" ? yup.string().required("This is required field") : yup.string().notRequired(),
    serviceIds: yup
      .array()
      .min(1, "Please go back and select service.") // Ensures that there is at least 1 service in the array
      .required("Please go back and select service."),
    requestType: yup.string().required("This is required field")
  });


  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)

  });
  const watchDate = watch('date');

  const onSave = async (data) => {

    if (data.date) {
      data.date = moment(data.date).format("YYYY-MM-DD");
    }

    if (data.budget) {
      data.budget = Number(data.budget)
    } else {
      delete data.budget;
    }

    let params = {
      ...data,
      totalAmount: totalAmount,
      // address: address,
      // serviceIds: selectedServices?.map(service => service.id),
      request: "private_request",
      professionalId: id,
      time: time,
                latitude: String(Number(latLng.lat)),
          longitude: String(Number(latLng.lng))
    }
  //   if (requestType === "door_step") {
  //     params = {
  //         ...params,
  //         latitude: String(Number(latLng.lat)),
  //         longitude: String(Number(latLng.lng))
  //     }
  // }
  // else{
  //     params = {
  //       ...params,
  //         address: auth?.address,
  //         latitude: String(Number(auth?.latitude)),
  //         longitude: String(Number(auth?.longitude))
  //     }
  // }

    if (UploadedUrls && UploadedUrls.length > 0) {
      params.images = UploadedUrls;
    }
    setButtonLoading(true)
    dispatch(createPersonalRequest(params))
      .then(unwrapResult)
      .then((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(obj?.data?.message);
        }
        setButtonLoading(false)
        setSelectedServices([]);
        onClose();
      })
      .catch((obj) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(obj?.msg);
        }
        setButtonLoading(false)
      });

    console.log(params, "data")
  };


  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    let images = uploadedFiles.filter(file => file.type.startsWith("image/")).length;
    let videos = uploadedFiles.filter(file => file.type.startsWith("video/")).length;

    const validFiles = newFiles.filter(file => {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        images++;
        return images <= 2; // Allow up to 2 images
      } else if (fileType.startsWith("video/")) {
        videos++;
        return videos <= 1; // Allow only 1 video
      }
      return false;
    });

    if (images > 2 || videos > 1) {
      setErrorMessage("You can upload up to 2 images and 1 video.");
    } else {
      setErrorMessage("");
      const updatedFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(updatedFiles);

      // Create previews for the updated files
      const filePreviews = updatedFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setPreviews(filePreviews);
      uploadTheDocument(validFiles)
    }
  };

  const uploadTheDocument = (files) => {
    setLoading(true)
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    dispatch(uploadTheDocuments(formData))
      .then(unwrapResult)
      .then((response) => {
        const uploadedimages = response?.data?.data.map((file) => file.url);
        setUploadedUrls((prevUrls) => [...prevUrls, ...uploadedimages]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading documents", error);
      });
  };

  const handleWheel = (e) => {
    e.target.blur(); // Removes focus from the input
    e.preventDefault(); // Prevents the default scroll behavior
  };

  const blockInvalidChar = (e) => {
    // Allow backspace
    if (e.key === "Backspace") {
      return;
    }
    // Block alphabets and specific characters
    if (!/^\d$/.test(e.key) || ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);

    // Update previews
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };


  const onTimeChange = (event) => {
    const date = new Date(event);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;


    if (!formattedTime) return;

    const timeSplit = formattedTime.split(':');
    let hour = parseInt(timeSplit[0]);
    const minute = timeSplit[1];
    let meridian = '';

    // Convert 24-hour format to 12-hour format with AM/PM
    if (hour > 12) {
      meridian = 'PM';
      hour -= 12;
    } else if (hour < 12) {
      meridian = 'AM';
      if (hour === 0) {
        hour = 12;
      }
    } else {
      meridian = 'PM'; // 12 PM case
    }

    // Ensure the hours are two digits (prepend 0 if necessary)
    const formattedHours = hour < 10 ? `0${hour}` : hour;

    // Update the time in the format "HH:MM AM/PM"
    const formattedTime1 = `${formattedHours}:${minute} ${meridian}`;
    settime(formattedTime1);
    setValue("time", formattedTime1 || "", { shouldValidate: true });
    trigger("time");
    console.log(formattedTime);
    console.log(formattedTime, "ddddddddddddddddddddddddddddddddda");
  };

  const autoCompleteHandleChange = (address) => {

    setAddress(address);
    setValue("address", address);
    trigger("address")
  };

  const autoCompleteHandleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        console.log(results[0].formatted_address, "addressaddress")
        setValue("address", results[0].formatted_address);
        trigger("address")
        setAddress(results[0].formatted_address);
        // setValue("latitude", results[0].geometry.location.lat());
        // setValue("longitude", results[0].geometry.location.lng());
        setLatLng({
          lat: Number(results[0].geometry.location.lat()),
          lng: Number(results[0].geometry.location.lng())
        })
      })
      .catch((error) => { });
  };
  const shouldDisableTime = (timeValue) => {
    if (!timeValue) return false;
    const timeToCheck = dayjs(timeValue).tz(userTimeZone);

    // Example usage: logging times to verify
    console.log('Current Time:', watchDate);
    console.log('Two Hours Later:', twoHoursLater.format('YYYY-MM-DD HH:mm'));
    const timeToCheckDate = timeToCheck.format('YYYY-MM-DD');
    const specificDate = watchDate.format('YYYY-MM-DD')

    console.log(specificDate, timeToCheckDate, "222222222222222222222222222");
    if (timeToCheckDate === specificDate) {
      return timeToCheck.isSameOrBefore(twoHoursLater, 'minute');
    }

    // Disable times before or equal to two hours from the current time
    return false
  };

  useEffect(() => {
    setValue("serviceIds", selectedServices?.map(service => service?.services?.id) || []);
  }, [onRemoveService])

  useEffect(() => {
    if (watchDate) {
      clearErrors('time'); // Clear the time error when the date changes
    }
  }, [watchDate, clearErrors]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white rounded-xl w-full max-w-lg mx-8 md:px-4 shadow-lg">
          <button
            type='button'
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &#x2715;
          </button>
          <div className="px-3 pt-3 pb-3 shadow-sm">
            <h2 class="text-xl text-left font-semibold">Request Details</h2>
            <p class="text-gray-600 text-left text-sm">
              Please fill out the form to book our best services on the board.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSave)}>
            <div className="p-3 h-[68vh] overflow-y-auto">

              <div className="flex gap-4 overflow-x-auto mb-4">
                {selectedServices.map((service) => (
                  <div
                    key={service.services.id}
                    className="flex w-28 border flex-col items-center p-2 rounded-md policyShadow relative"
                  >
                    <img
                      src={service.services.image || "https://via.placeholder.com/100"}
                      alt={service.services.name}
                      className="w-12 h-12 rounded-md mb-2"
                    />
                    <span className="text-center text-xs font-medium">
                      {service.services.name}
                    </span>
                    <span className="mainbluetext text-lg font-bold">
                      ${displayedPrice(service)} {/* Format price */}
                    </span>
                    <button
                      onClick={() => onRemoveService(service)}
                      className="absolute bg-white top-0 right-1 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-left">
                {/* {ServiceError && <Error error={ServiceError} />} */}
                {errors.serviceIds && <Error error={errors.serviceIds?.message} />}

              </div>

              <p class="text-sm mb-4 text-left">
                Total Amount: <span class="mainbluetext font-bold">${totalAmount}</span>
              </p>

              <div class="space-y-2">

                <div className="text-left">
                  <label
                    htmlFor="title"
                    className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                  >
                    Job Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter Job title"
                    {...register("title")}
                    class="w-full requestborder outline-none rounded-md p-2 focus:outline-none "
                  />
                  {errors.title && <Error error={errors.title?.message} />}
                </div>

                <div className="text-left">
                  <label
                    htmlFor="details"
                    className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                  >
                    Details
                  </label>
                  <textarea
                    {...register("details")}
                    name="details"
                    placeholder="Enter service details"
                    class="w-full requestborder outline-none -mb-2 rounded-md p-2 focus:outline-none"
                  ></textarea>
                  {errors.details && <Error error={errors.details?.message} />}
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                  >
                    Desired budget (Optional)
                  </label>
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <span class="absolute left-2 top-1/2 transform -translate-y-1/2 mainbluetext">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="29"
                        name="budget"
                        onWheel={handleWheel}
                        onKeyDown={blockInvalidChar}
                        id="budget"
                        min={1}
                        {...register("budget")}
                        class="pl-6 pr-2 py-2 outline-none w-full requestborder rounded-md focus:outline-none "
                      />
                    </div>
                  </div>

                </div>

                <div className='text-left'>
                  <label
                    htmlFor="requestType"
                    className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                  >
                    Service Type
                  </label>
                  <div class="flex items-center gap-2 ml-1 my-2">
                    <div class="flex items-center">
                      <input
                        type="radio"
                        id="door_step"
                        name="requestType"
                        value="door_step"
                        {...register("requestType")}
                        onChange={() => setRequestType("door_step")}
                        class="mr-2"
                      />
                      <label htmlFor="door_step" className="text-sm text-gray-700">My location</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="radio"
                        id="walkin"
                        name="requestType"
                        value="walkin"
                        {...register("requestType")}
                        onChange={() => setRequestType("walkin")}
                        class="mr-2"
                      />
                      <label htmlFor="walkin" className="text-sm text-gray-700">Professional location</label>
                    </div>
                  </div>
                  {errors.requestType && <Error error={errors.requestType?.message} />}
                </div>

                <div>
                  <label
                    htmlFor="Service"
                    className="block text-xs text-left maxmid:text-sm pl-1 font-normal text-gray-700"
                  >
                    Customer Place
                  </label>
                  {/* <input
                    type="text"
                    placeholder="Enter Service place address"
                    class="w-full requestborder outline-none rounded-md p-2 focus:outline-none "
                  /> */}
                  <div className="relative text-left">
                    <PlacesAutocomplete
                      value={address || ""}
                      onChange={autoCompleteHandleChange}
                      onSelect={autoCompleteHandleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div className="relative  rounded-xl">
                          <input
                            {...getInputProps({
                              placeholder: "Enter Service place address",
                              className:
                                "location-search-input customform-control countrytags_",
                            })}
                            className="block pinkshadow w-full darkblueborder pl-3 text-sm font-medium py-0.5 md:py-2 bg-[#FFFFFF] rounded-md placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-500 outline-none sm:text-sm"
                            // disabled={requestType === "walkin"}
                         />
                          <div className="autocomplete-dropdown-container shadow-xl">
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
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                  key={index}
                                  className="inner-autocomplete"
                                >
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                    {/* {addresserror && <Error error={addresserror} />} */}
                    {errors.address && <Error error={errors.address?.message} />}

                  </div>
                </div>

                <div class="grid grid-cols-1 lmob:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label
                      htmlFor="date"
                      className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                    >
                      Date
                    </label>
                    {/* <input
                      id="date"
                      type="date"
                      {...register("date")}
                      class="w-full requestborder outline-none rounded-md p-2 focus:outline-none "
                    /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="date" // Change this to "date" if you're updating the date field
                        control={control}
                        render={({ field }) => (
                          <>
                            <DatePicker
                              {...field}
                              format="DD/MM/YYYY"
                              className="outline-none pinkshadow bg-white"
                              renderInput={(params) => (
                                <TextField
                                  {...register("date")}
                                  className="newOne"
                                  {...params}
                                />
                              )}
                              sx={{
                                width: "100%",
                                background: "white",
                                borderColor: "transparent !important",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "2px solid #1B75BC66 !important",
                                  borderRadius: "6px",
                                },
                                "& .MuiInputBase-input ": {
                                  height: "0.7rem !important",
                                },
                              }}
                              minDate={minDate}
                            />
                          </>
                        )}
                      />
                    </LocalizationProvider>
                    {errors.date && <Error error={errors.date?.message} />}
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="time"
                      className="block text-left text-xs maxmid:text-sm pl-1 font-normal text-gray-700"
                    >
                      Time
                    </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        // label="Select Booking Time"
                        //   value={value}
                        // placeholder="sdd"
                        onChange={(e) => onTimeChange(e)}
                        shouldDisableTime={shouldDisableTime}
                        ampm={false}
                        // slots={{
                        //     textField: (params) => (
                        //         <TextField {...params} placeholder="Select Booking Time" />
                        //     ),
                        // }}
                        className="flex-1 w-full GrayBorder outline-none rounded-md p-2 focus:outline-none "
                        sx={{
                          width: "100%",
                          background: "white",
                          borderColor: "transparent !important",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "2px solid #1B75BC66 !important",
                            borderRadius: "6px",
                          },
                          "& .MuiInputBase-input": {
                            height: "0.7rem !important",
                          },
                        }}
                      // renderInput={(params) => (
                      //     <TextField placeholder="ddd" {...params} InputLabelProps={{ shrink: false }} /> // This hides the label
                      // )}
                      />
                    </LocalizationProvider>
                    {errors.time && <Error error={errors.time?.message} />}

                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs text-left maxmid:text-sm pl-1 mb-1 font-normal text-gray-700"
                  >
                    Attach Photos or Videos (Optional)
                  </label>
                  {
                    Loading ?
                      <div
                        className="relative flex servicesShadow justify-center items-center w-28 h-28 bg-white rounded-xl p-2">
                        < PuffLoader
                          color="#4de527"
                          loading
                          size={35}
                          speedMultiplier={3}
                        />
                      </div>
                      :
                      <div className={`flex flex-wrap sm:flex-nowrap ${previews.length > 0 ? "gap-3" : ""}  mt-4`}>
                        {/* Preview Section */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-4">
                          {previews.map((file, index) => (
                            <div key={index} className="relative flex flex-col items-center">
                              {file.type.startsWith("image/") ? (
                                <img
                                  src={file.url}
                                  alt="Preview"
                                  className="w-28 h-28 object-cover rounded-lg"
                                />
                              ) : (
                                <video
                                  src={file.url}
                                  controls
                                  className="w-28 h-28 object-cover rounded-lg"
                                />
                              )}
                              <Image
                                onClick={() => handleRemoveFile(index)}
                                src="/assets/redcross.svg"
                                width="24"
                                height="24"
                                alt="Remove Icon"
                                className="absolute -top-2 -right-2 cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>


                        {
                          previews.length !== 3 && (
                            <label className={`flex ${previews.length > 0 ? "py-2" : "w-full py-6"} servicesShadow bg-white cursor-pointer flex-col justify-center items-center px-6 border border-dashed border-[#8DB7DD] rounded-xl`}>
                              <Image
                                width="50"
                                height="50"
                                src="/assets/uploaddocs.svg"
                                alt="Experience Certificate Icon"
                              />
                              <p className="text-xs maingray text-center">
                                Upload Photos and Videos files.
                              </p>
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept=".jpg,.png,.jpeg,.mp4,.mov,.avi"
                                multiple
                                onChange={handleFileChange}
                              />
                            </label>
                          )
                        }
                      </div>
                  }
                  {errorMessage && <p className="text-red-500  mt-1 text-left text-xs">{errorMessage}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center mb-2 p-1">
              <button disabled={buttonLoading} type="submit" class="py-2 mainblue text-white rounded-md px-3 transition-colors">
                Place Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestDetail;
