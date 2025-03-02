import { ApiClient } from "../../utilities/api";
import ApiPath from "../../constants/apiPath";

export function declinedRequest(data) {
    const url = ApiPath.ProfessioanlApiPath.PERSONAL_REQUEST;
    return ApiClient.put(url, data);
}

export function getNotification(data) {
    const url = ApiPath.ProfessioanlApiPath.GET_NOTIFICATION;
    return ApiClient.get(url, data);
}


export function readNotification(data) {
    const url = `${ApiPath.ProfessioanlApiPath.READ_NOTIFICATION}/${data}`;
    return ApiClient.patch(url);
}

