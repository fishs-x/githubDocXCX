// pages/markdown/markdown.js
const app = getApp();
const urlJs = require('url-js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBack: false,
    fiels: [],
    title: '',
    dir: true,
    author: '',
    article: [],
    lock: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.title = options.title;
    this.data.author = options.author;
    this.data.dir = Boolean(options.dir);
    this.getdirList(options.url, options.dir, true);
    this['event_bind_touchstart'] = (event) => {
      this.onClickHref(event);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  isLock: function(url) {
    if (!url || this.data.lock[url]) {
      return true;
    }
    let that = this;
    this.data.lock[url] = true;
    // 500ms 解锁
    setTimeout(function () {
      that.data.lock[url] = false;
    }, 500);
    return false;
  },

  isSupport: function(url) {
    let msg = '';
    // 判断是否为锚点
    if (url[0] === '#') {
      msg = '不支持锚点';
    }
    if (msg !== '') {
      console.log(msg, '2222')
      wx.showToast({
        "title": msg,
        "icon": "none",
      });
      return false;
    }
    return true;
  },
  /**
   * 点击跳转页面
   * 跳转markdown 路径发现三种情况
   * 1. 路径带作者与项目名称的
   * 2. url 是相对路径的
   */
  onClickHref: function (e) {
    let url = e.target.dataset._el.attr.href;
    if(this.isLock(url)) {
      return
    }
    if (!this.isSupport(url)) {
      return
    }

    if (url.indexOf('http') < 0) {
      if (url.indexOf(this.data.title) < 0) {
        url = this.data.title + '/' + url;
      }
      url = 'https://' + url;
    }
    let urlObj = urlJs(url);

    if (urlObj.domain !== this.data.title && urlObj.domain != 'github.com') {
      this.clientCopy(urlObj.href);
      return;
    } else if (urlObj.domain === this.data.title) {
      urlObj.path = '/' + urlObj.domain + urlObj.path;
    } else if (urlObj.path.indexOf(this.data.author) > 0) {
      urlObj.path = urlObj.path.substr(this.data.author.length + urlObj.path.indexOf(this.data.author));
    }

    app.request.post('/api/v1/select/file', {path: urlObj.path.split('/').reverse(), title: this.data.title}).then(res=>{
      if (!res.path) {
        wx.showToast({
          "title": '未找到文件',
          "icon": "none",
        });
        return 
      }
      if (res.is_dir) {
        this.getdirList(res.path, res.is_dir, true);
      } else {
        wx.navigateTo({
          url: "/pages/content/content?path=" + res.path,
        });
      }
    });
  },

  /**
   * 目录文件详情
   * @param {*} e 
   */
  onClickFile: function(e) {
    let data = e.target.dataset;
    if (data.dir) {
      this.getdirList(data.path, data.dir, true);
    } else {
      if (data.path.search('.md') < 0) {
        wx.navigateTo({
          url: "/pages/content/content?path=" + data.path,
        });
      } else {
        this.getMd(data.path);
      }
    }
  },
  goBack: function(e) {
    let path = this.data.fiels[0].path;
    let pathArr = path.split('/').slice(0, -2);
    path = pathArr.join('/');
    this.getdirList(path, true, true);
  },
  /**
   * 点击复制
   */
  clientCopy: function (data) {
    wx.setClipboardData({
      data: data
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.lock = {}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getMd: function (url) {
    app.request.getMd(url).then(res => {
      if (!res) {
        return
      }
      wx.showLoading({ title: '加载中…' });
      if (typeof(res) === 'object') {
        res = JSON.stringify(res);
      }
      let data = app.towxml.toJson(res, 'markdown');
      data = app.towxml.initData(data, { base: 'https://xcs.fluobo.cn' +  this.data.title + '/', app: this });
      if (!data.child) {
        data.child = []
      }
      for (let i = 0; i < Math.ceil(data.child.length / 130); i++) {
        let s = i * 130;
        let e = s + 130;
        let node = {child: data.child.slice(s, e), node: data.node, id: data.id, theme: data.theme}
        let fild = 'article['+i+']'
        this.setData({[fild]: node})
        // break;
      }
      wx.hideLoading();
    });
  },

  /**
   * 
   * @param {string} path 请求路径
   * @param {boolean} dir 是否为目录
   * @param {boolean} first 是否为onLoad调用
   */
  getdirList: function(path, dir, first=false) {
    if (path[0] !== '/') {
      path = '/' + path;
    }
    app.request.getFiles(path, dir).then(res => {
      if (!res) {
        return;
      }
      let haveReadme = false;
      if (first) {
        res.list.forEach(element => {
          if (element.file_name.toUpperCase()==='README.MD'){
            haveReadme = true;
            this.getMd(path+"/"+element.file_name);          
          }
        });
      }
      let showBack = false;
      if (res.list.length>0) {
        let path = res.list[0].path;
        if (path.split('/').length > 3) {
          showBack = true;
        }
      }
      this.setData(haveReadme ? {fiels: res.list, showBack: showBack} : {fiels: res.list, article: {}, showBack: showBack})
    });
  },
})