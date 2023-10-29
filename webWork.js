//简介(多线程操作，防止阻塞页面卡死)
// 浏览器的js脚本运行一直都是单线程运行的，所以我们不需要考虑多线程同步加锁这种情况。但是当我们需要做一些比较耗时的计算时候如果还放在这个单线程里面，可以想象页面会卡主。
// 其实浏览器也是支持多线程运行的叫做web workers。通过web workers可以把耗时的计算放在非主线程里面。从而充分发挥电脑的性能。


//work.js(一个单独的文件)
onmessage = ({ data: { question } }) => {
    // 在这里处理计算量大的逻辑
    //
    //
    postMessage({
        answer: question
    });
};
onerror = (event) => {
    console.log(event.message);
}


//使用相关
// let worker = new Worker('./worker.js');// 初始化worker组件
// worker.onmessage = ({ data: { answer } }) => {//接收消息
//     计算完毕之后，将还给主线程处理
// };

// worker.onerror = (event) => {  //异常捕获
//     console.log(event.message);
// };

// worker.postMessage({//推送消息
//     question: data
// });

// //销毁
// if (worker) {
//     worker.terminate();
//     worker = null;
// }