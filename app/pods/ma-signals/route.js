import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let coinsInfo = [];
    let coinsBitfinexShortable = ['BTC', 'EOS', 'ETH', 'LTC', 'ETC', 'XRP', 'DASH', 'IOT', 'XMR', 'NEO', 'ZEC', 'OMG', 'BTG'];

    let coins = ['ADA', 'AION', 'ARK', 'BNB', 'BTC', 'BTCP', 'BTG', 'CLOAK', 'DASH', 'EOS', 'ETC', 'ETH', 'GAS', 'HT', 'ICX', 'IOT', 'KCS',
                 'LSK', 'LTC', 'NANO', 'NEO', 'OMG', 'QTUM', 'STRAT', 'TRX', 'VEN', 'XLM', 'XMR', 'XRP', 'ZEC', 'ZIL'];
    for (let coin of coins) {
      let maInfo4h = await this.get('ajax').getMovingAverage(coin, 4, 21);
      let priceYesterday = await this.get('ajax').getPriceYesterday(coin);
      let priceCurrent = await this.get('ajax').getCoinPrice(coin);
      let prc = (((priceCurrent - maInfo4h) / maInfo4h) * 100).toFixed(1);
      let isShortable = coinsBitfinexShortable.indexOf(coin) > -1;
      coinsInfo.push({ name: coin, ma: maInfo4h, priceCurrent: priceCurrent, priceYesterday: priceYesterday, prc: prc, isShortable: isShortable });
    }

    return hash({
      currenciesBuySignal4h: coinsInfo.filter((c) => c.priceCurrent > c.ma && c.priceYesterday < c.ma),
      currenciesSellSignal4h: coinsInfo.filter((c) => c.priceCurrent < c.ma && c.priceYesterday > c.ma),
      currenciesAbove21MA: coinsInfo.filter((c) => c.priceCurrent >= c.ma),
      currenciesBelow21MA: coinsInfo.filter((c) => c.priceCurrent < c.ma)
    });
  }
});
