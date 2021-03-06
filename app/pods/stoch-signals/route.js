import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let controller = this.controllerFor('stoch-signals');
    let hours = Number(controller.selectedHours.charAt(0));

    let coinsInfo = [];
    let coinsBitfinexShortable = ['BTC', 'BTG', 'DSH','EOS', 'ETC', 'ETH', 'IOT', 'LTC', 'NEO', 'OMG', 'XMR', 'XRP', 'ZEC'];

    let coins = ['ADA', 'AION', 'ARK', 'BNB', 'BTC', 'BTG', 'CLOAK', 'DASH', 'EOS', 'ETC', 'ETH', 'GAS', 'HT', 'ICX', 'IOT', 'KCS',
    'LSK', 'LTC', 'NANO', 'NEO', 'OMG', 'QTUM', 'TRX', 'VEN', 'XLM', 'XMR', 'XRP', 'ZEC', 'ZIL'];

    for (let coin of coins) {
      let stochasticsInfo = await this.get('ajax').getStochasticsInfo(coin, hours);
      let isShortable = coinsBitfinexShortable.indexOf(coin) > -1;
      coinsInfo.push({ name: coin, stoch: stochasticsInfo, isShortable: isShortable });
    }

    return hash({
      currenciesSignal4h: coinsInfo.filter((c) => c.stoch.warning),
      currenciesNeutral: coinsInfo.filter((c) => !c.stoch.warning),
      hoursList: ['1h', '4h']
    });
  },

  actions: {
    some(val) {
      console.log(val);
    }
  }
});
