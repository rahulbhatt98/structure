import React, { useEffect, useState } from 'react';
import { selectLoginAuth } from '../../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Image from 'next/image';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

function MyPortfolio() {
    const loginData = useSelector(selectLoginAuth);
    const [isOpen, setIsOpen] = useState(false);
    const [bigImage, setbigImage] = useState("");



    const services = loginData?.professional?.professionalUserServices || [];
    const [selectedId, setSelectedId] = useState(null);

    // const handleCategoryChange = (event) => {
    //     setSelectedId(event.target.value);
    // };

    console.log(services, "ssssssssssaaaaaaaaaaaaaaaaaaaaaa");

    const groupedServices = services.reduce((acc, service) => {
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
    const selectedData = selectedId ? groupedServices[selectedId] : null;
    console.log(services, groupedServices[selectedId], "saaaaaaaaaaaaaa");
    const options = Object.keys(groupedServices).map((id) => ({
        value: id,
        label: groupedServices[id].category.name,
    }));

    const handleCategoryChange = (option) => {
        setSelectedId(option.value);  // Use option.value instead of event.target.value
    };


    // console.log(groupedServices,"ssssssssssssssssssss");

    // const category = services.length > 0 ? services[0]?.categories?.name : 'N/A'; 
    // const subCategories = Array.from(new Set(services.flatMap(service => 
    //     service.subCategories 
    //         ? [service.subCategories.name] 
    //         : []
    // )));

    // const aggregatedServices = services.map(service => ({
    //     name: service.services?.name,
    //     price: service.price
    // }));

    const portfolioImages = loginData?.professional?.portfolioDetail?.[0]?.images || [];
    const portfolioDescription = loginData?.professional?.portfolioDetail?.[0]?.description;

    useEffect(() => {
        const firstCategoryId = Object.keys(groupedServices)[0];
        if (firstCategoryId) {
            setSelectedId(firstCategoryId);
        }
    }, []);


    return (
        <div>
            <div className='flex justify-between items-center'>
                <h3 className="text-xl font-semibold text-gray-800 ml-4">Portfolio</h3>
                <Link href="/professionalProfile/addService" className='text-base mainblue text-white font-semibold p-2 rounded-lg mt-2'>+ Add Service</Link>
            </div>
            <div className="bg-white paymentsBorder rounded-xl px-6 py-5 mt-3">

                {/* Display Category and Subcategories */}
                <div className="flex flex-wrap gap-5 md:gap-10">
                    <div className="flex flex-col">
                        <h4 className="text-sm font-medium maingray">Category:</h4>
                        {/* <p className="text-sm font-semibold">{category}</p> */}
                        {/* <select onChange={handleCategoryChange} value={selectedId || ''} className='bg-white border rounded-lg p-2 outline-none cursor-pointer'>
                            <option value="" disabled>Select a category</option>
                            {Object.keys(groupedServices)?.length > 0 && Object.keys(groupedServices).map((id) => (
                                <option key={id} value={id}>
                                    {groupedServices[id].category.name}
                                </option>
                            ))}
                        </select> */}
                        <div className='flex items-center'>
                            <Dropdown
                                options={options}
                                onChange={handleCategoryChange}
                                value={options.find(option => option.value === selectedId)} // Set the current selected value
                                placeholder="Select a category"
                                className='bg-white w-40 rounded-lg outline-none cursor-pointer'
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

                    {selectedData && <div className="flex flex-col">
                        <h4 className="text-sm font-medium maingray">Sub Categories:</h4>
                        <p className="text-sm font-semibold">
                            {selectedData?.subcategory_ids.length > 0 ? [...new Set(selectedData?.subcategory_ids)].join(', ') : 'No Subcategories'}
                        </p>
                    </div>}
                </div>

                {selectedData && (
                    <div className="mt-4">
                        <h4 className="text-sm font-bold maingray">Services:</h4>
                        <div className="flex flex-wrap gap-4 pt-3">

                            {selectedData?.services?.filter(val => val?.admin_status === "approve").length > 0 ? (
                                selectedData.services
                                    .filter(val => val?.admin_status === "approve")
                                    .map((service, index) => (
                                        <div key={index} className="flex items-center font-medium gap-2 py-2 px-4 rounded-md selectserviceShadow bg-white">
                                            <span className="text-sm">{service.name}</span>
                                            <span className="text-sm mainbluetext">${service.price}</span>
                                        </div>
                                    ))
                            ) : (
                                // Message when no services are approved
                                <p className="text-sm mainbluetext">Your service is not approved for this category yet.</p>
                            )}
                        </div>
                    </div>
                )}


                {/* Display Portfolio Images */}
                <div className="mt-4">
                    <h4 className="text-sm font-bold maingray">Images:</h4>
                    <div className="flex flex-wrap gap-4 mt-3">
                        {portfolioImages.length > 0 ? (
                            portfolioImages.map((img, index) => (
                                <div key={index}>
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Portfolio Image ${index + 1}`}
                                        className="h-32 w-32 object-cover rounded-lg cursor-pointer"
                                        onClick={() => { setIsOpen(true); setbigImage(img) }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No images available</p>
                        )}
                        {isOpen && (
                            <Lightbox
                                mainSrc={bigImage}
                                onCloseRequest={() => setIsOpen(false)}
                            />
                        )}
                    </div>
                </div>

                {/* Display Portfolio Description */}
                <div className="mt-4">
                    <h4 className="text-sm font-bold maingray">Description:</h4>
                    <p className="text-sm">{portfolioDescription || 'No description available.'}</p>
                </div>
            </div>
        </div>
    );
}

export default MyPortfolio;
