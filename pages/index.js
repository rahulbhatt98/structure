import { useRouter } from "next/router";
import Header from "../components/common/Header";
import Intro from "../components/Home/Intro";
import Services from "../components/Home/Services";
import Blogs from "../components/Home/Blogs";
import RequestNow from "../components/Home/RequestNow";
import Footer from "../components/common/Footer";
import Map from "../components/Home/Map";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function Home() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState("")
  const [headerSearch, setHeaderSearch] = useState("")
  return (
    <>
      <section className="authbg relative max-h-full h-screen">
        <Header setHeaderSearch={setHeaderSearch}/>
        <Intro setSelectedService={setSelectedService}/>
        <Map selectedService={selectedService} headerSearch={headerSearch}/>
        <Services />
        <Blogs />
        <RequestNow />
        <Footer />
      </section>

    </>
  );
}
export default Home;
