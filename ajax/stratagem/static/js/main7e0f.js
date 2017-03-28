// by Zoran Završki
// 26.05.2014
// v1.0
// based on http://jquery.gr/introtzikas/
//Copyright (C) 2014 by degordian
;(function( $ ){
    $.fn.intro = function(options) {

        var defaults = {
            line   : '#ffffff',
            speedwidth   : 2,
            speedheight  : 1,
            speedopacity : 1,
            bg : '#333',
            lineheight : 2,
            wrapperDiv : '.intro-wrapper',
            lineDiv : '.intro-line'
        };

        var options = $.extend(defaults, options);

        $('body').css('overflow-y','hidden');
        $('body').css('visibility','hidden');

        $(options.lineDiv).css('background',options.bg);
        $(options.lineDiv).css('background',options.line);
        $(options.lineDiv).css('height',options.lineheight+'px');
        $(options.lineDiv).css('margin-top',(options.lineheight/2)+'px');
        $(options.lineDiv).css('width','0%');
        $(options.lineDiv).css('visibility','visible');

        $(options.lineDiv),parent = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0});
        parent.to(options.lineDiv, options.speedwidth, { css: {width: '+=100%'}, delay: 0, ease:Power4.easeIn}, 0).timeScale(1);
        parent.to(options.lineDiv, options.speedheight, { css: {height: '+=100%', top: '-=50%'}, delay: options.speedwidth, ease:Power4.easeOut, onComplete:step}, 0).timeScale(1);

        function step() {
            $('body').attr('style','');
            $('body').css('visibility','visible');
            $(options.lineDiv),parent = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0});
            parent.to(options.wrapperDiv, options.speedopacity, { css: {opacity: '0'}, delay: 0, ease:Power4.easeOut, onComplete:step2}, 0).timeScale(1);
        }
        function step2() {
            $(options.wrapperDiv).remove();
            $('body').css('overflow-y','visible');
        }
    };

})( jQuery );

var DAnimation = {
    start: 0,
    bezier: function(p0, p1, p2, p3){
        return DAnimation.polyBez([p0, p1], [p2, p3]);

    },
    polyBez: function(p1, p2) {
        var A = [null, null], B = [null, null], C = [null, null],
            bezCoOrd = function(t, ax) {
                C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                return t * (C[ax] + t * (B[ax] + t * A[ax]));
            },
            xDeriv = function(t) {
                return C[0] + t * (2 * B[0] + 3 * A[0] * t);
            },
            xForT = function(t) {
                var x = t, i = 0, z;
                while (++i < 14) {
                    z = bezCoOrd(x, 0) - t;
                    if (Math.abs(z) < 1e-3) break;
                    x -= z / xDeriv(x);
                }
                //console.log(x);
                return x;
            };
        return function(t) {
            return bezCoOrd(xForT(t), 1);
        }
    }

};
/*
// Offline tool
$(document).ready(function(){

    $('form').submit(function(e){

        if($(this).find('#repeat-offline').val() == 0){
            // submit the form
            return true;
        }

        e.preventDefault(e);

        var $form = $(this);

        var input = $('<input>')
            .attr('type', 'hidden')
            .attr('id', 'repeat-offline')
            .attr('name', 'repeat').val(0);

        $form.append($(input));

        var url         = 'https://truba.interaktivni-studio.com/iapps/offline_tool/?r=site/getdata',
            clientId    = ga.getAll()[0].get('clientId'),
            templateId  = 'frmy0cdsm5';

        var dataToSend  = $('form').serialize();
        dataToSend += '&google_client_id='+clientId;
        dataToSend += '&template_code='+templateId;

        $.ajax({
            type:'POST',
            url:url,
            async: false,
            data:dataToSend
        });

    });
});*/

// 
  function tmEvent(category, action, label, value)
  {
      dataLayer.push({
          'event': '_d_GAEvent',
          'eventCategory': category,
          'eventAction': action,
          'eventLabel': label,
          'eventValue': value
      });
  }
  function tmVirtualPage(url, pageTitle)
  {
      dataLayer.push({
          'event': '_d_GAVirtualPageview',
          'virtualPageview': url,
          'virtualPageviewTitle': pageTitle
      });
  }
  function sendContact()
  {
      var url = 'index.php?r=site/createcontact")';

      var checked = [];
      $('input[name^="lect"]').each(function(){
        if($(this).val() == 1){
          checked.push($(this).attr('id'));
        }
      });

      var params = {
          name: $('#full-name').val(),
          email: $('#email').val(),
          company: $('#company').val(),
          position: $('#position').val(),
          lectures: checked,
          gaurl: $('#gaurl').val()
      };

      var isValid = validate(params);
      if(!isValid.ok) {
          tmVirtualPage('/signup/error/', 'Signup error');
          tmEvent('Form', 'Submitted', 'Fail'+isValid.err);
          TweenLite.to($("html, body"), 1, { scrollTop: $('.sign-in').find('.error-msg').offset().top - 100  , ease:Expo.easeInOut});
          return;
      }
      else{
      }

      $.ajax({
          type: 'POST',
          url: url,
          data: params,
          success: function(response) {
            response = jQuery.parseJSON(response);
              if (response.ok == 1) {
               // $("html, body").animate({ scrollTop: 0 }, 500);
                 TweenLite.to($("html, body"), 1, { scrollTop: $('#content').offset().top  , ease:Expo.easeInOut});
                $('#modal-thank').addClass('md-show');
                tmEvent('Form', 'Submitted', 'Success');
                tmVirtualPage('/signup/thank-you/', 'Signup thank-you');
                $('#thanks').val(1);
                $('.sign-in input[type="text"]').val('');
                $('.lectures-box').removeClass('ctive');
                $('input[type="checkbox"]').val(0);
              }
              else {
              }
          },
          failure: function(msg) {
              alert('Failure. Something went wrong.');
          }
      });
  }
  function validateEmail(email) 
  {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validate(params)
  {
    var err = '';
    var ret = {}
    
    if(params.lectures.length == 0){
      $('.checkbox-error').removeClass('hidden');
      err += ' | empty lectures';
    }
    else{ 
      $('.checkbox-error').addClass('hidden');
    }
    if(params.name == ''){
      $('input#full-name').nextAll('span:first').removeClass('hidden');
      err += ' | empty name';
    }
    else{ 
      $('input#full-name').nextAll('span:first').addClass('hidden');
    }


    if(params.email == '' ){
      $('input#email').nextAll('span.first').removeClass('hidden');
      err += ' | empty email';
    }
    else if(!validateEmail(params.email)){
      $('input#email').nextAll('span.first').addClass('hidden');      
      $('input#email').nextAll('span.second').removeClass('hidden');
      err += ' | invalid email';
    }
    else{ 
      $('input#email').nextAll('span.first').addClass('hidden');      
      $('input#email').nextAll('span.second').addClass('hidden');      
    }

    if(params.company == ''){
      $('input#company').nextAll('span:first').removeClass('hidden');
      err += ' | empty company';
    }
    else{ 
      $('input#company').nextAll('span:first').addClass('hidden');      
    }
    if(params.position == ''){
      $('input#position').nextAll('span:first').removeClass('hidden');
      err += ' | empty position';
    }
    else{ 
      $('input#position').nextAll('span:first').addClass('hidden');
    }
    if(err == ''){
      ret.ok = true;
      return ret;
    }
    else{
      ret.ok = false;
      ret.err = err;
      return ret;
    }
  }

  /*window.onload = function(){
      var tracker = ga.getAll()[0];
      var clientId = tracker.get('clientId');
      $(document).ready(function(){
        $('#gaurl').val($('#gaurl').val() + clientId);
      })
  };*/

/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var ModalEffects = {

    init: function () {

      $(document).ready(function(){

        var overlay = document.querySelector('.md-overlay');
        var title;

        [].slice.call(document.querySelectorAll('.md-trigger')).forEach(function (el, i) {
            var modal = document.querySelector('#' + el.getAttribute('data-modal')), 
                close = modal.querySelector('.md-close'), 
                close2 = modal.querySelector('.confirm'),
                close3 = modal.querySelector('.view-link');


            var modalTitle = $("[data-modal-title]").data('modal-title');
            var modalSubtitle = $("[data-modal-subtitle]").data('modal-subtitle');

            $('[modal-replace-title]').text(modalTitle);
            $('[modal-replace-subtitle]').text(modalSubtitle);

            function removeModal(hasPerspective) {
                classie.remove(modal, 'md-show');

                if (hasPerspective) {
                    classie.remove(document.documentElement, 'md-perspective');
                }
            }

            function removeModalHandler() {

                //$('body').css('overflow', 'visible');
                $('html').css('overflow', 'visible');
                removeModal(classie.has(el, 'md-setperspective'));
            }

            el.addEventListener('click', function (ev) {

                ev.preventDefault();
                ev.stopPropagation();

                //$('body').css('overflow', 'hidden');
                $('html').css('overflow', 'hidden');

                $('#'+el.getAttribute('data-modal')).css('top', $(el).offset().top);
                TweenLite.to($("body"), 1, { scrollTop:$(el).offset().top, ease:Expo.easeInOut});

                title = $('#' + el.getAttribute('data-modal')).data('title');
                vurl = $('#' + el.getAttribute('data-modal')).data('vurl');

                tmVirtualPage('lecture/'+vurl, title);

                document.title = title + ' | Degordian Academy';

                classie.add(modal, 'md-show');

                overlay.removeEventListener('click', removeModalHandler);
                overlay.addEventListener('click', removeModalHandler);
                if (classie.has(el, 'md-setperspective')) {
                    setTimeout(function () {
                        classie.add(document.documentElement, 'md-perspective');
                    }, 25);
                }

            });

            close.addEventListener('click', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                removeModalHandler();
                if($('#thanks').val() == 1){
                    tmEvent('Buttons', 'Close virtual page', 'Signup thank-you');
                    document.title = 'Degordian Academy';
                    $('#thanks').val(0);
                }
                else{
                    if(title === undefined){
                        title = $('#directPopup').val();
                    }
                    tmEvent('Buttons', 'Close virtual page', title);
                    document.title = 'Lectures | Degordian Academy';
                }
            });

            $(close2).click( function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                removeModalHandler();
            });

            $(close3).click( function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                removeModalHandler();
            });

        });


});

    }
};
ModalEffects.init();

var comFunct = {

    isDesktop: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return false;
        } else {
            return true;
        }
    },
    isMobileDevice: function () {
        return navigator.userAgent.toLowerCase().indexOf('iphone') > -1 || navigator.userAgent.toLowerCase().indexOf('ipad') > -1 || navigator.userAgent.toLowerCase().indexOf('ipod') > -1 || navigator.userAgent.toLowerCase().indexOf('android') > -1 || navigator.userAgent.toLowerCase().indexOf('webos') > -1 || navigator.userAgent.toLowerCase().indexOf('blackberry') > -1
    },
    isMobileDeviceFake: function () {
        if (comFunct.getViewport('width') < 979) {
            return true;
        } else {
            return false;
        }

    },
    getViewport: function (type) {
        var viewPortWidth;
        var viewPortHeight;

        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth = window.innerWidth, viewPortHeight = window.innerHeight
        }

        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth, viewPortHeight = document.documentElement.clientHeight
        }

        // older versions of IE
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth, viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
        }

        // return
        if (type == 'width') {
            return viewPortWidth;
        } else {
            return viewPortHeight;
        }
    },
    log: function () {
        if (!window.console) {
            window.console = {
                log: function () {
                }
            };
        } else {
            for (var i = 0; i < arguments.length; i++)
                console.log(arguments[i]);
        }
    },
    is_touch_device: function () {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    },
    getRelativepath: function () {
        var currentUrl = location.href;
        var currentHost = location.protocol + "//" + location.hostname;
        var cRelativeUrl = currentUrl.replace(currentHost, '');

        return cRelativeUrl;
    }
};

var main = (function ($) {
    "use strict";

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var originalTitle = document.title;

    window.visibilityChanger = {
        backMsg: "Come back!",
        visible: function () {
            document.title = originalTitle
        },
        hidden: function () {
            visibilityChanger.removeTimer(), window.originalDocumentTitle = document.title, document.title = visibilityChanger.backMsg, visibilityChanger.addRemoveTimer()
        },
        removeTimer: function () {
            visibilityChanger.timeoutId && window.clearTimeout(visibilityChanger.timeoutId)
        },
        addRemoveTimer: function () {
            visibilityChanger.timeoutId = window.setTimeout(visibilityChanger.visible, 2e4)
        }
    };

    window.addEventListener('focus', function() {
        visibilityChanger.visible();
    });

    window.addEventListener('blur', function() {
        visibilityChanger.hidden();
    });

    var main = {
        init: function () {
            var self = this;
            var animdelay = 0.6;
            var leftPos;

            $().intro({ });

            $('.close-lectures').click(function(e) {
                e.preventDefault();
                TweenLite.to($(this).attr('href'), 0.65, {css: {left: '130%'}, ease:DAnimation.bezier(0.95,0.0,0.46,0.14), onComplete: function() {$('.overlay').removeClass('show')}});
                tmEvent('Buttons', 'Close virtual page', 'Upcoming lectures');
                document.title = 'Degordian Academy';
            });

            $('.call-upcomes-lectures').click(function(e) {
                e.preventDefault();
                tmVirtualPage('/upcoming-lectures/', 'Upcoming lectures');
                document.title = 'Lectures | Degordian Academy';

                if(comFunct.isDesktop()){
                    leftPos = '0px';
                } else if(comFunct.isMobileDevice() && comFunct.getViewport('width') > 767 && comFunct.getViewport('width') < 1025 ) {
                    leftPos = '0px';
                } else {
                    leftPos = '0px';
                }

                if($(this).hasClass('gray')){
                    animdelay = 0.6;
                } 
                else {
                    animdelay = 0;
                }
                var scroolToAnchor = $(this).data('scroll-to-target');
                TweenLite.to($("html, body"), 0.5, { scrollTop: $(scroolToAnchor).offset().top, ease:Power2.easeIn, onComplete: function(){$('.overlay').addClass('show');}});

                TweenLite.to($(this).attr('href'), 0.5, {css: {left: leftPos}, delay: 0.5, ease:DAnimation.bezier(0.14,0.46,0,0.95)});
            });

            $('.confirm').click(function(e) {
                e.preventDefault();
                $('.overlay').removeClass('show');
                tmEvent('Buttons', 'Click', 'Confirm spot');
                TweenLite.to($('.lectures-wrapper'), 0.5, {css: {left: '130%'}, ease:Power2.easeOut, delay: 0.2});
                TweenLite.to($("html, body"), 0.8, { scrollTop: $('.form-wrapper').offset().top, delay: 0.7, ease: Power2.easeInOut});
            });

            $('.view-link').click(function(e) {
                e.preventDefault();
                $('.overlay').removeClass('show');
                tmEvent('Buttons', 'Click', 'View lectures & workshops timetable');
                TweenLite.to($('.lectures-wrapper'), 0.5, {css: {left: '130%'}, ease:Power2.easeOut, delay: 0.2});
                TweenLite.to($("html, body"), 0.8, { scrollTop: $('.form-wrapper').offset().top, delay: 0.7, ease: Power2.easeInOut});
            });

            main.scrollToSectionPlugin();
            if(comFunct.isDesktop()) {
                main.waypointPlugin();
            }
                main.waypointPlugin2();

            // CHECKBOXES
            $('.lectures-box').click(function(e){
                e.preventDefault();
                // $(this).toggleClass('ctive');
                var box = $(this).data('box');
                var val = $('#'+box).val()
                $('#'+box).val(val == 0 ? 1 : 0);
            });

            // SUBMIT FORM
            $('input#submit').click(function(){
                sendContact();
            });
        },
        start: function (){
            $("[data-transform]").each(function(){

                //Set to starting point
                var string = $(this).data('from');
                var condition = "none";
                var setExpression = 'none';
                var noExpression = 'none';
                var properties = string.split(', ');
                var obj = {};
                properties.forEach(function(property) {
                    var tup = property.split(':');

                    if(tup[0] == 'condition'){
                        condition = tup[1];
                    }else if(tup[0] == 'setExpression'){
                        setExpression = tup[1]
                    }else if(tup[0] == 'noExpression'){
                        noExpression = tup[1]
                    }else{
                        obj[tup[0]] = tup[1];
                    }

                });

                if(noExpression != 'none' && $("[" + noExpression + "]").length > 0 ){
                    return false;
                }
                if(setExpression != 'none' ){
                    $('body').attr(setExpression, 'on')
                }
                if($('[data-service="on"]').length <= 0){
                    $('body').removeAttr('submenuNoAnimate');
                }

                var css = obj;
                if(condition != 'none' && $(this).hasClass(condition)){
                    $(this).css(css);
                    //comFunct.log($(this).html());
                }else if(condition == 'none'){
                    $(this).css(css);

                }
            });
        },
        animate: function (){
            $("[data-transform]").each(function(){
                var string = $(this).data('to');
                //comFunct.log(string);
                var properties = string.split(', ');
                var obj = {};

                var delay = 0;
                var duration = 1;
                var animation = "Power1.easeOut";
                var condition = "none";

                properties.forEach(function(property) {
                    var tup = property.split(':');
                    if(tup[0] == 'delay'){
                        delay = tup[1];
                    }else if(tup[0] == 'animation'){
                        animation = tup[1];
                    }else if(tup[0] == 'duration'){
                        duration = tup[1];
                    }else if(tup[0] == 'condition'){
                        condition = tup[1];
                    }else {
                        obj[tup[0]] = tup[1];
                    }
                });

                if(condition != 'none' && $(this).hasClass(condition)){
                    TweenLite.to($(this), duration, {css: obj, delay:delay, ease:animation, force3D:true});
                }else if(condition == 'none'){
                    TweenLite.to($(this), duration, {css: obj, delay:delay, ease:animation, force3D:true});

                }
            });
        },
        scrollToSectionPlugin: function () {
            $(document).on('click', '[data-scrool-to="on"]', function (e) {
                e.preventDefault();

                var scroolToAnchor = $(this).data('scroll-to-target');
                TweenLite.to($("html, body"), 1, { scrollTop: $(scroolToAnchor).offset().top, ease: Expo.easeInOut});

            });
        },
        waypointPlugin: function() {

            $('.title-wrapper').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.overlay').removeClass('show');
                    TweenLite.to($('#lectures-wrapper'), 0.5, {css: {left: '130%'}, ease:Expo.easeInOut});
                } else if (direction === 'up') {
                }

            }, {
                offset: 300
            });
        },
        waypointPlugin2: function() {

            $('.form-wrapper').waypoint(function (direction) {
                tmVirtualPage('/signup/', 'Signup');
                document.title = 'Signup | Degordian Academy';
            }, {
                offset: 0
            });
        }

    };

    $(window).resize(function () {
    });

    return {
        main: main.init()
    };

}($));


var windowHeight = $(window).height();
/********GOOGLE MAPS**********/
var contentString = 'aaa';
var infowindow;
var markers = [];
var iterator = 0;
var marker;
var map;
var directionsDisplay;
var coord;
var latlng;
var directionPanelWidth;
var mapWidth;
var display;
var latLng2;
var image;
var mrk = [];
var self;
var MY_MAPTYPE_ID = 'degordian';

var gmap = ({
    init: function () {
        self = this;

        if($('#map').length > 0){
            self.initialize();
            setTimeout(self.drop,1000);
        }

        infowindow = new google.maps.InfoWindow({
            content: 'bla bla'
        });

        image = new google.maps.MarkerImage('static/img/pin@2x.png',
            new google.maps.Size(20, 24),
            new google.maps.Point(0,0),
            new google.maps.Point(12, 39)
        );
    },
    initialize: function() {

        var featureOpts =

            [{
                featureType: "administrative",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "road",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "water",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "transit",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "landscape",
                stylers: [{
                    visibility: "simplified"
                }]
            }, {
                featureType: "road.highway",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "road.local",
                stylers: [{
                    visibility: "on"
                }]
            }, {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{
                    visibility: "on"
                }]
            }, {
                featureType: "road.arterial",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "water",
                stylers: [{
                    color: "#5f94ff"
                }, {
                    lightness: 26
                }, {
                    gamma: 5.86
                }]
            }, {}, {
                featureType: "road.highway",
                stylers: [{
                    weight: 0.6
                }, {
                    saturation: -85
                }, {
                    lightness: 61
                }]
            }, {
                featureType: "road"
            }, {}, {
                featureType: "landscape",
                stylers: [{
                    hue: "#0066ff"
                }, {
                    saturation: 74
                }, {
                    lightness: 100
                }]
            }
            ];

        coord = $('#map').attr('rel').split('|');
        var myOptions = {
            zoom: 15,
            scrollwheel: false,
            center: new google.maps.LatLng(coord[0],coord[1]), //
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
            },
            // mapTypeId: MY_MAPTYPE_ID
        };
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        // directionsDisplay.setMap(map);
        // directionsDisplay.setPanel(document.getElementById("directionsPanel"));

        // var styledMapOptions = {
        //     name: 'Custom Style'
        // };
        // var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

        // map.mapTypes.set(MY_MAPTYPE_ID, customMapType);


        gmap.otherOptions();
    },
    drop: function() {
        setTimeout(function() {
            coord = $('#map').attr('rel').split('|');
            latLng2 = new google.maps.LatLng(coord[0],coord[1]); //
            self.addMarker();
        });
    },
    setMapsVar: function() {
        directionPanelWidth = 250;
        mapWidth = 370;
        display = "block";
    },
    addMarker: function(_latLng) {
        markers.push(new google.maps.Marker({
            position: latLng2,
            map: map,
            draggable: false,
            icon: image,
            animation: google.maps.Animation.DROP
        }));

        markers[markers.length-1].content = content;
        iterator++;
    },
    otherOptions: function() {
        /*google.maps.event.addListener(map, 'center_changed', function() {
         // 3 seconds after the center of the map has changed, pan back to the
         // marker.
         window.setTimeout(function() {
         map.panTo(marker.getPosition());
         }, 3000);
         });

         google.maps.event.addListener(marker, 'click', function() {
         map.setZoom(8);
         map.setCenter(marker.getPosition());
         });
         */
    }
});

$(window).resize(function () {
});

gmap.init();


function buildUrl(url, parameters){
    var qs = "";
    for(var key in parameters) {
        var value = parameters[key];
        if(!value){continue}
        value = value.toString().split('\"').join('"');
        qs += key + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0){
        qs = qs.substring(0, qs.length-1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
}


var socialShare = ({
    init: function(id){

        // take vars
        var share_url           = $('#'+id).data('share-link');
        var share_image         = $('#'+id).data('share-image');
        var title               = $('#'+id).data('share-title');
        var description         = $('#'+id).data('share-description');

        // create urls
        var fb_url = buildUrl(
            'http://www.facebook.com/sharer.php',{
                's':100
                ,'p[url]': (share_url)
                // ,'p[title]': title
                // ,'p[summary]': description
            });

        var tw_url = buildUrl(
            'http://twitter.com/intent/tweet',{
                'text': description.substring(0,102)+'...'
                ,'via': 'degordian'
                ,'hashtags': 'degordianacademy'
            });
        var gp_url = buildUrl(
            ' https://plus.google.com/share',{
                'url': share_url
            });
        var li_url = buildUrl(
            'http://www.linkedin.com/shareArticle',{
                'mini': 'true'
                ,'url': (share_url)
                ,'title': (title)
                ,'source': 'Degordian Academy'
                ,'summary': (description)
            });
        var em_url = buildUrl(
            'mailto:friend@gmail.com',{
                'subject':'Degordian%20Academy'
                ,'body':encodeURIComponent(share_url)
            });
        // var Pt_url = "http://pinterest.com/pin/create/bookmarklet/?media=" + encodeURIComponent(share_image) + "&url=" + encodeURIComponent(share_url) + "& is_video=false&description=" + description;

        // apply urls
        $('#'+id+' a.fb-share').attr('href', fb_url);
        $('#'+id+' a.tw-share').attr('href', tw_url);
        $('#'+id+' a.gp-share').attr('href', gp_url);
        $('#'+id+' a.li-share').attr('href', li_url);
        $('#'+id+' a.em-share').attr('href', em_url);
    }
});

socialShare.init('social-1');
socialShare.init('social-2');
socialShare.init('social-3');
socialShare.init('social-4');
socialShare.init('social-5');
// socialShare.init('social-6');