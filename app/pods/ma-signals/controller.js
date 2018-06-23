import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['coin'],
  coin: null,

  actions: {
    getSelectedCoin() {
      this.set('coin', this.selectedCoin);
    }
  }
});
