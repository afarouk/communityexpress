/*global define*/

'use strict';

var FilterOptionModel = require('../models/filterOptionModel.js');

var FilterOptionsCollection = Backbone.Collection.extend({

    model: FilterOptionModel,

    initialize: function(models){
        this._selected = this._setDefaultSelection(models);
    },

    selectDomain: function (id) {
        var model = this.get(id);
        if (!model) return;

        var selected = this.getSelected();
        if (model === selected) return;

        this._selected = model.id || 0;
        this.trigger('change:selected', model);
    },

    getSelected: function () {
        return this.get(this._selected);
    },

    _setDefaultSelection: function (models) {
        if (models && models.length > 0) {
            var model = models[0];
            return model.displayText || 0;
        }
        return 0;
    }

});

module.exports = FilterOptionsCollection;
