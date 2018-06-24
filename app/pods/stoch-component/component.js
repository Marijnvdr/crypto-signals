import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  ajax: service('crypto-api'),
  tagName: '',

  init() {
    this._super(...arguments);
    this.data = '';
  },

  didReceiveAttrs() {
    if (!this.hours) {
      this.set('hours', 4);
    }

    this.get('fetchData').perform(this.hours);
  },

  fetchData: task(function*(hours) {
    let coinsInfo = [];
    let coinsBitfinexShortable = ['BTC', 'BTG', 'DSH','EOS', 'ETC', 'ETH', 'IOT', 'LTC', 'NEO', 'OMG', 'XMR', 'XRP', 'ZEC'];

    let coins = ['ADA', 'AION', 'ARK', 'BNB', 'BTC', 'BTG', 'CLOAK', 'DASH', 'EOS', 'ETC', 'ETH', 'GAS', 'HT', 'ICX', 'IOT', 'KCS',
    'LSK', 'LTC', 'NANO', 'NEO', 'OMG', 'QTUM', 'TRX', 'VEN', 'XLM', 'XMR', 'XRP', 'ZEC', 'ZIL'];

    for (let coin of coins) {
      let stochasticsInfo = yield this.get('ajax').getStochasticsInfo(coin, hours);
      let isShortable = coinsBitfinexShortable.indexOf(coin) > -1;
      coinsInfo.push({ name: coin, stoch: stochasticsInfo, isShortable: isShortable });
    }

    return this.set('data', {
      currenciesSignal: coinsInfo.filter((c) => c.stoch.warning),
      currenciesNeutral: coinsInfo.filter((c) => !c.stoch.warning)
    });
  }).restartable()
});
