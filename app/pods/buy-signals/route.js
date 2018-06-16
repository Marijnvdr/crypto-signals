import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  async model() {
    let currentPrice = await this.get('ajax').getCoinPrice('BTC');
    let stochasticsInfo1h = await this.get('ajax').get1HourStochasticsInfo('BTC');
    return hash({
      price: currentPrice,
      stoch: stochasticsInfo1h,
      ts: this.get('ajax').getCurrentTimeStamp(),
      d: this.get('ajax').getCurrentDateTime(),
    });
  }
});
