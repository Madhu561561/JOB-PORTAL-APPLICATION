import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null, // initially  no  need of  user
    },
    reducers: {
        setUser: (state, action) => {   //we can write (state) only if we want to only get the state not add the data
            state.user = action.payload;// /payload in action =>/data received from backened add to state user
        },
    },
});
export const { setUser } = authSlice.actions;
