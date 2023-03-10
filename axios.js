//axios请求方法整理

//content-type
//1、application/x-www-form-urlencoded    //键值对形式  请求参数以key1=value1&key2=value2
//2、application/json                     //json字符串  {name:李四，age:20}
//3、text/plain                           //纯文本格式
//4、multipart/form-data
//表单中上传文件  随机生成了一个boundary字段，这个boundary用来分割不同的字段。一个请求的参数，会以boundary开始，然后是附加信息(参数名称，文件路径等)，再空一行，最后是参数的内容。请求体最后再以boundary结束。
//当然，response中也会有Content-Type为multipart/form-data的响应头。如果此时是导出文件，则响应头还需要添加一个
//Content-Disposition:attachment;fileName=文件.后缀
//注：Content-Disposition是Content-Type的扩展，告诉浏览器弹窗下载框，而不是直接在浏览器里展示文件。因为一般浏览器对于它能够处理的文件类型，如txt，pdf 等，它都是直接打开展示，而不是弹窗下载框。


//GET方法相关
axios.get('/user?ID=12345')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
// 上面的请求也可以这样做
axios.get('/user', {
    params: {
        ID: 12345
    }
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
//或者
axios({
    method: 'get',
    url: '/user/12345',
    params: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
});


//POST方法相关
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
//或者
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
});



//执行多个请求相关
function getUserAccount() {
    return axios.get('/user/12345');
}
function getUserPermissions() {
    return axios.get('/user/12345/permissions');
}
//所有请求都返回后才then
axios.all([getUserAccount(), getUserPermissions()])
    .then(axios.spread(function (res1, res2) {
        // 两个请求现在都执行完成
    }));
