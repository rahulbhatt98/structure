import OneSignal from 'react-onesignal';

export const initializeOneSignal = async () => {
    await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
    });
    const userId = await OneSignal.getUserId();
    console.log(userId,"iddddddddddddddddddddddddd")
    return userId;
};