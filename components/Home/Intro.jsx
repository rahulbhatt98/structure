import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTheSuggestionListAsync } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import Request from "../modals/Request";
import AutoModal from "../modals/AutoModal";

const Intro = ({ fromProfessional, setSelectedService , setsearchValue}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [selectedData, setSelectedData] = useState("")



    // console.log(selectedData, "selctedddddddddddddddd dataaaaaaaaaaaaaaaaaaa");
    const [isUrgentRequestModalOpen, setIsUrgentRequestModalOpen] = useState(false);
    const openUrgentRequestModal = () => {
        setIsUrgentRequestModalOpen(true);
    };
    const closeUrgentRequestModal = () => setIsUrgentRequestModalOpen(false);

    const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
    const openAutoModal = () => {
        setIsAutoModalOpen(true);
    };
    const closeAutoModal = () => setIsAutoModalOpen(false);

    const verifiedLogin = Cookies.get("authToken");
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch()
    const dropdownRef = useRef(null);

    const getSuggestionList = () => {
        setIsLoading(true);
        let params = {
            keyword: searchQuery || undefined
        };
        dispatch(getTheSuggestionListAsync(params))
            .then((obj) => {
                setServiceList(obj?.payload?.data?.data || undefined)
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
    };

    const handleSerch = (data) => {
        setSearchQuery(data.target.value)
        if (data.target.value === "") {
            setSelectedService("")
            setSelectedData("")
        }
    }

    const handleCreateRequest = () =>{
        if (verifiedLogin) {
            openUrgentRequestModal()
        } else {
            openAutoModal()
        }
    }

    const handleSearchSelect = (val) => {

        console.log(val,"ssssssssssssssssssssssssssssssss");
        setSelectedData(val); 
        setSearchQuery(val?.name);
        setIsOpen(false)
        handleServiceSelect(val?.name);
    }

    useEffect(() => {
        getSuggestionList();
        if (typeof setsearchValue === "function") {
            setsearchValue(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <>
            <section className={`${verifiedLogin ? "lmob:mt-28 lg:mt-[7rem] md:mt-[11rem] medmob:mt-28 smob:mt-28" : "mt-28 lg:mt-[7rem] md:mt-[11rem] "}`}>
                {
                    fromProfessional && (
                        <nav className="px-5 md:px-10">
                            <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home </Link> &gt;
                            <span className=" font-medium text-base md:text-lg">Quick Job Professionals </span>
                        </nav>
                    )
                } 
                                                                                    {/* py-36 sm:py-40 xl:py-56 */}
                <section className={`${fromProfessional ? "professionalbg py-20" : "introbg py-36 lg:py-40 2xl:py-56"}  m-[10px] mb-[31px] md:m-[31px] flex justify-center items-center`}>
                    <section className="mt-2 text-center text-white px-4">
                        <div className="max-w-screen-lg mx-auto my-auto">
                            {
                                fromProfessional ? (
                                    <div className="flex justify-center flex-col items-center">
                                        <div onClick={() => router.push("/Home")} className="flex cursor-pointer mr-6 w-40 h-10 justify-center items-center">
                                            <Image
                                                src="/assets/proBack.svg"
                                                alt="Search Icon"
                                                height="100"
                                                width="100"
                                                className="mt-2 -mr-6"
                                            />
                                            <span className="text-sm md:text-lg">Go Back</span>
                                        </div>
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 md:mb-8">
                                            Professionals
                                        </h1>
                                    </div>
                                ) : (

                                    <h1 className="text-2xl sm:text-4xl md:text-5xl 2xl:6xl font-semibold md:mb-4">
                                        Fast and Affordable Pros <br className="hidden md:block" /> at your location
                                    </h1>
                                )
                            }

                            {
                                !fromProfessional && (
                                    <p className="text-base sm:text-xl md:text-2xl font-normal mb-3 md:mb-8">
                                        Get your home services by experts @doorstep. “We’re here to help{" "}
                                        <br className="hidden md:block" /> you, every step of the way.”
                                    </p>
                                )
                            }
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-1 md:py-3 introInputshadow bg-[#FFFFFF33] inputbg border text-white border-[#FFFFFF] placeholder:text-[#FFFFFF] placeholder:text-base md:placeholder:text-2xl rounded-lg focus:outline-none text-lg md:text-2xl"
                                        placeholder="Search services here..."
                                        value={searchQuery}
                                        onChange={(e) => handleSerch(e)}
                                        onClick={() => setIsOpen(true)}
                                    />
                                    {/* <Image
                                        src="/assets/blackSearchIcon.svg"
                                        alt="Search Icon"
                                        height="50"
                                        width="50"
                                        className="absolute filter-none md:w-[50px] md:h-[50px] w-[30px] h-[30px] right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    /> */}
                                    {isOpen && (
                                        <div ref={dropdownRef} className="absolute z-30 text-black text-left w-full md:w-[690px] h-96 overflow-y-auto professionals mt-2 bg-white rounded-lg shadow-lg">
                                            {serviceList?.length > 0 ?
                                                serviceList?.map((service, index) => (
                                                    <div className="p-4" key={index}>
                                                        <h3 className="text-xl font-normal pb-2 border-b">  {service?.name}</h3>
                                                        <ul>

                                                            {
                                                                service?.services?.length > 0 && service?.services?.map((val, index) =>
                                                                    <li key={index} onClick={() => { handleSearchSelect(val) }} className=" py-3 flex justify-between border-b cursor-pointer maingray text-base">
                                                                        <div>
                                                                            <span className="w-3 h-3 rounded-full maingray mr-3">●</span>
                                                                            {val?.name}
                                                                        </div>
                                                                        <Image
                                                                            src="/assets/lastsearcharrow.svg"
                                                                            alt="Search Icon"
                                                                            height="10"
                                                                            width="10"
                                                                        />
                                                                    </li>)
                                                            }

                                                        </ul>
                                                        {service?.subCategories?.length > 0 && service?.subCategories?.map((val, index) => <div key={index} className="px-3">
                                                            <h3 className="text-base font-normal py-3 border-b">  {val?.name}</h3>
                                                            <ul>

                                                                {
                                                                    val?.services?.length > 0 && val?.services?.map((val, index) =>
                                                                        <li key={index} onClick={() => { handleSearchSelect(val) }} className=" py-3 flex justify-between border-b cursor-pointer maingray text-base">
                                                                            <div>
                                                                                <span className="w-3 h-3 rounded-full maingray mr-3">●</span>
                                                                                {val?.name}
                                                                            </div>
                                                                            <Image
                                                                                src="/assets/lastsearcharrow.svg"
                                                                                alt="Search Icon"
                                                                                height="10"
                                                                                width="10"
                                                                            />
                                                                        </li>)
                                                                }

                                                            </ul>
                                                        </div>)}
                                                    </div>
                                                )) : <div className="pt-4 mx-4">No Service Found</div>}
                                        </div>
                                    )}
                                </div>
                                {/* <button className="flex justify-center items-center border border-white  text-base md:text-2xl gap-2 bg-black opacity-60 py-2 md:py-3 px-5 rounded-lg">
                                    <Image
                                        src="/assets/whiteSearch.svg"
                                        alt="Search Icon"
                                        height="24"
                                        width="24"
                                        className="w-4 h-4 md:w-6 md:h-6"
                                    />
                                    Search
                                </button> */}
                                {/* onClick={openUrgentRequestModal} */}
                                <button onClick={handleCreateRequest} className="md:w-56 mt-4 px-4 md:px-0 text-sm md:text-xl font-semibold rounded-lg maingreenBG text-white py-3 md:py-[15px]">
                                    Create a Request
                                </button>
                                {isUrgentRequestModalOpen && (
                                    <Request
                                        isOpen={isUrgentRequestModalOpen}
                                        selectedData={selectedData}
                                        onClose={() => closeUrgentRequestModal()}
                                    />
                                )}
                                
                                {isAutoModalOpen && (
                                    <AutoModal
                                        isOpen={isAutoModalOpen}
                                        onClose={() => closeAutoModal()}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                </section>

            </section>
        </>
    );
}

export default Intro;
