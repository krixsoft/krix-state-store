import * as Rx from 'rxjs';
import * as _ from 'lodash';

export class SubscriptionManager {
  private subscription: Set<Rx.Subscription> = new Set();

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  destroy (
  ): void {
    this.subscription.forEach((data) => {
      if (_.isNil(data) || !_.isFunction(data.unsubscribe)) {
        return;
      }
      data.unsubscribe();
    });
    this.subscription.clear();
  }

  /**
   * Adds a subscription to subsciption list.
   *
   * @param {Subscription} sub
   * @return {void}
   */
  subscribe (
    sub: Rx.Subscription,
  ): void {
    this.subscription.add(sub);
  }
}
