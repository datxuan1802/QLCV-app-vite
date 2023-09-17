import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5556/api/v1";
const request = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: {
    Accept: "application/json",
  },
});
request.interceptors.request.use(async (config: any) => {
  const customHeaders: any = {};
  const auth: any = localStorage.getItem("auth");
  console.log(auth);
  //   const accessToken = JSON.parse(auth);
  if (auth) {
    customHeaders.authorization = `Bearer ${auth}`;
  }
  console.log("run interceptor");

  return {
    ...config,
    headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
});
request.interceptors.response.use(
  (response) => {
    // Handle response data here
    return response;
  },
  (error) => {
    // Handle response error here
    console.log(error);
    return Promise.reject(error);
  }
);
async function get(url: string) {
  try {
    const { data, status } = await request.get(url);

    // console.log(JSON.stringify(data, null, 4));

    // 👇️ "response status is: 200"
    console.log("response status is: ", status);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
async function post(url: string, params: any) {
  try {
    const { data, status } = await request.post(url, params);

    // 👇️ "response status is: 200"
    console.log("response status is: ", status);
    // 👇️ "data response"

    console.log(JSON.stringify(data, null, 4));

    return data;
  } catch (error: any) {
    console.log(error.message);
    // TODO: cần kiểm tra lại
    throw new Error(error.message);
  }
}
export { get, post };
export default request;
