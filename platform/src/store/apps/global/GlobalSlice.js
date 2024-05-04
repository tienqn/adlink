import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adManagementApi from "@/services/apis/adManagement.api";

const initialState = {
  listSite: [],
  listCategory: [],
  objectCategory: {},
};

export const GlobalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setListSite: (state, action) => {
      state.listSite = action.payload;
    },
    setListCategory: (state, action) => {
      state.listCategory = action.payload;
    },
    setObjectCategory: (state, action) => {
      state.objectCategory = action.payload;
    },
  },
});

export const { setListSite, setListCategory, setObjectCategory } =
  GlobalSlice.actions;

export const fetchListSite =
  (params = {}) =>
  async (dispatch) => {
    try {
      const _params = {
        page: -1,
        ...params,
      };
      const response = await adManagementApi.getListSite(_params);
      const { data, meta } = response || {};
      dispatch(setListSite(data));
    } catch (err) {
      throw new Error(err);
    }
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

export default GlobalSlice.reducer;
