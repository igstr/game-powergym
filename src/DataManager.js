
PowerGym.DataManager = function(data) {

  this.data = data || {};

};

PowerGym.DataManager.prototype = {

  save: function() {

    if (typeof this.data == "object") {
      for (var key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          var value = typeof this.data[key] == "object" ? JSON.stringify(this.data[key]) : this.data[key];
          localStorage.setItem(key, value);
        }
      }
    } else if (Array.isArray(this.data)) { }

  },

  load: function() {

    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        this.data[key] = JSON.parse(localStorage[key]);
      }
    }

    // Check if empty
    if (!this.isEmpty(this.data)) {
      return this.data;
    }

  },

  clearStorage: function() {

    localStorage.clear();

  },

  isEmpty: function(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

};
