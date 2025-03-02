import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTheBlogsList } from '../../redux/auth/authSlice';
import Cookies from "js-cookie";
import RotatingLoaderWithImage from '../common/RotateLoader';
import BasicPagination from '../common/basicPagination';
function BlogsListing({ searchQuery }) {

    const dispatch = useDispatch();
    const router = useRouter();
    const [blogs, setblogs] = useState([]);
    const [loading, setLoading] = useState(false)
    const roleSelected = Cookies.get("roleSelected");
    const [page, setPage] = useState(1);
    const [Total, setTotal] = useState(null);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    function findStartingContent(htmlString) {
        // Create a container to parse the HTML string
        const container = document.createElement("div");
        container.innerHTML = htmlString;
      
        let meaningfulContentFound = false;
      
        // Loop through child elements of the container
        Array.from(container.children).forEach((child) => {
          // If meaningful content has been found, stop processing other elements
          if (meaningfulContentFound) return;
      
          const childContent = child.textContent.trim();
      
          // Check if the child is an <img>, or if it has empty or whitespace-only content
          if (child.tagName === "IMG" || childContent === "" || childContent === " ") {
            // Hide non-meaningful elements
            child.style.display = "none";
          } else {
            meaningfulContentFound = true;
          }
        });
      
        // Return the modified HTML as a string
        return container.innerHTML;
      }

    const getBlogList = () => {
        let params = {
            "page": page,
            "limit": 10,
            "keyword": searchQuery || undefined
        }
        if (roleSelected) {
            params = {
                ...params,
                filter: roleSelected === "customer" ? "user" : "professional"
            }
        }
        setLoading(true)
        dispatch(getTheBlogsList(params))
            .then((obj) => {
                setLoading(false)

                console.log(obj?.payload, "payloadddddddddddddddddddd");
                setblogs(obj?.payload?.data?.data?.data)
                setTotal(obj?.payload?.data?.data?.totalRecords);
            })
            .catch((obj) => {
                // Handle error
                setLoading(false)
            })
            .finally(() => {
                setLoading(false)
            });
    };

    console.log(blogs, "blogs")


    useEffect(() => {
        getBlogList();
    }, [searchQuery, page]);

    return (
        <>
            <section className='mb-3'>
                <h2 className=" font-bold text-xl md:text-4xl mx-10 mb-3">Blogs</h2>
                <ul className='space-y-2'>
                    {
                        loading ? <RotatingLoaderWithImage /> :
                            blogs && blogs?.length > 0 ?
                                <>
                                    {
                                        blogs.map((blog, index) => {
                                            return (
                                                <li key={index} onClick={() => router.push(`/${roleSelected === "customer" ? 'Home/customer-blog-details' : roleSelected === "professional" ? 'blogs/professional-blog-details' : 'blogs/BlogDetail'}?blogId=${blog?.id}`)} className='cursor-pointer'>
                                                    <div className="flex flex-col justify-center items-center md:justify-normal md:items-start md:flex-row p-4 space-x-4 bg-white policyShadow mx-10 rounded-lg">
                                                        <div className="relative mb-3 md:mb-0">
                                                            <Image
                                                                // src="/assets/blogPic.png"
                                                                src={blog.images ? blog.images[0] : "/assets/blogPic.png"}
                                                                alt="Search Icon"
                                                                height="400"
                                                                width="400"
                                                                className='rounded-lg w-[208px] h-32'
                                                            />
                                                        </div>

                                                        <div className="flex flex-col justify-between w-full">
                                                            <div>
                                                                <div className='flex justify-between'>
                                                                    <div className="flex space-x-2 items-center mb-1">
                                                                        <span className="text-sm font-bold mainbluetext">{blog?.category?.name}</span>
                                                                        {
                                                                            (blog?.blog_for === "professional") && (
                                                                                <span className="lightPinkBG pinkText text-xs font-bold px-2 py-1 rounded-full">{blog?.blog_for === "professional" ? "Professional" : ""}</span>
                                                                            )
                                                                        }
                                                                    </div>

                                                                    <div className="font-semibold text-sm">
                                                                        By: <span className="text-blue-600">{blog?.author}</span>
                                                                    </div>

                                                                </div>
                                                                <h2 className="text-lg font-medium text-gray-900">
                                                                    {blog?.title}
                                                                </h2>
                                                                <p className="text-gray-400 text-sm lg:text-base mt-1 line-clamp-2">
                                                                    <div
                                                                        dangerouslySetInnerHTML={{ __html: findStartingContent(blog?.description) }}
                                                                        className='editorTiny'
                                                                    />
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                    <div className="flex justify-center items-center">
                                        <BasicPagination
                                            count={Math.ceil(Total / 10)}
                                            page={page}
                                            onChange={handlePageChange}
                                        />
                                    </div>
                                </>
                                :
                                <div className='flex justify-center items-center font-bold text-lg my-10'>No Blogs Found</div>
                    }
                </ul>
            </section>
        </>
    )
}

export default BlogsListing;