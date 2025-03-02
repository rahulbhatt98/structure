import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getServiceStepAsync, getTheProfile, listofService, selectLoginAuth, setupProfessionalProfile } from '../../redux/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../../utilities/useLocalStorage';
import Error from '../common/Error';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from "react-toastify";

function Services({ setStepValue }) {
    const dispatch = useDispatch();
    const toastId = React.useRef(null);
    const [search, setSearch] = useState();

    const auth = useSelector(selectLoginAuth);
    const defaultServices = auth?.professional?.professionalUserServices || [];

    const uniqueSubCategories = getUniqueSubCategories(defaultServices);

    const oldSelectedServiceDetail = transformData(defaultServices);

    const [openServiceId, setOpenServiceId] = useState(defaultServices?.length > 0 ? defaultServices[0]?.category_id : null);
    const [checkedSubcategories, setCheckedSubcategories] = useState({});

    const [selectedSubcategories, setselectedSubcategories] = useState(uniqueSubCategories?.length > 0 ? uniqueSubCategories : []);

    const [isSaved, setIsSaved] = useState(false);
    const [isEditingPrice, setIsEditingPrice] = useState(false);

    const [errorSubcategory, setErrorSubcategory] = useState('');
    const [errorService, setErrorService] = useState('');
    const [errorPrice, setErrorPrice] = useState('');

    const [price, setPrice] = useState('');
    const [priceType, setPriceType] = useState('per_hour');

    const [serviceDetail, setServiceDetail] = useState(oldSelectedServiceDetail?.length > 0 ? oldSelectedServiceDetail : []);

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
            priceType: item.price_type
        }));
    }

    const transformServices = (data) => {
        return data.map(item => ({
            id: item?.services?.id,
            name: item?.services?.name,
            price: item?.price,
            description: item?.services?.description,
            image: item?.services?.image,
            category_id: item?.services?.category_id,
            subcategory_id: item?.services?.subcategory_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            checked: true
        }));
    };

    const OldselectedServices = transformServices(defaultServices);
    const [selectedServices, setSelectedServices] = useState(OldselectedServices.length > 0 ? OldselectedServices : []);


    const handleCheckboxChange = (serviceId) => {
        setIsSaved(true)
        setIsEditing(true)
        if (openServiceId === serviceId) {
            // Unchecking: Clear all selected services and subcategories
            setServiceDetail([])
            setSelectedServices([]);
            setCheckedSubcategories({});
            setselectedSubcategories([]);
            setSelectedServiceId(null);
            setPrice('');
            setPriceSet(false);
            setErrorPrice('');
            // Close the current service
            setOpenServiceId(null);
        } else {
            // Selecting a new service: Clear previous selections
            setSelectedServices([]);
            setCheckedSubcategories({});
            setselectedSubcategories([]);
            setSelectedServiceId(null);
            setPrice('');
            setPriceSet(false);
            setErrorPrice('');
            // Open the new service
            setOpenServiceId(serviceId);
        }
        // setOpenServiceId(prevId => prevId === serviceId ? null : serviceId);
    };

    const [priceSet, setPriceSet] = useState(false);

    const handleCheckboxChangeService = (serviceId) => {
        // Find if any selected service has a price of 0 and prevent further selection
        serviceWithZeroPrice = selectedServices.find(service =>
            service.checked && service.price === '0'
        );

        if (serviceWithZeroPrice && serviceWithZeroPrice.id !== serviceId) {
            setErrorPrice('Please set the price before selecting other services.');
            return;
        }

        const updatedServices = selectedServices.map(service => {
            if (service.id === serviceId) {
                return { ...service, checked: !service.checked };
            }
            return service;
        });

        const selectedService = updatedServices.find(service => service.id === serviceId);

        // If service has a price of 0 and is checked, enforce price setting
        if (selectedService?.checked && (!selectedService.price || selectedService.price === 0)) {
            setSelectedServiceId(serviceId);
            setIsEditingPrice(true);  // Force price editing if price is 0
            setErrorPrice("Please set a price for this service.");
        } else {
            setSelectedServiceId(serviceId);
            setIsEditingPrice(false);
        }

        setSelectedServices(updatedServices);
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

    const handleCheckboxChangeSubcategory = (subcategoryId) => {
        const isChecked = !checkedSubcategories[subcategoryId];
        setCheckedSubcategories(prevState => ({
            ...prevState,
            [subcategoryId]: isChecked
        }));

        if (isChecked) {
            setErrorSubcategory('');
        }

        const services = serviceList.flatMap(service =>
            service.subCategories?.find(subcategory => subcategory?.id === subcategoryId)?.service || []
        );

        if (isChecked) {
            setSelectedServices(prevState => [
                ...prevState,
                ...services.filter(service => !prevState.some(s => s.id === service.id)).map(service => ({
                    ...service,
                    checked: false
                }))
            ]);
        } else {
            setSelectedServices(prevState =>
                prevState.filter(service => !services.some(s => s.id === service.id))
            );
        }
    };
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (categoryId, subCategories) => {

        setselectedSubcategories(Object.keys(checkedSubcategories).filter(id => checkedSubcategories[id]))
        const selectedSubcategoriesIds = Object.keys(checkedSubcategories).filter(id => checkedSubcategories[id]);
        const selectedServiceIds = selectedServices.filter(service => service.checked).map(service => service.id);

        // if (selectedSubcategoriesIds.length === 0) {
        //     setErrorSubcategory('Please select at least one subcategory.');
        //     return
        // } else {
        //     setErrorSubcategory('');
        // }

        if (selectedServiceIds.length === 0) {
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

            const selectedServiceDetails = selectedServices
                .filter(service => service.checked)
                .map(service => ({
                    categoryId: categoryId,
                    serviceId: service.id,
                    price: service.price,
                    priceType: service.priceType ? service.priceType : "fixed",
                    ...(service.subcategory_id ? { subcategoryId: service.subcategory_id } : {}) // Include only if truthy
                }));


            setServiceDetail([...selectedServiceDetails])


            // setServiceList(prevList =>
            //     prevList.map(service =>
            //         service.id === categoryId ? { ...service, isPriceSaved: true } : service
            //     )
            // );

        }
    };

    console.log('serviceDetail:', serviceDetail);

    const setupProfileFunc = () => {
        // let param = {
        //     serviceDetail: serviceDetail
        // }
        let param = {
            serviceDetail: serviceDetail.map(service => ({
                categoryId: service.categoryId,
                serviceId: service.serviceId,
                price: service.price,
                priceType: service.priceType ? service.priceType : "fixed",
                ...(service.subcategoryId ? { subcategoryId: service.subcategoryId } : {}) // Conditionally include subcategoryId if it's not null/undefined
            }))
        };
        setIsLoading(true);
        dispatch(setupProfessionalProfile(param))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                setIsLoading(false);
                setIsSaved(false)
                dispatch(getServiceStepAsync("2"))

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

    const handlePriceSubmit = () => {
        if (!price || isNaN(price) || parseFloat(price) === 0) {
            setErrorPrice('Please enter a valid price.');
            return;
        }

        // Update the price for the selected service
        const updatedServices = selectedServices.map(service => {
            if (service.id === selectedServiceId) {
                return { ...service, price, priceType };
            }
            return service;
        });

        setSelectedServices(updatedServices);
        setPrice('');
        setErrorPrice("");
        setIsEditingPrice(false);
        setSelectedServiceId(null);
    };


    const EditTheService = () => {
        setIsSaved(true)
        setIsEditing(!isEditing);
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
                    <h2 className="text-lg font-semibold">Select services you offer</h2>
                    <div className='relative w-full sm:w-1/2'>
                        <input onChange={(e) => setSearch(e.target.value)} placeholder='Search services' type="text" className='mt-1 w-full searchShadow block text-sm font-medium p-3 bg-[#FFFFFF] rounded-xl border-2 border-[#FFFFFF] placeholder:text-gray-500 outline-none sm:text-sm' />
                        <Image src="/assets/Search.svg" alt="search" width="20" height="20" className='absolute right-3 top-4' />
                    </div>
                </div>

                <section>
                    <div className='profileHeight PersonalDetails pb-5 overflow-y-auto'>
                        <ul className='mt-3 space-y-3'>
                            {serviceList?.map((listItem, index) => (
                                <li key={index}>
                                    <div className='servicesShadow flex justify-between pr-2 medmob:pr-6 bg-white h-20'>
                                        <div className='flex items-center gap-2 medmob:gap-5'>
                                            <Image src={listItem?.image ? listItem?.image : "/assets/serviceplaceholder.svg"} alt="service" width="112" height="78" className='md:w-[115px] md:h-[80px] w-[100px] h-[70px] object-cover rounded-lg' />
                                            <div>
                                                <div>
                                                    <h3 className='text-lg md:text-2xl first-letter:uppercase lowercase font-semibold'>{listItem?.name}</h3>
                                                    {serviceDetail?.find(val => val?.categoryId === listItem?.id) && selectedSubcategories.length > 0 && !isEditing && (
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
                                            <input type="checkbox" className="checkbox-custom2 cursor-pointer" checked={openServiceId == listItem.id} onChange={() => { handleCheckboxChange(listItem.id); setSelectedServices(listItem?.service) }} />
                                        </div>
                                    </div>


                                    {openServiceId === listItem.id && selectedServices.length > 0 && !isEditing && (
                                        <div className='p-4 bg-white serviceBox'>

                                            {serviceDetail?.find(val => val?.categoryId === listItem?.id) && selectedSubcategories.length > 0 && !isEditing && (
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
                                            <div className='flex flex-wrap justify-between'>
                                                <div className='flex flex-wrap gap-4'>
                                                    {selectedServices.filter(service => service.checked)
                                                        // .filter(service =>
                                                        //     listItem.subCategories.some(subcat =>
                                                        //         subcat.service.some(serv => serv.id === service.id && service.checked)
                                                        //     )
                                                        // )
                                                        .map(service => (
                                                            <div key={service.id} className='flex items-center gap-2 py-2 px-4 rounded-md selectserviceShadow bg-white'>
                                                                <span className='text-sm font-medium'>{service.name}</span>
                                                                <span className='text-sm mainbluetext'>${service.price}{service.priceType === 'per_hour' ? '/hr' : ''}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <button onClick={EditTheService} type='button' className='font-semibold mainbluetext mt-2 sm:mt-0'>Edit</button>
                                            </div>
                                        </div>
                                    )}

                                    {(isEditing || isSaved) && openServiceId === listItem.id && (

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
                                                                        onChange={() => handleCheckboxChangeSubcategory(subcategory?.id)}
                                                                    />
                                                                    <span className='text-sm'>{subcategory?.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {errorSubcategory && (
                                                            <Error error={errorSubcategory} />
                                                        )}
                                                    </div>
                                                )
                                            }

                                            {
                                                ((selectedServices && selectedServices?.length > 0)) && (
                                                    <div className='mt-4'>
                                                        <h5 className='text-sm font-medium maingray mb-2'>Select the services you provide</h5>
                                                        <div className='flex flex-wrap gap-4 mb-4'>
                                                            {
                                                                selectedServices?.length > 0 &&
                                                                selectedServices.map(service => (
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
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {errorService && (
                                                <Error error={errorService} />
                                            )}


                                            {selectedServiceId && (
                                                <p className='text-base my-2'>
                                                    {selectedServices.some(service =>
                                                        service.id === selectedServiceId &&
                                                        service.checked &&
                                                        service.price === '0'
                                                    ) ? (
                                                        <>
                                                            Set the service price for : <span className='font-semibold'>{selectedServices.find(service => service.id === selectedServiceId)?.name}</span>
                                                        </>
                                                    ) : (
                                                        selectedServices.some(service =>
                                                            service.id === selectedServiceId &&
                                                            service.checked
                                                        ) ? (
                                                            <>
                                                                Edit the service price for : <span className='font-semibold'>{selectedServices.find(service => service.id === selectedServiceId)?.name}</span>, if you&apos;d like to make changes.
                                                            </>
                                                        ) : (
                                                            <span className='text-gray-500'></span>
                                                        )
                                                    )}
                                                </p>
                                            )}


                                            {selectedServices && (
                                                <div>
                                                    <div className='flex items-center gap-1 medmob:gap-4'>
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
                                                    </div>

                                                    <div className="relative mt-4 w-full sm:w-1/2">
                                                        <span className="absolute top-1/2 left-3 transform text-lg -translate-y-1/2 font-bold">$</span>
                                                        <input
                                                            type="text"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                            className="pl-8 p-3 border border-[#1B75BC1A] outline-none bg-[#1B75BC08] rounded-lg w-full"
                                                            placeholder="Enter amount"
                                                        />
                                                        <button onClick={handlePriceSubmit} className="absolute top-1/2 right-3 mainbluetext transform text-lg -translate-y-1/2 font-bold">Submit</button>
                                                    </div>
                                                    {errorPrice && (
                                                        <Error error={errorPrice} />
                                                    )}
                                                </div>
                                            )}

                                            <div className='flex justify-end'>
                                                <button
                                                    className='lg:mt-4 py-2 px-6 mainbluetext text-base'
                                                    onClick={() => handleSave(listItem.id, listItem?.subCategories)}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="flex justify-between items-center">
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
                        <button onClick={setupProfileFunc} type="button" className="px-10 lg:px-16 font-semibold mainblue text-white p-4 blueshadow shadow-lg shadow-[#1B75BC] rounded-xl">
                            Next
                        </button>
                    </div>
                </section >
            </div >

        </>
    );
}

export default Services;