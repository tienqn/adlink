import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import studentManagementApi from "@/services/apis/studentManagement.api";

const initialState = {
  studentData: {
    tableData: [],
    meta: {},
  },
  loadingStudentData: true,
  listStudent: [],
};

export const StudentSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setLoadingStudentData: (state, action) => {
      state.loadingStudentData = action.payload;
    },
    setStudentData: (state, action) => {
      const { tableData, meta } = action?.payload;
      state.studentData = {
        tableData,
        meta,
      };
    },
    setListStudent: (state, action) => {
      state.listStudent = action.payload;
    },
  },
});

export const {
  setLoadingStudentData,
  setStudentData,
  setListStudent,
} = StudentSlice.actions;

export const fetchListStudent = () => async (dispatch) => {
  dispatch(setLoadingStudentData(true));
  try {
    const response = await studentManagementApi.getListStudent();
    console.log(response);
  } catch (err) {
    throw new Error(err);
  }
  dispatch(setLoadingStudentData(false));
};

export default StudentSlice.reducer;
