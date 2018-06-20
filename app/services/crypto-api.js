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

  getMovingAverage(currency, hours, candleCount) {
    return this.request(`/data/histohour?fsym=${currency}&tsym=USD&limit=${candleCount - 1}&aggregate=${hours}`).then((response) => {
      let total = 0;
      let count = 0;
      for (let candle of response.Data) {
        total += candle.open;
        count++;
      }
      if (count > 0) {
        return (total / count).toFixed(4);
      } else {
        return "no data";
      }
    }).catch(() => {
      return "ERR";
    })
  },

  getStochasticsInfo(currency, hours) {
    return this.request(`/data/histohour?fsym=${currency}&tsym=USD&limit=17&aggregate=${hours}`).then((response) => {
      let oldest = this.getSlowStochastics(currency, response.Data.slice(0, 16));
      let middle = this.getSlowStochastics(currency, response.Data.slice(1, 17));
      let newest = this.getSlowStochastics(currency, response.Data.slice(2, 18));
      let warning = '';
      if (oldest > middle && middle > newest && oldest > 80 && middle > 80 && newest > 75 && newest < 80) {
        warning = `Overbought in ${hours}h chart`;
      }
      if (oldest < middle && middle < newest && oldest < 20 && middle < 20 && newest < 25 && newest > 20) {
        warning = `Oversold in ${hours}h chart`;
      }
      let timeOldest = new Date(response.Data[15].time * 1000).getHours();
      let timeMiddle = new Date(response.Data[16].time * 1000).getHours();
      let timeNewest = new Date(response.Data[17].time * 1000).getHours();
      let times = `(${timeOldest}h/${timeMiddle}h/${timeNewest}h)`;
      let values = `${oldest}/${middle}/${newest}`;
      return { warning: warning, stoch: { valuesInfo: values, timesInfo: times } };
    }).catch(() => {
      return "ERR";
    })
  },

  getSlowStochastics(currency, data) {
    let f1 = this.getFastStochastics(data[15].open, data.slice(2, 16));
    let f2 = this.getFastStochastics(data[14].open, data.slice(1, 15));
    let f3 = this.getFastStochastics(data[13].open, data.slice(0, 14));
    let slowStochastics = (f1 + f2 + f3) / 3;
    return slowStochastics.toFixed(0);
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
