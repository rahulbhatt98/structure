import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { personalRequest, getGlobalRequestData, suggestionList, getBlogDeatil, addComment,getComments } from "./customerApi";

const initialState = {
    user: null,
    status: "idle",
    token: null,
};

export const createPersonalRequest = createAsyncThunk("customer/personalRequest", async (data, { rejectWithValue }) => {
    try {
        const response = await personalRequest(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getGlobalData = createAsyncThunk("customer/getGlobalRequestData", async (id, { rejectWithValue }) => {

    try {
        const response = await getGlobalRequestData(id);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getTheSuggestionList = createAsyncThunk("customer/suggestionList", async (data, { rejectWithValue }) => {

    try {
        const response = await suggestionList(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getBlogsData = createAsyncThunk("customer/getBlogDeatil", async (id, { rejectWithValue }) => {

    try {
        const response = await getBlogDeatil(id);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const addTheComment = createAsyncThunk("customer/addComment", async (data, { rejectWithValue }) => {

    try {
        const response = await addComment(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const getTheComments = createAsyncThunk("customer/getComments", async (id, { rejectWithValue }) => {

    try {
        const response = await getComments(id);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
});

export default customerSlice.reducer;