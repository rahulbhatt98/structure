import React, { useEffect, useRef, useState } from "react";
import RotatingLoaderWithImage from "../common/RotateLoader";
import Slider from "react-slick";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LatestBlogs = ({ loading, blogs }) => {
  const router = useRouter();
  const roleSelected = Cookies.get("roleSelected");

  var settings = {
    dots: false,
    infinite: blogs?.length > 3,
    speed: 500,
    autoplay: blogs?.length > 3,
    autoplaySpeed: 2000,
    slidesToShow: blogs?.length > 3 ? 3 : blogs?.length,
    centerMode: true,
    centerPadding: blogs?.length > 3 ? "50px" : "0px",
    arrows: false,
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: blogs?.length > 3,
    swipe: blogs?.length > 3,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
          swipe: blogs?.length > 1,
          infinite: blogs?.length > 1,
          autoplay: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          centerPadding: "20px",
          swipe: blogs?.length > 2,
          infinite: blogs?.length > 2,
          autoplay: blogs?.length > 2,
          slidesToShow: blogs?.length > 2 ? 2 : 1,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: blogs?.length > 2 ? 2 : 1,
          centerPadding: "20px",
          swipe: blogs?.length > 2,
          infinite: blogs?.length > 2,
          autoplay: blogs?.length > 2,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: blogs?.length > 3 ? 3 : blogs?.length,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div>
      <h2 className=" font-bold text-xl md:text-4xl"> Latest Blogs</h2>
      <ul className="my-4 gap-3">
        {loading ? (
          <RotatingLoaderWithImage />
        ) : blogs && blogs?.length > 0 ? (
          <Slider {...settings}>
            {blogs?.map((blog, index) => {
              const titleWords = blog?.title.split(" ") || [];
              return (
                <li

                  key={index}
                  className="bg-white policyShadow rounded-xl h-[255px] md:h-[379px] p-4"
                >
                  <div className="">
                    <div className="text-sm font-bold mainbluetext px-3 rounded-lg mb-2.5 text-left max-w-fit  lightBlueBG">
                      {blog?.category?.name}
                    </div>
                    <Image
                      src={blog.images ? blog.images[0] : "/assets/blogPic.png"}
                      alt="Search Icon"
                      height="600"
                      width="800"
                      className="rounded-lg w-[250px] h-[150px] md:w-[369px] md:h-[268px]"
                    />
                    <div className="relative">
                      <p className="font-medium text-xl hidden md:block text-left">
                        {blog?.title.length > 50
                          ? `${blog?.title.slice(0, 50)}...`
                          : blog?.title
                        }
                      </p>
                      <p className="font-medium text-xl block md:hidden text-left">
                        {blog?.title.length > 30
                          ? `${blog?.title.slice(0, 30)}...`
                          : blog?.title
                        }
                      </p>
                      {blog?.title.length > 30 && (
                        <button
                          className="text-blue-500 absolute block md:hidden bottom-0.5 md:bottom-0 right-0 md:right-6 font-semibold text-xs md:text-sm"
                          onClick={() =>
                            router.push(
                              `/${roleSelected === "customer"
                                ? "Home/customer-blog-details"
                                : roleSelected === "professional"
                                  ? "blogs/professional-blog-details"
                                  : "blogs/BlogDetail"
                              }?blogId=${blog?.id}`
                            )
                          }
                        >
                          See More
                        </button>
                      )}
                      {blog?.title.length > 65 && (
                        <button
                          className="text-blue-500 absolute hidden md:block bottom-0.5 md:bottom-0 right-0 md:right-6 font-semibold text-xs md:text-sm"
                          onClick={() =>
                            router.push(
                              `/${roleSelected === "customer"
                                ? "Home/customer-blog-details"
                                : roleSelected === "professional"
                                  ? "blogs/professional-blog-details"
                                  : "blogs/BlogDetail"
                              }?blogId=${blog?.id}`
                            )
                          }
                        >
                          See More
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </Slider>
        ) : (
          <div className="flex justify-center items-center font-bold text-lg my-10">
            No Latest Blogs Found
          </div>
        )}
      </ul>
    </div>
  );
};

export default LatestBlogs;
