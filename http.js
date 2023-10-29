import axios from "axios";
// import Message from "@/utils/message.js";
// import router from "@/router";
// import store from "@/store";

let service = axios.create({
    baseURL: "",
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "https://api.siweiearth.com",
    },
});
service.defaults.headers.get["Content-Type"] = "application/x-www-form-urlencoded";

//删除重复请求
const pending = [];
const { CancelToken } = axios;
const removePending = (config) => {
    for (const p in pending) {
        if (pending[p].url === `${config.url}&${config.method}`) {
            pending[p].f();
            pending.splice(p, 1);
        }
    }
};

// request拦截器
service.interceptors.request.use(
    (config) => {
        // const { url } = config;

        //删除重复请求
        // if (!config.cancelRepeatedRequest) {
        removePending(config);
        config.cancelToken = new CancelToken((c) => {
            pending.push({ url: `${config.url}&${config.method}`, f: c });
        });
        // }

        //判断token是否存在
        // if (
        //   !url.includes("/auth/user/login")
        // ) {
        //   // const tokenObj = token.getToken();
        //   if (tokenObj) {
        //     config.headers["Authorization"] = tokenObj.access_token;
        //   } else {
        //     // 去登陆页
        //     router.replace({
        //       name: "userLogin",
        //     });
        //   }
        // }

        return config;
    },
    (error) => {
        throw new Error(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        // if (res.code === 401) {
        //     router.replace({
        //         name: "userLogin",
        //     });
        // }
        return res;
    },
    (e) => {
        httpErrorStatusHandle(e);
        throw new Error(e.message);
    }
);

function httpErrorStatusHandle(error) {
    let message = "";

    if (error && error.response) {
        const { response } = error;
        switch (response.status) {
            case 302:
                message = "接口重定向了！";
                break;
            case 400: {
                const {
                    data: { errmsg },
                } = response;
                message = errmsg || "参数不正确！";
                break;
            }
            case 401:
                message =
                    response.data && response.data.errmsg ? response.data.errmsg : "您未登录，或者登录已经超时，请先登录！";
                break;
            case 403:
                message = "您没有权限操作！";
                break;
            case 404:
                message = `请求地址出错: ${response.config.url}`;
                break;
            case 408:
                message = "请求超时！";
                break;
            case 409:
                message = "系统已存在相同数据！";
                break;
            case 500: {
                const {
                    data: { errmsg },
                } = response;
                message = errmsg || "服务器内部错误！";
                break;
            }
            case 501:
                message = "服务未实现！";
                break;
            case 502:
                message = "网关错误！";
                break;
            case 503:
                message = "服务不可用！";
                break;
            case 504:
                message = "服务暂时无法访问，请稍后再试！";
                break;
            case 505:
                message = "HTTP版本不受支持！";
                break;
            default:
                message = error.message ? error.message : "异常问题，请联系管理员！";
                break;
        }
    }
    if (error.message.includes("timeout")) message = "网络请求超时！";
    if (error.message.includes("Network")) message = window.navigator.onLine ? "服务端异常！" : "您断网了！";

    Message({
        message: message,
        type: "error",
        duration: 5000,
        showClose: true,
        offset: 80,
    });
}

export default service;




//使用示例
// export function get(params) {
//     return service({
//         method: "get",
//         url: `${baseUrl}/work-order/pushedMessage/list`,
//         params: params,
//     });
// }
// export function get1(sceneId) {
//     const url = `${BASE_URL_SCENE}/video/scene/simulate/process/list/${sceneId}`;
//     return service.get(url);
// }


// export function post(data) {
//     const url = `${BASE_URL_SCENE}/video/scene/simulate/trajectory/generation`;
//     return service.post(url, data);
// }
// export function post1(params) {
//     return service({
//         method: "post",
//         url: `${baseUrl}/work-order/pushedMessage/update/list`,
//         data: params,
//     });
// }



