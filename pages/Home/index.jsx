import React, { useState } from 'react'
import Image from "next/image";
import Header from '../../components/common/Header';
import Intro from '../../components/Home/Intro';
import Footer from '../../components/common/Footer';
import RequestNow from '../../components/Home/RequestNow';
import Services from '../../components/Home/Services';
import Blogs from '../../components/Home/Blogs';
import Map from '../../components/Home/Map';

const Home = () => {
    const [selectedService, setSelectedService] = useState("")
    const [headerSearch, setHeaderSearch] = useState("")
    
    return (
        <>
            <section className="authbg relative max-h-full h-screen">
                <Header setHeaderSearch={setHeaderSearch}/>
                <Intro setSelectedService={setSelectedService}/>
                <Map selectedService={selectedService} headerSearch={headerSearch}/>
                <Services/>
                <Blogs/>
                <RequestNow />
                <Footer />
            </section>
        </>
    )
}

export default Home;