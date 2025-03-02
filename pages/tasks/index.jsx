import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { getTaskListAsync } from '../../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import IncomingTasks from '../../components/tasks/IncomingTasks';
import BasicPagination from '../../components/common/basicPagination';
import ProfessionalMap from '../../components/Home/ProfessionalMap';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import RotatingLoaderWithImage from '../../components/common/RotateLoader';
import DeclinedTasks from '../../components/tasks/DeclinedTasks';
import OpenedTasks from '../../components/tasks/OpenedTasks';


function Tasks() {
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("incoming")
    const [expendableId, setExpendableId] = useState("")
    const [headerSearch, setHeaderSearch] = useState("")
    const [taskView, setTaskView] = useState("list")
    const [isExpanded, setIsExpanded] = useState(false);
    const [taskData, setTaskData] = useState([])
    const [sortDate, setSortDate] = useState("latest")
    const [taskLoading, setTaskLoading] = useState(false)
    const [Total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const [value, setValue] = useState([0, 0]);
    const [locationvalue, setlocationvalue] = useState("0");
    const dropdownRef = useRef(null)

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const dispatch = useDispatch()

    const toggleExpand = (label, id) => {
        setIsExpanded(label === "open" ? true : false);
        setExpendableId(label === "open" ? id : "")
    };

    const getTask = () => {
        let params = {
            "page": page,
            "limit": 10,
            "date": sortDate
        }
        if (value[1] !== 0) {
            params = {
                ...params,
                startPrice: value[0],
                endPrice: value[1]
            }
        }

        console.log(typeof (locationvalue), "ssssssaaaaaaaaaaaaaaaaaaaaaa111111111111111");
        if (locationvalue != "0") {
            params = {
                ...params,
                radius: locationvalue,
            }
        }
        setTaskLoading(true)
        dispatch(getTaskListAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                setTaskLoading(false)
                setTaskData(obj?.data?.data?.data)
                setTotal(obj?.data?.data?.totalRecords);
                console.log(obj?.data?.data?.data, obj, "task responseeeeeeeeeee");
            })
            .catch((obj) => {
                setTaskLoading(false)
            });
    }

    function valuetext(value) {
        return `${value}`;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function locationtext(value) {
        return `${value}`;
    }


    const handleLocationChange = (event, newValue) => {
        setlocationvalue(newValue);
    };

    useEffect(() => {
        getTask()
    }, [page, sortDate, value, locationvalue])


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSortDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    console.log(sortDate, value, locationvalue, "datataaaaaaaaa");


    return (
        <>
            <section className="authbg relative max-h-full h-full">
                <Header setHeaderSearch={setHeaderSearch} />
                <nav className="lg:mt-24 md:mt-40 mt-24 px-2 pt-4 md:px-12 bg-[#F0F8FF] z-[21] relative">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 my-4">Tasks
                        <span className='text-base ml-3 textGray'>({taskView === "list" ? "List" : "Map"} View)</span>
                    </h1>
                    <div className="flex flex-wrap-reverse lg:justify-between items-center border-gray-200">
                        <div className="flex text-xs sm:text-base md:space-x-8">
                            <button type="button" onClick={() => setActiveTab("incoming")} className={`flex gap-2 hover:border-[#EC008C] items-center ${activeTab === "incoming" ? 'border-[#EC008C] border-b-4 text-black' : "textgray"} font-medium px-1 lmob:px-4 py-2`}>
                                Incoming Requests
                                {(taskData && taskData?.length > 0) && <span className='text-white pinkBG rounded-full w-4 h-4 pb-1 text-xs font-bold text-center'>{Total}</span>}
                            </button>
                            <button type="button" onClick={() => setActiveTab("opened")} className={`flex gap-2 hover:border-[#EC008C] items-center ${activeTab === "opened" ? 'border-[#EC008C] border-b-4 text-black' : "textgray"} font-medium px-1 lmob:px-4 py-2`}>
                                Open Tasks
                            </button>
                            <button className=" border-b-4 border-transparent textgray hover:border-[#EC008C]  font-medium px-1 lmob:px-4 py-2">
                                Upcoming Tasks
                            </button>
                            <button type="button" onClick={() => setActiveTab("declined")} className={`flex gap-2 hover:border-[#EC008C] items-center  ${activeTab === "declined" ? 'border-[#EC008C] border-b-4 text-black' : "textgray"} font-medium px-1 lmob:px-4 py-2`}>
                                Declined Tasks
                            </button>
                            {/* <button type="button" className=" border-b-4 border-transparent textgray hover:border-[#EC008C]  font-medium px-1 lmob:px-4 py-2">
                                Completed Tasks
                            </button> */}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:space-x-4 mt-3 xl:mt-0 -translate-y-3">
                            {/* Sort By Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    className="bg-white text-black rounded-lg px-2 py-1 grayBorder text-xs sm:text-base font-normal flex gap-4 items-center"
                                >
                                    Sort By
                                    <Image src="/assets/arrowdown.svg" alt="call" width="18" height="18" />
                                </button>


                                {sortDropdownOpen && (
                                    <div ref={dropdownRef} className={`absolute px-4 pb-6 pt-2 mt-2 w-60 bg-white border border-gray-200 rounded-lg z-[1000] shadow-lg ${activeTab === "declined" ? "lg:right-0" : "left-0"}`}>
                                        <ul className="text-black">
                                            <li className=" px-4 py-2 ">
                                                <div className="text-sm text-gray-600">Date</div>
                                                <div className="flex mt-2 space-x-2">
                                                    <button type="button" onClick={() => setSortDate("latest")} className={`px-4 py-2 ${sortDate === "latest" ? "mainblue text-white focus:outline-none" : "text-gray-600 border border-black bg-[#D9D9D9 hover:bg-gray-100"}  rounded-lg `}>
                                                        Latest
                                                    </button>
                                                    <button type="button" onClick={() => setSortDate("oldest")} className={`px-4 py-2 ${sortDate === "oldest" ? "mainblue text-white focus:outline-none" : "text-gray-600 border border-black bg-[#D9D9D9 hover:bg-gray-100"}  rounded-lg `}>
                                                        Oldest
                                                    </button>
                                                </div>
                                            </li>
                                            <li className="px-4 py-2 mb-2">
                                                <div>
                                                    <h4 className='maingray text-sm'>Price</h4>
                                                    <Box sx={{ width: 200 }}>
                                                        <Slider
                                                            getAriaLabel={() => 'Temperature range'}
                                                            value={value}
                                                            onChange={handleChange}
                                                            valueLabelDisplay="on"
                                                            getAriaValueText={valuetext}
                                                            valueLabelFormat={(value) => `$${value}`}
                                                            sx={{
                                                                "& .MuiSlider-valueLabel": {
                                                                    backgroundColor: "#1B75BC",
                                                                    color: "#fff",
                                                                    top: "55px", // Adjust this value to move the tooltip below the slider
                                                                    transform: "translateY(100%)", // Shift the tooltip downward
                                                                },
                                                                "& .MuiSlider-valueLabel:before": {
                                                                    top: "-8px", // Adjust this value to move the tooltip below the slider
                                                                },
                                                            }}
                                                            min={0}
                                                            max={5000}
                                                        />
                                                    </Box>

                                                </div>

                                            </li>
                                            <li className="px-4 py-2 mt-6 pb-5">
                                                <h4 className=' maingray text-sm'>Location Range</h4>
                                                <Box sx={{ width: 200 }}>

                                                    {/* <Slider
  size="small"
  value={locationvalue}
  aria-label="Small"
  valueLabelDisplay="auto"
/> */}
                                                    <Slider
                                                        // getAriaLabel={() => 'Temperature range'}
                                                        value={locationvalue}
                                                        onChange={handleLocationChange}
                                                        valueLabelDisplay="on"
                                                        // getAriaValueText={locationtext}
                                                        valueLabelFormat={(value) => `${value}km`}
                                                        sx={{
                                                            "& .MuiSlider-valueLabel": {
                                                                backgroundColor: "#1B75BC",
                                                                color: "#fff",
                                                                top: "55px", // Adjust this value to move the tooltip below the slider
                                                                transform: "translateY(100%)", // Shift the tooltip downward
                                                            },
                                                            "& .MuiSlider-valueLabel:before": {
                                                                top: "-8px", // Adjust this value to move the tooltip below the slider
                                                            },
                                                        }}
                                                    // min={0}
                                                    // max={5000}
                                                    />
                                                </Box>
                                            </li>

                                        </ul>
                                    </div>
                                )}
                            </div>

                            {
                                activeTab !== "declined" &&
                                <>
                                    <button className='pinkBG text-white rounded-lg px-2 py-1 grayBorder text-xs sm:text-base font-normal'>Urgent Tasks Only</button>
                                    <button type="button" disabled={(taskData?.length === 0)} className='greenBG text-white flex  items-center gap-1 rounded-lg px-2 py-1 grayBorder text-xs sm:text-base font-normal' onClick={() => { setTaskView(taskView === "list" ? "map" : "list") }}>
                                        {taskView === "map" ? <Image src="/assets/list.svg" alt="call" width="15" height="15" /> : <Image src="/assets/location.svg" alt="call" width="20" height="20" />}
                                        {taskView === "list" ? "Map" : "List"} View</button>
                                </>
                            }
                        </div>
                    </div>
                </nav>

                {
                    activeTab === "incoming" ?
                        taskLoading ? <RotatingLoaderWithImage /> :
                            taskView === "list" ?
                                taskData?.length > 0 ?
                                    <>
                                        {
                                            taskData?.map((val, index) => {
                                                return (
                                                    <IncomingTasks sortDate={sortDate} price={value} radius={locationvalue} expendableId={expendableId} getTask={getTask} key={index} isExpanded={isExpanded} toggleExpand={toggleExpand} data={val} />
                                                )
                                            })
                                        }
                                        <div className="my-4 flex justify-center items-center">
                                            <BasicPagination
                                                count={Math.ceil(Total / 10)}
                                                page={page}
                                                onChange={handlePageChange}
                                            />
                                        </div>
                                    </>
                                    : <div className='h-[50vh] w-full flex justify-center items-center'>
                                        <div className='font-bold md:text-lg'>No Incoming Request Found</div>
                                    </div>
                                :
                                <div className='mt-2'>
                                    <ProfessionalMap headerSearch={headerSearch} taskData={taskData} setTaskView={setTaskView} setExpendableId={setExpendableId} setIsExpanded={setIsExpanded} />
                                </div>

                        : activeTab === "declined" ?
                            <DeclinedTasks sortDate={sortDate} price={value} radius={locationvalue} />
                            :
                            activeTab === "opened" ?
                                <OpenedTasks sortDate={sortDate} price={value} radius={locationvalue} taskView={taskView} headerSearch={headerSearch} setTaskView={setTaskView} />
                                :
                                <></>}


                {/* <ProfessionalMap taskData={taskData}/> */}


                <Footer />
            </section >
        </>
    )
}

export default Tasks;