//app.js
import { ApiConfig } from "apis/apiconfig.js";

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
  },
  globalData: {
    userInfo: null
  }
})