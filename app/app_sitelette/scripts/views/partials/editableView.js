/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/editable.ejs'),
    loader = require('../../loader');

var FavoriteView = Backbone.View.extend({

    tagName: 'li',

    template: template,

    events: {
        'click .action': 'act'
    },

    initialize: function (options) {
        this.actionfn = options.actionfn;
        this.action = options.action;
    },

    act: function() {
        loader.show();
        this.actionfn(this.model.id)
            .then(function () {
                this.model.trigger('destroy', this.model);
                loader.showFlashMessage('action completed successfully');
            }.bind(this), function () {
                loader.showFlashMessage('an error has occurred');
            });
    },

    render: function() {
        this.$el.html(this.template({model: this.model, action: this.action}));
        return this;
    },

});

module.exports = FavoriteView;
