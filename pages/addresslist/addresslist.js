Page({
  data: {
    searchInputShowed: false,
    searchInputVal: ""
  },
  showSearchInput: function () {
    this.setData({
      searchInputShowed: true
    });
  },
  hideSearchInput: function () {
    this.setData({
      searchInputVal: "",
      searchInputShowed: false
    });
  },
  clearSearchInput: function () {
    this.setData({
      searchInputVal: ""
    });
  },
  inputSearchTyping: function (e) {
    this.setData({
      searchInputVal: e.detail.value
    });
  }
});