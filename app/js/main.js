var $ = jQuery;

var pTags = $(document).find("p");
  for (var i=0; i<pTags.length; i++) {
	var elm = pTags[i];

	if ($(elm).html().replace(/\s|&nbsp;/g, '').length == 0) {
	  $(elm).remove();
	}
}

// number of loaded images for preloader progress
var loadedCount = 0; //current number of images loaded
var imagesToLoad = $('.bcg .bcg-img').length; //number of slides with .bcg container
var loadingProgress = 0; //timeline progress - starts at 0

$('.bcg .bcg-img').imagesLoaded({
    background: true
  }
).progress( function( instance, image ) {
  loadProgress();
});

function loadProgress(imgLoad, image)
{
  //one more image has been loaded
  loadedCount++;

  loadingProgress = (loadedCount/imagesToLoad);

  //console.log(loadingProgress);

  // GSAP timeline for our progress bar
  TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});

}

//progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
var progressTl = new TimelineMax({paused:true,onUpdate:progressUpdate,onComplete:loadComplete});

progressTl
  //tween the progress bar width
  .to($('.progress span'), 1, {width:100, ease:Linear.easeNone});

//as the progress bar witdh updates and grows we put the precentage loaded in the screen
function progressUpdate()
{
  //the percentage loaded based on the tween's progress
  loadingProgress = Math.round(progressTl.progress() * 100);
  //we put the percentage in the screen
  $(".txt-perc").text(loadingProgress + '%');

}

function loadComplete() {

  // preloader out
  var preloaderOutTl = new TimelineMax();

  preloaderOutTl
    .to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
    .to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
    .set($('body'), {className: '-=is-loading'})
    .set($('#intro'), {className: '+=is-loaded'})
    .to($('#preloader'), 0.7, {yPercent: 100, ease:Power4.easeInOut})
    .set($('#preloader'), {className: '+=is-hidden'})
    .from($('#intro .title'), 1, {autoAlpha: 0, ease:Power1.easeOut}, '-=0.2')
    .from($('#intro p'), 0.7, {autoAlpha: 0, ease:Power1.easeOut}, '+=0.2')
    .from($('.scroll-hint'), 0.3, {y: -20, autoAlpha: 0, ease:Power1.easeOut}, '+=0.1');

  return preloaderOutTl;
}

var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.scrollmagicControls = function(options) {
      return this.each(function() {
          var scrollmagicControls = Object.create(Neu.scrollmagicControls);
          scrollmagicControls.init(this, options);
      });
  };

  $.fn.scrollmagicControls.options = {
      slides: ".slide",
      headers: ".main-container .slide .wrapper",
      blocks: ".content-block"
  };

  Neu.scrollmagicControls = {
      init: function(elem, options) {
          var self = this;
          self.$container = $(elem);
          self.options = $.extend({}, $.fn.scrollmagicControls.options, options);
          self.bindElements();
          self.bindEvents();

          $(document).ready( function() {
            // if (!Modernizr.touch) {
              self.triggerSlides();
            // }
          });
      },
      bindElements: function() {
        var self = this;

        self.$slides = self.$container.find(self.options.slides);
        self.$headers = self.$container.find(self.options.headers);
        self.$blocks = self.$container.find(self.options.blocks);
        self.controller = new ScrollMagic.Controller();
        num = 0;
    },
    bindEvents: function() {
      var self = this;
    },
    triggerSlides: function() {
      var self = this;
      $(self.options.headers).each(function(header, index) {
        var parentSlide = $(this).closest(".slide");
        num++;

        var headerScene = new ScrollMagic.Scene({
					triggerElement: this,
					offset: -95
				})
        .setClassToggle("#slide0"+num, "is-active")
        // .addIndicators({
      	// 	name: 'header scene',
      	// 	colorTrigger: 'blue',
      	// 	indent: 200,
      	// 	colorStart: '#00ff00'
      	// })
				.addTo(self.controller);
      });

      $(self.options.blocks).each(function(header, index) {
        var breakID = $(this).attr('id');

        var blockScene = new ScrollMagic.Scene({
					triggerElement: this,
					triggerHook: 0.75
				})
        .setClassToggle("#"+breakID, "is-active")
        // .addIndicators({
      	// 	name: 'block scene',
      	// 	colorTrigger: '#ff00ff',
      	// 	indent: 200,
      	// 	colorStart: '#00ff00'
      	// })
				.addTo(self.controller);
      });

      $(self.options.slides).each(function(header, index) {
        var slide = $(this);

        //parallax scenes
        var bcg = $(this).find(".bcg");

        var slideParallaxScene = new ScrollMagic.Scene({
					triggerElement: this,
          triggerHook: 1,
          duration: "100%"
				})
        .setTween(TweenMax.from(bcg, 1, {y: '-40%', autoAlpha: 0.3, ease:Power0.easeNone}))
        // .addIndicators({
      	// 	name: 'bcg scene',
      	// 	colorTrigger: 'navy',
      	// 	colorStart: 'pink'
      	// })
        .addTo(self.controller);

        // var pinSceneTl = new TimelineMax();
        // var h1 = $(this).find("h1");
        // var section = $(this).find("section");
        // var paragraph = $(this).find("p");
        // var altText = $(this).attr("data-altText");
        // var duration = $(this).attr("data-duration");
        //
        // pinSceneTl
  	    // 	.to(h1, 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
  	    // 	.to(section, 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
  	    // 	.set(h1, {text: ''})
  	    // 	.set(paragraph, {text: altText})
  	    // 	.fromTo(section, 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
  	    // 	.fromTo(section, 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
  	    // 	.set(paragraph, {autoAlpha: 1}, '+=2');
        //
        //   new ScrollMagic.Scene({
        //     triggerElement: this,
        //     triggerHook: 0,
        //     duration: duration
        //   })
        //   .setPin(this)
        //   .setTween(pinSceneTl)
        //   .addTo(self.controller);

      });

      //INTRO scene
      var introTl = new TimelineMax();

	    introTl
	    	.to($('#intro header, .scroll-hint'), 0.2, {autoAlpha: 0, ease:Power1.easeNone})
	    	//.to($('#intro .bcg'), 1.4, {y: '20%', ease:Power1.easeOut}, '-=0.2')
	    	.to($('#intro'), 0.7, {autoAlpha: 0.5, ease:Power1.easeNone}, 0);

  		var introScene = new ScrollMagic.Scene({
  	        triggerElement: '#intro',
  	        triggerHook: 0,
  	        duration: "100%"
  	    })
  	    .setTween(introTl)
        // .addIndicators({
      	// 	name: 'intro scene',
      	// 	colorTrigger: 'lightblue',
      	// 	colorStart: 'purple'
      	// })
  	    .addTo(self.controller);

    var pinScene01Tl = new TimelineMax();
    var altCap2 = $("#slide01 .bcg-img").data("altcap2");
    var altImg2 = $("#slide01 .bcg-img").data("altimg2");

     pinScene01Tl
       // .to($('#slide01 h1'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       // .to($('#slide01 section'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       .to($('#slide01 caption'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       .to($('#slide01 .bcg'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       // .to($('#slide01 .caption'), 1, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       // .set($('#slide01 h1'), {text: 'Rock Climbing'})
       .set($('#slide01 .caption'), {text: altCap2})
       .set($('#slide01 .bcg-img'), {css: "background-image: url('" + altImg2 + "')"})
       .fromTo($('#slide01 .bcg'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
       .fromTo($('#slide01 caption'), 0.8, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.4')
       // .fromTo($('#slide01 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
       // .fromTo($('#slide01 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
       // .to($('#slide01 .caption'), 0.2, {autoAlpha: 1, ease:Power1.easeOut},1.5)
       // .set($('#slide01 h1'), {autoAlpha: 1}, '+=2');

     var pinScene01 = new ScrollMagic.Scene({
         triggerElement: '#slide01',
         triggerHook: 0,
         duration: "250%"
     })
     .setPin("#slide01")
     .setTween(pinScene01Tl)
     .addTo(self.controller);

     // SCENE 7 - pin the second section
     // and update text

     var pinScene02Tl = new TimelineMax();
     var altText2 = $("#slide02").attr("data-altText");

     pinScene02Tl
       .to($('#slide02 h1'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       .to($('#slide02 section'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       // .to($('#slide02 .caption'), 1, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
       .set($('#slide02 h1'), {text: "The Memories"})
       .set($('#slide02 p'), {text: altText2})
       // .to($('#slide02 .bcg'), 0.6, {scale: 1.2, transformOrigin: '0% 0%', ease:Power0.easeNone})
       .fromTo($('#slide02 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
       .fromTo($('#slide02 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
       // .fromTo($('#slide02 .caption'), 0.6, {autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
       .set($('#slide02 h1'), {autoAlpha: 1}, '+=2.5');

     var pinScene02 = new ScrollMagic.Scene({
         triggerElement: '#slide02',
         triggerHook: 0,
         duration: "300%"
     })
     .setPin("#slide02")
     .setTween(pinScene02Tl)
     .addTo(self.controller);

      // change behaviour of controller to animate scroll instead of jump
  // self.controller.scrollTo(function (newpos) {
  //   TweenMax.to(window, 1, {scrollTo: {y: newpos}, ease:Power1.easeInOut});
  // });

  //  bind scroll to anchor links
  // $(document).on("click", "a[href^='#']", function (e) {
  //   var id = $(this).attr("href");
  //   if ($(id).length > 0) {
  //     e.preventDefault();
  //
  //     // trigger scroll
  //     self.controller.scrollTo(id);
  //
  //       // if supported by the browser we can even update the URL.
  //     if (window.history && window.history.pushState) {
  //       history.pushState("", document.title, id);
  //     }
  //   }
  // });
    }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".main-container").scrollmagicControls();
  });
})();
