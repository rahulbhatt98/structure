import React, { useRef } from 'react';
import { addTheComment } from '../../redux/customer/customerSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from "react-toastify";
import Error from '../common/Error';
import { selectLoginAuth } from '../../redux/auth/authSlice';

function CommentModal({ isOpen, onClose, blogId, getAllComments }) {
    const dispatch = useDispatch();
    const toastId = useRef(null);
    const userDetail = useSelector(selectLoginAuth);

    console.log(userDetail, "userDetail")
    const schema = yup.object().shape({
        name: yup.string().required("This is required field"),
        email: yup.string().required("This is required field"),
        comments: yup.string().required("This is required field"),

    });


    const {
        control,
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: userDetail?.email,
            name: `${userDetail?.first_name} ${userDetail?.last_name}`,
        },

    });

    const watchComment = watch('comments')

    const onSave = async (data) => {

        let params = {
            ...data,
            blogId: blogId
        }

        dispatch(addTheComment(params))
            .then(unwrapResult)
            .then((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.success(obj?.data?.message);
                }
                onClose();
                getAllComments();
            })
            .catch((error) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
            });

        console.log(params, "data")
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-4 mx-4 md:p-8">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>

                <div className="md:mx-auto mt-5">
                    <h2 className="text-lg font-semibold mb-4">Leave a Reply</h2>

                    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    {...register("name")}
                                    disabled
                                    className="w-full p-3 GrayBorder inputshadow rounded-lg outline-none"
                                />
                            </div>
                            {errors.name && <Error error={errors.name?.message} />}

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email")}
                                    disabled
                                    className="w-full p-3 GrayBorder inputshadow rounded-lg outline-none"
                                />
                            </div>
                            {errors.email && <Error error={errors.email?.message} />}
                        </div>

                        <div>
                            <textarea
                                rows="4"
                                placeholder="Add Comment"
                                {...register("comments")}
                                className="w-full p-3 GrayBorder inputshadow rounded-lg outline-none"
                                maxLength={200}
                            ></textarea>
                            <div class="flex text-sm items-end justify-end mx-2"><p className='mr-1'>Character Limit :</p><p>{watchComment ? watchComment?.length : 0} <span>/ 200</span></p></div>
                        </div>
                        {errors.comments && <Error error={errors.comments?.message} />}


                        <div className='flex justify-center'>
                            <button
                                type="submit"
                                className="mainblue text-base text-white font-semibold px-20 py-1.5 md:py-3 rounded-xl"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>



        </div>

    )
}

export default CommentModal;