import React, { useRef, useState } from 'react'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer';
import Link from 'next/link';
import Details from '../../components/professionalEdit/details';
import EditDocs from '../../components/professionalEdit/editDocs';
import EditPortfolio from '../../components/professionalEdit/editPortfolio';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { getTheProfile, selectLoginAuth, setupProfessionalProfile } from '../../redux/auth/authSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationPatterns } from '../../constants/constant';
import dayjs from "dayjs";
import Documents from '../../components/auth/Documents';
import { options } from '../../utilities/helper';
import Image from 'next/image';
import Error from '../../components/common/Error';

function EditProfessional() {
    const userDetails = useSelector(selectLoginAuth);

    const [errorPortfolioImage, setErrorPortfolioImage] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const [certificatesError, setCertificatesError] = useState("");
    const [licensesError, setLicensesError] = useState("");
    const [passportError, setpassportError] = useState("");
    const [selfieError, setselfieError] = useState("");
    const [profileImage, setProfileImage] = useState(userDetails?.profile_photo ? userDetails?.profile_photo : "")
    const [isDocsUploading, setIsDocsUploading] = useState(false);
    const [isPortfolioUploading, setIsPortfolioUploading] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();
    const toastId = React.useRef(null);

    const auth = useSelector(selectLoginAuth);
    const defaultoff_days_flag = auth?.professional?.off_days_flag;
    const defaultoff_days = auth?.professional?.off_days;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [selectedOffDay, setSelectedOffDay] = useState(defaultoff_days_flag);
    const [selectedDays, setSelectedDays] = useState(
        defaultoff_days_flag === "other" ? defaultoff_days : []
    );

    const [error, setError] = useState(false);
    const [dayserror, setdaysError] = useState(false);
    const dropdownRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            dropdownRef.current?.scrollIntoView({ block: "end", inline: "nearest" })
        }, 100);
    }

    const handleOffDaySelection = (day) => {
        setSelectedOffDay(day);
        if (day !== "other") {
            setSelectedDays([]); // Reset selectedDays when other than "Other" is selected
        }

    };
    const getSelectedDaysString = () => {
        return selectedDays.length > 0 ? selectedDays.join(", ") : "Select";
    };

    const handleDayCheckboxChange = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((d) => d !== day)
                : [...prevSelectedDays, day?.toLowerCase()]
        );

        setError(false);
        setdaysError(false);
    };

    const [IsLoading, setIsLoading] = useState(false);
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

    const DocsData = {
        setLicensesError,
        setpassportError,
        setselfieError,
        setCertificatesError,
        licensesError,
        passportError,
        selfieError,
        certificatesError,
        licenses: [],
        certificates: [],
        uploadedImage: null,
        capturedImage: null,
        setIsDocsUploading,
    };

    const portfolioData = {
        setErrorPortfolioImage,
        setErrorDescription,
        errorPortfolioImage,
        errorDescription,
        images: [],
        description: "",
        setIsPortfolioUploading,
    };

    const setupProfileFunc = (params) => {
        setIsLoading(true);
        dispatch(setupProfessionalProfile(params))
            .then(unwrapResult)
            .then(async (obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                // await Cookies.set("profileStatus", true);
                await getProfileFunc();
                await router.push("/professionalProfile");

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
            offDaysFlag: selectedOffDay?.toLowerCase() || defaultoff_days_flag,
            offDays: selectedDays?.length > 0 ? selectedDays : [],
        },
    });

    const handleUpdateProfile = (data) => {


        console.log(data, profileImage, "updated dattaa");
        let isValid = true;

        setLicensesError('');
        setpassportError('');
        setselfieError('');
        setErrorPortfolioImage('');
        setErrorDescription('');

        // if (DocsData.licenses.length === 0) {
        //     setLicensesError("Please upload license");
        //     isValid = false;
        // }

        // if (DocsData.uploadedImage === null) {
        //     setpassportError("Please upload your Passport/ID Proof");
        //     isValid = false;
        // }


        if (!selectedOffDay) {
            setError(true);
            isValid = false;
        }

        if ((selectedOffDay === "other" && selectedDays?.length == 0)) {
            setdaysError(true);
            isValid = false;
        }

        // if (DocsData.capturedImage === null) {
        //     setselfieError("Please take a photo of your Passport/ID Proof");
        //     isValid = false;
        // }

        // Validate Portfolio Data
        if (portfolioData.images.length === 0) {
            setErrorPortfolioImage('Please upload at least one portfolio image.');
            isValid = false;
        }
        if (!portfolioData.description.trim()) {
            setErrorDescription('Please add a description.');
            isValid = false;
        }

        if (isValid) {
            delete data?.phone
            const params = {
                ...data,
                profilePhoto: profileImage || undefined,
                portfolioDetail: {
                    images: portfolioData.images,
                    description: portfolioData.description
                },
                // uploadPassport: DocsData.capturedImage ? [DocsData.uploadedImage, DocsData.capturedImage] : [DocsData.uploadedImage],
                // uploadLicenses: DocsData.licenses,
                // uploadCertificate: DocsData.certificates,
            };
            setupProfileFunc(params);
        }

    };




    return (
        <>
            <section className="">
                <Header />

                <form onSubmit={handleSubmit(handleUpdateProfile)}>
                    <div>
                        <nav className="lg:mt-24 md:mt-44 mt-28 p-4 pl-10 md:pl-20 pr-7 bg-[#F0F8FF]">
                            <Link
                                href="/professionalProfile"
                                className="text-[#919EAB] font-medium text-base md:text-lg hover:underline"
                            >
                                Profile
                            </Link>{" "}
                            &gt;
                            <span className="text-base md:text-lg font-medium">
                                {" "}
                                Edit Profile
                            </span>
                            <div className="flex justify-between items-center flex-wrap">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4">
                                    Edit Profile
                                </h1>
                                <div>
                                {/* className='flex gap-3' */}
                                    {/* <button type="button" className="bg-[#F14336] text-sm md:text-lg text-white px-2  md:px-4 h-12 shadow-lg shadow-[#F14336] rounded-xl" >Delete User</button> */}
                                    <button
                                        type='submit'
                                        disabled={isDocsUploading || isPortfolioUploading}
                                        className={`text-sm md:text-lg text-white px-2 md:px-4 py-3 shadow-lg rounded-xl ${isDocsUploading || isPortfolioUploading
                                            ? 'bg-gray-400 shadow-gray-400'
                                            : 'mainblue blueshadow shadow-[#1B75BC]'
                                            }`}
                                    >
                                        {" "}
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </nav>

                        <section className='bg-white rounded-xl border border-white m-8 pinkshadow'>
                            <Details setProfileImage={setProfileImage} selectedImage={profileImage} errors={errors} userDetails={userDetails} trigger={trigger} watch={watch} setValue={setValue} register={register} control={control} />
                            <div className='px-6 -mt-6'>
                                <label
                                    htmlFor="Offday"
                                    className="block text-lg pt-3 pl-1 font-normal"
                                >
                                    Off Day&apos;s
                                </label>
                                <div className="relative mt-1 w-full md:w-96">
                                    <button
                                        type="button"
                                        onClick={() => { setIsDropdownOpen(!isDropdownOpen); scrollToBottom() }}
                                        className={`w-full flex justify-between text-left text-sm font-medium p-3 capitalize bg-[#FFFFFF] rounded-xl blueBordermain outline-none ${!selectedOffDay ? "text-gray-500" : "text-black"
                                            }`}
                                    >
                                        <span>{selectedOffDay === "other"
                                            ? getSelectedDaysString()
                                            : selectedOffDay || "Select"}</span>
                                        <Image alt="Jobizz Logo" width="20" height="16" src="/assets/arrowdown.svg" />

                                    </button>

                                    <div
                                        className={`absolute bg-white rounded-b-xl shadow-lg z-[45] ${isDropdownOpen ? "block" : "hidden"
                                            }`}
                                    >
                                        <div className="p-4">
                                            <ul>
                                                <li className="flex items-center mb-3">
                                                    <input
                                                        id="weekend"
                                                        type="radio"
                                                        name="offday"
                                                        className="form-radio radio-custom  text-green-600"
                                                        onChange={() => {
                                                            handleOffDaySelection("weekend");
                                                            setError(false);
                                                            setdaysError(false);
                                                        }}
                                                        checked={selectedOffDay === "weekend"}
                                                    />
                                                    <label
                                                        htmlFor="weekend"
                                                        className="ml-3 text-sm font-normal"
                                                    >
                                                        Weekend{" "}
                                                        <span className="text-[#919EAB] text-xs font-normal ml-1">
                                                            {" "}
                                                            (Saturday & Sunday)
                                                        </span>
                                                    </label>
                                                </li>
                                                <li className="flex items-center mb-3">
                                                    <input
                                                        id="fortnightly"
                                                        type="radio"
                                                        name="offday"
                                                        className="form-radio radio-custom  text-green-600"
                                                        onChange={() => {
                                                            handleOffDaySelection("fortnightly");
                                                            setError(false);
                                                            setdaysError(false);
                                                        }}
                                                        checked={selectedOffDay === "fortnightly"}
                                                    />
                                                    <label
                                                        htmlFor="fortnightly"
                                                        className="ml-3 text-sm font-normal"
                                                    >
                                                        Fortnightly{" "}
                                                        <span className="text-[#919EAB] text-xs font-normal ml-1">
                                                            {" "}
                                                            (i.e. once every two weeks)
                                                        </span>
                                                    </label>
                                                </li>
                                                <li className="flex items-center">
                                                    <input
                                                        id="other"
                                                        type="radio"
                                                        name="offday"
                                                        className="form-radio radio-custom  text-green-600"
                                                        onChange={() => {
                                                            handleOffDaySelection("other");
                                                            setError(false);
                                                        }}
                                                        checked={selectedOffDay === "other"}
                                                    />
                                                    <label
                                                        htmlFor="other"
                                                        className="ml-3 text-sm font-medium text-gray-900"
                                                    >
                                                        Other
                                                    </label>
                                                </li>
                                            </ul>
                                            <div className="mt-4">
                                                <div className="flex flex-wrap gap-3">
                                                    {options.map((day, index) => (
                                                        <label
                                                            key={index}
                                                            className="flex items-center custom-checkbox"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="form-checkbox text-blue-600"
                                                                checked={selectedDays.includes(day?.value)}
                                                                onChange={() =>
                                                                    handleDayCheckboxChange(day?.value)
                                                                }
                                                                disabled={selectedOffDay !== "other"}
                                                            />
                                                            <span className="checkmark2"></span>
                                                            <span className="ml-2 text-sm text-gray-900">
                                                                {day?.label}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {dayserror && (
                                                    <Error className="mt-2" error="Please select days also." />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {dayserror && (
                                        <Error className="mt-2" error="Please select days also." />
                                    )}
                                    {error && (
                                        <Error error="Please select any one option" />
                                    )}

                                </div>
                            </div>
                            <EditDocs DocsData={DocsData} />
                            <EditPortfolio portfolioData={portfolioData} />
                        </section>
                    </div>
                </form>
                <Footer />
            </section>
        </>
    );
}

export default EditProfessional;
