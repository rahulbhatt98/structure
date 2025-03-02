import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Map from "./Map";
import Link from "next/link";
import { getTheProfessionalData } from "../../redux/auth/authSlice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import PortfolioModal from "../modals/portfolioModal";
import RequestDetail from "../modals/RequestDetail";
import Cookies from "js-cookie";
import AddTime from "../modals/addTime";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function SPDetails() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id, distance } = router.query;
    const [providerData, setproviderData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const verifiedLogin = Cookies.get("authToken");
    const [headerSearch, setHeaderSearch] = useState("")
    const [activeService, setActiveService] = useState(null);
    const [hours, setHours] = useState(0);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);


    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const openTimeModal = () => {
        setIsTimeModalOpen(true);
    };


    const closeTimeModal = (saveTime, enteredHours) => {
        if (saveTime && enteredHours && activeService) {
            setSelectedServices((prev) =>
                prev.map((s) =>
                    s.services.id === activeService.services.id
                        ? { ...s, enteredHours, totalAmount: enteredHours * s.services.price }
                        : s
                )
            );
        } else if (!saveTime) {
            setSelectedServices((prev) =>
                prev.filter((s) => s.services.id !== activeService.services.id)
            );
        }
        setActiveService(null);
        setIsTimeModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const openRequestModal = () => {
        setIsRequestModalOpen(true);
    };

    const closeRequestModal = () => setIsRequestModalOpen(false);

    const getProviderData = () => {
        setIsLoading(true);

        dispatch(getTheProfessionalData(id))
            .then((obj) => {
                setproviderData(obj.payload.data.data);
                setIsLoading(false);
            })
            .catch((obj) => {
                // Handle error
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getUniqueCategoryNames = (data) => {
        if (!Array.isArray(data)) {
            console.error('Expected an array but received:', data);
            return '';
        }
        // Create a Set to store unique category names
        const categorySet = new Set(
            data
                .map(item => item.categories?.name)
                .filter(name => name)
        );

        // Convert Set to an array and then join it into a string
        return Array.from(categorySet).join(', ');
    };

    const professionalUserServices = providerData?.professionalUserServices || [];

    const uniqueCategoryNames = getUniqueCategoryNames(professionalUserServices);

    const uniqueCategories = professionalUserServices.reduce((acc, item) => {
        const exists = acc.find((cat) => cat?.id === item?.categories?.id);
        if (!exists) {
            acc.push(item?.categories);
        }
        return acc;
    }, []);

    // Filter services by selected category
    const [services, setServices] = useState(() => {
        return selectedCategory
            ? professionalUserServices.filter(
                (item) => item.category_id === selectedCategory && item.subcategory_id === null
            )
            : [];
    });

    const removeService = (service) => {
        setSelectedServices((prev) =>
            prev.filter((s) => s.services.id !== service.services.id)
        );
    };

    const toggleServiceSelection = (service) => {
        // Check if the service is already selected and has hours set
        const selectedService = selectedServices?.find((s) => s.services.id === service.services.id);

        if (service?.price_type === "per_hour") {
            if (selectedService && selectedService.enteredHours) {
                // If the service is already selected and has time set, remove it
                setSelectedServices((prev) =>
                    prev.filter((s) => s.services.id !== service.services.id)
                );
            } else {
                // Otherwise, set it as the active service and open the time modal
                setActiveService(service);
                setSelectedServices((prev) => [...prev, { ...service, enteredHours: null, totalAmount: 0 }]); // Add the service immediately
                setIsTimeModalOpen(true);
            }
        } else {
            // Non per-hour service, toggle selection normally
            if (selectedService) {
                // Remove service if already selected
                setSelectedServices((prev) =>
                    prev.filter((s) => s.services.id !== service.services.id)
                );
            } else {
                // Add service if not selected
                setSelectedServices((prev) => [...prev, service]);
            }
        }
    };


    function getUniqueObjects(arr) {
        const uniqueObjects = arr.filter((obj, index, self) =>
            index === self.findIndex((o) => o.value === obj.value && o.label === obj.label)
        );

        return uniqueObjects;
    }

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubCategory(null);

        // Filter services with no subcategory by default
        const filteredServices = providerData.professionalUserServices.filter(
            (item) => item.category_id === categoryId && item.subcategory_id === null
        );

        setServices(filteredServices);

        // Get all subcategories that belong to the services
        const subcategories = providerData.professionalUserServices
            .filter(item => item.category_id === categoryId)
            .map(service => service.subCategories)
            .filter(subCategory => subCategory !== null);

        const uniqueData = getUniqueObjects(subcategories);

        const uniqueSubcategories = uniqueData.map(sub => ({
            value: sub.id,
            label: sub.name
        }));

        console.log(uniqueSubcategories, "saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        setSubCategoryOptions(uniqueSubcategories);
    };


    const handleSubCategorySelect = (selectedOption) => {
        const selectedSubCategory = selectedOption.value;
        setSelectedSubCategory(selectedOption);

        setSelectedServices([]);
        // Filter services based on the selected subcategory
        const filteredServices = providerData.professionalUserServices.filter(
            (item) => item.category_id === selectedCategory && item.subcategory_id === selectedSubCategory
        );

        // Set the new filtered services
        setServices(filteredServices);
    };

    useEffect(() => {
        if (id) {
            getProviderData();
        }
    }, [id, distance]);

    // useEffect(() => {
    //     if (providerData?.professionalUserServices?.length > 0) {
    //         const firstCategory = providerData?.professionalUserServices[0]?.categories?.id;
    //         setSelectedCategory(firstCategory);
    //     }
    // }, [providerData]);

    useEffect(() => {
        if (providerData?.professionalUserServices?.length > 0) {

            const firstCategory = providerData?.professionalUserServices[0]?.categories?.id;
            setSelectedCategory(firstCategory);
            handleCategoryClick(firstCategory);
        }
    }, [providerData]);


    return (
        <>
            <Header setHeaderSearch={setHeaderSearch} />
            <section className="authbg">
                <div className="p-6">
                    <div className="text-sm text-gray-600 mb-4">
                        <nav className="lg:mt-24 md:mt-40 mt-24">
                            <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home </Link> &gt;
                            <Link href={verifiedLogin ? "/professionals" : "/Home/professionalList"} className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Quick Job Professionals </Link> &gt;
                            <span className="text-gray-800 text-base md:text-lg">{providerData?.user_details?.first_name} {providerData?.user_details?.last_name}</span>
                        </nav>
                    </div>

                    <div className="bg-white servicesShadow rounded-lg p-4 mb-6 w-full flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex flex-col md:flex-row w-full gap-5">
                            <Image
                                src={providerData?.user_details?.profile_photo ? providerData?.user_details?.profile_photo : "/assets/professional1.png"}
                                alt="professional"
                                width="500"
                                height="500"
                                className="rounded-lg w-[131px] h-[131px]"
                            />
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center space-y-3 md:space-y-0">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <h2 className="text-xl font-bold">{providerData?.user_details?.first_name} {providerData?.user_details?.last_name}</h2>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <div className="px-1 pr-2 bg-white rounded-2xl servicesShadow flex items-center">
                                                <span className="text-yellow-500">★</span>
                                                <span className="ml-1 text-sm text-gray-800">4.5</span>
                                            </div>
                                            <span className="flex items-center gap-1 font-normal px-2 py-1 rounded">
                                                <Image
                                                    src="/assets/greentick.svg"
                                                    width="19"
                                                    height="19"
                                                    alt="greentick"
                                                />
                                                Work license
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                        <span className="ml-1 text-xs md:text-sm text-gray-800">
                                            {/* {providerData?.user_details?.status === 'active' ? 'Online' : 'Offline'} */}
                                            Online
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">
                                    A business or individual that offers specific services to
                                    clients or customers. Service providers can range from
                                    freelancers offering specialized skills to large companies
                                    providing comprehensive solutions.
                                </p>
                                <p className="font-semibold text-sm mt-2">20+ completed orders</p>

                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 w-full items-start">
                                    <div className="flex gap-3 items-center">
                                        <img
                                            src="/assets/locationSign.svg"
                                            alt=""
                                            width="15"
                                            height="15"
                                        />
                                        <span className="text-xs md:text-sm mainbluetext font-semibold">
                                            {distance ? `${Number(distance).toFixed(1)} Km` : 'N/A Km'}
                                            <span className="text-[#919EAB] font-medium ml-2">
                                                away
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-start -ml-1">
                                        <img
                                            src="/assets/pinkLocationIcon.svg"
                                            alt="Jobizz Logo"
                                            height="24"
                                            width="24"
                                        />
                                        <p className="text-xs md:text-sm">
                                            {providerData?.user_details?.address}
                                        </p>
                                    </div>
                                    <p className="maingray">
                                        Profession:{" "}
                                        <span className="text-black">{uniqueCategoryNames}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-40 self-start ">
                            <button onClick={openModal} className="bg-white flex items-center gap-1 grayBorder text-sm px-4 py-2 rounded-lg ">
                                <Image
                                    src="/assets/viewportfolio.svg"
                                    width="16"
                                    height="16"
                                    alt="greentick"
                                />
                                <span className="whitespace-nowrap">View Portfolio</span>
                            </button>
                            {isModalOpen && (
                                <PortfolioModal
                                    isOpen={isModalOpen}
                                    onClose={() => closeModal()}
                                    portfolioData={providerData?.portfolioDetail}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mb-3">
                        <h3 className="font-medium md:text-2xl">Select The Service You Need</h3>
                        <div className="flex flex-wrap medmob:flex-nowrap gap-2 justify-between w-[74%]">
                            <div>
                                <div className='flex items-center'>
                                    <Dropdown
                                        options={subCategoryOptions}
                                        onChange={handleSubCategorySelect}
                                        value={selectedSubCategory || null}
                                        className='bg-white w-52 md:w-60 rounded-lg text-sm md:text-base z-40 outline-none cursor-pointer'
                                        placeholder="Select Sub Category"
                                        arrowClosed={<span className="arrow-open2">
                                            <Image
                                                src="/assets/blueDropdown.svg"
                                                alt="Search Icon"
                                                height="20"
                                                width="20"
                                                className="-translate-x-6 z-40 cursor-pointer"
                                            />
                                        </span>}
                                        arrowOpen={<span className="arrow-open2">
                                            <Image
                                                src="/assets/blueDropdown.svg"
                                                alt="Search Icon"
                                                height="20"
                                                width="20"
                                                className="-translate-x-6 z-40 cursor-pointer"
                                            />
                                        </span>}
                                    />
                                    {/* <Image
                                        src="/assets/blueDropdown.svg"
                                        alt="Search Icon"
                                        height="15"
                                        width="15"
                                        className="-translate-x-6 z-40 cursor-pointer"
                                    /> */}
                                </div>
                            </div>
                            <div className="text-right">
                                <button disabled={selectedServices?.length === 0} onClick={openRequestModal} className={`${selectedServices?.length === 0 ? "bg-[#919EABB3]" : "mainblue"} text-white font-bold px-6 py-1.5 md:py-3 rounded-lg`}>
                                    Confirm
                                </button>
                                {isRequestModalOpen && (
                                    <RequestDetail
                                        isOpen={isRequestModalOpen}
                                        onClose={() => closeRequestModal()}
                                        selectedServices={selectedServices}
                                        setSelectedServices={setSelectedServices}
                                        onRemoveService={removeService}
                                        id={providerData?.id}
                                    />
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="md:flex md:gap-6">
                        <div className="bg-white policyShadow rounded-lg p-4 w-full text-base md:w-1/4 mb-4 md:mb-0">
                            <ul className="space-y-2">
                                {uniqueCategories.map((category, index) => (
                                    <React.Fragment key={index}>
                                        <li
                                            className={`flex justify-between items-center border-b py-3.5 px-3 rounded-md cursor-pointer ${selectedCategory === category?.id ? 'mainblue text-white' : 'hover:bg-gray-100'}`}
                                            onClick={() => { handleCategoryClick(category?.id); setSelectedServices([]); }}
                                        >
                                            {category?.name}
                                            <Image src={`/assets/${selectedCategory === category?.id ? 'rightArrow' : 'grayRightArrow'}.svg`} alt="arrow" width="6" height="13" />
                                        </li>


                                        {/* Display services right below the clicked li for mobile */}
                                        {
                                            selectedCategory === category?.id && (
                                                <div className="block md:hidden mt-2">
                                                    {services.map((service) => {
                                                        // Find the selected service before returning the JSX
                                                        const selectedService = selectedServices?.find((s) => s.services.id === service.services.id);
                                                        return (
                                                            <div
                                                                key={service?.services?.id}
                                                                className="bg-white cursor-pointer relative policyShadow rounded-lg p-4 flex flex-col sm:flex-row gap-3 mb-4"
                                                            // onClick={() => {
                                                            //     // Check if the service is selected and time is set
                                                            //     if (selectedService && selectedService.enteredHours) {
                                                            //         // Remove the service from selected services without opening the modal
                                                            //         toggleServiceSelection(service);
                                                            //     } else {
                                                            //         // Add service to selected services and open the modal if it's "per hour"
                                                            //         toggleServiceSelection(service);
                                                            //         if (service?.price_type === "per_hour") {
                                                            //             openTimeModal();
                                                            //         }
                                                            //     }
                                                            // }}
                                                            >
                                                                <Image
                                                                    src={service?.services?.image ? service?.services?.image : "/assets/professional1.png"}
                                                                    alt="service"
                                                                    width="131"
                                                                    height="131"
                                                                    className="rounded-lg w-[131px] h-[131px]"
                                                                />
                                                                <div className="w-full">
                                                                    <h4 className="font-bold text-lg mb-2">{service?.services?.name}</h4>
                                                                    <p className="text-gray-500 text-sm mb-3">{service?.services?.description}</p>
                                                                    <div className="flex flex-wrap justify-between">
                                                                        <p className="font-bold text-lg">${service?.price} {service?.price_type === "per_hour" ? "/hr" : ""}</p>

                                                                        {selectedService?.enteredHours && (
                                                                            <div className="flex gap-4">
                                                                                <p>Time: <span className="mainbluetext font-bold">{selectedService.enteredHours} hr</span></p>
                                                                                <p>Amount: <span className="mainbluetext font-bold">${selectedService.totalAmount}</span></p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <label className="custom-checkbox absolute -top-2 right-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedServices?.some((s) => s.services.id === service.services.id)}
                                                                        onChange={() => {
                                                                            if (selectedService && selectedService.enteredHours) {
                                                                                // Remove the service from selected services without opening the modal
                                                                                toggleServiceSelection(service);
                                                                            } else {
                                                                                // Add service to selected services and open the modal if it's "per hour"
                                                                                toggleServiceSelection(service);
                                                                                if (service?.price_type === "per_hour") {
                                                                                    openTimeModal();
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="mr-3"
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>

                        {/* For larger screens, show services in the right section */}
                        <div className="hidden md:block w-full md:w-3/4">
                            {
                                services?.length > 0 ?
                                    services.map((service) => {
                                        // Find the selected service before returning the JSX
                                        const selectedService = selectedServices?.find((s) => s.services.id === service.services.id);

                                        return (
                                            <div
                                                key={service?.services?.id}
                                                className="bg-white cursor-pointer relative policyShadow rounded-lg p-4 flex flex-col sm:flex-row gap-3 mb-4"
                                            // onClick={() => {
                                            //     // Check if the service is selected and time is set
                                            //     if (selectedService && selectedService.enteredHours) {
                                            //         // Remove the service from selected services without opening the modal
                                            //         toggleServiceSelection(service);
                                            //     } else {
                                            //         // Add service to selected services and open the modal if it's "per hour"
                                            //         toggleServiceSelection(service);
                                            //         if (service?.price_type === "per_hour") {
                                            //             openTimeModal();
                                            //         }
                                            //     }
                                            // }}
                                            >
                                                <div className="w-[131px] h-[131px]">
                                                    <Image
                                                        src={service?.services?.image ? service?.services?.image : "/assets/professional1.png"}
                                                        alt="service"
                                                        width="500"
                                                        height="500"
                                                        className="rounded-[12px] w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="w-full">
                                                    <h4 className="font-bold text-lg mb-2">{service?.services?.name}</h4>
                                                    <p className="text-gray-500 text-sm mb-3">{service?.services?.description}</p>
                                                    <div className="flex justify-between">
                                                        <p className="font-bold text-lg">${service?.price} {service?.price_type === "per_hour" ? "/hr" : ""}</p>

                                                        {selectedService?.enteredHours && (
                                                            <div className="flex gap-4">
                                                                <p>Time: <span className="mainbluetext font-bold">{selectedService.enteredHours} hr</span></p>
                                                                <p>Amount: <span className="mainbluetext font-bold">${selectedService.totalAmount}</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <label className="custom-checkbox absolute -top-2 right-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedServices?.some((s) => s.services.id === service.services.id)}
                                                        onChange={() => {
                                                            if (selectedService && selectedService.enteredHours) {
                                                                // Remove the service from selected services without opening the modal
                                                                toggleServiceSelection(service);
                                                            } else {
                                                                // Add service to selected services and open the modal if it's "per hour"
                                                                toggleServiceSelection(service);
                                                                if (service?.price_type === "per_hour") {
                                                                    openTimeModal();
                                                                }
                                                            }
                                                        }}
                                                        className="mr-3"
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        );
                                    })

                                    :
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-lg">No services exist to this category, you can check sub categories for further selection</p>
                                    </div>
                            }
                        </div>

                        {isTimeModalOpen && (
                            <AddTime
                                isOpen={isTimeModalOpen}
                                onClose={() => closeTimeModal(false)} // Close modal without saving
                                onSave={(enteredHours) => closeTimeModal(true, enteredHours)}
                                servicePrice={activeService?.price || 0}
                            />
                        )}
                    </div>
                </div>
                <Map onViewProvider={true} headerSearch={headerSearch} />
            </section>
            <Footer />
        </>
    )
}

export default SPDetails;