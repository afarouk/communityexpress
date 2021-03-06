/*global define*/
'use strict';

var saslActions = require('../../actions/saslActions');

var ContactUsInLandindView = Backbone.View.extend({
  name: 'contact_us_subview',
  el: '#cmtyx_contact_us_block',
  map: '#home_map',

  events: {
  },

  initialize: function(options) {
    this.options = options || {};
    this.$el.unbind();
    this.showMap();
    this.fillLinks();
    this.resolved();
  },

  //TODO temporary, should be set on server side
  fillLinks: function() {
    var $drive = this.$('#driveToUs'),
        $call = this.$('#callUs'),
        driveHref = 'https://maps.apple.com/?daddr=' +
          saslData.number + '+' + saslData.street + '+' +
          saslData.city + '+&saddr=current%20location',
        callHref = 'tel:'+saslData.telephoneNumber;
    driveHref = driveHref.replace(/ /g,'+');
    $drive.attr('href', driveHref);
    $call.attr('href', callHref);
  },

  showMap: function() {
    var lat = saslData.latitude,
        lng = saslData.longitude,
        address = saslData.street + ' ' + saslData.number + ', ' + saslData.city;
    var $map = this.$(this.map);
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 10,
        disableDefaultUI:true,
        zoomControl: true,
        draggable:false,
        scaleControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
    };
    var map = new google.maps.Map($map.get(0), mapOptions);
    var myCenter=new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
      position:myCenter
      // ,animation:google.maps.Animation.BOUNCE
    });

    marker.setMap(map);

    var infowindow = new google.maps.InfoWindow({
      content: address
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  }

});

module.exports = ContactUsInLandindView;
