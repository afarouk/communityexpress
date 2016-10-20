/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    popupController = require('../controllers/popupController'),
    h = require('../globalHelpers'),
    template= require('ejs!../templates/blogPostsView.ejs');

var BlogPostsView = Backbone.View.extend({
    name: 'blog_posts',
    id: 'cmtyx_blog_posts',

    events: {
        
    },

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.on('show', this.onShow, this);
        this.render();
    },
    render: function(){
        this.$el.html(template());
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        loader.hide();
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = BlogPostsView;
