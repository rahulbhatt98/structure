import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginApi,
  signupApi,
  VerifyOtp,
  setProfile,
  forgetPassword,
  uploadPhoto,
  resetPassword,
  getProfile,
  resendOtp,
  changePassword,
  updateVerifyDetails,
  socialLogin,
  getServiceList,
  getFlagList,
  setProfessionalProfile,
  getServiceStep,
  getProfessionalData,
  uploadDocuments,
  termsAndPolicy,
  getMapList,
  getBlogsList,
  addProfessionalProfile,
  getTheSuggestionList,
  getTaskList,
  getOpenTaskList,
  logoutApi
} from "./authApi";

const initialState = {
  user: null,
  status: "idle",
  token: null
};

export const signupAsync = createAsyncThunk("auth/signupApi", async (data, { rejectWithValue }) => {
  try {
    const response = await signupApi(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const loginAsync = createAsyncThunk("auth/loginApi", async (data, { rejectWithValue }) => {
  try {
    const response = await loginApi(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const verifyTheOtp = createAsyncThunk("auth/VerifyOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await VerifyOtp(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const setupProfile = createAsyncThunk("auth/setProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await setProfile(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const forgetThePassword = createAsyncThunk("auth/forgetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await forgetPassword(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const resetPasswordAsync = createAsyncThunk("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await resetPassword(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});


export const uploadThePhoto = createAsyncThunk("auth/uploadPhoto", async (data, { rejectWithValue }) => {
  try {
    const response = await uploadPhoto(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});


export const getTheProfile = createAsyncThunk("auth/getProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await getProfile(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTheProfessionalData = createAsyncThunk("auth/getProfessionalData", async (userID, { rejectWithValue }) => {
  try {
    const response = await getProfessionalData(userID);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const resendOtpAsync = createAsyncThunk("auth/resendOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await resendOtp(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changePasswordAsync = createAsyncThunk("auth/changePassword", async (data, { rejectWithValue }) => {
  try {
    const response = await changePassword(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateVerifyDetailsAsync = createAsyncThunk("auth/updateVerifyDetails", async (data, { rejectWithValue }) => {
  try {
    const response = await updateVerifyDetails(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const socialLoginAsync = createAsyncThunk("auth/socialLogin", async (data, { rejectWithValue }) => {
  try {
    const response = await socialLogin(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});


export const listofService = createAsyncThunk("auth/getServiceList", async (data, { rejectWithValue }) => {
  try {
    const response = await getServiceList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const listofCode = createAsyncThunk("auth/getFlagList", async (data, { rejectWithValue }) => {
  try {
    const response = await getFlagList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const setupProfessionalProfile = createAsyncThunk("auth/setProfessionalProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await setProfessionalProfile(data);
    return response;
  } catch (err) {
    console.log(err,"ssssssssssaaaaaaaaaaaaaaaaa");
    return rejectWithValue(err);
  }
});

export const addProfessionalProfileAsync = createAsyncThunk("auth/addProfessionalProfile", async (data, { rejectWithValue }) => {
  try {
    const response = await addProfessionalProfile(data);
    return response;
  } catch (err) {
    console.log(err,"ssssssssssaaaaaaaaaaaaaaaaa");
    return rejectWithValue(err);
  }
});

export const getServiceStepAsync = createAsyncThunk("auth/getServiceStep", async (data, { rejectWithValue }) => {
  try {
    const response = await getServiceStep(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});


export const uploadTheDocuments = createAsyncThunk("auth/uploadDocuments", async (data, { rejectWithValue }) => {
  console.log( "dataaaaa")
  try {
    const response = await uploadDocuments(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const TermsAndPolicy = createAsyncThunk("auth/termsAndPolicy", async (data, { rejectWithValue }) => {
  try {
    const response = await termsAndPolicy(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTheMapList = createAsyncThunk("auth/getMapList", async (data, { rejectWithValue }) => {
  try {
    const response = await getMapList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTheSuggestionListAsync = createAsyncThunk("auth/getTheSuggestionList", async (data, { rejectWithValue }) => {
  try {
    const response = await getTheSuggestionList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTheBlogsList = createAsyncThunk("auth/getBlogsList", async (data, { rejectWithValue }) => {
  try {
    const response = await getBlogsList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTaskListAsync = createAsyncThunk("auth/getTaskList", async (data, { rejectWithValue }) => {
  try {
    const response = await getTaskList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getOpenTaskListAsync = createAsyncThunk("auth/getOpenTaskList", async (data, { rejectWithValue }) => {
  try {
    const response = await getOpenTaskList(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const logoutApiAsync = createAsyncThunk("auth/logoutApi", async (data, { rejectWithValue }) => {
  try {
    const response = await logoutApi(data);
    return response;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.fulfilled, (state, { payload }) => {
        state.user = payload?.data ? { ...payload?.data?.data[0]?.userDetails, "token": payload?.data?.data[0]?.token } : null;
        state.token = payload?.data ? payload?.data?.data[0]?.token : null
      })
      .addCase(signupAsync.rejected, (state, { error }) => {
        state.user = null;
      })
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.user = payload?.data ? { ...payload?.data?.data[0]?.userDetails, "token": payload?.data?.data[0]?.token } : null;
        state.token = payload?.data ? payload?.data?.data[0]?.token : null
      })
      .addCase(loginAsync.rejected, (state, { error }) => {
        state.user = null;
      })
      .addCase(socialLoginAsync.fulfilled, (state, { payload }) => {
        state.user = payload?.data ? { ...payload?.data?.data[0]?.userDetails, "token": payload?.data?.data[0]?.token } : null;
        state.token = payload?.data ? payload?.data?.data[0]?.token : null
      })
      .addCase(socialLoginAsync.rejected, (state, { error }) => {
        state.user = null;
      })
      .addCase(verifyTheOtp.fulfilled, (state, { payload }) => {
        state.user = payload?.data ? { ...payload?.data?.data[0]?.userDetails, "token": payload?.data?.data[0]?.token } : null;
        state.token = payload?.data ? payload?.data?.data[0]?.token : null
      })
      .addCase(verifyTheOtp.rejected, (state, { error }) => {
      })
      .addCase(getTheProfile.fulfilled, (state, { payload }) => {
        state.user = payload ? { ...state.user, ...payload?.data?.data } : null;
      })
      .addCase(getTheProfile.rejected, (state, { error }) => {
      })
      // .addCase(getTheProfessionalProfile.fulfilled, (state, { payload }) => {
      //   state.user = payload ? { ...state.user, ...payload?.data?.data } : null;
      // })
      // .addCase(getTheProfessionalProfile.rejected, (state, { error }) => {
      //   state.user = null;
      // })
      .addCase(getServiceStepAsync.fulfilled, (state, { payload }) => {
        console.log(payload,{ ...state.user, "customStep":payload },"payloadddddddddddddddddd");
        state.user = { ...state.user, "customStep":payload };
      })
      .addCase(getServiceStepAsync.rejected, (state, { error }) => {
      })
  },

});

export const { logout } = authSlice.actions;
export const selectLoginAuth = (state) => state.auth.user;

export default authSlice.reducer;
