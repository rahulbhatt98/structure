import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getServiceStepAsync, getTheProfile, selectLoginAuth, setupProfessionalProfile, uploadTheDocuments } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from '../common/Spinner';
import Error from '../common/Error';
import { useRouter } from 'next/router';
import Cookies from "js-cookie";
import { PuffLoader } from 'react-spinners';

function EditPortfolio({ portfolioData }) {

    const auth = useSelector(selectLoginAuth);
    const defaultImages = auth?.professional?.portfolioDetail[0]?.images || [];
    const defaultDescription = auth?.professional?.portfolioDetail[0]?.description || "";

    const [loading, setloading] = useState(false);


    const router = useRouter();

    const dispatch = useDispatch();

    const [uploadedFiles, setUploadedFiles] = useState(defaultImages.length > 0 ? defaultImages : []);

    const [description, setDescription] = useState(defaultDescription);

    const [portfolioUrls, setportfolioUrls] = useState(defaultImages.length > 0 ? defaultImages : []);

    const [errorPortfolioImage, setErrorPortfolioImage] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const flattenedUrls = Array.isArray(files[0]) ? files.flat() : files;

        setUploadedFiles((prevFiles) => [...prevFiles, ...flattenedUrls]);
        event.target.value = null;

        if (files.length > 0) {
            portfolioData.setErrorPortfolioImage('');
        }

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });
        uploadTheDocument(formData);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);

        // Clear error when description is typed
        if (value.trim()) {
            portfolioData.setErrorDescription('');
        }
    };

    const handleRemoveFile = (index) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, fileIndex) => fileIndex !== index)
        );
        if (index < portfolioUrls.length) {
            const updatedEditFiles = [...portfolioUrls];
            updatedEditFiles.splice(index, 1);
            setportfolioUrls(updatedEditFiles);
        } else {
            const updatedFiles = [...portfolioUrls];
            updatedFiles.splice(index - portfolioUrls.length, 1);
            setportfolioUrls(updatedFiles);
        }
    };

    const uploadTheDocument = (formData) => {
        portfolioData.setIsPortfolioUploading(true);
        setloading(true)

        dispatch(uploadTheDocuments(formData))
            .then(unwrapResult)
            .then((obj) => {
                let uploadedUrl = obj?.data?.data;
                if (uploadedUrl?.length > 0) {
                    uploadedUrl = uploadedUrl.map(obj => obj.url);
                }
                setportfolioUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
                setloading(false);
                portfolioData.setIsPortfolioUploading(false);

            })
            .catch((obj) => {
                console.log(obj, "obj");
                setloading(false);
                portfolioData.setIsPortfolioUploading(false);

            });
    };


    useEffect(() => {
        portfolioData.images = portfolioUrls;
        portfolioData.description = description;
        setErrorPortfolioImage(portfolioData.errorPortfolioImage),
            setErrorDescription(portfolioData.errorDescription)
    }, [portfolioUrls, description, portfolioData]);


    return (
        <>
            <section>
                <div className='px-7'>
                    <div>
                        <h2 className="text-lg font-semibold mt-2 mb-4">Portfolio</h2>
                        <div className="flex flex-wrap gap-4">
                            {loading ?
                                <div
                                    className="relative flex servicesShadow justify-center items-center w-36 h-36 bg-white rounded-xl p-2">
                                    <PuffLoader
                                        color="#4de527"
                                        loading
                                        size={35}
                                        speedMultiplier={3}
                                    />
                                </div>
                                :
                                portfolioUrls?.length > 0 && portfolioUrls.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative flex servicesShadow justify-center w-36 h-36 bg-white rounded-xl p-2"
                                    >
                                        {/* Document preview */}
                                        <Image
                                            // src={URL.createObjectURL(file)}
                                            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                            className="rounded-lg"
                                            width="134"
                                            height="134"
                                            alt={`Uploaded document ${index + 1}`}
                                        />
                                        {/* Remove button */}
                                        <Image
                                            onClick={() => handleRemoveFile(index)}
                                            src="/assets/redcross.svg"
                                            width="24"
                                            height="24"
                                            className="absolute top-2 right-2 cursor-pointer"
                                            alt="service"
                                        />
                                    </div>
                                ))}

                            {/* Upload button with hidden input */}
                            <label className="flex servicesShadow bg-white w-36 h-36 cursor-pointer flex-col justify-center items-center p-6 border border-dashed border-[#8DB7DD] rounded-xl">
                                <Image
                                    width="50"
                                    height="50"
                                    src="/assets/uploaddocs.svg"
                                    alt="Experience Certificate Icon"
                                />
                                <p className="text-xs maingray text-center">
                                    Upload Jpg, Png or jpeg file.
                                </p>
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    accept=".jpg,.png,.jpeg"
                                    onChange={handleFileChange}
                                    multiple
                                />
                            </label>
                        </div>
                        {errorPortfolioImage && (
                            <Error error={errorPortfolioImage} />
                        )}
                    </div>
                    <textarea
                        placeholder='Add Description'
                        className="mt-4 block servicesShadow mb-5 w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500 outline-none sm:text-sm"
                        type="textarea"
                        rows="8"
                        name="desc"
                        value={description}
                        // onChange={(e) => setDescription(e.target.value)}
                        onChange={handleDescriptionChange}
                    />
                    {errorDescription && (
                        <Error error={errorDescription} />
                    )}
                    {/* <button className='text-base text-[#1B75BC] font-normal mt-2'>+ Add Portfolio</button> */}
                </div>
            </section >
        </>
    )
}

export default EditPortfolio;