// pages/markdown/markdown.js
const app = getApp();
const urlJs = require('url-js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    article: {},
    lock: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.title = options.title;
    this.getMd(options.url);
    this['event_bind_touchstart'] = (event) => {
      this.onClickHref(event);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 点击跳转页面
   */
  onClickHref: function (e) {
    let url = e.target.dataset._el.attr.href;
    let DistrUrl = url;
    console.log('befor', url);
    // 判断url是否存在
    if (!url || this.data.lock[DistrUrl]) {
      console.log('被锁了');
      return;
    }
    // 加锁
    let that = this;
    this.data.lock[DistrUrl] = true;
    // 500ms 解锁
    setTimeout(function () {
      that.data.lock[DistrUrl] = false;
    }, 500);

    let msg = '';
    // 判断是否为锚点
    if (url[0] === '#') {
      msg = '不支持锚点';
    }
    if (msg !== '') {
      wx.showToast({
        "title": msg,
        "icon": "none",
      });
      return;
    }
    if (url.indexOf('http') < 0) {
      if (url.indexOf(this.data.title) < 0) {
        url = this.data.title + '/' + url;
      }
      url = 'https://' + url;
    }

    let urlObj = urlJs(url);
    console.log('after', urlObj);
    if (urlObj.domain !== that.data.title && urlObj.domain != 'github.com') {
      this.clientCopy(urlObj.href);
      return;
    } else if (urlObj.domain === that.data.title) {
      urlObj.path = '/' + urlObj.domain + urlObj.path;
    }
    console.log(urlObj, 'xxx');

    // TODO 图片加载路径不正确、作者目录加到mysql
    // 目录太深找不到问题
    // let splNum = url.lastIndexOf('\/');
    // this.data.title += url.substr(0, splNum);
    // url = url.substr(splNum);
    // 跳转 
    // TODO notes/%E6%B5%B7%E9%87%8F%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86.md 中的nodes需要天津到title中
    // wx.navigateTo({
    //   url: "/pages/markdown/markdown?title="+this.data.title+"&url="+url
    // });
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
    app.request.getMd(this.data.title + url).then(res => {
      if (res.length >= 1048576) {
        res = res.substr(0, 1048576);
      }
      wx.showLoading({ title: '加载中…' });
      let data = app.towxml.toJson(res, 'markdown');
      data = app.towxml.initData(data, { base: 'https://xcs.fluobo.cn' + this.data.title + '/', app: this });
      wx.hideLoading()
      this.setData({ article: data, });
    });
  }
})