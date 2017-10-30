/*global define*/

'use strict';

var SecurityView = Mn.View.extend({
    el: '#cmtyx_medicalSecureView',
    name: 'security',
    ui: {
        securityBlock: '.secure-block',
        puzzle: '.secure-block .puzzle',
        leftPuzzle: '.secure-block .left.puzzle',
        saslCode: '.secure-block .left.puzzle .secure-text',
        rightPuzzle: '.secure-block .right.puzzle',
        input: '.secure-block .right.puzzle .secure-input',
        approveMessage: '.approve-message'
    },
    events: {
        'change @ui.input': 'onPinInputChanged',
        'click @ui.approveMessage .confirm': 'onConfirm',
        'click @ui.approveMessage .reject': 'onReject',
        'click @ui.rightPuzzle': 'onInputFocus'
    },
    initialize: function() {
        this.bindUIElements();
    },
    onInputFocus: function(e) {
        setTimeout(function(){
            this.ui.input.focus();
            e.preventDefault();
        }.bind(this), 1);
    },
    onInvalid: function() {
        this.$el.addClass('invalid');
    },
    onMismatch: function() {
        this.ui.approveMessage.addClass('mismatch');
    },
    afterGetSASL: function(saslCode) {
        this.ui.approveMessage
            .removeClass('mismatch')
            .addClass('approve');
        this.ui.saslCode.text(saslCode);
        this.ui.puzzle.removeClass('active');
        this.ui.input.blur();
    },
    onLogoutSuccess: function() {
        this.$el.show('slow');
        this.ui.input.val('');
        this.ui.securityBlock.removeClass('secured');
        this.ui.approveMessage.removeClass('approved');
        this.ui.saslCode.text('xxx');
    },
    afterAuth: function() {
        this.ui.puzzle.addClass('active');
        this.ui.input.click();
    },
    onPinInputChanged: function(e) {
        var $target = $(e.currentTarget),
            val = $target.val();

        if (val.length === 3) {
            this.trigger('pinEntered', val);
        }
    },
    onConfirm: function() {
        this.trigger('ticketWasConfirmed');
    },
    onReject: function() {
        this.$el.addClass('no');
        this.trigger('ticketWasRejected');
    },
    afterVerify: function() {
        this.ui.securityBlock.addClass('secured');
        setTimeout(function() {
            $('#cmtyx_landingView').show('slow');
            this.$el.hide('slow');
        }.bind(this), 2000);
        this.ui.approveMessage
            .removeClass('approve')
            .addClass('approved');
    }
});

module.exports = SecurityView;
