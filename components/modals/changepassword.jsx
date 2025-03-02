import { useRef, useState } from 'react';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Error from '../common/Error';
import { useDispatch } from 'react-redux';
import { changePasswordAsync } from '../../redux/auth/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

function Changepassword({ isOpen, onClose }) {
    const toastId = useRef(null);
    const [oldPasswordShown, setOldPasswordShown] = useState(false);
    const [newPasswordShown, setNewPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const schema = yup.object().shape({
        old_password: yup.string().required("This is a required field"),
        new_password: yup.string().required("This is a required field")
            .min(8, 'Password must be at least 8 characters long')
            .matches(passwordRegex, 'Password must contain at least one uppercase letter, one special character & one number'),
        confirm_password: yup.string()
            .oneOf([yup.ref('new_password'), null], 'New Password & Confirm Password must match')
    });

    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const oldPassword = watch("old_password");
    const newPassword = watch("new_password");
    const confirmPassword = watch("confirm_password");

    const onSave = (data) => {
        let params = {
            "oldPassword": data?.old_password,
            "newPassword": data?.new_password
        }
        dispatch(changePasswordAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                toast.success(obj?.data?.message);
                onClose();
            })
            .catch((obj) => {
                if (!toast.isActive(toastId.current)) {
                    toastId.current = toast.error(obj?.msg);
                }
            });
    };

    const toggleOldPasswordVisibility = () => {
        setOldPasswordShown(!oldPasswordShown);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordShown(!newPasswordShown)
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordShown(!confirmPasswordShown)
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                <button
                    type='button'
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>

                <form onSubmit={handleSubmit(onSave)}>
                    <div className="mb-4 relative">
                        <label htmlFor="old_password" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">Old Password</label>
                        <input
                            id="old_password"
                            {...register("old_password")}
                            type={oldPasswordShown ? "text" : "password"}
                            placeholder="Enter old password"
                            className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                        />
                        {oldPassword && (
                            <span
                                onClick={toggleOldPasswordVisibility}
                                className="text-[11px] absolute right-2  top-10  maxmid:top-10 maingray uppercase cursor-pointer"
                            >
                                {oldPasswordShown ? "Hide" : "Show"}
                            </span>
                        )}
                        {errors.old_password && <Error error={errors.old_password?.message} />}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="new_password" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">New Password</label>
                        <input
                            id="new_password"
                            {...register("new_password")}
                            type={newPasswordShown ? "text" : "password"}
                            placeholder="Enter new password"
                            className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                        />
                        {newPassword && (
                            <span
                                onClick={toggleNewPasswordVisibility}
                                className="text-[11px] absolute right-2  top-10  maxmid:top-10 maingray uppercase cursor-pointer"
                            >
                                {newPasswordShown ? "Hide" : "Show"}
                            </span>
                        )}
                        {errors.new_password && <Error error={errors.new_password?.message} />}
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="confirm_password" className="block text-xs maxmid:text-sm pb-1 pl-1 font-normal text-gray-700">Confirm New Password</label>
                        <input
                            id="confirm_password"
                            {...register("confirm_password")}
                            type={confirmPasswordShown ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="block w-full text-sm inputshadow font-medium p-2 maxmid:p-3 bg-[#FFFFFF] rounded-md border-2 border-[#FFFFFF] placeholder:text-gray-500  outline-none sm:text-sm"
                        />
                        {confirmPassword && (
                            <span
                                onClick={toggleConfirmPasswordVisibility}
                                className="text-[11px] absolute right-2  top-10  maxmid:top-10 maingray uppercase cursor-pointer"
                            >
                                {confirmPasswordShown ? "Hide" : "Show"}
                            </span>
                        )}
                        {errors.confirm_password && <Error error={errors.confirm_password?.message} />}
                    </div>

                    <button type="submit" className="w-full font-bold mainblue text-white px-2 py-2 maxmid:p-4 blueshadow shadow-lg  shadow-[#1B75BC] rounded-xl">
                        Save Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Changepassword;
