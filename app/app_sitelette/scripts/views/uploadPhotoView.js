/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
    template= require('ejs!../templates/uploadView.ejs');

var UploadPhotoView = Backbone.View.extend({
    name: 'upload_photo',
    id: 'cmtyx_uploadPhoto',

    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.restaurant = options.restaurant;
        this.on('show', this.onShow, this);
        //temp hardcoded
        this.renderData = {
            uploadPlaceHolder: {},
            hideTitle: {},
            promotionTypes: new Backbone.Collection()
        };
        this.render();
    },
    render: function(){
        // this.$el.html(template(this.renderData));
        this.$el.html('<div style="background:black;width:100%;height:100%" ></div>');
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    renderContent : function (options){
        return this.$el;
    },

    onShow:  function() {
        
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = UploadPhotoView;
