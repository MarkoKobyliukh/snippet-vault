import axios from 'axios';
import { PaginatedResponse, Snippet, SnippetFormData } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface GetSnippetsParams {
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export function getSnippets(params?: GetSnippetsParams): Promise<PaginatedResponse> {
  return api.get('/snippets', { params }).then((r) => r.data);
}

export function getSnippet(id: string): Promise<Snippet> {
  return api.get(`/snippets/${id}`).then((r) => r.data);
}

export function createSnippet(data: Omit<SnippetFormData, 'tags'> & { tags: string[] }): Promise<Snippet> {
  return api.post('/snippets', data).then((r) => r.data);
}

export function updateSnippet(id: string, data: Partial<Omit<SnippetFormData, 'tags'> & { tags: string[] }>): Promise<Snippet> {
  return api.patch(`/snippets/${id}`, data).then((r) => r.data);
}

export function deleteSnippet(id: string): Promise<void> {
  return api.delete(`/snippets/${id}`).then(() => undefined);
}
