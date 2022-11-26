import axiosClient from "../axiosClient";

export const getDepartmentHierarchy = () => {
  return axiosClient.get("/department_hierarchy");
};

export const updateDepartmentHierarchy = (id, payload) => {
  return axiosClient.put(`/department_hierarchy?id=${id}`, payload);
};

export const addDepartment = (payload) => {
  return axiosClient.post(`/department_hierarchy`, payload);
};
