import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import systemApi from "@/services/apis/system.api";
import authApi from "@/services/apis/auth.api";
import {setCreativeData, setLoadingCreativeData} from "../ad-management/CreativeSlice.js";

const initialState = {
  userData: {
    tableData: [],
    meta: {},
  },
  loadingUserData: true,

  listRole: [],
  activeRole: null,
  renderPermission: [],
  listAllPermission: [],

  listUser: [],

  userProfile: {},
  loadingUserProfile: 'loading',
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {

    setLoadingUserData: (state, action) => {
      state.loadingUserData = action.payload;
    },
    setUserData: (state, action) => {
      const { tableData, meta } = action?.payload;
      state.userData = {
        tableData,
        meta,
      };
    },

    setListRole: (state, action) => {
      state.listRole = action.payload;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    setRenderPermission: (state, action) => {
      state.renderPermission = action.payload;
    },
    setListAllPermission: (state, action) => {
      state.listAllPermission = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchListRole.pending, (state) => {
        // state.loadingUserProfile = "loading";
      })
      .addCase(fetchListRole.fulfilled, (state, action) => {
        state.listRole = action.payload;
      })
      .addCase(fetchListRole.rejected, (state) => {
        // state.loadingUserProfile = "failed";
      })

      .addCase(fetchListPermission.pending, (state) => {
        // state.loadingUserProfile = "loading";
      })
      .addCase(fetchListPermission.fulfilled, (state, action) => {
        state.listAllPermission = action.payload;
      })
      .addCase(fetchListPermission.rejected, (state) => {
        // state.loadingUserProfile = "failed";
      })

        .addCase(fetchUserProfile.pending, (state) => {
          state.loadingUserProfile = 'loading';
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.loadingUserProfile = 'idle';
          state.userProfile = {
            ...action.payload,
          };
        })
        .addCase(fetchUserProfile.rejected, (state) => {
          state.loadingUserProfile = 'failed';
        });
  },
});

export const fetchListUser = (params) => async (dispatch) => {
  dispatch(setLoadingUserData(true));
  try {
    const _params = {
      page: -1,
      ...params,
    };
    const response = await systemApi.getListUser(_params);
    const { data, meta } = response || {};
    dispatch(
        setUserData({
          tableData: data,
          meta,
        })
    );
  } catch (err) {
    throw new Error(err);
  }
  dispatch(setLoadingUserData(false));
};

export const fetchListRole = createAsyncThunk(
  "system/fetchListRole",
  // if you type your function argument here
  async () => {
    const response = await systemApi.getListRole();
    const { data } = response || {};
    return data;
  }
);

export const fetchListPermission = createAsyncThunk(
  "system/fetchListPermission",
  // if you type your function argument here
  async () => {
    const response = await systemApi.getListPermission();
    const { data } = response || {};
    return data;
  }
);

export const fetchUserProfile = createAsyncThunk(
    'system/fetchUserProfile',
    // if you type your function argument here
    async () => {
      const response = await authApi.getProfile({
        includes: "roles"
      });
      const data = response?.data || {};
      return data;
    },
);


// Action creators are generated for each case reducer function
export const {
  setLoadingUserData,

  setListRole,
  setUserData,
  setActiveRole,
  setRenderPermission,
  setListAllPermission,
} = systemSlice.actions;

export default systemSlice.reducer;
