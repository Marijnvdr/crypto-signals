import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let coinsInfo = [];
    let coins = ['BTC', 'LTC', 'NEO'];
    for (let coin of coins) {
      let stochasticsInfo1h = await this.get('ajax').getStochasticsInfo(coin, 1);
      let stochasticsInfo4h = await this.get('ajax').getStochasticsInfo(coin, 4);
      coinsInfo.push({ name: coin, stoch1h: stochasticsInfo1h, stoch4h: stochasticsInfo4h });
    }

    return hash({
      currencies: coinsInfo
    });
  }
});
