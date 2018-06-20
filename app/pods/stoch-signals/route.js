import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let coinsInfo = [];
    let coins = ['BTC', 'EOS', 'ETH', 'LTC', 'ETC', 'XRP', 'DSH', 'IOT', 'XMR', 'NEO', 'ZEC', 'OMG', 'BTG'];
    for (let coin of coins) {
      let stochasticsInfo1h = await this.get('ajax').getStochasticsInfo(coin, 1);
      let stochasticsInfo4h = await this.get('ajax').getStochasticsInfo(coin, 4);
      coinsInfo.push({ name: coin, stoch1h: stochasticsInfo1h, stoch4h: stochasticsInfo4h });
    }

    return hash({
      currenciesSignal4h: coinsInfo.filter((c) => c.stoch4h.warning),
      currenciesSignal1h: coinsInfo.filter((c) => c.stoch1h.warning),
      currenciesNeutral: coinsInfo.filter((c) => !c.stoch1h.warning && !c.stoch4h.warning)
    });
  }
});