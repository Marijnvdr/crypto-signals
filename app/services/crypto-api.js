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
  }
});
