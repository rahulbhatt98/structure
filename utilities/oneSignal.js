import OneSignal from "react-onesignal";
export default async function runOneSignal() {
  const randomId = 'user_' + Math.random().toString(36).substr(2, 9);
  await OneSignal.init({
    appId: "241d32f1-4c44-4fb9-8426-45734d8f3033",
    allowLocalhostAsSecureOrigin: true,
  });
  OneSignal.Slidedown.promptPush();
  //await OneSignal.init({ appId: '79ea6707-e1ce-44e9-97d3-8d27b2e792c7', allowLocalhostAsSecureOrigin: true});
}
