//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.loadWeatherData(function(data){
        console.log(data);
        that.setData({
            weather: data
        });
        // that.data.weather = data;
    });
  }
  
})
