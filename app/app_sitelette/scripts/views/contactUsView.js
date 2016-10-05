/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    contactActions = require('../actions/contactActions'),
    sessionActions = require('../actions/sessionActions.js'),
    template = require('ejs!../templates/contactUs.ejs');

var ContactUs = Backbone.View.extend({
    name: 'contact_us',
    id: 'cmtyx_contactUs',

    events: {
        'click .send_btn': 'onSendMessage',
        'keypress input': 'removeError',
        'keypress textarea': 'removeError'
    },
    
    initialize: function(options) {
        options = options || {};
        this.sasl = options.sasl;
        this.render(this.getUserData());
    },
    render: function(data){
        this.$el.html(template(data));
        this.setElement(this.$el.children().eq(0));
        return this;
    },

    getUserData: function () {
        var user = sessionActions.getCurrentUser();
        return _.extend({subject: 'I have a question...'} ,user);
    },

    onSendMessage: function() {
        var data = this.getContactUsData();
        if (!data) return;
        contactActions.sendContactUsEmail(this.getContactUsData())
            .then(function(response){
                loader.showFlashMessage(response.explanation);
                //Maybe goBack after that???
            });
    },

    getContactUsData: function(){
        var $name = this.$('.contact_name'),
            $email = this.$('.contact_email'),
            $subject = this.$('.contact_subject'),
            $message = this.$('.contact_message'),
            contactUsData = {
                senderName: $name.val(),
                replyToEmail: $email.val(),
                subject: $subject.val(),
                description: $message.val()
            },
            isValid = true;

        //Verification
        if (contactUsData.senderName.length < 2) {
            $name.addClass('error');
            isValid = false;
        } else {
            $name.removeClass('error');
        }
        if (contactUsData.description.length < 2) {
            $message.addClass('error');
            isValid = false;
        } else {
            $message.removeClass('error');
        }
        if (contactUsData.subject.length < 2) {
            $subject.addClass('error');
            isValid = false;
        } else {
            $subject.removeClass('error');
        }
        if (!this.validateEmail(contactUsData.replyToEmail)) {
            $email.addClass('error');
            isValid = false;
        } else {
            $email.removeClass('error');
        }

        return isValid ? contactUsData : false;
    },

    validateEmail: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    removeError: function(e) {
        var $target = $(e.currentTarget);
        $target.removeClass('error');
    },

    /* AF: we don't need this function. It was part of the
       old PageLayout based layout management. We leave
       it here for now, while we continue clean up */
    renderContent : function (options){
        return this.$el;
    },

    goBack: function() {
        Vent.trigger( 'viewChange', 'restaurant', this.sasl.getUrlKey());
    }
});

module.exports = ContactUs;
