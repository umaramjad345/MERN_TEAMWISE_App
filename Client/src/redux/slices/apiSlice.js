import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.API_BASE_URL;

// console.log(API_URI);

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
