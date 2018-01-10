export class ApiConfig{
  static GetApiUrl() {
    return "https://cmsdev.app-link.org/alucard263096/hss/api/";
  }
  static GetUploadPath() {
    return "https://cmsdev.app-link.org/alucard263096/hss/upload/";
  }
  static GetFileUploadAPI() {
    return "https://cmsdev.app-link.org/alucard263096/hss/fileupload";
  }
  static GetHeader(){
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'UNICODE': ApiConfig.UNICODE
    };
    return headers;
  }
  static UNICODE="";
  static SetUnicode(unicode){
    ApiConfig.UNICODE=unicode;
  }

  static showLoadingCounter = 0;
  static ShowLoading = function () {
    if (ApiConfig.showLoadingCounter == 0) {
      wx.showLoading({
        title: '加载中',
      });
    }
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter + 1;
  }

  static CloseLoading = function () {
    ApiConfig.showLoadingCounter = ApiConfig.showLoadingCounter - 1;
    if (ApiConfig.showLoadingCounter == 0) {
      console.log(ApiConfig.showLoadingCounter);
      wx.hideLoading();
    }
  }




}