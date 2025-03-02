import Image from 'next/image';
import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { selectLoginAuth, uploadTheDocuments } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { PuffLoader } from 'react-spinners';
import Error from '../common/Error';
import { toast } from 'react-toastify';

function UploadDocument1({ isOpen, onClose, selectedDocument, setSelectedServices, selectedServices, setdocsError }) {
    const [checkedServices, setCheckedService] = useState(selectedDocument[0]?.services?.filter(service => service.checked && (service.license_required || service.certificate_required)))
    const [selectedId, setSelectedId] = useState("");
    const [licenseLoading, setLicenseLoading] = useState(false);
    const [certificateLoading, setCertificateLoading] = useState(false);
    const [isDocsUploading, setIsDocsUploading] = useState(false)
    // const [licenses, setlicenses] = useState([]);
    // const [certificates, setcertificates] = useState([]);
    const [certificatesError, setCertificatesError] = useState('');
    const [licensesError, setLicensesError] = useState('');
    const [licensesUrls, setLicensesUrls] = useState([]);
    const [certificatesUrls, setCertificatesUrls] = useState([]);

    console.log(certificatesUrls, "certificate urlssssssssssss");


    const auth = useSelector(selectLoginAuth)
    console.log(typeof (auth?.profile_completed_steps), auth, licensesUrls, "custome step");

    console.log(checkedServices, "checked service");


    const dispatch = useDispatch()
    const options = Object.keys(checkedServices).map((id) => ({
        value: checkedServices[id]?.id,
        label: checkedServices[id].name
    }));

    const handleLicenseChange = (event, type, status, matchUrl) => {
        const files = Array.from(event.target.files);

        if (!selectedId) {
            setLicensesError("Please select service first")
            event.target.value = null;
            return
        }
        if ((licensesUrls.length + files.length + (checkedServices[selectedId]?.upload_licenses?.length || 0) > 3) && !status) {
            setLicensesError('You can upload a maximum of 3 licenses.');
            event.target.value = null;
            return
        } else {
            setLicensesError('');
            // setlicenses((prevFiles) => [...prevFiles, ...files]);
        }
        event.target.value = null;

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });
        uploadTheDocument(formData, type, status, matchUrl);
    };


    const removeLicenseUrl = (services, targetId, urlToRemove) => {
        return services.map(service => {
            // Check if the current service ID matches the target ID
            if (service.id == targetId) {
                // Filter out the URL to remove from
                return {
                    ...service,
                    upload_licenses: service.upload_licenses.filter(url => url != urlToRemove)
                };
            }
            // Return the service unchanged if IDs do not match
            return service;
        });
    };

    const removeCertificateUrl = (services, targetId, urlToRemove) => {
        return services.map(service => {
            // Check if the current service ID matches the target ID
            if (service.id == targetId) {
                // Filter out the URL to remove from 
                return {
                    ...service,
                    upload_certificates: service.upload_certificates.filter(url => url != urlToRemove)
                };
            }
            // Return the service unchanged if IDs do not match
            return service;
        });
    };

    const handleRemoveLicense = (index, url) => {
        // setlicenses((prevFiles) =>
        //     prevFiles.filter((_, fileIndex) => fileIndex !== index)
        // );
        if (index < licensesUrls.length) {
            const updatedEditFiles = [...licensesUrls];
            updatedEditFiles.splice(index, 1);
            setLicensesUrls(updatedEditFiles);
            const updatedServices = removeLicenseUrl(checkedServices, selectedId, url);


            setCheckedService(updatedServices)
        } else {
            const updatedFiles = [...licensesUrls];
            updatedFiles.splice(index - licensesUrls.length, 1);
            setLicensesUrls(updatedFiles);
            console.log(checkedServices, "ssssssssssssssssssssssaaaaaaaaaaa");
            const updatedServices = removeLicenseUrl(checkedServices, selectedId, url);


            setCheckedService(updatedServices)
        }
    };

    const handleCertificatesChange = (event, type, status, matchUrl) => {
        const files = Array.from(event.target.files);

        if ((certificatesUrls?.length + files?.length + (checkedServices[selectedId]?.upload_certificates?.length || 0) > 3) && !status) {
            setCertificatesError('You can upload a maximum of 3 certificates.');
            return
        }
        setCertificatesError('');
        // setcertificates((prevFiles) => [...prevFiles, ...files]);

        event.target.value = null;
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });
        uploadTheDocument(formData, type, status, matchUrl);
    };

    const handleRemoveCertificates = (index, url) => {
        // setcertificates((prevFiles) =>
        //     prevFiles.filter((_, fileIndex) => fileIndex !== index)
        // );
        if (index < certificatesUrls.length) {
            const updatedEditFiles = [...certificatesUrls];
            updatedEditFiles.splice(index, 1);
            setCertificatesUrls(updatedEditFiles);
            const updatedServices = removeCertificateUrl(checkedServices, selectedId, url);

            setCheckedService(updatedServices)
        } else {
            const updatedFiles = [...certificatesUrls];
            updatedFiles.splice(index - certificatesUrls.length, 1);
            setCertificatesUrls(updatedFiles);
            const updatedServices = removeCertificateUrl(checkedServices, selectedId, url);

            setCheckedService(updatedServices)
        }
    };

    const replaceCategoryServices = (currentData, newServices) => {
        return currentData.map(category => {
            // Map through the services to replace them
            const updatedServices = category.services.map(service => {
                // Find a matching service in newServices
                const matchedService = newServices.find(newService => newService.id === service.id);
                // If matched, replace with new service, else keep original
                return matchedService ? { ...matchedService } : service;
            });

            // Return the category with updated services
            return {
                ...category,
                services: updatedServices
            };
        });
    };

    console.log(licensesUrls, "licence urllllllllll");

    const uploadTheDocument = (formData, type, status, matchUrl) => {
        setIsDocsUploading(true);
        switch (type) {
            case 'license':
                setLicenseLoading(true);
                break;
            case 'certificate':
                setCertificateLoading(true);
                break;
            default:
                console.error('Unknown document type');
        }

        dispatch(uploadTheDocuments(formData))
            .then(unwrapResult)
            .then((obj) => {
                let uploadedUrl = obj?.data?.data;

                if (uploadedUrl?.length > 0) {
                    uploadedUrl = uploadedUrl.map(obj => ({
                        image: obj.url,
                        status: null
                    }));
                }

                if (type === "license") {
                    setLicenseLoading(false);
                    const updateServiceImage = (services, targetId, newImageUrl) => {
                        return services.map(service =>
                            service.id == targetId
                                ? { ...service, upload_licenses: newImageUrl }  // Update the object with the new image
                                : service
                        );
                    };

                    const updatedServices = updateServiceImage(checkedServices, selectedId, [...licensesUrls, ...uploadedUrl]);
                    console.log(checkedServices, selectedId, [...licensesUrls, ...uploadedUrl], updatedServices, "assssssssssssssssss");
                    setLicensesUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
                    setCheckedService(updatedServices)

                }
                if (type === "certificate") {
                    setCertificatesUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
                    setCertificateLoading(false);
                    const updateServiceImage = (services, targetId, newImageUrl) => {
                        return services.map(service =>
                            service.id == targetId
                                ? { ...service, upload_certificates: newImageUrl }  // Update the object with the new image
                                : service
                        );
                    };

                    const updatedServices = updateServiceImage(checkedServices, selectedId, [...certificatesUrls, ...uploadedUrl]);
                    setCertificatesUrls([...certificatesUrls, ...uploadedUrl]);
                    setCheckedService(updatedServices)


                }

                setIsDocsUploading(false);


            })
            .catch((obj) => {
                setIsDocsUploading(false);
            });
    }


    const handleServiceSelect = (data) => {
        console.log(checkedServices, "dsssssssssssssssssssssssss");
        setSelectedId(data.value)

        setLicensesUrls(checkedServices?.find(val => val?.id == data.value)?.upload_licenses || [])
        setCertificatesUrls(checkedServices?.find(val => val?.id == data.value)?.upload_certificates || [])
    }

    console.log(checkedServices, "selected isddddddddddddd");

    const handleAdd = () => {
        // console.log(replaceCategoryServices(selectedServices, checkedServices),checkedServices,"saaaaaqqqqqqqqqqqqqqqq");
        console.log(checkedServices, "saaaaaqqqqqqqqqqqqqqqq");
        if (licensesUrls.length > 0) {
            setdocsError("");
        }

        setSelectedServices(replaceCategoryServices(selectedServices, checkedServices))
        onClose()
    }

    console.log(checkedServices, "saaaaaqqqqqqqqqqqqqqqq");
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg mx-4">
                    <button
                        type='button'
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        &#x2715;
                    </button>

                    <h2 className="text-xl mx-3 font-semibold mt-1">
                        Upload Document
                    </h2>
                    <p className="text-xs mx-3 maingray ">
                        Add Your Service document
                    </p>

                    <div className='h-96 mx-2 border overflow-y-auto'>

                        <div className=" p-1 rounded-lg mt-3">

                            <div className='flex items-center'>
                                <Dropdown
                                    options={options}
                                    onChange={handleServiceSelect}
                                    value={selectedId} // Set the current selected value
                                    placeholder="Select a service"
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
                                    </span>} // Custom open arrow
                                    className='bg-white w-full text-sm md:text-base rounded-lg outline-none cursor-pointer'
                                />
                            </div>

                            {!selectedId && <div className='flex justify-center items-center h-56'>
                                Please select a service to upload document
                            </div>}

                            {(selectedId && (checkedServices?.find(val => val?.id == selectedId) && checkedServices?.find(val => val?.id == selectedId)?.license_required === true)) &&
                                <div>
                                    <div className='flex mb-4 justify-between'>
                                        <div>
                                            <h2 className="text-sm font-semibold mt-2">Upload Licenses</h2>
                                            <p className="text-xs maingray">
                                                Upload licenses for specialized work.
                                            </p>
                                        </div>
                                        {/* <Image
                                                src="/assets/redcross.svg"
                                                alt="service"
                                                width="24"
                                                height="24"
                                                className="cursor-pointer"
                                                onClick={
                                                    setServices(services.filter(service => service.id !== val?.id))
                                                }
                                            /> */}

                                    </div>
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

                                                licensesUrls?.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2"
                                                    >

                                                        {((!file?.type ? file?.image?.toLowerCase()?.slice(-3) === 'pdf' : false) || file?.type === "application/pdf") ? (
                                                            // Display the PDF icon for PDF files
                                                            <div className=' '>

                                                                <Image
                                                                    src="/assets/pdf.svg"
                                                                    className="w-[90px] h-[90px]"
                                                                    width="50"
                                                                    height="50"
                                                                    alt={`PDF document ${index + 1}`}
                                                                />

                                                            </div>
                                                        ) : (
                                                            // Display the image preview for image files
                                                            <div className=' '>

                                                                <Image
                                                                    // src={URL.createObjectURL(file)}
                                                                    src={typeof file?.image === 'string' ? file?.image : URL.createObjectURL(file)}
                                                                    className="w-[98px] h-[126px] object-contain"
                                                                    width="98"
                                                                    height="126"
                                                                    alt={`Uploaded document ${index + 1}`}
                                                                />

                                                            </div>
                                                        )}

                                                        {/* Remove button */}
                                                        {<Image
                                                            onClick={() => handleRemoveLicense(index, file)}
                                                            src="/assets/redcross.svg"
                                                            width="24"
                                                            height="24"
                                                            className="absolute top-1 right-1 cursor-pointer"
                                                            alt="Remove Icon"
                                                        />}

                                                    </div>
                                                ))}



                                        {(licensesUrls?.length < 3) && (
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
                                                    onChange={(e) => handleLicenseChange(e, "license")}
                                                    multiple
                                                    maxLength={3}
                                                />
                                            </label>
                                        )}

                                    </div>

                                    {licensesError && <Error error={licensesError} />}


                                </div>}

                            {(selectedId && (checkedServices?.find(val => val?.id == selectedId) && checkedServices?.find(val => val?.id == selectedId)?.certificate_required === true)) && <div>
                                <h2 className="text-sm font-semibold mt-2">
                                    Experience Certificate
                                </h2>
                                <p className="text-xs maingray mb-4">
                                    Upload certificate of your work experience.
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
                                            certificatesUrls?.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2"
                                                >
                                                    {/* Document preview */}
                                                    {((!file?.type ? file?.image?.toLowerCase()?.slice(-3) === 'pdf' : false) || file?.type === "application/pdf") ? (
                                                        // Display the PDF icon for PDF files
                                                        <div className=' '>

                                                            <Image
                                                                src="/assets/pdf.svg" // Replace with the actual PDF logo path
                                                                className="w-[90px] h-[90px]"
                                                                width="50"
                                                                height="50"
                                                                alt={`PDF document ${index + 1}`}
                                                            />

                                                        </div>
                                                    ) : (
                                                        // Display the image preview for image files
                                                        <div className=' '>

                                                            <Image
                                                                // src={URL.createObjectURL(file)}
                                                                src={typeof file?.image === 'string' ? file?.image : URL.createObjectURL(file)}
                                                                className="w-[98px] h-[126px] object-contain"
                                                                width="98"
                                                                height="126"
                                                                alt={`Uploaded document ${index + 1}`}
                                                            />

                                                        </div>
                                                    )}
                                                    {/* Remove button */}
                                                    {<Image
                                                        onClick={() => handleRemoveCertificates(index, file)}
                                                        src="/assets/redcross.svg"
                                                        width="24"
                                                        alt="service"
                                                        height="24"
                                                        className="absolute top-2 right-2 cursor-pointer"
                                                    />}
                                                </div>
                                            ))}

                                    {/* Upload button with hidden input */}
                                    {(certificatesUrls?.length < 3) && (
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

                                {console.log(certificatesError, "ssssswwwwwwwwwwwwwwwwwwqqqqqqqqq")
                                }
                            </div>}

                        </div>

                        {/* <button type="button" onClick={addService} disabled={checkedServices?.length == services?.length} className='text-base text-[#1B75BC] font-normal mt-2'>+ Add Documents</button> */}


                    </div>
                    <div className='flex justify-center my-2'>
                        <button
                            className="mainblue text-sm text-white font-semibold px-20 py-3 rounded-xl"
                            type="button"
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadDocument1;