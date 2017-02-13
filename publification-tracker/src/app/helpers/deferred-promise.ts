export class DeferredPromise {
  /*
    A simple'ish jQuery-like variation of promise. (Needed for a specific part.)
   */

  public resolve = null;
  public reject  = null;
  // Access with myDeferred.promise
  public promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}