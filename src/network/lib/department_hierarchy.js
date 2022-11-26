import axiosClient from "../axiosClient";

export const getDepartmentHierarchy = () => {
  return axiosClient.get("/dep");
};

export const updateDepartmentHierarchy = (id, payload) => {
  return axiosClient.put(`/dep/${id}`, payload);
};

export const addDepartment = (payload) => {
  return axiosClient.post("/dep", payload);
};
