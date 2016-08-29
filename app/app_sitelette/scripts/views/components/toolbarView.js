/*global define*/

'use strict';

var ToolbarView = Backbone.View.extend({

    initialize: function(options) {
        this.template = options.template;
    },

    render: function(data) {
        this.$el.append(this.template(data));
        this.setElement(this.$el.children().eq(0));
        this.reinitialize();
        return this;
    },

    reinitialize: function(){
        this.$el.toolbar();
    }

});

module.exports = ToolbarView;
