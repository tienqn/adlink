import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adManagementApi from "@/services/apis/adManagement.api";
import {_get} from "@/utils/common.js";

const initialState = {
  creativeData: {
    tableData: [],
    meta: {},
  },
  loadingCreativeData: true,
};

export const CreativeSlice = createSlice({
  name: "creative",
  initialState,
  reducers: {
    setLoadingCreativeData: (state, action) => {
      state.loadingCreativeData = action.payload;
    },
    setCreativeData: (state, action) => {
      const { tableData, meta } = action?.payload;
      state.creativeData = {
        tableData,
        meta,
      };
    },
  },
});

export const { setLoadingCreativeData, setCreativeData } =
  CreativeSlice.actions;

export const fetchListCreative = (params) => async (dispatch) => {
  dispatch(setLoadingCreativeData(true));
  try {
    const _params = {
      page: -1,
      includes: "lineItems,adUnits.site",
      ...params,
    };
    const response = await adManagementApi.getListCreative(_params);
    const { data, meta } = response || {};
    const _tableData = (data||[]).map(item => {
      const siteName =  _get(item, `adUnits.data.[0].site.data.domain`, '-');
      return {
        ...item,
        siteName
      }
    });
    dispatch(
      setCreativeData({
        tableData: _tableData,
        meta,
      })
    );
  } catch (err) {
    throw new Error(err);
  }
  dispatch(setLoadingCreativeData(false));
};

export default CreativeSlice.reducer;
