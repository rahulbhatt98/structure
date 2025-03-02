import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getServiceStepAsync, getTheProfile, listofService, selectLoginAuth, setupProfessionalProfile } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../../utilities/useLocalStorage';
import Error from '../common/Error';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import UploadDocument from '../modals/uploadDocument';

function Services({ setStepValue }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);

    const router = useRouter()

    const dispatch = useDispatch();
    const toastId = React.useRef(null);
    const [search, setSearch] = useState();
    const [selectedDocument, setSelectedDocument] = useState("")

    const auth = useSelector(selectLoginAuth);
    const defaultServices = auth?.professional?.professionalUserServices || [];

    const uniqueSubCategories = getUniqueSubCategories(defaultServices);

    const oldSelectedServiceDetail = transformData(defaultServices);

    const [serviceDetail, setServiceDetail] = useState(oldSelectedServiceDetail?.length > 0 ? oldSelectedServiceDetail : []);


    const getUniqueCategoryIds = (services) => {
        // Extract unique category IDs from services
        return [...new Set(services.map(service => service.category_id))];
    };


    const uniqueCategoryIds = getUniqueCategoryIds(defaultServices);
    // setOpenServiceId, openServiceId
    const [openServiceIds, setOpenServiceIds] = useState(uniqueCategoryIds ? uniqueCategoryIds : []);
    const [checkedSubcategories, setCheckedSubcategories] = useState({});
    const [openServiceSelectedId, setOpenServiceSelectedId] = useState("")
    const [selectedSubcategories, setselectedSubcategories] = useState(uniqueSubCategories?.length > 0 ? uniqueSubCategories : []);

    console.log(checkedSubcategories, "checkedSubcategories")

    const [isSaved, setIsSaved] = useState(false);
    const [isEditingPrice, setIsEditingPrice] = useState(false);

    const [errorSubcategory, setErrorSubcategory] = useState('');
    const [noServiceError, setnoServiceError] = useState('');

    const [errorService, setErrorService] = useState('');
    const [docsError, setdocsError] = useState('');

    const [errorPrice, setErrorPrice] = useState('');

    const [price, setPrice] = useState('');
    const [priceType, setPriceType] = useState('per_hour');

    const [IsLoading, setIsLoading] = useState(false);

    const [serviceList, setServiceList] = useState([]);

    const [selectedServiceId, setSelectedServiceId] = useState(null);
    let serviceWithZeroPrice;

    function getUniqueSubCategories(data) {
        const seenIds = new Set();
        const uniqueSubCategories = [];

        data.forEach(item => {
            const subCategory = item.subCategories?.id;

            if (subCategory && !seenIds.has(subCategory)) {
                seenIds.add(subCategory);
                uniqueSubCategories.push(subCategory);
            }
        });

        return uniqueSubCategories;
    }

    function transformData(input) {
        return input.map(item => ({
            categoryId: item.category_id,
            subcategoryId: item.subcategory_id,
            serviceId: item.service_id,
            price: item.price,
            priceType: item.price_type,
            upload_certificates: item?.upload_certificates || undefined,
            upload_licenses: item?.upload_licenses || undefined
        }));
    }

    const transformServices = (data) => {
        return data.map(item => ({
            id: item?.services?.id,
            name: item?.services?.name,
            price: item?.price,
            priceType: item.price_type,
            description: item?.services?.description,
            image: item?.services?.image,
            category_id: item?.services?.category_id,
            subcategory_id: item?.services?.subcategory_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            checked: true,
            upload_certificates: item?.upload_certificates || undefined,
            upload_licenses: item?.upload_licenses || undefined,
            license_required: (item?.upload_licenses && item?.upload_licenses?.length > 0) ? true : false,
            certificate_required: (item?.upload_certificates && item?.upload_certificates?.length > 0) ? true : false,
        }));
    };

    const OldselectedServices = transformServices(defaultServices);
    const groupedServices = OldselectedServices.reduce((acc, service) => {
        const { category_id } = service;

        // Check if the category already exists in the accumulator
        let categoryGroup = acc.find(cat => cat.category_id === category_id);

        if (categoryGroup) {
            // If it exists, push the service into the existing services array
            categoryGroup.services.push(service);
        } else {
            // If it doesn't exist, create a new category entry
            acc.push({
                category_id,
                services: [service]
            });
        }

        return acc;
    }, []);
    const [selectedServices, setSelectedServices] = useState(groupedServices.length > 0 ? groupedServices : []);

    console.log(selectedServices, "22222222222222222222222222");

    const groupedServicesData = auth?.professional?.professionalUserServices.reduce((acc, service) => {
        const { category_id, services, subcategory_id, subCategories, admin_status, price, price_type } = service;

        if (!acc[category_id]) {
            acc[category_id] = {
                category: service.categories,
                services: [],
                subcategory_ids: [],
            };
        }

        const serviceWithStatus = {
            ...services,
            admin_status: admin_status || null,
            price: price,
            price_type: price_type
        };

        acc[category_id].services.push(serviceWithStatus);
        if (subcategory_id) {
            acc[category_id].subcategory_ids.push(subCategories?.name);
        }

        return acc;
    }, {});

    const filteredGroupedServices = groupedServicesData && Object?.values(groupedServicesData)?.flatMap(category =>
        category.services.filter(service => service.admin_status === "refuse")
    );

    const filteredGroupedServicesApprove = groupedServicesData && Object?.values(groupedServicesData)?.flatMap(category =>
        category.services.filter(service => service.admin_status === "approve")
    );

    const removeMatchingServices = (original, toRemove) => {
        if (!toRemove || toRemove.length === 0) {
            // If the second array is empty, return the original array unchanged
            return original;
        }

        return original.filter(item =>
            !toRemove.some(rem => rem.id === item.serviceId)
        );
    };

    const updatedArrayToSend = removeMatchingServices(serviceDetail, filteredGroupedServicesApprove);

    console.log(filteredGroupedServicesApprove, serviceDetail, updatedArrayToSend, "approved servicessssssssssssssssss");

    const handleCheckboxChange = (serviceId, service, checkedValue) => {
        setdocsError("")
        setOpenServiceSelectedId(serviceId)

        if (!checkedValue) {
            const filteredData = serviceDetail.filter(record => record.categoryId !== serviceId);
            setServiceDetail(filteredData)
            setOpenServiceSelectedId("")

            let filterdCategory = selectedServices?.find(val => val?.category_id === serviceId)

            const subcategoryIds = filterdCategory && filterdCategory?.services
                .filter(service => service.subcategory_id !== null)
                .map(service => service.subcategory_id);

            subcategoryIds.forEach(id => {
                if (checkedSubcategories.hasOwnProperty(id)) {
                    delete checkedSubcategories[id];
                }
            });

            // setCheckedSubcategories(prev => {
            //     const allFalse = Object.keys(prev).reduce((acc, key) => {
            //         acc[key] = false;
            //         return acc;
            //     }, {});
            //     return allFalse;
            // });
        }

        setIsSaved(true)
        setIsEditing(true)



        // setSelectedServices(prevCategories => {
        //     const categoryIndex = prevCategories.findIndex(cat => cat.category_id === serviceId);

        //     if (categoryIndex !== -1) {
        //         const updatedCategories = prevCategories.filter((_, index) => index !== categoryIndex);
        //         return [
        //             ...updatedCategories,
        //             {
        //                 category_id: serviceId,
        //                 services: service
        //             }
        //         ];
        //     } else {
        //         return [
        //             ...prevCategories,
        //             {
        //                 category_id: serviceId,
        //                 services: service
        //             }
        //         ];
        //     }
        // });

        const updateCategories = (prevCategories) => {
            const categoryIndex = prevCategories.findIndex(cat => cat.category_id === serviceId);
            let updatedCategories;

            if (categoryIndex !== -1) {
                updatedCategories = prevCategories.filter((_, index) => index !== categoryIndex);
            } else {
                updatedCategories = [...prevCategories];
            }

            updatedCategories.push({
                category_id: serviceId,
                services: service
            });

            return updatedCategories;
        };

        const updatedServices = updateCategories(selectedServices);
        setSelectedServices(updatedServices);

        setOpenServiceIds(prev => {
            if (prev.includes(serviceId)) {
                // Remove the serviceId if it's already in the array
                return prev.filter(id => id !== serviceId);
            } else {
                // Add the serviceId if it's not in the array
                return [...prev, serviceId];
            }
        });
    };

    const [priceSet, setPriceSet] = useState(false);

    const handleCheckboxChangeService = (serviceId, categoryId, serviceData) => {
        setdocsError("")
        // Find if any selected service has a price of 0 and prevent further selection

        // serviceWithZeroPrice = selectedServices?.find(service =>
        //     service.checked && service.price === '0'
        // );
        setPriceType(serviceData?.price_type)
        serviceWithZeroPrice = selectedServices?.filter(val => val?.id == categoryId)?.services?.find(service =>
            service.checked && service.price === '0'
        );

        if (serviceWithZeroPrice && serviceWithZeroPrice.id !== serviceId) {
            setErrorPrice('Please set the price before selecting other services.');
            return;
        }

        const updatedServices = selectedServices?.find(val => val?.category_id == categoryId)?.services?.map(service => {
            if (service.id === serviceId) {
                return { ...service, checked: !service.checked };
            }
            return service;
        });

        let newSelectedService = selectedServices?.find(val => val?.category_id == categoryId)?.services?.find(val => val?.id == serviceId)

        // const selectedService = updatedServices.find(service => service.id === serviceId);

        // If service has a price of 0 and is checked, enforce price setting
        if (newSelectedService?.checked && (!newSelectedService.price || newSelectedService.price === 0)) {
            setSelectedServiceId(serviceId);
            setIsEditingPrice(true);  // Force price editing if price is 0
            setErrorPrice("Please set a price for this service.");
        } else {
            setSelectedServiceId(serviceId);
            setIsEditingPrice(false);
        }

        setSelectedServices(prevCategories => {
            return prevCategories.map(category => {
                if (category.category_id === categoryId) {
                    return {
                        ...category,
                        services: updatedServices
                    };
                }
                return category; // Return the category unchanged if no match
            });
        });

        // setSelectedServices(prevCategories => {
        //     const category = prevCategories.find(cat => cat.category_id === categoryId);
        //     if (category) {
        //         return prevCategories.map(cat =>
        //             cat.id === serviceId
        //                 ? { ...cat, services: [...cat.service, updatedServices] }
        //                 : cat
        //         );
        //     } else {
        //         return [
        //             ...prevCategories,
        //             {
        //                 category_id: serviceId,
        //                 services: [updatedServices]
        //             }
        //         ];
        //     }
        // });
    };

    const getServiceList = () => {
        setIsLoading(true);

        let params = {
            page: 1,
            limit: 10,
        };

        if (search && search != "") {
            params.keyword = search
        }
        dispatch(listofService(params))
            .then((obj) => {
                setServiceList(obj?.payload?.data?.data?.data);
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getServiceList();
    }, [search]);

    const handleCheckboxChangeSubcategory = (categoryId, subcategoryId, subcategory) => {
        const hasServices = subcategory?.service?.length > 0;


        const isChecked = !checkedSubcategories[subcategoryId];
        setCheckedSubcategories(prevState => ({
            ...prevState,
            [subcategoryId]: isChecked
        }));

        if (isChecked) {
            if (!hasServices) {
                // Show message if the subcategory has no services
                setnoServiceError("No services for this subcategory");
            } else {
                setnoServiceError("");

            }
            setErrorSubcategory('');
        } else {
            // Checkbox is unchecked
            if (!hasServices) {
                setnoServiceError(""); // Clear error message when unchecked
            }
        }

        const services = serviceList.flatMap(service =>
            service.subCategories?.find(subcategory => subcategory?.id === subcategoryId)?.service || []
        );

        if (isChecked) {
            // setSelectedServices(prevState => [
            //     ...prevState,
            //     ...services.filter(service => !prevState.some(s => s.id === service.id)).map(service => ({
            //         ...service,
            //         checked: false
            //     }))
            // ]);
            setSelectedServices(prevState => {
                const existingCategoryIndex = prevState.findIndex(cat => cat.category_id === categoryId);

                if (existingCategoryIndex !== -1) {
                    const existingCategory = prevState[existingCategoryIndex];

                    const newServices = services.filter(service =>
                        !existingCategory.services.some(s => s.id === service.id)
                    ).map(service => ({
                        ...service,
                        checked: false
                    }));

                    return prevState.map((cat, index) =>
                        index === existingCategoryIndex
                            ? { ...cat, services: [...cat.services, ...newServices] }
                            : cat
                    );
                } else {
                    const newServices = services.map(service => ({
                        ...service,
                        checked: false
                    }));

                    return [
                        ...prevState,
                        {
                            category_id: categoryId,
                            services: newServices
                        }
                    ];
                }
            });
        } else {
            // setSelectedServices(prevState =>
            //     prevState.filter(service => !services.some(s => s.id === service.id))
            // );
            setSelectedServices(prevCategories => {
                return prevCategories.map(category => ({
                    ...category,
                    services: category.services.filter(service =>
                        !services.some(s => s.id === service.id)
                    )
                })).filter(category => category.services.length > 0);
            });
        }
    };
    const [isEditing, setIsEditing] = useState(false);

    function validateServices(services) {
        const licenseErrors = [];
        const certificateErrors = [];

        services.forEach(service => {
            const { name, certificate_required, license_required, upload_certificates, upload_licenses } = service;

            // Check if license is required and upload_licenses is not provided or has length 0
            if (license_required && (!upload_licenses || upload_licenses.length === 0)) {
                licenseErrors.push(name);
            }

            // Check if certificate is required and upload_certificates is not provided or has length 0
            if (certificate_required && (!upload_certificates || upload_certificates.length === 0)) {
                certificateErrors.push(name);
            }
        });

        // Combine the error messages if there are any errors
        const errors = [];
        if (licenseErrors.length > 0 || certificateErrors.length > 0) {
            // errors.push(`Licenses are required for the following services: ${licenseErrors.join(", ")}`);
            // if (!toast.isActive(toastId.current)) {
            //     toastId.current = toast.error("Please upload required document");
            // }
            setdocsError("Please upload required document")
        }
        else {
            setdocsError("")
        }
        // if (certificateErrors.length > 0) {
        //     // errors.push(`Certificates are required for the following services: ${certificateErrors.join(", ")}`);
        //     if (!toast.isActive(toastId.current)) {
        //         toastId.current = toast.error("Please upload required document");
        //     }
        // }

        // If there are any errors, throw a single error with combined messages
        if (errors.length > 0) {
            // setdocsError(errors.join(" | "))
        }
        else {
            // setdocsError("")
        }
        return (licenseErrors.length > 0 || certificateErrors?.length > 0) ? true : null;
    }

    const handleSave = (categoryId, subCategories) => {

        setselectedSubcategories(Object.keys(checkedSubcategories).filter(id => checkedSubcategories[id]))
        const selectedSubcategoriesIds = Object.keys(checkedSubcategories).filter(id => checkedSubcategories[id]);
        const selectedServiceIds = selectedServices?.find(val => val?.category_id == categoryId)?.services?.filter(service => service.checked).map(service => service.id);

        // if (selectedSubcategoriesIds.length === 0) {
        //     setErrorSubcategory('Please select at least one subcategory.');
        //     return
        // } else {
        //     setErrorSubcategory('');
        // }

        if (selectedServiceIds && selectedServiceIds?.length === 0) {
            setdocsError("")
            setErrorService('Please select at least one service.');
            return
        } else {
            setErrorService('');
        }

        const serviceWithZeroPrice = selectedServices.find(service => service.checked && service.price === '0');

        if (serviceWithZeroPrice) {
            setErrorPrice(`Please set the price for the service: ${serviceWithZeroPrice.name}`);
            return;
        } else {
            setErrorPrice('');
        }
        setIsEditing(!isEditing);

        const ourServices = selectedServices?.find((val) => val?.category_id == categoryId)?.services.filter(service => service.checked);

        const errorMessage = validateServices(ourServices);

        if (errorMessage) {
            return;
        }
        // const checkUploadLicenses = (services) => {
        //     for (let service of services) {
        //         if (!service.upload_licenses || service.upload_licenses.length === 0) {
        //             setdocsError('Please upload license for selected service.');
        //             return false;
        //         }
        //     }
        //     return true;
        // };
        // const licensesValid = checkUploadLicenses(ourServices);

        // // Stop execution if licenses are invalid
        // if (!licensesValid) {
        //     return;
        // }
        // // Call the function to validate
        // checkUploadLicenses(ourServices);

        if (selectedSubcategoriesIds.length > 0 || selectedServiceIds.length > 0) {
            setIsSaved(false);
            // const selectedServiceDetails = selectedServices
            //     .filter(service => service.checked)
            //     .map(service => ({
            //         categoryId: categoryId,
            //         subcategoryId: service.subcategory_id === null ? "" : service.subcategory_id,
            //         serviceId: service.id,
            //         price: service.price,
            //         priceType: service.priceType ? service.priceType : "fixed"
            //     }));


            // selectedServices?.find(val => val?.category_id == listItem?.id)?.services.filter(service => service.checked)

            const selectedServiceDetails = selectedServices?.find((val) => val?.category_id == categoryId)?.services
                .filter(service => service.checked)
                .map(service => ({
                    categoryId: categoryId,
                    serviceId: service.id,
                    price: service.price,
                    upload_licenses: service?.upload_licenses || undefined,
                    upload_certificates: service?.upload_certificates || undefined,
                    priceType: service.price_type ? service.price_type : "fixed",
                    ...(service.subcategory_id ? { subcategoryId: service.subcategory_id } : {}) // Include only if truthy
                }));

            const filteredData = serviceDetail.filter(record => record.categoryId !== categoryId);

            setServiceDetail([...filteredData, ...selectedServiceDetails])


            // setServiceList(prevList =>
            //     prevList.map(service =>
            //         service.id === categoryId ? { ...service, isPriceSaved: true } : service
            //     )
            // );

        }
        setOpenServiceSelectedId("")
    };



    const setupProfileFunc = () => {
        // let param = {
        //     serviceDetail: serviceDetail
        // }
        // if (serviceDetail.length === 0) {
        //     if (!toast.isActive(toastId.current)) {
        //         toastId.current = toast.error("Please save service.");
        //     }
        // }
        // updatedArrayToSend
        let param = {
            serviceDetail: serviceDetail.map(service => ({
                categoryId: service.categoryId,
                serviceId: service.serviceId,
                price: service.price,
                priceType: service.priceType ? service.priceType : "fixed",
                uploadCertificate: (service?.upload_certificates && service?.upload_certificates?.length > 0) ? service?.upload_certificates?.filter(val => val?.status != "approve")?.map(obj => obj.image) : [],
                uploadLicenses: (service?.upload_licenses && service?.upload_licenses?.length > 0) ? service?.upload_licenses?.filter(val => val?.status != "approve")?.map(obj => obj.image) : [],
                ...(service.subcategoryId ? { subcategoryId: service.subcategoryId } : {}) // Conditionally include subcategoryId if it's not null/undefined
            }))
        };
        setIsLoading(true);
        dispatch(setupProfessionalProfile(param))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success("Services added successfully");
                }
                setIsLoading(false);
                setIsSaved(false)
                dispatch(getServiceStepAsync("2"))

                getProfileFunc();
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error("Select atleast one service");
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

    const handlePriceSubmit = (categoryId) => {
        if (!price || isNaN(price) || parseFloat(price) === 0) {
            setErrorPrice('Please enter a valid price.');
            return;
        }


        selectedServiceId

        // Update the price for the selected service
        // const updatedServices = selectedServices.map(service => {
        //     if (service.id === selectedServiceId) {
        //         return { ...service, price, priceType };
        //     }
        //     return service;
        // });

        // setSelectedServices(updatedServices);
        setSelectedServices(prevCategories => {
            return prevCategories.map(category => ({
                ...category,
                services: category.services.map(service => {
                    if (service.id === selectedServiceId) {
                        return { ...service, price, price_type: priceType };
                    }
                    return service;
                })
            }));
        });


        setSelectedServices(prevCategories => {
            const category = prevCategories.find(cat => cat.category_id === categoryId);
            if (category) {
                return prevCategories.map(cat =>
                    cat.id === selectedServiceId
                        ? {
                            ...cat, services: category.services.map(service => {
                                if (service.id === selectedServiceId) {
                                    return { ...service, price, priceType };
                                }
                                return service;
                            })
                        }
                        : cat
                );
            } else {
                return [
                    ...prevCategories,
                    {
                        category_id: categoryId,
                        services: [updatedServices]
                    }
                ];
            }
        });

        setPrice('');
        setErrorPrice("");
        setIsEditingPrice(false);
        setSelectedServiceId(null);
    };

    const EditTheService = (categroyId) => {
        setIsSaved(true)
        setIsEditing(!isEditing);
        setOpenServiceSelectedId(categroyId)
    }

    // Assuming selectedSubcategories is an array of subcategory IDs
    useEffect(() => {
        const initialCheckedState = selectedSubcategories.reduce((acc, id) => {
            acc[id] = true;
            return acc;
        }, {});
        setCheckedSubcategories(initialCheckedState);
    }, [selectedSubcategories]);


    return (
        <>
            <div className="w-full lg:w-3/4 p-6">
                <div className='flex justify-between flex-wrap items-center'>
                    <h2 className="text-lg font-semibold">{router.pathname === "/professionalProfile/addService" ? "Add more service" : "Select services you offer"}</h2>
                    <div className='relative w-full sm:w-1/2'>
                        <input onChange={(e) => setSearch(e.target.value)} placeholder='Search services' type="text" className='mt-1 w-full searchShadow block text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl border-2 border-[#FFFFFF] placeholder:text-gray-500 outline-none sm:text-sm' />
                        <Image src="/assets/Search.svg" alt="search" width="20" height="20" className='absolute right-3 top-4' />
                    </div>
                </div>

                <section>
                    {filteredGroupedServices?.length > 0 && <h4 className='text-red-500 text-base'>Your {filteredGroupedServices?.map((val, index) => <span key={index}> &quot;{val?.name}&quot;{index < (filteredGroupedServices?.length - 1) && ','} </span>)} service has been rejected. Please upload the documents again.</h4>}
                    <div className='profileHeight PersonalDetails pb-5 overflow-y-auto'>

                        {
                            (serviceList && serviceList?.length > 0) ?
                                <ul className='mt-3 space-y-3'>
                                    {serviceList?.map((listItem, index) => (
                                        <li key={index}>
                                            <div className='servicesShadow flex justify-between pr-2 medmob:pr-6 bg-white h-20'>
                                                <div className='flex items-center gap-2 medmob:gap-5'>
                                                    <Image src={listItem?.image ? listItem?.image : "/assets/serviceplaceholder.svg"} alt="service" width="112" height="78" className='md:w-[115px] md:h-[80px] w-[100px] h-[70px] object-cover rounded-lg' />
                                                    <div>
                                                        <div>
                                                            <h3 className='text-lg md:text-2xl first-letter:uppercase lowercase font-semibold'>{listItem?.name}</h3>
                                                            {serviceDetail?.find(val => val?.categoryId === listItem?.id) && selectedSubcategories.length > 0 && (
                                                                <div className='mt-1 md:flex hidden'>
                                                                    <h4 className='text-sm font-medium maingray mb-2'>Sub Category:</h4>
                                                                    <p className='text-sm ml-1'>
                                                                        {selectedSubcategories
                                                                            .map(subcategoryId => {
                                                                                const subcategory = listItem.subCategories.find(subcat => subcat.id === subcategoryId);
                                                                                return subcategory ? subcategory.name : null;
                                                                            })
                                                                            .filter(name => name)
                                                                            .join(', ')}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex gap-3'>
                                                    {/* {listItem.isPriceSaved && (
                                                <div className='mt-3'>
                                                    <span>Price</span>
                                                    <div>
                                                        <span>${price}<sub>/{priceType}</sub></span>
                                                    </div>
                                                </div>
                                            )} */}
                                                    {/* setSelectedServices(listItem?.service) */}
                                                    <input type="checkbox" disabled={auth?.profile_completed_steps === "4"} className="checkbox-custom2 cursor-pointer" checked={openServiceIds.includes(listItem.id)} onChange={(e) => { handleCheckboxChange(listItem.id, listItem?.service, e.target.checked); setnoServiceError("") }} />
                                                </div>
                                            </div>


                                            {openServiceIds.includes(listItem.id) && selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.length > 0 && (!(openServiceSelectedId == listItem?.id)) && (
                                                <div className='p-4 bg-white serviceBox'>

                                                    {serviceDetail?.find(val => val?.categoryId === listItem?.id) && selectedSubcategories.length > 0 && (
                                                        <div className='mt-1 flex flex-wrap my-3 md:hidden'>
                                                            <h4 className='text-sm font-medium maingray mb-2'>Sub Category:</h4>
                                                            <p className='text-sm ml-1'>
                                                                {selectedSubcategories
                                                                    .map(subcategoryId => {
                                                                        const subcategory = listItem.subCategories.find(subcat => subcat.id === subcategoryId);
                                                                        return subcategory ? subcategory.name : null;
                                                                    })
                                                                    .filter(name => name)
                                                                    .join(', ')}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <h3 className='text-sm font-medium maingray mb-2'>Services:</h3>
                                                    <div className='flex justify-between'>
                                                        <div className='flex flex-wrap gap-4'>
                                                            {selectedServices?.find(val => val?.category_id == listItem?.id)?.services.filter(service => service.checked)
                                                                // .filter(service =>
                                                                //     listItem.subCategories.some(subcat =>
                                                                //         subcat.service.some(serv => serv.id === service.id && service.checked)
                                                                //     )
                                                                // )
                                                                .map(service => (
                                                                    <div key={service.id} className='flex items-center gap-2 py-2 px-4 rounded-md selectserviceShadow bg-white'>
                                                                        <span className='text-sm font-medium'>{service.name}</span>
                                                                        <span className='text-sm mainbluetext'>${service.price}{service.price_type === 'per_hour' ? '/hr' : ''}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                    </div>
                                                    <div className='flex justify-end'>

                                                        <button onClick={() => EditTheService(listItem?.id)} type='button' className='font-semibold mainbluetext mt-2 sm:mt-0'>Edit</button>
                                                    </div>
                                                </div>
                                            )}

                                            {(isEditing || isSaved) && openServiceIds.includes(listItem.id) && (openServiceSelectedId == listItem?.id) && (

                                                <div className='p-4 bg-white serviceBox'>
                                                    {
                                                        listItem?.subCategories.length > 0 && (
                                                            <div>
                                                                <h4 className='text-sm font-medium maingray mb-2'>Select the Sub Category you provide in cleaning</h4>
                                                                <div className='flex flex-wrap gap-4 mb-4'>
                                                                    {listItem?.subCategories?.map((subcategory) => (
                                                                        <label
                                                                            key={subcategory?.id}
                                                                            className={`flex items-center gap-2 py-2 px-4 rounded-md ${(checkedSubcategories[subcategory?.id]) ? 'mainblue text-white' : 'selectserviceShadow bg-white maingray'}`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox-custom"
                                                                                checked={checkedSubcategories[subcategory?.id] || false}
                                                                                disabled={auth?.profile_completed_steps === "4"}
                                                                                onChange={() => handleCheckboxChangeSubcategory(listItem?.id, subcategory?.id, subcategory)}
                                                                            />
                                                                            <span className='text-sm'>{subcategory?.name}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                                {errorSubcategory && (
                                                                    <Error error={errorSubcategory} />
                                                                )}
                                                                {
                                                                    noServiceError && (
                                                                        <Error error={noServiceError} />

                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        ((selectedServices && selectedServices?.length > 0)) && (
                                                            <div className='mt-4'>
                                                                {(selectedServices?.length > 0 && selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.length > 0) &&
                                                                    <h5 className='text-sm font-medium maingray mb-2'>Select the services you provide</h5>}
                                                                <div className='flex flex-wrap gap-4 mb-4'>
                                                                    {
                                                                        (selectedServices?.length > 0 && selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.length > 0) &&
                                                                        selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.map((val, index) => (
                                                                            <label
                                                                                key={index}
                                                                                className={`flex items-center gap-2 py-2 px-4 rounded-md ${val.checked ? 'mainblue text-white' : 'selectserviceShadow bg-white maingray'}`}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="checkbox-custom"
                                                                                    checked={val.checked}
                                                                                    disabled={auth?.profile_completed_steps === "4"}
                                                                                    // disabled={
                                                                                    //     (isEditingPrice && val.id !== selectedServiceId) ||
                                                                                    //     (serviceWithZeroPrice && serviceWithZeroPrice.id !== val.id)  // Disable when another val has $0 price
                                                                                    // }
                                                                                    onChange={() => handleCheckboxChangeService(val?.id, listItem?.id, val)}
                                                                                />
                                                                                <span className='text-sm'>{val?.name}</span>
                                                                                {val?.price && val?.price !== '' && (
                                                                                    <span className="text-sm">
                                                                                        ${val?.price}{val?.price_type === 'per_hour' ? '/hr' : ''}
                                                                                    </span>
                                                                                )}
                                                                            </label>
                                                                        ))}


                                                                    {/* {
                                                                listItem?.service?.length > 0 &&
                                                                listItem?.service?.map(service => (
                                                                    <label
                                                                        key={service.id}
                                                                        className={`flex items-center gap-2 py-2 px-4 rounded-md ${service.checked ? 'mainblue text-white' : 'selectserviceShadow bg-white maingray'}`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox-custom"
                                                                            checked={service.checked}
                                                                            // disabled={
                                                                            //     isEditingPrice && service.id !== selectedServiceId
                                                                            // }
                                                                            disabled={
                                                                                (isEditingPrice && service.id !== selectedServiceId) ||
                                                                                (serviceWithZeroPrice && serviceWithZeroPrice.id !== service.id)  // Disable when another service has $0 price
                                                                            }
                                                                            onChange={() => handleCheckboxChangeService(service?.id)}
                                                                        />
                                                                        <span className='text-sm'>{service?.name}</span>
                                                                        {service?.price && service?.price !== '' && (
                                                                            <span className="text-sm">
                                                                                ${service?.price}{service?.priceType === 'per_hour' ? '/hr' : ''}
                                                                            </span>
                                                                        )}
                                                                    </label>
                                                                ))}

                                                                {
                                                                                 console.log(listItem?.subCategories.filter(category => 
                                                                                    serviceDetail.some(s => s.id === category.id)
                                                                                ),"response")
                                                                }

                                                            {
                                                                (listItem?.subCategories?.length > 0 && listItem?.subCategories.filter(category =>
                                                                    serviceDetail.some(s => s.id === category.id)
                                                                )?.length > 0) &&
                                                                listItem?.subCategories.filter(category =>
                                                                    serviceDetail.some(s => s.id === category.id))?.map(service => (
                                                                        <label
                                                                            key={service.id}
                                                                            className={`flex items-center gap-2 py-2 px-4 rounded-md ${service.checked ? 'mainblue text-white' : 'selectserviceShadow bg-white maingray'}`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox-custom"
                                                                                checked={service.checked}
                                                                                // disabled={
                                                                                //     isEditingPrice && service.id !== selectedServiceId
                                                                                // }
                                                                                disabled={
                                                                                    (isEditingPrice && service.id !== selectedServiceId) ||
                                                                                    (serviceWithZeroPrice && serviceWithZeroPrice.id !== service.id)  // Disable when another service has $0 price
                                                                                }
                                                                                onChange={() => handleCheckboxChangeService(service?.id)}
                                                                            />
                                                                            <span className='text-sm'>{service?.name}</span>
                                                                            {service?.price && service?.price !== '' && (
                                                                                <span className="text-sm">
                                                                                    ${service?.price}{service?.priceType === 'per_hour' ? '/hr' : ''}
                                                                                </span>
                                                                            )}
                                                                        </label>
                                                                    ))} */}

                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    {errorService && (
                                                        <Error error={errorService} />
                                                    )}


                                                    {selectedServiceId && (
                                                        <p className='text-base my-2'>
                                                            {selectedServices?.find(val => val?.category_id == listItem?.id)?.services.some(service =>
                                                                service.id === selectedServiceId &&
                                                                service.checked &&
                                                                service.price === '0'
                                                            ) ? (
                                                                <>
                                                                    Set the service price for : <span className='font-semibold'>{selectedServices?.find(val => val?.category_id == listItem?.id)?.services.find(service => service.id === selectedServiceId)?.name}</span>
                                                                </>
                                                            ) : (
                                                                selectedServices?.find(val => val?.category_id == listItem?.id)?.services.some(service =>
                                                                    service.id === selectedServiceId &&
                                                                    service.checked
                                                                ) ? (
                                                                    <>
                                                                        Edit the service price for : <span className='font-semibold'>{selectedServices?.find(val => val?.category_id == listItem?.id)?.services.find(service => service.id === selectedServiceId)?.name}</span>, if you&apos;d like to make changes.
                                                                    </>
                                                                ) : (
                                                                    <span className='text-gray-500'></span>
                                                                )
                                                            )}
                                                        </p>
                                                    )}


                                                    {(selectedServices?.find(val => val?.category_id == listItem?.id)?.services.some(service =>
                                                        service.id === selectedServiceId &&
                                                        service.checked)) && (
                                                            <div>
                                                                {/* <div className='flex items-center gap-1 medmob:gap-4'>
                                                                    <label className='mr-2 text-sm font-semibold maingray'>Set Price:</label>
                                                                    <label className='flex items-center'>
                                                                        <input
                                                                            type="radio"
                                                                            name="pricing"
                                                                            className='radio-custom mr-1'
                                                                            value="per_hour"
                                                                            checked={priceType === 'per_hour'}
                                                                            onChange={() => setPriceType('per_hour')}
                                                                        />
                                                                        <span className='text-sm font-semibold'>Per hour</span>
                                                                    </label>
                                                                    <label className='flex items-center'>
                                                                        <input
                                                                            type="radio"
                                                                            name="pricing"
                                                                            className='radio-custom mr-1'
                                                                            value="fixed"
                                                                            checked={priceType === 'fixed'}
                                                                            onChange={() => setPriceType('fixed')}
                                                                        />
                                                                        <span className='text-sm font-semibold'>Fixed</span>
                                                                    </label>
                                                                </div> */}

                                                                <div className="relative mt-4 w-full sm:w-1/2">
                                                                    <span className="absolute top-1/2 left-3 transform text-lg -translate-y-1/2 font-bold">$</span>
                                                                    <input
                                                                        type="text"
                                                                        value={price}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                        className="pl-8 p-3 border border-[#1B75BC1A] outline-none bg-[#1B75BC08] rounded-lg w-full"
                                                                        placeholder="Enter amount"
                                                                    />
                                                                    <button disabled={!price} onClick={() => handlePriceSubmit(listItem?.id)} className={`absolute top-1/2 right-3 ${!price ? "text-sky-300" : "mainbluetext"}  transform text-lg -translate-y-1/2 font-bold`}>{"Edit"}</button>
                                                                </div>
                                                                {errorPrice && (
                                                                    <Error error={errorPrice} />
                                                                )}
                                                            </div>
                                                        )}


{
    console.log(selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.filter(
        (service) =>
            (service.license_required || service.certificate_required) &&
            service.checked
    ),selectedServices,listItem?.id, "saaaaaaaaqq111111111111111111111111111")
}
                                                    <div className='flex gap-4 md:justify-end mt-4 md:mt-0'>
                                                        {(selectedServices?.find(val => val?.category_id == listItem?.id)?.services?.filter(
                                                            (service) =>
                                                                (service.license_required || service.certificate_required) &&
                                                                service.checked
                                                        )?.length > 0) && <button
                                                            className='lg:mt-4 py-2 px-2 md:px-6 blueBorder rounded-xl bg-white mainbluetext text-base'
                                                            onClick={() => { setIsModalOpen(true); setSelectedDocument(selectedServices?.filter(val => val?.category_id === listItem?.id)) }}
                                                        >
                                                                Upload Document
                                                            </button>}

                                                        <button
                                                            className='lg:mt-4 py-2 px-6 text-white mainblue rounded-xl text-base'
                                                            onClick={() => handleSave(listItem.id, listItem?.subCategories)}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                    <div className='flex justify-end mr-16 mt-2'>
                                                        {docsError && (
                                                            <Error error={docsError} />
                                                        )}
                                                    </div>
                                                    {isModalOpen && (
                                                        <UploadDocument
                                                            isOpen={isModalOpen}
                                                            onClose={() => closeModal()}
                                                            selectedDocument={selectedDocument}
                                                            selectedServices={selectedServices}
                                                            setSelectedServices={setSelectedServices}
                                                            setdocsError={setdocsError}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                :
                                <div className='flex justify-center items-center font-bold h-full'>
                                    No services available.
                                </div>
                        }
                    </div>

                    <div className={`flex ${router.pathname !== "/professionalProfile/addService" ? 'justify-between' : 'justify-end'} items-center`}>
                        {router.pathname !== "/professionalProfile/addService" &&
                            <>
                                <button onClick={() => dispatch(getServiceStepAsync(""))} type="button" className="px-10 pinkshadow lg:px-16 font-semibold justify-center pinkshadow flex gap-2 bg-white items-center text-white py-5 rounded-xl">
                                    <Image
                                        src="/assets/leftArrow.svg"
                                        alt="back"
                                        className=""
                                        height="6"
                                        width="8"
                                    />
                                    <span className="maingray block text-sm font-normal cursor-pointer">Go back</span>
                                </button>
                                <button onClick={setupProfileFunc} disabled={serviceDetail.length === 0} type="button" className={`px-10 lg:px-16 font-semibold ${serviceDetail.length === 0 ? "bg-[#b2d1e8]" : "mainblue"}  text-white p-4 blueshadow shadow-[#b2d1e8] rounded-xl`}>
                                    Next
                                </button>
                            </>
                        }
                        {router.pathname === "/professionalProfile/addService" &&
                            <button onClick={setupProfileFunc} type="button" className="px-10 lg:px-16 font-semibold mainblue text-white p-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl">
                                Verify Changes
                            </button>
                        }
                    </div>
                </section >
            </div >

        </>
    );
}

export default Services;