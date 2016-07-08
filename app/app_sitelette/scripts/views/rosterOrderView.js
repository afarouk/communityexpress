/*global define*/

'use strict';

var Vent = require('../Vent'),
    loader = require('../loader'),
    viewFactory = require('../viewFactory'),
    PageLayout = require('./components/pageLayout'),
    orderActions = require('../actions/orderActions'),
    states = require('../states'),
    h = require('../globalHelpers');

var RosterOrderView = PageLayout.extend({

    name: 'roster_order',

    initialize: function(options) {
        this.cardTypes = options.cardTypes;
        this.fundsource = options.fundsource;
        options = options || {};
        this.sasl = options.sasl;
        this.basket = options.basket;
        this.editModel=options.editModel;
        this.catalogOptions = this.sasl.attributes.services.catalog;
        this.user = options.user;
        this.country = this.sasl.get('country');
        this.years = this.getYears();
        this.months = this.getMonths();
        this.states = this.getStates();
        this.rosterId = options.rosterId;
        this.backToCatalog = options.backToCatalog;
        this.launchedViaURL=options.launchedViaURL;
        this.backToCatalogs = options.backToCatalogs; /* this is passed on to catalogview, for its' decision-making */
        this.priceAddons = options.priceAddons;
        this.calculateTaxes();
        this.getTotalPriceWithTax();
        this.on('show', this.onShow, this);
        this.navbarView=options.navbarView;
        this.prefillAddress = this.getPrefillAddress() || {};
    },

    onShow: function(){
        if (this.fundsource) {
            this.prefillCreditInfo();
        };
        this.$('.save_credit_data').find('input').attr('checked', true).checkboxradio("refresh");
        this.addEvents({
            'click .back': 'triggerRosterView',
            'click .cancel_button': 'triggerRosterView',
            'click .submit_button': 'onSubmitClick',
            'click .showHideInfo': 'showHideInfo'
        });
    },

    renderData: function () {

        var tmpData = _.extend({},  this.catalogOptions, {
            username: this.user.userName,
            cardTypes: this.cardTypes,
            fundsource: this.fundsource,
            country: this.country,
            years: this.years,
            months: this.months,
            states: this.states,
            priceAddons: this.priceAddons,
            taxes: this.taxes,
            totalPriceWithTax: this.totalPriceWithTax,
            basket:this.basket,
            editModel:this.editModel,
            prefillAddress: this.prefillAddress
        });

        return tmpData;
    },

    prefillCreditInfo: function() {
        console.log(this.fundsource);
        var month = this.fundsource.expirationMonth,
            year = this.fundsource.expirationYear;
        this.$('select.cardtype');
        this.$('input[name=cardNumber]').val(this.fundsource.creditCardNumber);
        this.$('select.month option[value=' + month + ']').attr('selected', true);
        this.$('select.month').selectmenu('refresh', true);
        this.$('select.year option[value=' + year + ']').attr('selected', true);
        this.$('select.year').selectmenu('refresh', true);
        this.$('input[name=cvv]').val(this.fundsource.cvv);
        this.$('input[name=firstname]').val(this.fundsource.firstName);
        this.$('input[name=lastname]').val(this.fundsource.lastName);
    },

    getPrefillAddress: function() {
        var queryString = h().parseQueryString(window.location.search.replace('?', '')),
            address = unescape(queryString.prefilladdress),
            street = address.substring(0, address.indexOf(',')),
            city = address.substring(address.indexOf(',') + 1);
        return {
            street: street,
            city: city==='undefined'?'':city,
            street2: ''
        };
    },

    calculateTaxes: function() {
        this.taxes = parseInt(this.basket.getTotalPrice()*this.priceAddons.taxState)/100;
    },

    getTotalPriceWithTax: function() {
        var priceWithoutTaxes = parseFloat(this.basket.getTotalPrice().toFixed(2));
        this.totalPriceWithTax = parseFloat((this.taxes + priceWithoutTaxes).toFixed(2));
    },

    triggerRosterView: function() {


      Vent.trigger('viewChange', 'roster', {
          sasl: this.sasl.id,
          id: this.rosterId,
          backToRoster:true,
          rosterId:this.rosterId,
          launchedViaURL:this.launchedViaURL,
       }, { reverse: false });

    },

    onSubmitClick: function (e) {
        if (this.$('.save_credit_data').find('input').is(':checked')) {
            this.saveCreditCardForFutureReference = true;
        } else {
            this.saveCreditCardForFutureReference = false;
        };
        e.preventDefault();
        var cardType = this.$('select.cardtype').val();
        var country = this.$('select.country').val();
        var street = this.$('input[name=street]').val();
        var street2 = this.$('input[name=street]').val();
        var city = this.$('input[name=city]').val();
        var state = this.$('select.state').val();
        var zip = this.$('input[name=zip]').val();
        var email = this.$('input[name=email]').val();
        var phone = this.$('input[name=phone]').val();
        var firstName = this.$('input[name=firstname]').val();
        var lastName = this.$('input[name=lastname]').val();
        var zip = this.$('input[name=zip]').val();
        var cardNumber = this.$('input[name=cardNumber]').val();
        var expirationMonth = parseInt(this.$('select.month').val());
        var expirationYear = parseInt(this.$('select.year').val());
        var cvv = this.$('input[name=cvv]').val();
        var creditCard = this.$('#credit')[0].checked;
        var pickup = this.$('#pickup')[0].checked;

        var items = this.basket.getItems(this.sasl);

        this.onSubmit({
            serviceAccommodatorId: this.sasl.sa(),
            serviceLocationId: this.sasl.sl(),
            deliveryEmail: email,
            deliveryPhone: phone,
            deliveryContactName: firstName,
            pickupSelected: pickup,
            deliverySelected: !pickup,
            cashSelected: !creditCard,
            creditCardSelected: creditCard,
            items: items,
            taxAmount: this.taxes,
            totalAmount: this.totalPriceWithTax,
            currencyCode: this.priceAddons.currencyCode,
            saveCreditCardForFutureReference: this.saveCreditCardForFutureReference,
            billingAddress: {
                zip: zip,
                street: street,
                state: state,
                country: country,
                city: city
            },
            deliveryAddress: {
                street: street,
                city: city,
                // state: state,
                // zip: zip,
                street2: street2
            },
            creditCard: {
                cardType: cardType === 'Card Type' ? 'UNDEFINED' : cardType,
                firstName: firstName,
                lastName: lastName,
                cardNumber: cardNumber,
                expirationMonth: expirationMonth,
                expirationYear: expirationYear,
                cvv: cvv
            }
        });
    },

    onSubmit: function (options) {
        loader.show('placing your order');
        return orderActions.placeOrder(
            this.sasl.sa(),
            this.sasl.sl(),
            options
        ).then(function () {
            this.basket.reset();
            loader.showFlashMessage('order successful');
            setTimeout(function () {
                this.triggerRosterView( );
            }.bind(this), 3000);
        }.bind(this), function () {
            loader.showFlashMessage('error placing your order');
        });
    },

    // EXPAND/COLLAPSE CREDIT INFO WHEN CREDIT/CASH SELECTED
    showHideInfo: function(e) {
        var $target = $(e.target),
            $input = $($target.siblings('input'));
        switch ($input.attr('id')) {
            case 'delivery':
                $('#collapsible').collapsible('expand');
            break;
            case 'pickup':
                $('#collapsible').collapsible('collapse');
            break;
            case 'credit':
                $('#collapsible1').collapsible('expand');
            break;
            case 'cash':
                $('#collapsible1').collapsible('collapse');
            break;
            default:
        };
        // $('#collapsible1').collapsible('expand');
    },

    hideInfo: function() {
        $('#collapsible1').collapsible('collapse');
    },
    // THE END

    getYears: function() {
        var years = [],
            k = (new Date).getFullYear(),
            j = (new Date).getFullYear()+20;
        for ( var i = k; i < j; i++ ) {
            years.push(i);
        };
        return years;
    },

    getMonths: function() {
        var months = [];
        for (var i = 1; i <= 12; i++) {
            months.push(i);
        };
        return months;
    },

    getStates: function() {
        return states;
    }
});

module.exports = RosterOrderView;
