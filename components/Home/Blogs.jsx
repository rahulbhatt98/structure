import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCurrentYear } from "../../utilities/helper";
import { useDispatch } from "react-redux";
import { getTheBlogsList } from "../../redux/auth/authSlice";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import moment from "moment-timezone";

function Blogs() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [blogs, setblogs] = useState([]);
    const roleSelected = Cookies.get("roleSelected");

    const getBlogList = () => {
        let params = {
        }

        if (roleSelected) {
            params = {
                ...params,
                filter: roleSelected === "customer" ? "user" : "professional"
            }
        }

        dispatch(getTheBlogsList(params))
            .then((obj) => {
                setblogs(obj?.payload?.data?.data?.data);
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => { });
    };

    useEffect(() => {
        getBlogList();
    }, []);

    return (
        <>
            <section className="bg-[#F0F8FF] py-10">
                <h2 className="text-4xl md:text-6xl text-center font-bold">
                    Our Latest Blogs
                </h2>


                {
                    blogs && blogs.length > 0 ?
                        <section className={` gap-6  ${blogs.length === 1 ? "flex justify-center items-center" : "grid grid-cols-1 lg:grid-cols-2"} lg:gap-10 mx-4 md:mx-10 xl:mx-20 py-8 2xl:py-10`}>

                            {
                                blogs[0] && (
                                    <div
                                        onClick={() =>
                                            router.push(
                                                `/${roleSelected === "customer"
                                                    ? "Home/customer-blog-details"
                                                    : roleSelected === "professional"
                                                        ? "blogs/professional-blog-details"
                                                        : "blogs/BlogDetail"
                                                }?blogId=${blogs[0]?.id}`
                                            )
                                        }
                                        className="bg-white rounded-2xl cursor-pointer"
                                    >
                                        <div>
                                            <div className="relative">
                                                <div className="">
                                                    <Image
                                                        src={
                                                            blogs[0]?.images[0]
                                                                ? blogs[0]?.images[0]
                                                                : "/assets/wax.png"
                                                        }
                                                        alt="Car Mechanics"
                                                        width="900"
                                                        height="300"
                                                        className="object-fit w-full h-[300px] rounded-t-2xl"
                                                    />
                                                </div>
                                                <div className="bg-white p-1 px-2 rounded-2xl flex items-center gap-1 absolute bottom-4 left-3">
                                                    <Image
                                                        src="/assets/blackCalender.svg"
                                                        alt="image"
                                                        width="18"
                                                        height="18"
                                                    />
                                                    <span className="text-xs font-semibold">
                                                        {moment(blogs[0]?.created_at).format('DD MMMM YYYY')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <div className="flex justify-between px-2">
                                                    <div>
                                                        <span className="text-xs md:text-sm bg-[#1B75BC1A] mainbluetext p-1 md:p-2 px-2 md:px-3 rounded-full font-bold">
                                                            {blogs[0]?.category?.name}
                                                        </span>
                                                        {
                                                            (blogs[0]?.blog_for === "professional") && (
                                                                <span className="lightPinkBG pinkText text-xs md:text-sm ml-2 font-bold px-2 py-1 rounded-full">{blogs[0]?.blog_for === "professional" ? "Professional" : ""}</span>
                                                            )
                                                        }
                                                    </div>
                                                    <span className="text-xs md:text-sm maingray font-normal">
                                                        by: <span className="text-black">{blogs[0]?.author}</span>
                                                    </span>
                                                </div>
                                                <p className="text-lg xl:text-xl px-2 md:px-4 mt-3 w-full line-clamp-3 lg:w-[520px]">
                                                    {blogs[0]?.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className={`gap-6 ${blogs.length === 2 ? "md:grid-rows-2" : "grid grid-cols-1"}`}>

                                {
                                    blogs[1] && (
                                        <div
                                            onClick={() =>
                                                router.push(
                                                    `/${roleSelected === "customer"
                                                        ? "Home/customer-blog-details"
                                                        : roleSelected === "professional"
                                                            ? "blogs/professional-blog-details"
                                                            : "blogs/BlogDetail"
                                                    }?blogId=${blogs[1].id}`
                                                )
                                            }
                                            className="flex flex-col md:flex-row xl:gap-4 bg-white rounded-xl cursor-pointer"
                                        >
                                            <div className="">
                                                <Image
                                                    src={
                                                        blogs[1]?.images[0]
                                                            ? blogs[1]?.images[0]
                                                            : "/assets/wax.png"
                                                    }
                                                    alt="Car Mechanics"
                                                    width="800"
                                                    height="800"
                                                    className="p-3 object-cover mx-auto w-[200px] h-[200px]  rounded-3xl "
                                                />
                                            </div>
                                            <div className="p-3 mt-4 md:mt-0 md:w-2/3">
                                                <div className="flex justify-between w-full px-2">
                                                    <div>
                                                        <span className="text-xs md:text-sm bg-[#1B75BC1A] mainbluetext p-1 md:p-2 px-2 md:px-3 rounded-full font-bold">
                                                            {blogs[1]?.category?.name}
                                                        </span>
                                                        {
                                                            (blogs[1]?.blog_for === "professional") && (
                                                                <span className="lightPinkBG pinkText text-xs md:text-sm ml-2 font-bold px-2 py-1 rounded-full">{blogs[1]?.blog_for === "professional" ? "Professional" : ""}</span>
                                                            )
                                                        }
                                                    </div>
                                                    <span className="text-xs md:text-sm maingray font-normal">
                                                        by: <span className="text-black">{blogs[1]?.author}</span>
                                                    </span>
                                                </div>
                                                <p className="text-lg xl:text-xl line-clamp-3 px-2 md:px-4 mt-3 md:mt-5">
                                                    {blogs[1]?.title}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    blogs[2] && (
                                        <div
                                            onClick={() =>
                                                router.push(
                                                    `/${roleSelected === "customer"
                                                        ? "Home/customer-blog-details"
                                                        : roleSelected === "professional"
                                                            ? "blogs/professional-blog-details"
                                                            : "blogs/BlogDetail"
                                                    }?blogId=${blogs[2].id}`
                                                )
                                            }
                                            className="flex flex-col md:flex-row xl:gap-3 bg-white rounded-xl cursor-pointer"
                                        >
                                            <div className="">
                                                <Image
                                                    src={
                                                        blogs[2]?.images[0]
                                                            ? blogs[2]?.images[0]
                                                            : "/assets/wax.png"
                                                    }
                                                    alt="Car Mechanics"
                                                    width="800"
                                                    height="800"
                                                    className="p-3 object-cover mx-auto w-[200px] h-[200px] rounded-3xl "

                                                />
                                            </div>
                                            <div className="p-3 mt-4 md:mt-0 md:w-2/3">
                                                <div className="flex justify-between w-full px-2">
                                                    <div>
                                                        <span className="text-xs md:text-sm bg-[#1B75BC1A] mainbluetext p-1 md:p-2 px-2 md:px-3 rounded-full font-bold">
                                                            {blogs[2]?.category?.name}
                                                        </span>
                                                        {
                                                            (blogs[2]?.blog_for === "professional") && (
                                                                <span className="lightPinkBG pinkText text-xs md:text-sm ml-2 font-bold px-2 py-1 rounded-full">{blogs[2]?.blog_for === "professional" ? "Professional" : ""}</span>
                                                            )
                                                        }
                                                    </div>
                                                    <span className="text-xs md:text-sm maingray font-normal">
                                                        by: <span className="text-black">{blogs[2]?.author}</span>
                                                    </span>
                                                </div>
                                                <p className="text-lg xl:text-xl line-clamp-3 px-2 md:px-4 mt-3 md:mt-5">
                                                    {blogs[2]?.title}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                        :
                        <div className="flex justify-center items-center font-bold text-2xl my-10">
                            No Blogs Found
                        </div>
                }

                <div className="flex justify-center items-center 2xl:mt-6">
                    {/* onClick={() => router.push("/blogs/allBlogs")} */}
                    <button
                        onClick={() =>
                            router.push(
                                `/${roleSelected === "customer"
                                    ? "Home/blogs-customer"
                                    : roleSelected === "professional"
                                        ? "blogs/blogs-professional"
                                        : "blogs/allBlogs"
                                }`
                            )
                        }
                        type="button"
                        className="bg-white mainbluetext border py-2 px-6 md:px-10 rounded-lg font-bold border-[#1B75BC]"
                    >
                        View All
                    </button>
                </div>

            </section>
        </>
    );
}

export default Blogs;
