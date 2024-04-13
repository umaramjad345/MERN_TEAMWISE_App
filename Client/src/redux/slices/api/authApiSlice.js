import { apiSlice } from "../apiSlice.js";

const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
  reducerPath: apiSlice.reducer,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authApiSlice;
