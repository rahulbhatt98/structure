import React, { useEffect, useState } from 'react'
import Header from '../common/Header';
import Footer from '../common/Footer';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { getBlogsData, getTheComments } from '../../redux/customer/customerSlice';
import moment from 'moment-timezone';
import CommentModal from '../modals/commentModal';
import AutoModal from '../modals/AutoModal';
import { space } from 'postcss/lib/list';
import RotatingLoaderWithImage from '../common/RotateLoader';

function DetailOfBlog() {
    const verifiedLogin = Cookies.get("authToken");
    const router = useRouter();
    const { blogId } = router.query;
    const [blogsDetail, setblogsDetail] = useState([]);
    const [comments, setcomments] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log(comments, "comments")

    const dispatch = useDispatch();
    const roleSelected = Cookies.get("roleSelected");


    const getBlogDetail = () => {
        setLoading(true);

        dispatch(getBlogsData(blogId))
            .then((obj) => {
                setblogsDetail(obj?.payload?.data?.data);
                setLoading(false)
            })
            .catch((obj) => {
                // Handle error
                setLoading(false)
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const getAllComments = () => {

        dispatch(getTheComments(blogId))
            .then((obj) => {
                setcomments(obj?.payload?.data?.data)
            })
            .catch((obj) => {
                // Handle error
            })
            .finally(() => {
            });
    };


    const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
    const openAutoModal = () => {
        setIsAutoModalOpen(true);
    };
    const closeAutoModal = () => setIsAutoModalOpen(false);

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const openCommentModal = () => {
        setIsCommentModalOpen(true);
    };
    const closeCommentModal = () => setIsCommentModalOpen(false);


    useEffect(() => {
        getBlogDetail();
        getAllComments();
    }, []);

    return (
        <>
            <section className="authbg relative max-h-full h-screen">
                <Header />
                <section className={`${verifiedLogin ? "lmob:mt-28 lg:mt-[7rem] md:mt-[11rem]  medmob:mt-28 smob:mt-28" : "mt-28 lg:mt-[7rem] md:mt-[11rem] "}`}>
                    <nav className="px-5 md:px-10">
                        <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home </Link> &gt;
                        <Link href={`/${roleSelected === "customer"
                            ? "Home/blogs-customer"
                            : roleSelected === "professional"
                                ? "blogs/blogs-professional"
                                : "blogs/allBlogs"}`}
                            className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Blogs </Link> &gt;
                        <span className=" font-medium text-base md:text-lg">Blog Detail</span>
                    </nav>
                </section>

                <section>
                    {
                        loading ? <RotatingLoaderWithImage /> :
                            <div className="lg:mx-44 my-8 p-6 bg-white rounded-md">
                                {/* Header */}
                                <div className="mb-6">
                                    <h1 className="text-xl md:text-4xl font-bold leading-tight">
                                        {blogsDetail?.title}
                                    </h1>
                                    <div className="flex items-center space-x-4 mt-4 border-b border-black">
                                        <div className="flex items-center space-x-2 ">
                                            <div className='w-16 h-16'>
                                                <Image
                                                    src="/assets/bloglogo.svg"
                                                    alt="Search Icon"
                                                    height="400"
                                                    width="400"
                                                // className='rounded-lg'
                                                />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-700">{blogsDetail?.author}</p>
                                                <p className="text-base text-gray-500">{moment(blogsDetail?.created_at).format('DD/MM/YYYY')}</p>
                                            </div>
                                        </div>
                                        {
                                            (blogsDetail?.blog_for === "professional") && (
                                                <span className="lightPinkBG pinkText text-xs font-bold px-2 py-1 rounded-full">{blogsDetail?.blog_for === "professional" ? "Professional" : ""}</span>
                                            )
                                        }
                                        {/* <div className="ml-auto flex space-x-2">
                                    <button>
                                        <i className="fas fa-heart text-pink-600"></i>
                                    </button>
                                    <button>
                                        <i className="fas fa-share-alt text-gray-500"></i>
                                    </button>
                                    <button>
                                        <i className="fas fa-comment text-gray-500"></i>
                                    </button>
                                </div> */}
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="mb-6 flex justify-center items-center">
                                    <Image
                                        src={blogsDetail?.images ? blogsDetail?.images[0] : "/assets/blogDetail.png"}
                                        // src="/assets/blogDetail.png"
                                        alt="Search Icon"
                                        height="800"
                                        width="1200"
                                        className='h-full'
                                    />
                                </div>
                                {/* <div className="mb-6 flex justify-center items-center">
                                    <Image
                                        src={blogsDetail?.images ? blogsDetail?.images[0] : "/assets/blogDetail.png"}
                                        // src="/assets/blogDetail.png"
                                        alt="Search Icon"
                                        height="800"
                                        width="1200"
                                        className='h-full'
                                    />
                                </div> */}

                                {/* Content */}
                                <div className="text-gray-700 space-y-4">
                                    {/* <pre className='text-wrap whitespace-pre-wrap break-words latoFont'>
                                        {blogsDetail?.description}
                                    </pre> */}
                                    <div
                                        dangerouslySetInnerHTML={{ __html: blogsDetail?.description }}
                                        // className='flex justify-center items-center flex-col'
                                    />
                                </div>

                                {/* Comments Section */}
                                <div className="mt-8 border-t pt-3 border-black">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
                                        <button
                                            onClick={verifiedLogin ? openCommentModal : openAutoModal}
                                            type="button"
                                            className="mainblue text-base text-white font-semibold px-2 py-1.5 md:py-2 rounded-xl"
                                        >
                                            Add Comment
                                        </button>
                                    </div>
                                    {isCommentModalOpen && (
                                        <CommentModal
                                            isOpen={isCommentModalOpen}
                                            onClose={() => closeCommentModal()}
                                            blogId={blogId}
                                            getAllComments={getAllComments}
                                        />
                                    )}
                                    {isAutoModalOpen && (
                                        <AutoModal
                                            isOpen={isAutoModalOpen}
                                            onClose={() => closeAutoModal()}
                                        />
                                    )}

                                    {
                                        comments?.length > 0 ?
                                            <div className="mt-5 space-y-2">
                                                {comments.map((comment, index) => (
                                                    <div key={index} className="flex gap-2 w-full">
                                                        <div className='md:w-14 md:h-14'>
                                                            <Image
                                                                // src="/assets/bloglogo.svg"
                                                                src={comment.user_details.profile_photo ? comment.user_details.profile_photo : "/assets/mapprofile.svg"}
                                                                alt="Search Icon"
                                                                height="60"
                                                                width="60"
                                                                className='rounded-lg'
                                                            />
                                                        </div>
                                                        <div className='w-full'>

                                                            <div key={comment.id} className="mb-4">
                                                                <div className='flex justify-between w-full'>
                                                                    <p className="text-base font-bold text-gray-700">{comment.user_details.first_name} {comment.user_details.last_name}</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        <span className='mr-1'> {new Date(comment.created_at).toLocaleDateString()} </span>
                                                                        {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}

                                                                    </p>
                                                                </div>
                                                                <p className="text-sm">
                                                                    {comment.comments}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            :
                                            <span className='flex font-bold my-5 justify-center items-center'>
                                                No comments Found
                                            </span>
                                    }
                                </div>


                            </div>
                    }
                </section>

                <Footer />
            </section>
        </>
    )
}

export default DetailOfBlog;