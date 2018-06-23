import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let coinsInfo = [];
    let coinsBitfinexShortable = ['BTC', 'BTG', 'DSH','EOS', 'ETC', 'ETH', 'IOT', 'LTC', 'NEO', 'OMG', 'XMR', 'XRP', 'ZEC'];

    let coins = ['ADA', 'AION', 'ARK', 'BNB', 'BTC', 'BTG', 'CLOAK', 'DASH', 'EOS', 'ETC', 'ETH', 'GAS', 'HT', 'ICX', 'IOT', 'KCS',
    'LSK', 'LTC', 'NANO', 'NEO', 'OMG', 'QTUM', 'TRX', 'VEN', 'XLM', 'XMR', 'XRP', 'ZEC', 'ZIL'];

    for (let coin of coins) {
      let stochasticsInfo1h = await this.get('ajax').getStochasticsInfo(coin, 1);
      let stochasticsInfo4h = await this.get('ajax').getStochasticsInfo(coin, 4);
      let isShortable = coinsBitfinexShortable.indexOf(coin) > -1;
      coinsInfo.push({ name: coin, stoch1h: stochasticsInfo1h, stoch4h: stochasticsInfo4h, isShortable: isShortable });
    }

    return hash({
      currenciesSignal4h: coinsInfo.filter((c) => c.stoch4h.warning),
      currenciesSignal1h: coinsInfo.filter((c) => c.stoch1h.warning),
      currenciesNeutral: coinsInfo.filter((c) => !c.stoch1h.warning && !c.stoch4h.warning)
    });
  }
});
