import { useRef, useState } from 'react';
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

function Portfolio() {
    const auth = useSelector(selectLoginAuth);
    const defaultImages = auth?.professional?.portfolioDetail[0]?.images || [];
    const defaultDescription = auth?.professional?.portfolioDetail[0]?.description || "";
    const [portfolioLoading, setportfolioLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [IsLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState(defaultDescription);
    const toastId = useRef(null);
    const [portfolioUrls, setportfolioUrls] = useState(defaultImages.length > 0 ? defaultImages : []);
    const [errorPortfolioImage, setErrorPortfolioImage] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        event.target.value = null;

        if (files.length > 0) {
            setErrorPortfolioImage('');
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
        if (value.trim()) {
            setErrorDescription('');
        }
    };

    const handleRemoveFile = (index) => {
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
        setportfolioLoading(true)
        dispatch(uploadTheDocuments(formData))
            .then(unwrapResult)
            .then((obj) => {
                let uploadedUrl = obj?.data?.data;
                if (uploadedUrl?.length > 0) {
                    uploadedUrl = uploadedUrl.map(obj => obj.url);
                }
                setportfolioUrls((prevUrls) => [...prevUrls, ...uploadedUrl]);
                setportfolioLoading(false);
            })
            .catch((obj) => {
            });
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
                await Cookies.set("stepsDone", true);
                await getProfileFunc();
                await router.push('/auth/professionalVefication');
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

        let isValid = true;
        if (portfolioUrls.length === 0) {
            setErrorPortfolioImage('Please upload portfolio.');
            isValid = false;
        } else {
            setErrorPortfolioImage('');
        }
        if (!description.trim()) {
            setErrorDescription('Please add a description.');
            isValid = false;
        } else {
            setErrorDescription('');
        }


        if (isValid) {
            const params = {
                portfolioDetail:
                {
                    images: portfolioUrls,
                    description: description,
                }

            };

            setupProfileFunc(params);

        }
    }

    return (
        <>
            <div className="w-full lg:w-3/4 p-6">
                <section>
                    <div className='profileHeight pb-5 overflow-y-auto'>
                        <div>
                            <h2 className="text-xl font-semibold mt-2 mb-4">Add Portfolio Details</h2>
                            {
                                portfolioLoading ?
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
                                    <div className="flex flex-wrap gap-4">
                                        {portfolioUrls?.length > 0 && portfolioUrls.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex servicesShadow justify-center w-36 h-36 bg-white rounded-xl p-2"
                                            >
                                                <Image
                                                    src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                                    className="rounded-lg object-cover"
                                                    width="134"
                                                    height="134"
                                                    alt={`Uploaded document ${index + 1}`}
                                                />
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
                            }
                            {errorPortfolioImage && (
                                <Error error={errorPortfolioImage} />
                            )}
                        </div>
                        <textarea
                            placeholder='Add Description'
                            className="mt-4 block w-full text-sm font-medium p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
                            type="textarea"
                            rows="8"
                            name="desc"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                        {errorDescription && (
                            <Error error={errorDescription} />
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <button onClick={() => dispatch(getServiceStepAsync("2"))} type="button" className="px-5 medmob:px-10 pinkshadow lg:px-16 font-semibold justify-center pinkshadow flex gap-2 bg-white items-center text-white py-5 rounded-xl">
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
                        <button disabled={IsLoading} onClick={onSave} type="submit" className="px-10 lg:px-16 font-semibold mainblue text-white p-4 blueshadow shadow-lg  shadow-[#1B75BC] rounded-xl">
                            {IsLoading ? <Spinner /> : "Submit"}
                        </button>
                    </div>
                </section>
            </div>

        </>
    )
}

export default Portfolio;