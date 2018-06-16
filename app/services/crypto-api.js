import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  host: 'https://min-api.cryptocompare.com',

  // https://min-api.cryptocompare.com/data/price?fsym={coin}&tsyms=USD,EUR
  getCoinPrice(coin) {
    return this.request(`/data/price?fsym=${coin}&tsyms=USD,EUR`).then((response) => {
      return response.USD;
    }).catch(() => {
      return "ERR";
    })
  },

  getCurrentTimeStamp() {
    return parseInt((new Date().getTime() / 1000).toFixed(0));
  },

  getCurrentDateTime() {
    let ts = parseInt((new Date().getTime() / 1000).toFixed(0));
    let d = new Date(ts * 1000);
    return d.toLocaleString();
  },

  getSlowStochastics(currency) {
    return this.request(`/data/histohour?fsym=${currency}&tsym=USD&limit=15&aggregate=1`).then((response) => {
      let f1 = this.getFastStochastics(response.Data[15].open, response.Data.slice(2, 15));
      let f2 = this.getFastStochastics(response.Data[14].open, response.Data.slice(1, 14));
      let f3 = this.getFastStochastics(response.Data[13].open, response.Data.slice(0, 13));
      let slowStochastics = (f1 + f2 + f3) / 3;
      return slowStochastics.toFixed(0);
    }).catch(() => {
      return "ERR";
    })
  },

  getFastStochastics(currentPrice, data) {
    let highestHigh = 0;
    let lowestLow = 0;
    for (let point of data) {
      if (point.high > highestHigh) {
        highestHigh = point.high;
      }
      if (point.low < lowestLow || lowestLow == 0) {
        lowestLow = point.low;
      }
    }
    return ((currentPrice - lowestLow) / (highestHigh - lowestLow)) * 100;
  }

});
