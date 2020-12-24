import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import { getToken, removeToken } from "@/utils/token";
import { Modal } from "ant-design-vue";
import { Message, Notification } from "@/utils/resetMessage";
import router from "@/router";

// create an axios instance
const service: AxiosInstance = axios.create({
  baseURL: "/api", // 正式环境
  timeout: 60 * 1000,
  headers: {}
})

/**
 * 请求拦截
 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.common["Authorization"] = getToken(); // 请求头带上token
  config.headers.common["token"] = getToken();
  return config;
},
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
service.interceptors.response.use((response: AxiosResponse) => {
  if (response.status == 201 || response.status == 200) {
    let { code, status, msg } = response.data;
    if (code == 401) {
      Modal.warning({
        title: "token出错",
        content: "token失效，请重新登录！",
        onOk: () => {
          removeToken();
          router.push("/login");
        }
      });
    } else if (code == 200) {
      if (status) {
        //接口请求成功
        msg && Message.success(msg); //后台如果返回了msg，则将msg提示出来
        return Promise.resolve(response.data); //返回成功数据
      } else {
        //接口异常
        msg && Message.warning(msg); //后台如果返回了msg，则将msg提示出来
        return Promise.reject(response.data); //返回异常数据
      }
    } else {
      //接口异常
      msg && Message.error(msg);
      return Promise.reject(response.data);
    }
  }
  return response;
},
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          Notification.error({
            message: "温馨提示",
            description: "服务异常，请重启服务器！"
          });
          break;
        case 401:
          Notification.error({
            message: "温馨提示",
            description: "服务异常，请重启服务器！"
          });
          break;
        case 403:
          Notification.error({
            message: "温馨提示",
            description: "服务异常，请重启服务器！"
          });
          break;
        // 404请求不存在
        case 404:
          Notification.error({
            message: "温馨提示",
            description: "服务异常，请重启服务器！"
          });
          break;
        default:
          Notification.error({
            message: "温馨提示",
            description: "服务异常，请重启服务器！"
          });
      }
    }
    return Promise.reject(error.response);
  }
);

export default service