import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adManagementApi from "@/services/apis/adManagement.api";

const initialState = {
  siteData: {
    tableData: [],
    meta: {},
  },
  loadingSiteData: true,
  listCategory: [],
  objectCategory: {},
};

export const SiteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setLoadingSiteData: (state, action) => {
      state.loadingSiteData = action.payload;
    },
    setSiteData: (state, action) => {
      const { tableData, meta } = action?.payload;
      state.siteData = {
        tableData,
        meta,
      };
    },
    setListCategory: (state, action) => {
      state.listCategory = action.payload;
    },
    setObjectCategory: (state, action) => {
      state.objectCategory = action.payload;
    },
  },
});

export const {
  setLoadingSiteData,
  setSiteData,
  setListCategory,
  setObjectCategory,
} = SiteSlice.actions;

export const fetchListSite = (params) => async (dispatch) => {
  dispatch(setLoadingSiteData(true));
  try {
    const _params = {
      page: -1,
      ...params,
    };
    const response = await adManagementApi.getListSite(_params);
    const { data, meta } = response || {};
    dispatch(
      setSiteData({
        tableData: data,
        meta,
      })
    );
  } catch (err) {
    throw new Error(err);
  }
  dispatch(setLoadingSiteData(false));
};

export const fetchListCategory = () => async (dispatch) => {
  try {
    const response = await adManagementApi.getListCategorie();
    const { data } = response || {};
    dispatch(setObjectCategory(data));
    let _listCategory = [];
    for (const [key, value] of Object.entries(data)) {
      _listCategory.push({
        key,
        value,
      });
    }
    dispatch(setListCategory(_listCategory));
  } catch (err) {
    throw new Error(err);
  }
};

export default SiteSlice.reducer;
