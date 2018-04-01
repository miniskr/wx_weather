const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取当前位置坐标
function getLocation(callback) {
    wx.getLocation({
        success: function(res) {
            callback(true, res.latitude, res.longitude);
        },
        fail: function(){
            callback(false);
        }
    })
}

//Reverse Geocoding 根据经纬度互殴去城市名称
function getCityName(latitude, longitude, callback) {
    let apiURL = "https://api.map.baidu.com/geocoder?output=json&location="+ latitude + "," + longitude + "&key=37492c0ee6f924cb5e934fa08c6b1676";
    wx.request({
        url: apiURL,
        success: function(res) {
            callback(res.data["result"]["addressComponent"]["city"]);
        }
    });
}

//获取指定位置的天气信息
function getWeatherByLocation(latitude, longitude, callback) {
    let apiKey = "b0cbc723415e4b848c3109bc962844c7";
    let apiURL = "https://free-api.heweather.com/s6/weather/forecast?key=" + apiKey + "&location=" + latitude + "," + longitude;
    
    wx.request({
        url: apiURL,
        success: function(res) {
            
            let weatherData = parseWeatherData(res.data);
            getCityName(latitude, longitude, function(city){
                weatherData.city = city;
                callback(weatherData);
            });
        }
    });
}

//解析天气数据
function parseWeatherData(data){
    let weather = {};
    weather["daily_forecast"] = data.HeWeather6[0]["daily_forecast"];
    weather["basic"] = data.HeWeather6[0]["basic"];
    return weather;
}

//加载天气数据
function requestWeatherData(cb) {
    
    getLocation(function(success, latitude, longitude){
        
        //如果 GPS 信息获取不成功， 设置一个默认坐标
        if(success == false){
            latitude = 30.28745842;
            longitude = 120.15357971;
        }

        //请求天气数据 API
        getWeatherByLocation(latitude, longitude, function(weatherData){
            
            cb(weatherData);
        });
    });
}

function loadWeatherData(callback) {
    
    requestWeatherData(function(data){
        
        let weatherData = {};
        weatherData = data;
        // weatherData.current.formattedDate = formatDate(data.current.time);
        // weatherData.current.formattedTime = formatTime(data.current.time);
        // weatherData.current.temperature = parseInt(weatherData.current.temperature);

        // var wantedDaily = [];
        // for (var i = 1; i < weatherData.daily.data.length; i++) {

        //     var wantedDailyItem = weatherData.daily.data[i];
        //     var time = weatherData.daily.data[i].time;
        //     wantedDailyItem["weekday"] = formatWeekday(time);
        //     wantedDailyItem["temperatureMin"] = parseInt(weatherData.daily.data[i]["temperatureMin"])
        //     wantedDailyItem["temperatureMax"] = parseInt(weatherData.daily.data[i]["temperatureMax"])

        //     wantedDaily.push(wantedDailyItem);

        // }

        // weatherData.daily.data = wantedDaily;
        callback(weatherData);

    });
}

module.exports = {
  formatTime: formatTime,
  loadWeatherData: loadWeatherData
}
