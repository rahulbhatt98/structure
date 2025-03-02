import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Inbox from '../../components/chats/inboxItem';
import ChatInterface from '../../components/chats/chatInterface';


function ChatScreen() {
    return (
        <>
            <section className="authbg relative max-h-full ">
                <Header />
                <div className='grid grid-cols-12 gap-3'>
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                        <Inbox />
                    </div>
                    <div className=" col-span-12 lg:col-span-8 xl:col-span-9">
                        <ChatInterface />
                    </div>
                </div>

            </section>
        </>
    )
}

export default ChatScreen;