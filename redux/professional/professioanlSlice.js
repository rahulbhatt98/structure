import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { declinedRequest , getNotification, readNotification } from "./professioanlApi";

const initialState = {
    status: "idle",
};

export const declinedRequestAsync = createAsyncThunk("professional/declinedRequest", async (data, { rejectWithValue }) => {
    try {
        const response = await declinedRequest(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});


export const getAllNotifications = createAsyncThunk("professional/getNotification", async (data, { rejectWithValue }) => {
    try {
        const response = await getNotification(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const readNotificationsAsync = createAsyncThunk("professional/readNotification", async (data, { rejectWithValue }) => {
    try {
        const response = await readNotification(data);
        return response;
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const professionalSlice = createSlice({
    name: "professional",
    initialState,
    reducers: {},
});

export default professionalSlice.reducer;