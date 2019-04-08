// pages/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    docs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request.get('/api/v1/doc/list').then(res => {
      this.setData({
        docs: res.list
      });
    });
  },
  /**
   * 进入文档详情
   */
  inDetails: function (e) {
    let title = e.currentTarget.dataset.title;
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "/pages/markdown/markdown?title="+title+"&url="+url
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})