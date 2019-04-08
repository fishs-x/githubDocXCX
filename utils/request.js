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
        return res.data;
    });
}

module.exports = {
    get: get,
    getMd: getMd
};
