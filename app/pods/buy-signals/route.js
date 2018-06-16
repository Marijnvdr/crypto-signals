import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let currentPrice = await this.get('ajax').getCoinPrice('BTC');
    let stochasticValue = await this.get('ajax').getStochastics('BTC', currentPrice);
    return hash({
      price: currentPrice,
      stoch: stochasticValue,
      ts: this.get('ajax').getCurrentTimeStamp(),
      d: this.get('ajax').getCurrentDateTime(),
    });
  }
});
