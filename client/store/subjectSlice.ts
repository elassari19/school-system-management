import { createSlice } from '@reduxjs/toolkit';

const inititalState = {
  subjects: [],
  loading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: 'subject',
  initialState: inititalState,
  reducers: {
    fetchSubjects(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSubjectsSuccess(state, action) {
      state.subjects = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSubjectsError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  selectors: {
    selectSubjects: (state) => state.subjects,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
  },
});

export const { fetchSubjects, fetchSubjectsSuccess, fetchSubjectsError } =
  subjectSlice.actions;

export default subjectSlice.reducer;

export const { selectSubjects, selectLoading, selectError } =
  subjectSlice.selectors;
