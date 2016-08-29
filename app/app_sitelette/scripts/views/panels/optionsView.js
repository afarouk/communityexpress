/*global define*/

'use strict';

var template = require('ejs!../../templates/options.ejs'),
    loader = require('../../loader'),
    config = require('../../appConfig'),
    PanelView = require('../components/panelView'),
    userController = require('../../controllers/userController'),
    favoriteActions = require('../../actions/favoriteActions'),
    configurationActions = require('../../actions/configurationActions'),
    saslActions = require('../../actions/saslActions'),
    h = require('../../globalHelpers');

var OptionsView = PanelView.extend({

    template: template,

    initialize: function(){
        this.$el.attr({
            'class': 'options_panel',
            'id': 'cmntyex_options_panel'
        });
        this.addEvents({
            'click .close-panel-button': 'shut',
            'click .edit_favorites_button': 'openEditFavorites',
            'click .my_messages_button': 'openMyMessages',
            'click .invitation_button': 'openInvitation',
            'click .support_button': 'openSupport',
            'change #simulate-flipswitch': 'toggleSimulate'
        });
    },

    render: function() {
        this.$el.html(this.template({
            user: this.user.getUID(),
            simulate: this.model.get('simulate')
        }));
        return this;
    },

    openEditFavorites: function() {
        this.parent.openSubview('editFavorites', function () {
            return this.user.favorites;
        }.bind(this), {
            actions: {
                removeItem: function (selected) {
                    var keys = selected.map(function (model) {
                        return model.getUrlKey();
                    });
                    return favoriteActions.removeFavorites(keys);
                }
            }
        });
    },

    openMyMessages: function() {
        this.parent.openSubview('myMessages', function () {
            return this.user.messages;
        }.bind(this));
    },

    openInvitation: function() {
        this.parent.openSubview('invitationView');
    },

    openSupport: function() {
        this.parent.openSubview('support');
    },

    toggleSimulate: function(e) {
        configurationActions.toggleSimulate(e.target.checked);
        saslActions.getSaslSummaryByLocation();
    }
});

module.exports = OptionsView;
