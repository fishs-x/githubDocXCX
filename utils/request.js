const HOST = 'https://xcs.fluobo.cn';
let DEFAULT_REQ = {url: "", data: {}, method: "GET", header: {'Content-Type': 'application/json'}};
const request = function (obj) {
    return new Promise(function (resolve, reject) {
        wx.showNavigationBarLoading();
        wx.request({
            url: HOST + obj.url,
            data: obj.data,
            method: obj.method,
            header: obj.header,
            success: function (data) {
                // 回调成功执行resolve
                if (data.data.code !== 200) {
                    wx.showToast({
                        "title": data.data.msg,
                        "icon": "none",
                    });
                }
                resolve(data);
            },
            fail: function (data) {
                // 回调失败时
                console.log(data);
            },
            complete: function (data) {
                wx.hideNavigationBarLoading();
            }
        })
    })
};

function get(url) {
    let req = DEFAULT_REQ;
    req.url = url;
    req.method = 'GET';
    req.header = { 'Content-Type': 'application/json' };
    return request(req).then(res => {
        return res.data.data;
    });
}

function post(url, data) {
    let req = DEFAULT_REQ;
    req.url = url;
    req.data = data;
    req.method = 'POST';
    req.header = { 'Content-Type': 'application/json' };
    return request(req).then(res => {
        return res.data.data;
    });
}

function getMd(url) {
    url = url[0] === '/' ? url : '/' + url;
    let req = DEFAULT_REQ;
    req.url = url;
    req.method = 'GET';
    req.header = {'Content-Type': 'text/markdown'};
    return request(req).then(res => {
        if (res.statusCode > 400) {
            wx.showToast({
                "title": '未找到文件',
                "icon": "none",
            });
            return false;
        }
        return res.data;
    });
}

function getFiles(path, dir) {
    let req = DEFAULT_REQ;
    req.url = '/api/v1/list/dir';
    req.method = 'POST';
    req.header = { 'Content-Type': 'application/json' };
    req.data = {path: path, dir:dir};
    return request(req).then(res=>{
        if (res.data.data.list.length === 0) {
            wx.showToast({
                "title": '文件为空',
                "icon": "none",
            });
            return false;
        }
        return res.data.data;
    });
}

module.exports = {
    get: get,
    post: post,
    getMd: getMd,
    getFiles: getFiles
};
