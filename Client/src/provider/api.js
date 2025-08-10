// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://whatsappapi.trixofly.com/api',
});

export const fetchChats = () => API.get('/chats');
export const fetchMessages = (wa_id) => API.get(`/messages/${wa_id}`);
export const sendMessage = (wa_id, text) =>
  API.post('/messages', { wa_id, text });
