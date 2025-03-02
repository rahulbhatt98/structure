import { useEffect, useRef } from "react";
import Image from "next/image";
import { useState } from "react";
import WebcamModal from "../modals/webcam";
import Error from "../common/Error";
import { getServiceStepAsync, getTheProfile, selectLoginAuth, uploadTheDocuments } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { setupProfessionalProfile } from "../../redux/auth/authSlice";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useRouter } from "next/router";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { PuffLoader } from 'react-spinners';

function Documents() {
    const auth = useSelector(selectLoginAuth);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [bigImage, setbigImage] = useState("");
    const uploadPassport = Array.isArray(auth?.professional?.upload_Passports) ? auth.professional.upload_Passports : [];
    const DefaultPassportPic = uploadPassport[0] || null;
    const DefaultSelfie = uploadPassport[1] || null;
    const professionalService = auth?.professional?.professionalUserServices
    const [selectedId, setSelectedId] = useState(professionalService?.length > 0 ? professionalService[0]?.id : null);
    const options = (router?.pathname === "/professionalProfile/editProfessional") ? professionalService?.filter(val => val?.admin_status == "approve")?.map(service => ({
        value: service.id,
        label: service.services.name,
    })) : professionalService?.map(service => ({
        value: service.id,
        label: service.services.name,
    }))
    const dispatch = useDispatch();
    const toastId = useRef(null);
    const [IsLoading, setIsLoading] = useState(false);
    const [isWebcamModalOpen, setisWebcamModalOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(DefaultPassportPic ?? null);
    const [capturedImage, setCapturedImage] = useState(DefaultSelfie ?? null)
    const [passportError, setpassportError] = useState('');
    const [selfieError, setselfieError] = useState('');
    const [passportLoading, setpassportLoading] = useState(false);
    const [selfieLoading, setselfieLoading] = useState(false);
    const [passportUrl, setPassportUrl] = useState(DefaultPassportPic ?? null);
    const [selfieUrl, setSelfieUrl] = useState(DefaultSelfie ?? null);

    const openModal = () => {
        setisWebcamModalOpen(true);
    };

    const closeModal = () => setisWebcamModalOpen(false);

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl?.split(','),
            mime = arr?.length > 0 && arr[0]?.match(/:(.*?);/)[1],
            bstr = arr?.length > 0 && atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(20)
        );
    }


    const handleCapture = (imageSrc, type) => {
        if (imageSrc) {
            setselfieError("");
        }

        setCapturedImage(imageSrc);
        let file1 = dataURLtoFile(imageSrc, `${uuidv4()}.jpeg`);
        const formData = new FormData();
        formData.append(`files`, file1)
        uploadTheDocument(formData, type);
    };

    const handleSelfie = () => {
        setCapturedImage(null);
    };

    const handlePhotoUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            setpassportError("");
        }
        if (file) {
            setUploadedImage({
                image: `${URL.createObjectURL(file)}`,
                status: null
            });
            const formData = new FormData();
            formData.append(`files`, file)
            uploadTheDocument(formData, type);
        };

    }
    const handleRemovePhoto = () => {
        setUploadedImage(null);
    };
    const uploadTheDocument = (formData, type) => {
        switch (type) {
            case 'passport':
                setpassportLoading(true);
                break;
            case 'selfie':
                setselfieLoading(true);
                break;
            default:
        }

        dispatch(uploadTheDocuments(formData))
            .then(unwrapResult)
            .then((obj) => {
                let uploadedUrl = obj?.data?.data;

                if (uploadedUrl?.length > 0) {
                    uploadedUrl = uploadedUrl.map(obj => obj.url);
                }

                switch (type) {
                    case 'passport':
                        setPassportUrl({ image: uploadedUrl[0] });
                        setpassportLoading(false);
                        break;
                    case 'selfie':
                        setSelfieUrl({ image: uploadedUrl[0] });
                        setselfieLoading(false)
                        break;
                    default:
                }
            })
            .catch((obj) => {
            });
    }


    const setupProfileFunc = (params) => {
        setIsLoading(true);
        dispatch(setupProfessionalProfile(params))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                dispatch(getServiceStepAsync("3"))

                getProfileFunc();
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
            .then((obj) => {


            })
            .catch((obj) => { });
    };
    const onSave = () => {

        let params = {
            "uploadPassport": selfieUrl ? [passportUrl?.image, selfieUrl?.image] : [passportUrl?.image],
        }

        let isValid = true;


        if (uploadedImage === null) {
            setpassportError("Upload photo");
            isValid = false;
        }

        if (isValid) {
            setupProfileFunc(params);
        }
    }

    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
    const handleServiceSelect = (option) => {
        const selectedService = professionalService.find(service => service.id === option.value);
        setSelectedId(option.value);
        setSelectedServiceDetails(selectedService); 
    };

    useEffect(() => {
        if (professionalService && professionalService.length > 0) {
            const defaultService = professionalService[0];
            setSelectedId(defaultService.id);
            setSelectedServiceDetails(defaultService);
        }
    }, [professionalService]);

    return (
        <>
            <div className={`${router.pathname !== "/professionalProfile/editProfessional" ? "w-full lg:w-3/4 p-6" : ""}`}>
                <section>
                    {isOpen && (
                        <Lightbox
                            mainSrc={bigImage}
                            onCloseRequest={() => setIsOpen(false)}
                        />
                    )}
                    <div className={`${router.pathname !== "/professionalProfile/editProfessional" ? "profileHeight PersonalDetails pb-5 overflow-y-auto" : ""}`}>
                        <div className="rounded">
                            {
                                router.pathname !== "/professionalProfile/editProfessional" && (
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Passport/ID Proof
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                {
                                                    passportLoading ?
                                                        <div className="bg-white rounded-xl flex justify-center items-center w-full h-full xl:py-1 md:p-6">
                                                            < PuffLoader
                                                                color="#4de527"
                                                                loading
                                                                size={35}
                                                                speedMultiplier={3}
                                                            />
                                                        </div>
                                                        :
                                                        <div >
                                                            {uploadedImage ? (
                                                                <div className="bg-white rounded-xl w-full h-full xl:py-1 md:p-6">
                                                                    <div className="flex relative justify-center items-center">
                                                                        <div className="relative">
                                                                            {(auth?.profile_completed_steps === "4" && uploadedImage?.status === "refuse") && <div className="absolute inset-0 rounded-xl bg-black bg-opacity-10 backdrop-blur-sm"></div>}
                                                                            <Image
                                                                                src={uploadedImage?.image}
                                                                                alt="Uploaded Photo"
                                                                                className="object-cover rounded-xl w-[320px] h-[181px] cursor-pointer"
                                                                                width="320"
                                                                                height="203"
                                                                                onClick={() => { setIsOpen(true); setbigImage(uploadedImage?.image); }}
                                                                            />
                                                                            {(auth?.profile_completed_steps === "4" && uploadedImage?.status === "refuse") && <label className="">
                                                                                <Image
                                                                                    width="50"
                                                                                    height="50"
                                                                                    src="/assets/uploaddocs.svg"
                                                                                    alt="Experience Certificate Icon"
                                                                                    className="absolute top-1/3 left-[40%] cursor-pointer"
                                                                                />
                                                                                <input
                                                                                    type="file"
                                                                                    id="photoInput"
                                                                                    accept=".jpg, .png, .jpeg"
                                                                                    style={{ display: "none" }}
                                                                                    onChange={(e) => handlePhotoUpload(e, 'passport')}
                                                                                />
                                                                            </label>}
                                                                        </div>
                                                                        {auth?.profile_completed_steps !== "4" && <Image
                                                                            onClick={handleRemovePhoto}
                                                                            src="/assets/redcross.svg"
                                                                            alt="service"
                                                                            width="24"
                                                                            height="24"
                                                                            className="absolute -top-6 -right-6 mid:top-1 xl:-right-6 mid:-right-4 maxmid:-right-2 cursor-pointer"
                                                                        />}
                                                                    </div>

                                                                </div>
                                                            ) : (
                                                                <div className="flex servicesShadow space-y-3 flex-col items-center p-6 border border-dashed bg-white border-[#8DB7DD] rounded-xl">
                                                                    <Image
                                                                        src="/assets/takeProof.svg"
                                                                        width="50"
                                                                        height="50"
                                                                        alt="Passport/ID Icon"
                                                                    />
                                                                    <p className="text-xs maingray text-center">
                                                                        Upload a photo of your Passport/ID Proof
                                                                    </p>
                                                                    <label>
                                                                        <div
                                                                            className="bg-[#8DC63F] text-white px-6 py-3 rounded-xl cursor-pointer"
                                                                        >
                                                                            Upload Photo
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            id="photoInput"
                                                                            accept=".jpg, .png, .jpeg"
                                                                            style={{ display: "none" }}
                                                                            onChange={(e) => handlePhotoUpload(e, 'passport')}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            )}


                                                        </div>
                                                }
                                                {passportError && <Error error={passportError} />}

                                            </div>

                                            <div>
                                                {capturedImage ? (
                                                    <div className="bg-white rounded-xl w-full h-full xl:py-1 md:p-6">
                                                        <div className="flex relative justify-center items-center">
                                                            <div className="relative">
                                                                {(auth?.profile_completed_steps === "4" && capturedImage?.status === "refuse") && <div className="absolute inset-0 rounded-xl bg-black bg-opacity-10 backdrop-blur-sm"></div>}
                                                                <Image
                                                                    src={capturedImage?.image}
                                                                    alt="Uploaded Photo"
                                                                    className="object-cover rounded-xl w-[320px] h-[181px]"
                                                                    width="320"
                                                                    height="203"
                                                                    onClick={() => { setIsOpen(true); setbigImage(capturedImage?.image) }}
                                                                />
                                                                {(auth?.profile_completed_steps === "4" && capturedImage?.status === "refuse") && <label className="">
                                                                    <Image
                                                                        width="50"
                                                                        height="50"
                                                                        src="/assets/uploaddocs.svg"
                                                                        alt="Experience Certificate Icon"
                                                                        className="absolute top-1/3 left-[40%] cursor-pointer"
                                                                        onClick={openModal}
                                                                    />
                                                                </label>}
                                                            </div>
                                                            {auth?.profile_completed_steps !== "4" && <Image
                                                                onClick={handleSelfie}
                                                                src="/assets/redcross.svg"
                                                                width="24"
                                                                height="24"
                                                                alt="service"
                                                                className="absolute -top-6 -right-6 mid:top-1 xl:-right-6 mid:-right-4 maxmid:-right-2 cursor-pointer"
                                                            />}
                                                        </div>
                                                    </div>
                                                ) : <>

                                                    <div className="flex servicesShadow flex-col space-y-3  items-center  bg-white p-6 border border-dashed border-[#8DB7DD] rounded-xl">
                                                        <Image
                                                            src="/assets/takeselfie.svg"
                                                            width="63"
                                                            height="50"
                                                            alt="Licenses Icon"
                                                            className=""
                                                        />
                                                        <p className="text-xs maingray text-center">
                                                            Take a photo of your Passport/ID Proof
                                                        </p>
                                                        <button onClick={openModal} disabled={auth?.profile_completed_steps !== "4"} className="bg-[#8DC63F] text-white px-6 py-3 rounded-xl">
                                                            Take Photo
                                                        </button>
                                                    </div>
                                                </>}
                                                {selfieError && <Error error={selfieError} />}
                                            </div>

                                        </div>
                                    </div>
                                )
                            }

                            {isWebcamModalOpen && (
                                <WebcamModal
                                    isOpen={isWebcamModalOpen}
                                    onClose={() => closeModal()}
                                    onCapture={(e) => handleCapture(e, 'selfie')}
                                    selfieLoading={selfieLoading}
                                />
                            )}

                            <div className="rounded-lg mt-3 p-5">
                                <h2 className="text-base md:text-xl font-semibold mb-2">Choose the service below :</h2>
                                <div className="flex justify-between">
                                    <div className='flex items-center'>
                                        <Dropdown
                                            options={options}
                                            onChange={handleServiceSelect}
                                            value={options ? options?.find(option => option.value === selectedId) : null}
                                            className='bg-white w-48 md:w-60 rounded-lg z-40 outline-none cursor-pointer'
                                            placeholder="Select Service"
                                            arrowClosed={<span className="arrow-open">
                                                <Image
                                                    src="/assets/blueDropdown.svg"
                                                    alt="Search Icon"
                                                    height="15"
                                                    width="15"
                                                />
                                            </span>}
                                            arrowOpen={<span className="arrow-open">
                                                <Image
                                                    src="/assets/blueDropdown.svg"
                                                    alt="Search Icon"
                                                    height="15"
                                                    width="15"
                                                />
                                            </span>}
                                        />                                 
                                    </div>
                                </div>                             

                                {
                                    (selectedServiceDetails?.upload_licenses && selectedServiceDetails?.upload_licenses.length > 0) && (
                                        <div>
                                            <h2 className="text-xl font-semibold mt-2">Licenses</h2>
                                            <p className="text-xs maingray">
                                                Licenses for specialized work.
                                            </p>
                                            <div className="flex flex-wrap">
                                                {selectedServiceDetails.upload_licenses.map((license, index) => {
                                                    const fileExtension = license?.image?.split('.').pop().toLowerCase();
                                                    return (
                                                        <div key={index} className="p-2">
                                                            {fileExtension === 'pdf' ? (
                                                                <div className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2">
                                                                    <Image
                                                                        src="/assets/pdf.svg"
                                                                        className="w-[90px] h-[90px]"
                                                                        width="50"
                                                                        height="50"
                                                                        alt={`PDF document ${index + 1}`}
                                                                    />
                                                                </div>                                                
                                                            ) : (
                                                                <img
                                                                    src={license?.image}
                                                                    alt={`License ${index + 1}`}
                                                                    className="w-36 h-36 object-cover rounded-md cursor-pointer"
                                                                    onClick={() => { setIsOpen(true); setbigImage(license?.image); }}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                }                             

                                {
                                    (selectedServiceDetails?.upload_certificates && selectedServiceDetails.upload_certificates.length > 0) && (
                                        <div>
                                            <h2 className="text-xl font-semibold mt-2">
                                                Experience Certificates
                                            </h2>
                                            <p className="text-xs maingray">
                                                Certificate of your work experience.
                                            </p>
                                            <div className="flex flex-wrap">
                                                {selectedServiceDetails.upload_certificates.map((certificate, index) => {
                                                    const fileExtension = certificate?.image?.split('.').pop().toLowerCase();
                                                    return (
                                                        <div key={index} className="p-2">
                                                            {fileExtension === 'pdf' ? (
                                                                <div className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2">
                                                                    <Image
                                                                        src="/assets/pdf.svg"
                                                                        className="w-[90px] h-[90px]"
                                                                        width="50"
                                                                        height="50"
                                                                        alt={`PDF document ${index + 1}`}
                                                                    />
                                                                </div>

                                                            ) : (
                                                                <img
                                                                    src={certificate?.image}
                                                                    alt={`Certificate ${index + 1}`}
                                                                    className="w-36 h-36 object-cover rounded-md cursor-pointer"
                                                                    onClick={() => { setIsOpen(true); setbigImage(certificate?.image); }}

                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                }


                                {
                                    (selectedServiceDetails?.upload_licenses?.length === 0 && selectedServiceDetails?.upload_certificates?.length === 0) && (
                                        <div className="mt-4 md:mt-8 ">
                                            <img
                                                src="/assets/no-data-fn.svg"
                                                alt="nodata"
                                                className="md:w-1/3 md:h-1/3 xl:w-48 xl:h-44 object-cover p-2 border rounded-lg servicesShadow cursor-pointer"
                                            />
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    {
                        router.pathname !== "/professionalProfile/editProfessional" && (
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => dispatch(getServiceStepAsync("1"))}
                                    className="px-5 medmob:px-10 lg:px-16 pinkshadow font-semibold justify-center pinkshadow flex gap-2 bg-white items-center text-white py-5 rounded-xl"
                                >
                                    <Image
                                        src="/assets/leftArrow.svg"
                                        alt="Google Icon"
                                        className=""
                                        height="6"
                                        width="8"
                                    />
                                    <span className="maingray block text-sm font-normal cursor-pointer">
                                        Go back
                                    </span>
                                </button>
                                <button
                                    onClick={onSave}
                                    type="submit"
                                    disabled={IsLoading || passportLoading}
                                    className="px-10 lg:px-16 font-semibold mainblue text-white p-4 blueshadow shadow-lg  shadow-[#1B75BC] rounded-xl"
                                >
                                    {IsLoading ? <Spinner /> : "Next"}
                                </button>
                            </div>
                        )
                    }
                </section >
            </div >
        </>
    );
}

export default Documents;
