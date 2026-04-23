import axios, { type AxiosRequestConfig, type AxiosRequestHeaders } from 'axios'
import { API_BASE_URL } from '@/config/apiBase'

const baseURL = API_BASE_URL

const Method = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
} as const

/**
 * 通用响应体
 * @template T 响应数据类型
 */
export interface CommonResponse<T> {
  code: number
  message: string
  data: T
}

interface RequestConfig {
  header?: AxiosRequestHeaders | Record<string, string>
  timeout?: number
}

function fetch<T>(
  fetchUrl: string,
  method: (typeof Method)[keyof typeof Method],
  params?: unknown,
  config?: RequestConfig,
): Promise<T> {
  const isGet = method === Method.GET
  const token = localStorage.getItem('token')

  const requestConfig: AxiosRequestConfig = {
    baseURL,
    url: fetchUrl,
    method,
    timeout: config?.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...config?.header,
    },
  }

  if (isGet) {
    requestConfig.params = {
      ...(params as Record<string, unknown> | undefined),
      _t: Date.now(),
    }
  } else {
    requestConfig.data = params
  }

  return axios<T>(requestConfig).then((response) => response.data)
}

export const get = <T>(url: string, params?: unknown, config?: RequestConfig): Promise<T> => {
  return fetch<T>(url, Method.GET, params, config)
}

export const post = <T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
  return fetch<T>(url, Method.POST, data, config)
}

export const del = <T>(url: string, params?: unknown, config?: RequestConfig): Promise<T> => {
  return fetch<T>(url, Method.DELETE, params, config)
}

/** 上传文件（FormData，不设置 Content-Type） */
export const postForm = <T>(url: string, data: FormData, config?: RequestConfig): Promise<T> => {
  const token =localStorage.getItem('token')
  return axios<T>({
    baseURL,
    url,
    method: 'POST',
    data,
    timeout: config?.timeout,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...config?.header,
    },
  }).then((res) => res.data)
}

const instance = {
  get,
  post,
  del,
  postForm,
}

export default instance
