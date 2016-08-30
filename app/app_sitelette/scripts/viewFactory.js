/*global define*/

'use strict';

var OpeningHoursView = require('./views/popups/openingHoursView'),
    PromotionsView = require('./views/popups/promotionsView'),
    NewMessageView = require('./views/popups/newMessageView'),
    RestaurantMenu = require('./views/panels/restaurantMenu'),
    UploadView = require('./views/popups/uploadView'),
    RestaurantListView = require('./views/panels/rest_listView'),
    FiltersView = require('./views/popups/filtersView'),
    ShareView = require('./views/panels/shareView'),
    OptionsView = require('./views/panels/optionsView'),
    SigninView = require('./views/panels/signinView'),
    SignupView = require('./views/panels/signupView'),
    EditFavoritesView = require('./views/panels/editFavoritesView'),
    EditRosterView = require('./views/panels/editRosterView'),
    MyMessagesView = require('./views/panels/myMessagesView'),
    NotificationsView = require('./views/panels/notificationView'),
    AddToCatalogBasketView = require('./views/panels/addToCatalogBasketView'),
    AddToRosterBasketView = require('./views/panels/addToRosterBasketView'),
    FavoriteStarView = require('./views/partials/favoriteStar'),
    NewReviewView = require('./views/popups/newReviewView'),
    LegendView = require('./views/panels/legendView'),
    configurationActions = require('./actions/configurationActions'),
    UserPicturesView = require('./views/popups/userPicturesView'),
    ContactPopup = require('./views/popups/contactPopup'),
    InvitationView = require('./views/popups/invitationView'),
    SupportView = require('./views/popups/supportView'),
    ConfirmationPopup = require('./views/popups/confirmationPopup'),
    TextPopup = require('./views/popups/textPopup');

var viewMap = {
    userPictures: UserPicturesView,
    openingHours: OpeningHoursView,
    restaurantList: RestaurantListView,
    promotions: PromotionsView,
    newMessage: NewMessageView,
    restaurantMenu: RestaurantMenu,
    upload: UploadView,
    filters: FiltersView,
    share: ShareView,
    options: OptionsView,
    signin: SigninView,
    signup: SignupView,
    editFavorites: EditFavoritesView,
    editRosterView:EditRosterView,
    myMessages: MyMessagesView,
    favoriteStar: FavoriteStarView,
    newReview: NewReviewView,
    notifications: NotificationsView,
    addToCatalogBasket: AddToCatalogBasketView,
    addToRosterBasket: AddToRosterBasketView,
    contactPopup: ContactPopup,
    invitationView: InvitationView,
    confirmationPopup: ConfirmationPopup,
    support: SupportView,
    textPopup: TextPopup
};

module.exports = {

    create: function(viewname, model, parent, options) {
        if (viewname === 'legend') {
            return this.createLegendView();
        }
        else if ( viewMap[viewname] ){
            var callback;
            if (!$.isFunction(options)) {
                callback = function() {};
            } else {
                callback = options;
            };
            return new viewMap[viewname](_.extend({},{
                collection: model,
                model: model,
                parent: parent,
                callback: callback
            }, options ));
        }
        throw new Error('unknown view ' + viewname);
    },

    createLegendView: function () {
        return configurationActions.getLegendInfo()
            .then(function (response) {
                return new LegendView(response);
            });
    }

};
