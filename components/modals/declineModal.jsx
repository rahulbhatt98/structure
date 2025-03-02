import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { declinedRequestAsync } from '../../redux/professional/professioanlSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import Spinner from '../common/Spinner';
import { selectLoginAuth } from '../../redux/auth/authSlice';

function DeclineModal({ isOpen, onClose, declinedId, getTask,toggleExpand, notificationId }) {
    const [IsLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const toastId = useRef(null);

    const auth = useSelector(selectLoginAuth)

    console.log(auth,"saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    const handleDecline = () => {
        setIsLoading(true);
        let params = 
            {
                "professionalId":declinedId?.professional_id ? declinedId?.professional_id : auth?.professional?.id,
                "requestId":declinedId?.request_id ? declinedId?.request_id : (declinedId?.data?.id)?.toString(),
                "status":"declined",
                "notificationId": notificationId || undefined
            }
        dispatch(declinedRequestAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                getTask()
                onClose()
                setIsLoading(false);
                if(notificationId){
                    toggleExpand("close","")
                }
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
                setIsLoading(false);
            });
        // console.log(declinedId,"declinedddddddddddddddddd");
    }
   
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>
                <div>
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-4 rounded-full">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856C18.943 18.6 20 16.5 20 14c0-5.3-5.4-9-8-9s-8 3.7-8 9c0 2.5 1.057 4.6 2.828 6H5.062z"></path>
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">Decline Job!</h2>

                    <p className="text-center text-gray-600 mb-4">Are you sure you want to decline the job?</p>

                    <div className="flex w-full gap-2">
                        <button type="button" disabled={IsLoading} onClick={() => handleDecline()} className="bg-red-500 text-white font-semibold py-2 w-full px-6 rounded-lg hover:bg-red-600">
                        {IsLoading ? <Spinner /> : "Decline job"}   
                        </button>

                        <button type="button" onClick={onClose} className="bg-gray-100 text-gray-500 w-full font-semibold py-2 px-6 rounded-lg hover:bg-gray-200">
                            Resume job
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeclineModal;
