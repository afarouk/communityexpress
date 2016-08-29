/*global define*/

'use strict';

var DomainModel = Backbone.Model.extend({

    defaults: {
        selected: false
    },

    initialize: function (attrs, filterOptions) {
        if (!filterOptions || !_(filterOptions).isArray() || filterOptions.length < 1) {
            this.filterOptions = new Backbone.Collection([]);
        } else {
            this.filterOptions = new Backbone.Collection(filterOptions);
        }
    },

    getCategory: function () {
        var id = this.get('category');
        return this.filterOptions.get(id) || this.filterOptions.at(0) || new Backbone.Model({
            enumText: '',
            displayText: ''
        });
    },

    setCategory: function (id) {
        var filter = this.filterOptions.get(id);
        if (filter) {
            this.set('category', id);
        }
    }

});

module.exports = DomainModel;
