import { API_URL } from '../config/APIURL';

const baseHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Server Error: ${response.status} ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export const fetchHorses = async () => {
  const response = await fetch(`${API_URL}/get-farm`);
  return handleResponse(response);
};

export const addHorse = async (horseData) => {
  const response = await fetch(`${API_URL}/add-horse`, {
    method: 'POST',
    headers: baseHeaders,
    credentials: 'include',
    body: JSON.stringify(horseData),
  });
  return handleResponse(response);
};

export const updateHorse = async (id, horseData) => {
  const response = await fetch(`${API_URL}/mutate-horse/${id}`, {
    method: 'POST',
    headers: baseHeaders,
    credentials: 'include',
    body: JSON.stringify(horseData),
  });
  return handleResponse(response);
};

export const deleteHorse = async (id) => {
  const response = await fetch(`${API_URL}/glue-factory/${id}`, {
    method: 'POST',
    headers,
  });
  return handleResponse(response);
};
