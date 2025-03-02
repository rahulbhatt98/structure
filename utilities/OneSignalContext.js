import React, { createContext, useState, useContext } from 'react';

const OneSignalContext = createContext();

export const OneSignalProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <OneSignalContext.Provider value={{ userId, setUserId }}>
            {children}
        </OneSignalContext.Provider>
    );
};

export const useOneSignal = () => useContext(OneSignalContext);