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
      coinsInfo.push({ name: coin, ma: maInfo4h });
    }

    return hash({
      currenciesSignal4h: coinsInfo
    });
  }
});
