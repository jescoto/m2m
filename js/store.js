function fireEvent(name, params) {
    var evt = document.createEvent("Events")
 
    evt.initEvent(name, true, true);
    evt.params = params;
    
    window.dispatchEvent(evt);
}



var Store;

Store = (function() {
  function Store(obj) {
    this.data = obj;
    this.GUID = this.uniqueID();
  }

  Store.prototype.uniqueID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  Store.prototype.update = function(obj) {
    this.data = obj;
    return fireEvent(this.GUID + '.onupdate', [this, this.data]);
  };

  Store.prototype.on = function(event, callback, bubble) {
    return window.addEventListener(this.GUID + '.on' + event, function(e){return callback.apply(this, e.params)}, bubble);
  };

  return Store;

})();