import { apiSlice } from "../apiSlice";

const AUTH_URL = "/user";
const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
  reducerPath: apiSlice.reducer,
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getTeam: builder.query({
      query: (data) => ({
        url: `${AUTH_URL}/get-team`,
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${AUTH_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    userAction: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getNotifications: builder.query({
      query: (data) => ({
        url: `${AUTH_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),
    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/read-noti?isReadType=${data?.type}&id=${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetTeamQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useChangePasswordMutation,
} = userApiSlice;
