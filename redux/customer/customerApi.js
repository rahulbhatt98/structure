import { ApiClient } from "../../utilities/api";
import ApiPath from "../../constants/apiPath";

export function personalRequest(data) {
    const url = ApiPath.CustomerApiPath.PERSONAL_REQUEST;
    return ApiClient.post(url, data);
}


export function getGlobalRequestData(id) {
    const url = `${ApiPath.CustomerApiPath.GLOBAL_REQUESTS}${id}`;
    return ApiClient.get(url);
}


export function suggestionList(data) {
    const url = ApiPath.CustomerApiPath.SP_SUGGESTIONS;
    return ApiClient.post(url, data);
}

export function getBlogDeatil(id) {
    const url = `${ApiPath.CustomerApiPath.BLOG_DETAILS}${id}`;
    return ApiClient.get(url);
}

export function addComment(data) {
    const url = ApiPath.CustomerApiPath.ADD_COMMENT;
    return ApiClient.post(url, data);
}

export function getComments(id) {
    const url = `${ApiPath.CustomerApiPath.GET_COMMENTS}${id}`;
    return ApiClient.get(url);
}


