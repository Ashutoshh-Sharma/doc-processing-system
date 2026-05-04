import axios from "axios";

const BASE = "https://doc-processing-system-y8y1.onrender.com";

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,  
  });
};

export const getStatus = (id) => {
  return axios.get(`${BASE}/status/${id}`);
};

export const getDocuments = () => {
  return axios.get(`${BASE}/documents`);
};