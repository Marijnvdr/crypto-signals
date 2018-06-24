import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('main', { path: '/' });
  this.route('stoch-signals', { path: '/stochastics' });
  this.route('ma-signals', { path: '/movingaverage' });
  this.route('stoch-test', { path: '/stochtest' });
});

export default Router;
