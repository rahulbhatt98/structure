const ApiPath = {
  AuthApiPath: {
    SIGNUP: "user/signup",
    LOGIN: "user/login",
    VERIFYOTP: "user/verify-otp",
    SETPROFILE: "user/update-profile",
    FORGETPASSWORD: "user/forgot-password",
    UPLOADPHOTO: "user/upload-profile-image",
    RESETPASSWORD: "user/reset-password",
    GETPROFILE: "user/profile",
    RESENDOTP: "user/resend-otp",
    CHANGEPASSWORD: "user/change-password",
    UPDATEVERIFY: "user/update-verify",
    SOCIALLOGIN: "user/social-login",
    GETSERVICELIST: "/services/category-list",
    CODELIST: "/country_code/list",
    SETPROFESSIONALPROFILE: "/professionals/create",
    ADDPROFESSIONALPROFILE: "/professionals_users_services/create",
    UPLOADDOCUMENT: "/professionals/upload",
    TERMS_POLICY: "/settings",
    GET_MAPLIST: "/professionals/get-list",
    GET_BLOGS: "/blogs/",
    GETPROFESSIONALDATA: "/professionals/",
    SUGGESTIONLIST: "/categories/suggestions",
    TASKLIST: "/requests/request-list",
    OPENEDLIST: "/requests/request-open-list",
    LOGOUT: 'user/logout'
  },
  CustomerApiPath: {
    PERSONAL_REQUEST: "/requests/create",
    GLOBAL_REQUESTS: "/requests/",
    SP_SUGGESTIONS: "/professionals/professional-suggestion-list",
    BLOG_DETAILS : "/blogs/",
    ADD_COMMENT : "/blog_comments/create",
    GET_COMMENTS : "/blog_comments/"
  },
  ProfessioanlApiPath: {
    PERSONAL_REQUEST: "/requests",
    GET_NOTIFICATION : "/notifications/getall",
    READ_NOTIFICATION : "/notifications/isread"
  }
};

export default ApiPath;
