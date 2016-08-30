/*global define*/

'use strict';

var ListRadioView = Backbone.View.extend({

    tagName: 'ul',

    initialize: function(options) {
        options = options || {};
        this.parent = options.parent;
        this.ListRadioItemView = options.ListItemView;
        this.ListRadioItemViewOptions = options.ListItemViewOptions || {}; 
        this.$el.attr({ 
            'data-role': this.ListRadioItemViewOptions.dataRole || 'listview',
            'data-icon': this.ListRadioItemViewOptions.icon || 'false'
        });

        this.listenTo(this.parent, 'close:all', this.close, this);
        if (options.update !== false) {
            this.listenTo(this.collection, 'add remove', this.render, this);
        }

    },

    render: function () {
        this.$el.empty();
        var frg = document.createDocumentFragment();
        var isFirstItem=true;
        this.collection.each(function (item) {
            var html=new this.ListRadioItemView($.extend(this.ListRadioItemViewOptions, {
                model: item,
                parent: this
            })).render().el ; 
            if(isFirstItem){ 
               $(html).find('input').prop('checked','checked'); 
               isFirstItem=false;
            }
            $(frg).append(html); 
               
        }, this);
        this.$el.append(frg);
        
        //this.enhance();
        return this;
    },

    //enhance: function () {
    //    this.$el.enhanceWithin();
    //},

    close: function () {
        this.trigger('close:all');
        this.stopListening();
        this.undelegateEvents();
        this.remove();
    }

});

module.exports = ListRadioView;
