import {createSlice}from '@reduxjs/toolkit';

export const alertSlice = createSlice({
    name :"alert",
    initialState:{  //object
        loading:false,   //key value
    },
    reducers:{             //here reducers are written as multiple action can be possible but in store we write reducer
        showLoading:(state) =>{    //showloading /hideloading => these are function in reducer or ACTIONS
            state.loading = true;  //initial state are changing
    },
    hideLoading: (state) =>{
        state.loading = false;
    },
},
});

export const{showLoading,hideLoading} = alertSlice.actions;