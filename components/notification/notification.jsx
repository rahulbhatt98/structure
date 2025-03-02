import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getAllNotifications, readNotificationsAsync } from '../../redux/professional/professioanlSlice';
import { useDispatch } from 'react-redux';
import DeclineModal from '../modals/declineModal';
import Cookies from "js-cookie";

function Notification({ toggleDropdown }) {
    const dispatch = useDispatch();
    const [notificationList, setnotificationList] = useState([]);
    const [activeTab, setActiveTab] = useState("new")
    const [isModalDeclineOpen, setisModalDeclineOpen] = useState(false);
    const [notificationId, setNotificationId] = useState("")
    const roleSelected = Cookies.get("roleSelected");
    const [declinedId, setDeclinedId] = useState("")
    const closeDeclineModal = () => setisModalDeclineOpen(false);
    const openDeclineModal = (e, data) => {
        e.stopPropagation()
        setDeclinedId(data)
        setisModalDeclineOpen(true);
        setNotificationId(data?.id);
    };

    const getNotificationList = () => {
        // setIsLoading(true);

        dispatch(getAllNotifications())
            .then((obj) => {
                setnotificationList(obj?.payload?.data?.data)
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

    const timeAgo = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const seconds = Math.floor((now - then) / 1000);

        if (seconds < 60) {
            return `${seconds} ${seconds === 1 ? 's' : 's'}`;
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? 'm' : 'm'}`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} ${hours === 1 ? 'h' : 'h'}`;
        }

        const days = Math.floor(hours / 24);
        return `${days} ${days === 1 ? 'days' : 'days'}`;
    };

    const notificationUpdate = (id) => {
        dispatch(readNotificationsAsync(id))
            .then((obj) => {
                getNotificationList()
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
                // setIsLoading(false);
            });
    }

    useEffect(() => {
        getNotificationList();
    }, [])

    return (
        <div>
            <div className="absolute z-[1000] smob:-left-2 medmob:left-0 lg:-left-[450px] mt-12 w-[320px] medmob:w-[350px] lmob:w-[390px] md:w-[600px] bg-white rounded-lg shadow-lg">
    
                <div className="flex justify-between items-center px-4 py-2">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <button onClick={toggleDropdown} className="text-gray-400 text-xl hover:text-gray-600">
                        &#10005;
                    </button>
                </div>

                <div className="flex space-x-8 px-4 py-2">
                    <div type="button" className={`flex ${activeTab === "new" ? 'border-b-2  border-b-[#1B75BC] pb-2' : 'text-gray-500 pb-1'} items-center space-x-2`}>
                        <button type='button' onClick={() => setActiveTab("new")} className="">New</button>
                        <div className="relative">
                            {(notificationList?.length > 0 && notificationList?.filter(val => (val?.is_read === 0 && (roleSelected === "customer" ? val?.type === 1 : val?.type !== 1)))?.length > 0) && <div className=" pinkBG text-white text-xs font-semibold rounded-full w-4 flex justify-center h-4">{notificationList?.filter(val => val?.is_read === 0)?.length}</div>}
                        </div>
                    </div>
                    <div className={`${activeTab === "all" ? 'border-b-2  border-b-[#1B75BC]' : ''}`}>
                        <button type="button" onClick={() => setActiveTab("all")} className={`${activeTab === "all" ? '' : 'text-gray-500 pb-1'}`}>All</button>
                    </div>
                </div>

                <div className="py-2 h-72 overflow-y-auto">


                    {
                        notificationList?.filter(val => ((activeTab === "all" ? (val?.is_read === 1 || val?.is_read === 0) : val?.is_read === 0) && (roleSelected === "customer" ? val?.type === 1 : val?.type !== 1))).length > 0 ?
                            notificationList?.filter(val => ((activeTab === "all" ? (val?.is_read === 1 || val?.is_read === 0) : val?.is_read === 0) && (roleSelected === "customer" ? val?.type === 1 : val?.type !== 1)))?.map((notification, index) => (
                                <div key={index} onClick={() => notificationUpdate(notification?.id)} className={`flex items-center pl-1 pr-4 py-3 border-b ${notification?.is_read ? '' : 'bg-[#F0F8FF]'} hover:bg-gray-100 transition`}>
                           
                                    {!notification?.is_read && <div className="w-2 h-2 rounded-full bg-[#1B75BC] mr-1.5"></div>}

                         
                                    <div className="flex-shrink-0 ml-2 medmob:ml-0">
                                        <Image
                                            src={notification?.sender_user_details?.profile_photo || "/assets/professional1.png"} // Dynamic avatar
                                            height="48"
                                            width="48"
                                            alt="User Avatar"
                                        />
                                    </div>

                         
                                    <div className="ml-3 flex-1 py-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            {notification?.sender_user_details?.first_name} {notification?.type === 1 ? 'has rejected your work order' : 'is requesting a job request.'}
                                        </p>
                                        <div className="mt-2 flex space-x-2">
                                            {
                                                notification?.type !== 1 &&
                                                <>
                                                    <button disabled={notification?.data?.status === "declined"} className="md:px-4 px-1 py-1 mainblue text-white text-xs sm:text-sm rounded-md">
                                                        Chat with {notification?.sender_user_details?.first_name}
                                                    </button>
                                                    <button disabled={notification?.data?.status === "declined"} onClick={(e) => { openDeclineModal(e, notification) }} className="md:px-4 px-1 py-1 border border-gray-300 text-gray-600 text-xs sm:text-sm rounded-md">
                                                        Decline
                                                    </button>
                                                </>
                                            }
                                        </div>
                                    </div>

                                 
                                    <span className="ml-auto text-gray-400 text-xs">{timeAgo(notification?.created_at)}</span>
                                </div>
                            ))
                            :
                            <div className='flex justify-center items-center mb-10 h-44'>
                                {activeTab === "all" ? 'No Notification found' : 'No new notifications found'}
                            </div>

                    }
                </div>
                {isModalDeclineOpen && (
                    <DeclineModal
                        isOpen={isModalDeclineOpen}
                        onClose={() => closeDeclineModal()}
                        declinedId={declinedId}
                        getTask={getNotificationList}
                        notificationId={notificationId}
                    // toggleExpand={toggleExpand}
                    />
                )}
            </div>
        </div >
    )
}

export default Notification;
