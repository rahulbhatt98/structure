import { ApiClient } from "../../utilities/api";
import ApiPath from "../../constants/apiPath";

export function signupApi(data) {
    const url = ApiPath.AuthApiPath.SIGNUP;
    return ApiClient.post(url, data);
}

export function loginApi(data) {
    const url = ApiPath.AuthApiPath.LOGIN;
    return ApiClient.post(url, data);
}

export function VerifyOtp(data) {
    let id = data?.id
    if (id) {
        delete data?.id
    }
    const url = id ? `${ApiPath.AuthApiPath.VERIFYOTP}?id=${id}` : ApiPath.AuthApiPath.VERIFYOTP;
    return ApiClient.post(url, data);
}

export function setProfile(data) {
    const url = ApiPath.AuthApiPath.SETPROFILE;
    return ApiClient.put(url, data);
}

export function forgetPassword(data) {
    const url = ApiPath.AuthApiPath.FORGETPASSWORD;
    return ApiClient.post(url, data);
}

export function resendOtp(data) {
    const url = ApiPath.AuthApiPath.RESENDOTP;
    return ApiClient.post(url, data);
}

export function resetPassword(data) {
    const url = ApiPath.AuthApiPath.RESETPASSWORD;
    return ApiClient.post(url, data);
}

export function uploadPhoto(data) {
    const url = ApiPath.AuthApiPath.UPLOADPHOTO;
    return ApiClient.post(url, data);
}

export function changePassword(data) {
    const url = ApiPath.AuthApiPath.CHANGEPASSWORD;
    return ApiClient.post(url, data);
}

export function updateVerifyDetails(data) {
    const url = ApiPath.AuthApiPath.UPDATEVERIFY;
    return ApiClient.put(url, data);
}

export function getProfile(data) {
    const url = ApiPath.AuthApiPath.GETPROFILE;
    return ApiClient.get(url, data);
}

export function getProfessionalData(id) {
    const url =`${ApiPath.AuthApiPath.GETPROFESSIONALDATA}${id}`;
    return ApiClient.get(url);
}

export function socialLogin(data) {
    const url = ApiPath.AuthApiPath.SOCIALLOGIN;
    return ApiClient.post(url, data);
}

export function getServiceList(data) {
    const url = ApiPath.AuthApiPath.GETSERVICELIST;
    return ApiClient.get(url, data);
}

export function getFlagList(data) {
    const url = ApiPath.AuthApiPath.CODELIST;
    return ApiClient.get(url, data);
}

export function getTheSuggestionList(data) {
    const url = ApiPath.AuthApiPath.SUGGESTIONLIST;
    return ApiClient.get(url, data);
}

export function setProfessionalProfile(data) {
    const url = ApiPath.AuthApiPath.SETPROFESSIONALPROFILE;
    return ApiClient.post(url, data);
}

export function addProfessionalProfile(data) {
    const url = ApiPath.AuthApiPath.ADDPROFESSIONALPROFILE;
    return ApiClient.post(url, data);
}

export function getServiceStep(data) {
    return data
}

export function uploadDocuments(data) {
    const url = ApiPath.AuthApiPath.UPLOADDOCUMENT;
    return ApiClient.post(url, data);
}

export function termsAndPolicy(data) {
    const url = ApiPath.AuthApiPath.TERMS_POLICY;
    return ApiClient.get(url, data);
}

export function getMapList(data) {
    const url = ApiPath.AuthApiPath.GET_MAPLIST;
    return ApiClient.get(url, data);
}

export function getBlogsList(data) {
    const url = ApiPath.AuthApiPath.GET_BLOGS;
    return ApiClient.get(url, data);
}

export function getTaskList(data) {
    const url = ApiPath.AuthApiPath.TASKLIST;
    return ApiClient.get(url, data);
}
export function getOpenTaskList(data) {
    const url = ApiPath.AuthApiPath.OPENEDLIST;
    return ApiClient.get(url, data);
}

export function logoutApi(data) {
    const url = ApiPath.AuthApiPath.LOGOUT;
    return ApiClient.put(url, data);
}