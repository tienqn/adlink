import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adManagementApi from "@/services/apis/adManagement.api";
import {dispatch} from "../../Store.js";

const initialState = {
  adUnitData: {
    tableData: [],
    meta: {},
  },
  loadingAdUnitData: true,

  listAdUnit: [],

  currentAdUnitDetails: {},
};

export const AdUnitSlice = createSlice({
  name: "adUnit",
  initialState,
  reducers: {
    setLoadingAdUnitData: (state, action) => {
      state.loadingAdUnitData = action.payload;
    },
    setAdUnitData: (state, action) => {
      const { tableData, meta } = action?.payload;
      state.adUnitData = {
        tableData,
        meta,
      };
    },

    setCurrentAdUnitDetails: (state, action) => {
      state.currentAdUnitDetails = {
       ...action?.payload
      };
    },



  },
});

export const { setLoadingAdUnitData, setAdUnitData,setCurrentAdUnitDetails } = AdUnitSlice.actions;

export const fetchListAdUnit = (params) => async (dispatch) => {
  dispatch(setLoadingAdUnitData(true));
  try {
    const _params = {
      page: -1,
      ...params,
    };
    const response = await adManagementApi.getListAdUnit(_params);
    const { data, meta } = response || {};
    dispatch(
      setAdUnitData({
        tableData: data,
        meta,
      })
    );
  } catch (err) {
    throw new Error(err);
  }
  dispatch(setLoadingAdUnitData(false));
};

export const fetchAdUnitDetails = (adUnitId) => async (dispatch) => {
  // dispatch(setLoadingAdUnitData(true));
  try {
    const response = await adManagementApi.getAdUnitDetails(adUnitId, {
      includes: "creatives",
    });
    dispatch(setCurrentAdUnitDetails(response?.data||{}))
  } catch (err) {
    throw new Error(err);
  }
  // dispatch(setLoadingAdUnitData(false));
};



export default AdUnitSlice.reducer;
