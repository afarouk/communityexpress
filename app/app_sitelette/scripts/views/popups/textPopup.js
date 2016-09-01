/*global define*/

var PopupView = require('../components/popupView'),
    template = require('ejs!../../templates/textPopup.ejs');

var TextPopup = PopupView.extend({

    template: template,

    id: 'cmntyex_text_popup',

    className: 'popup',

    initialize: function (options) {
        this.text = options.model.text;
        this.color = options.model.color || '#fff';
        this.options = options || {};
        this.callback = options.callback || function () {};

        this.addEvents({
            'click .confirmation_button': 'triggerCallback'
        });
    },

    render: function () {
        this.$el.html(this.template({
            text: this.text,
            color: this.color
        }));
        return this;
    },

    beforeShow: function() {
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 450,
            'max-width': 300,
            'width': w * 0.8
        });
    },

    onShow: function () {
        if (this.options.select) {
            this.selectText();
        }
        if (this.options.wordBreak) {
            this.$('.ui-content').css({
                'word-wrap': 'break-word'
            });
        }
    },

    triggerCallback: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            setTimeout(this.callback.bind(this.options.parent), 0);
        }.bind(this));
    },

    selectText: function () {
        var el = this.$('.ui-content')[0];
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

});

module.exports = TextPopup;
