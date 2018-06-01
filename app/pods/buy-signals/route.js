import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend({
  ajax: service('crypto-api'),

  model() {
    return hash({
      test: this.get('ajax').getCoinPrice('BTC')
    });
  }
});
