// pages/content/content.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    article: [],
    isMD: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.request.getMd(options.path).then(res=>{
      let isMd = options.path.search('.md') > 0;
      if (!isMd) {
        this.setData({code: res, isMD: isMd});
        return 
      }
      wx.showLoading({ title: '加载中…' });
      let data = app.towxml.toJson(res, 'markdown');
        data = app.towxml.initData(data, { base: 'https://xcs.fluobo.cn' + this.data.title + '/', app: this });
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