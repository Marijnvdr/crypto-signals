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

  getStochastics(currency, currentPrice) {
    return this.request(`/data/histohour?fsym=${currency}&tsym=USD&limit=24&aggregate=1`).then((response) => {
      let history = [];
      let highestHigh = 0;
      let lowestLow = 0;
      for (let point of response.Data) {
        if (point.high > highestHigh) {
          highestHigh = point.high;
        }
        if (point.low < lowestLow || lowestLow == 0) {
          lowestLow = point.low;
        }
        let d = new Date(point.time * 1000);
        history.push({ time: d.toLocaleString(), val: point.open, highest: highestHigh, lowest: lowestLow });
      }
      // stochastics: %K = ((current Close - Lowest Low) / (Highest High - Lowest Low)) * 100
      let stoch = ((currentPrice - lowestLow) / (highestHigh - lowestLow)) * 100;
      return stoch.toFixed(0);
    }).catch(() => {
      return "ERR";
    })
  }
});
