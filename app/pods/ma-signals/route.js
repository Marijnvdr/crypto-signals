import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let coinsInfo = [];
    let coins = ['BTC', 'EOS', 'ETH', 'LTC', 'ETC', 'XRP', 'DASH', 'IOT', 'XMR', 'NEO', 'ZEC', 'OMG', 'BTG'];
    for (let coin of coins) {
      let maInfo4h = await this.get('ajax').getMovingAverage(coin, 4, 21);
      let priceYesterday = await this.get('ajax').getPriceYesterday(coin);
      let priceCurrent = await this.get('ajax').getCoinPrice(coin);
      let prc = (((priceCurrent - maInfo4h) / maInfo4h) * 100).toFixed(1);
      coinsInfo.push({ name: coin, ma: maInfo4h, priceCurrent: priceCurrent, priceYesterday: priceYesterday, prc: prc });
    }

    return hash({
      currenciesBuySignal4h: coinsInfo.filter((c) => c.priceCurrent > c.ma && c.priceYesterday < c.ma),
      currenciesSellSignal4h: coinsInfo.filter((c) => c.priceCurrent < c.ma && c.priceYesterday > c.ma),
      currenciesAbove21MA: coinsInfo.filter((c) => c.priceCurrent > c.ma && c.priceYesterday > c.ma),
      currenciesBelow21MA: coinsInfo.filter((c) => c.priceCurrent < c.ma && c.priceYesterday < c.ma)
    });
  }
});
