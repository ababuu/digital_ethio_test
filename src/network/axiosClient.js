import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://6380be98786e112fe1b8bdfb.mockapi.io/digitalEthioTest",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default axiosClient;
