import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useState } from "react";
import WebcamModal from "../modals/webcam";
import Error from "../common/Error";
import { getServiceStepAsync, getTheProfile, selectLoginAuth, uploadTheDocuments } from "../../redux/auth/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { setupProfessionalProfile } from "../../redux/auth/authSlice";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import Documents from "../auth/Documents";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function EditDocs({ DocsData }) {
    const auth = useSelector(selectLoginAuth);
    const uploadPassport = Array.isArray(auth?.professional?.upload_Passports) ? auth.professional.upload_Passports : [];
    const DefaultPassportPic = uploadPassport[0] || null;
    const DefaultSelfie = uploadPassport[1] || null;
    const [isOpen, setIsOpen] = useState(false);
    const [bigImage, setbigImage] = useState("");


    const DefaultLicenses = auth?.professional?.upload_licenses || [];
    const DefaultCertificates = auth?.professional?.upload_certificate || [];

    const dispatch = useDispatch();
    const toastId = React.useRef(null);
    const [passportLoading, setPassportLoading] = useState(false);
    const [selfieLoading, setSelfieLoading] = useState(false);
    const [licenseLoading, setLicenseLoading] = useState(false);
    const [certificateLoading, setCertificateLoading] = useState(false);

    const [licenses, setlicenses] = useState(DefaultLicenses.length > 0 ? DefaultLicenses : []);
    const [certificates, setcertificates] = useState(DefaultCertificates.length > 0 ? DefaultCertificates : []);

    const [isWebcamModalOpen, setisWebcamModalOpen] = useState(false);

    const [uploadedImage, setUploadedImage] = useState(DefaultPassportPic ?? null);
    const [capturedImage, setCapturedImage] = useState(DefaultSelfie ?? null)


    const [certificatesError, setCertificatesError] = useState('');
    const [licensesError, setLicensesError] = useState('');
    const [passportError, setpassportError] = useState('');
    const [selfieError, setselfieError] = useState('');


    // const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [passportUrl, setPassportUrl] = useState(DefaultPassportPic ?? null);
    const [selfieUrl, setSelfieUrl] = useState(DefaultSelfie ?? null);


    const [licensesUrls, setLicensesUrls] = useState(DefaultLicenses.length > 0 ? DefaultLicenses : []);
    const [certificatesUrls, setCertificatesUrls] = useState(DefaultCertificates.length > 0 ? DefaultCertificates : []);


    // const handleLicenseChange = (event, type) => {
    //     const files = Array.from(event.target.files);

    //     if (licenses.length + files.length > 3) {
    //         DocsData.setLicensesError('You can upload a maximum of 3 licenses.');
    //     } else {
    //         DocsData.setLicensesError('');
    //         setlicenses((prevFiles) => [...prevFiles, ...files]);
    //     }
    //     event.target.value = null;

    //     const formData = new FormData();
    //     files.forEach((file, index) => {
    //         formData.append(`files`, file);
    //     });
    //     uploadTheDocument(formData, type);
    // };

    // const handleRemoveLicense = (index) => {
    //     setlicenses((prevFiles) =>
    //         prevFiles.filter((_, fileIndex) => fileIndex !== index)
    //     );
    //     if (index < licensesUrls.length) {
    //         const updatedEditFiles = [...licensesUrls];
    //         updatedEditFiles.splice(index, 1);
    //         setLicensesUrls(updatedEditFiles);
    //     } else {
    //         const updatedFiles = [...licensesUrls];
    //         updatedFiles.splice(index - licensesUrls.length, 1);
    //         setLicensesUrls(updatedFiles);
    //     }
    // };

    // const handleCertificatesChange = (event, type) => {
    //     const files = Array.from(event.target.files);

    //     if (certificates.length + files.length > 3) {
    //         DocsData.setCertificatesError('You can upload a maximum of 3 certificates.');
    //     } else {
    //         DocsData.setCertificatesError('');
    //         setcertificates((prevFiles) => [...prevFiles, ...files]);
    //     }
    //     event.target.value = null;
    //     const formData = new FormData();
    //     files.forEach((file, index) => {
    //         formData.append(`files`, file);
    //     });
    //     uploadTheDocument(formData, type);
    // };

    // const handleRemoveCertificates = (index) => {
    //     setcertificates((prevFiles) =>
    //         prevFiles.filter((_, fileIndex) => fileIndex !== index)
    //     );
    // };

    // const handleRemoveCertificates = (index) => {
    //     setcertificates((prevFiles) =>
    //         prevFiles.filter((_, fileIndex) => fileIndex !== index)
    //     );
    //     if (index < certificatesUrls.length) {
    //         const updatedEditFiles = [...certificatesUrls];
    //         updatedEditFiles.splice(index, 1);
    //         setCertificatesUrls(updatedEditFiles);
    //     } else {
    //         const updatedFiles = [...certificatesUrls];
    //         updatedFiles.splice(index - certificatesUrls.length, 1);
    //         setCertificatesUrls(updatedFiles);
    //     }
    // };



    // const openModal = () => {
    //     setisWebcamModalOpen(true);
    // };

    // const closeModal = () => setisWebcamModalOpen(false);

    // function dataURLtoFile(dataurl, filename) {
    //     var arr = dataurl?.split(','),
    //         mime = arr?.length > 0 && arr[0]?.match(/:(.*?);/)[1],
    //         bstr = arr?.length > 0 && atob(arr[1]),
    //         n = bstr.length,
    //         u8arr = new Uint8Array(n);

    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, { type: mime });
    // }
    // function uuidv4() {
    //     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    //         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(20)
    //     );
    // }


    // const handleCapture = (imageSrc, type) => {
    //     if (imageSrc) {
    //         DocsData.setselfieError("");
    //     }

    //     setCapturedImage(imageSrc);
    //     let file1 = dataURLtoFile(imageSrc, `${uuidv4()}.jpeg`);
    //     const formData = new FormData();
    //     formData.append(`files`, file1)
    //     uploadTheDocument(formData, type);
    // };

    // const handleSelfie = () => {
    //     setCapturedImage(null);
    //     setSelfieUrl(null);
    // };

    // const handlePhotoUpload = (event, type) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         DocsData.setpassportError("");
    //     }
    //     if (file) {
    //         setUploadedImage(URL.createObjectURL(file));
    //         const formData = new FormData();
    //         formData.append(`files`, file)
    //         console.log(file, "file")
    //         uploadTheDocument(formData, type);
    //     };

    // }

    // const handleRemovePhoto = () => {
    //     setUploadedImage(null);
    //     setPassportUrl(null)
    // };


    // const uploadTheDocument = (formData, type) => {
    //     DocsData.setIsDocsUploading(true);
    //     switch (type) {
    //         case 'passport':
    //             setPassportLoading(true);
    //             break;
    //         case 'selfie':
    //             setSelfieLoading(true);
    //             break;
    //         case 'license':
    //             setLicenseLoading(true);
    //             break;
    //         case 'certificate':
    //             setCertificateLoading(true);
    //             break;
    //         default:
    //             console.error('Unknown document type');
    //     }

    //     dispatch(uploadTheDocuments(formData))
    //         .then(unwrapResult)
    //         .then((obj) => {
    //             let uploadedUrl = obj?.data?.data;

    //             if (uploadedUrl?.length > 0) {
    //                 uploadedUrl = uploadedUrl.map(obj => obj.url);
    //             }


    //             switch (type) {
    //                 // case 'image':
    //                 //     setUploadedImageUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
    //                 //     break;
    //                 case 'passport':
    //                     setPassportUrl(uploadedUrl[0]);
    //                     setPassportLoading(false);
    //                     break;
    //                 case 'selfie':
    //                     setSelfieUrl(uploadedUrl[0]);
    //                     setSelfieLoading(false);
    //                     break;
    //                 case 'license':
    //                     setLicensesUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
    //                     setLicenseLoading(false);
    //                     break;
    //                 case 'certificate':
    //                     setCertificatesUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
    //                     setCertificateLoading(false);
    //                     break;
    //                 default:
    //                     console.error('Unknown document type');
    //             }
    //             DocsData.setIsDocsUploading(false);


    //         })
    //         .catch((obj) => {
    //             setloading(false);
    //             DocsData.setIsDocsUploading(false);
    //         });
    // }

    useEffect(() => {
        DocsData.licenses = licensesUrls;
        DocsData.certificates = certificatesUrls;
        DocsData.uploadedImage = passportUrl;
        DocsData.capturedImage = selfieUrl;
        setLicensesError(DocsData.licensesError);
        setpassportError(DocsData.passportError);
        setselfieError(DocsData.selfieError);
        setCertificatesError(DocsData.certificatesError);
    }, [licensesUrls, passportUrl, selfieUrl, certificatesUrls, DocsData]);

    return (
        <>
            <section>
                <div className=" pb-5">
                    <div className="p-6 rounded">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Documents
                            </h2>
                            <div className="flex flex-wrap gap-6">
                                {isOpen && (
                                    <Lightbox
                                        mainSrc={bigImage}
                                        onCloseRequest={() => setIsOpen(false)}
                                    />
                                )}
                                <div>
                                    <div >
                                        {
                                            passportLoading ?
                                                <div
                                                    className="relative flex servicesShadow justify-center items-center w-[320px] h-[181px] bg-white rounded-xl p-2">
                                                    <PuffLoader
                                                        color="#4de527"
                                                        loading
                                                        size={35}
                                                        speedMultiplier={3}
                                                    />
                                                </div>
                                                :
                                                uploadedImage ? (
                                                    <div className="bg-white servicesShadow rounded-xl w-full h-full xl:py-1 md:p-6 md:px-10">
                                                        <div className="flex relative justify-center items-center">
                                                            <Image
                                                                src={uploadedImage?.image}
                                                                alt="Uploaded Photo"
                                                                className="object-cover rounded-xl w-[320px] h-[181px] cursor-pointer"
                                                                width="320"
                                                                height="203"
                                                                onClick={() => { setIsOpen(true); setbigImage(uploadedImage?.image) }}

                                                            />
                                                            {/* <Image
                                                                onClick={handleRemovePhoto}
                                                                src="/assets/redcross.svg"
                                                                alt="service"
                                                                width="24"
                                                                height="24"
                                                                className="absolute -top-6 -right-6 mid:top-0 xl:-right-6 mid:-right-8 cursor-pointer"
                                                            /> */}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // <div className="flex servicesShadow space-y-3 flex-col items-center p-6 border border-dashed bg-white border-[#8DB7DD] rounded-xl">
                                                    //     <Image
                                                    //         src="/assets/takeProof.svg"
                                                    //         width="50"
                                                    //         height="50"
                                                    //         alt="Passport/ID Icon"
                                                    //     />
                                                    //     <p className="text-xs maingray text-center">
                                                    //         Take a photo of your Passport/ID Proof
                                                    //     </p>
                                                    //     <label>
                                                    //         <div
                                                    //             className="bg-[#8DC63F] text-white px-6 py-3 rounded-xl cursor-pointer"
                                                    //         >
                                                    //             Take Photo
                                                    //         </div>
                                                    //         <input
                                                    //             type="file"
                                                    //             id="photoInput"
                                                    //             accept=".jpg, .png, .jpeg"
                                                    //             style={{ display: "none" }}
                                                    //             onChange={(e) => handlePhotoUpload(e, 'passport')}
                                                    //         />
                                                    //     </label>
                                                    // </div>
                                                    <></>
                                                )}


                                    </div>

                                    {passportError && <Error error={passportError} />}

                                </div>

                                <div>
                                    {
                                        selfieLoading ?
                                            <div
                                                className="relative flex servicesShadow justify-center items-center w-[320px] h-[181px] bg-white rounded-xl p-2">
                                                <PuffLoader
                                                    color="#4de527"
                                                    loading
                                                    size={35}
                                                    speedMultiplier={3}
                                                />
                                            </div>
                                            :
                                            capturedImage ? (
                                                <div className="bg-white servicesShadow rounded-xl w-full h-full xl:py-1 md:p-6 md:px-10">
                                                    <div className="flex relative justify-center items-center">
                                                        <Image
                                                            src={capturedImage?.image}
                                                            alt="Uploaded Photo"
                                                            className="object-cover rounded-xl w-[320px] h-[181px]"
                                                            width="320"
                                                            height="203"
                                                            onClick={() => { setIsOpen(true); setbigImage(capturedImage?.image) }}

                                                        />
                                                        {/* <Image
                                                            onClick={handleSelfie}
                                                            src="/assets/redcross.svg"
                                                            width="24"
                                                            height="24"
                                                            alt="service"
                                                            className="absolute -top-6 -right-6 mid:top-0 xl:-right-6 mid:-right-8 cursor-pointer"
                                                        /> */}
                                                    </div>
                                                </div>
                                            ) : (
                                                // <div className="flex servicesShadow flex-col space-y-3  items-center  bg-white p-6 border border-dashed border-[#8DB7DD] rounded-xl">
                                                //     <Image
                                                //         src="/assets/takeselfie.svg"
                                                //         width="63"
                                                //         height="50"
                                                //         alt="Licenses Icon"
                                                //         className=""
                                                //     />
                                                //     <p className="text-xs maingray text-center">
                                                //         Take a photo of your Passport/ID Proof
                                                //     </p>
                                                //     <button onClick={openModal} className="bg-[#8DC63F] text-white px-6 py-3 rounded-xl">
                                                //         Take Photo
                                                //     </button>
                                                //     {isWebcamModalOpen && (
                                                //         <WebcamModal
                                                //             isOpen={isWebcamModalOpen}
                                                //             onClose={() => closeModal()}
                                                //             onCapture={(e) => handleCapture(e, 'selfie')}
                                                //         />
                                                //     )}
                                                // </div>
                                                <></>
                                            )}
                                    {selfieError && <Error error={selfieError} />}
                                </div>

                            </div>
                        </div>
                        {/* <div>
                            <h2 className="text-base maingray font-semibold mt-2">Licenses</h2>
                            <p className="text-sm maingray mb-4">
                                licenses for specialized work.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {
                                    licenseLoading ?
                                        <div
                                            className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2">
                                            < PuffLoader
                                                color="#4de527"
                                                loading
                                                size={35}
                                                speedMultiplier={3}
                                            />
                                        </div>
                                        :

                                        licenses.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2"
                                            >
                                                {((!file?.type ? file?.toLowerCase()?.slice(-3) === 'pdf' : false) || file?.type === "application/pdf") ? (
                                                    // Display the PDF icon for PDF files
                                                    <Image
                                                        src="/assets/pdf.svg"
                                                        className="w-[90px] h-[90px]"
                                                        width="50"
                                                        height="50"
                                                        alt={`PDF document ${index + 1}`}
                                                    />
                                                ) : (
                                                    // Display the image preview for image files
                                                    <Image
                                                        // src={URL.createObjectURL(file)}
                                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                                        className="w-[98px] h-[126px] object-contain"
                                                        width="98"
                                                        height="126"
                                                        alt={`Uploaded document ${index + 1}`}
                                                    />
                                                )}

                                              
                                                {<Image
                                                    onClick={() => handleRemoveLicense(index)}
                                                    src="/assets/redcross.svg"
                                                    width="24"
                                                    height="24"
                                                    className="absolute top-1 right-1 cursor-pointer"
                                                    alt="Remove Icon"
                                                />}
                                            </div>
                                        ))}

                                {{licenses.length < 3 && (
                                    <label className="flex servicesShadow bg-white w-36 h-36 cursor-pointer flex-col justify-center items-center p-6 border border-dashed border-[#8DB7DD] rounded-xl">
                                        <Image
                                            width="50"
                                            height="50"
                                            src="/assets/uploaddocs.svg"
                                            alt="Experience Certificate Icon"
                                            className=""
                                        />
                                        <p className="text-xs maingray text-center">
                                            Upload Jpg, Png or PDF file.
                                        </p>
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            accept=".jpg, .png, .pdf, .jpeg"
                                            onChange={(e) => handleLicenseChange(e, 'license')}
                                            multiple
                                            maxLength={3}
                                        />
                                    </label>
                                )}}
                            </div>

                            {DocsData.licensesError && <Error error={DocsData.licensesError} />}
            
                        </div> */}

                        {/* <div>
                            <h2 className="text-base maingray font-semibold mt-2">
                                Experience Certificate
                            </h2>
                            <p className="text-sm maingray mb-4">
                                certificate of your work experience.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {
                                    certificateLoading ?
                                        <div
                                            className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2">
                                            < PuffLoader
                                                color="#4de527"
                                                loading
                                                size={35}
                                                speedMultiplier={3}
                                            />
                                        </div>
                                        :
                                        certificates.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2"
                                            >

                                                {((!file?.type ? file?.toLowerCase()?.slice(-3) === 'pdf' : false) || file?.type === "application/pdf") ? (
                                                    // Display the PDF icon for PDF files
                                                    <Image
                                                        src="/assets/pdf.svg" // Replace with the actual PDF logo path
                                                        className="w-[90px] h-[90px]"
                                                        width="50"
                                                        height="50"
                                                        alt={`PDF document ${index + 1}`}
                                                    />
                                                ) : (
                                                    // Display the image preview for image files
                                                    <Image
                                                        // src={URL.createObjectURL(file)}
                                                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                                        className="w-[98px] h-[126px] object-contain"
                                                        width="98"
                                                        height="126"
                                                        alt={`Uploaded document ${index + 1}`}
                                                    />
                                                )}

                                                <Image
                                                    onClick={() => handleRemoveCertificates(index)}
                                                    src="/assets/redcross.svg"
                                                    width="24"
                                                    alt="service"
                                                    height="24"
                                                    className="absolute top-2 right-2 cursor-pointer"
                                                />
                                            </div>
                                        ))}


                                {certificates.length < 3 && (
                                    <label className="flex servicesShadow bg-white w-36 h-36 cursor-pointer flex-col justify-center items-center p-6 border border-dashed border-[#8DB7DD] rounded-xl">
                                        <Image
                                            width="50"
                                            height="50"
                                            src="/assets/uploaddocs.svg"
                                            alt="Experience Certificate Icon"
                                            className=""
                                        />
                                        <p className="text-xs maingray text-center">
                                            Upload Jpg, Png or PDF file.
                                        </p>
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            accept=".jpg, .png, .pdf, .jpeg"
                                            onChange={(e) => handleCertificatesChange(e, 'certificate')}
                                            multiple
                                            maxLength={3}
                                        />
                                    </label>
                                )}
                            </div>
                            {certificatesError && <Error error={certificatesError} />}
                        </div> */}
                        <Documents />
                    </div>
                </div>
            </section >
        </>
    )
}

export default EditDocs;