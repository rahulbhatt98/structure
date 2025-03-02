import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Cookies from 'js-cookie';
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/router';
import BlogsListing from '../../components/blogs/BlogsListing';
import { getTheBlogsList } from '../../redux/auth/authSlice';
import { useDispatch } from 'react-redux';
import LatestBlogs from '../../components/blogs/LatestBlogs';

function Allblogs() {
  const verifiedLogin = Cookies.get("authToken");
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [blogs, setblogs] = useState([]);
  const roleSelected = Cookies.get("roleSelected");
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');



  const getBlogList = () => {
    let params = {

    }
    if (roleSelected) {
      params = {
        page: 1,
        limit: 10,
        filter: roleSelected === "customer" ? "user" : "professional"
      }
    }
    setLoading(true)
    dispatch(getTheBlogsList(params))
      .then((obj) => {
        setblogs(obj?.payload?.data?.data?.data)
        setLoading(false)
      })
      .catch((obj) => {
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      });
  };


  console.log(blogs, "blog listttttttttttttttttt");


  useEffect(() => {
    getBlogList();
  }, []);

  return (
    <>
      <section className="authbg relative max-h-full md:h-screen">
        <Header />
        <section className={`${verifiedLogin ? "lmob:mt-28 lg:mt-[7rem] md:mt-[11rem]  medmob:mt-28 smob:mt-28" : "mt-28 lg:mt-[7rem] md:mt-[11rem] "}`}>
          <nav className="px-5 md:px-10">
            <Link href="/Home" className="text-[#919EAB] font-medium text-base md:text-lg hover:underline">Home </Link> &gt;
            <span className=" font-medium text-base md:text-lg">Blogs</span>
          </nav>

          <section className={`blogsbg py-20 m-[10px] md:mx-[31px] my-3 flex justify-center items-center`}>
            <section className="mt-2 text-center text-white px-4">

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
                  Blogs
                </h1>

                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-full md:w-96 px-4 py-1 md:py-3 introInputshadow bg-[#FFFFFF33] inputbg border text-white border-[#FFFFFF] placeholder:text-[#FFFFFF] placeholder:text-base md:placeholder:text-2xl rounded-lg focus:outline-none text-lg md:text-2xl"
                    placeholder="Search Blog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  // onChange={(e) => handleSerch(e)}
                  // onClick={() => setIsOpen(true)}
                  />
                </div>
              </div>
            </section>
          </section>

          <section className='mx-8'>

            <LatestBlogs loading={loading} blogs={blogs} />

          </section>
          <BlogsListing searchQuery={searchQuery}/>

        </section>

        <Footer />
      </section>
    </>
  )
}

export default Allblogs;