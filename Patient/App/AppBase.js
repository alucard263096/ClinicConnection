export class AppBase{
  app=null;
  options=null;
  data={};
  Page=null;
  constructor(){
    this.app=getApp();
    this.me=this;
  }
  generateBodyJson(){
    var base=this;
    return {
      Base:base,
      /**
       * 页面的初始数据
       */
      data: base.data,
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: base.onLoad,

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: base.onReady,

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: base.onShow,

      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: base.onHide,

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: base.onUnload,

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh: base.onPullDownRefresh,

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: base.onReachBottom,

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: base.onShareAppMessage
    }
  }
  log(){
    console.log("yeah!");
  }
  onLoad(options){
    this.options=options;
    console.log(this);
    console.log("onload");
  }
  onReady() {
    console.log("onReady");
  }
  onShow() {
    console.log("onShow");
  }
  onHide(){
    console.log("onHide");
  }
  onUnload() {
    console.log("onUnload");
  } 
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
  }
  onReachBottom() {
    console.log("onReachBottom");
  }
  onShareAppMessage() {
    console.log("onShareAppMessage");
  }
  setMyData(obj){
    console.log(this.Page);
    this.Page.setData(obj);
  }
} 