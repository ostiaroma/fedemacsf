var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/*
---

script: SlideShow.js

description: Easily extendable, class-based, slideshow widget. Use any element, not just images. Comes with packaged transitions but is easy to extend and create your own transitions.  The class is built to handle the basics of a slideshow, extend it to implement your own navigation piece and custom transitions.

license: MIT-style license.

authors: Ryan Florence

docs: http://moodocs.net/rpflo/mootools-rpflo/SlideShow

requires:
  - Loop

provides: [SlideShow]

...
*/


var SlideShow = new Class({
	
	Implements: [Options, Events, Loop],
		
		options: {
			/*
			onShow: $empty,
			onShowComplete: $empty,
			onReverse: $empty,
			onPlay: $empty,
			onPause: $empty
			*/
			delay: 7000,
			transition: 'crossFade',
			duration: '500',
			autoplay: false
		},
	
	initialize: function(element, options){
		this.setOptions(options);
		this.setLoop(this.showNext, this.options.delay);
		this.element = document.id(element);
		this.slides = this.element.getChildren();
		this.current = this.slides[0];
		this.setup();
		if(this.options.autoplay) this.startLoop();
	},
	
	setup: function(){
	  this.setupElement();
	  this.setupSlides();
		return this;
	},
	
	setupElement: function(){
		var el = this.element;
		if(el.getStyle('position') != 'absolute' && el != document.body) el.setStyle('position','relative');
		return this;
	},
	
	setupSlides: function(){
		this.slides.each(function(slide, index){
			this.storeTransition(slide).reset(slide);
			if(index != 0) slide.setStyle('display','none');
		}, this);
		return this;
	},
	
	storeTransition: function(slide){
		var classes = slide.get('class');
		var transitionRegex = /transition:[a-zA-Z]+/;
		var durationRegex = /duration:[0-9]+/;
		var transition = (classes.match(transitionRegex)) ? classes.match(transitionRegex)[0].split(':')[1] : this.options.transition;
		var duration = (classes.match(durationRegex)) ? classes.match(durationRegex)[0].split(':')[1] : this.options.duration;
		slide.store('ssTransition', transition);
		slide.store('ssDuration', duration);
		return this;
	},
	
	getTransition: function(slide){
		return slide.retrieve('ssTransition');
	},
	
	getDuration: function(slide){
		return slide.retrieve('ssDuration');
	},
	
	show: function(slide){
		this.fireEvent('show');
		slide = (typeof slide == 'number') ? this.slides[slide] : slide;
		if(slide != this.current){
			var transition = this.getTransition(slide);
			var duration = this.getDuration(slide);
			var previous = this.current.setStyle('z-index', 1);
			var next = this.reset(slide);
			this.transitions[transition](previous, next, duration, this);
			(function() { 
				previous.setStyle('display','none');
				this.fireEvent('showComplete');
			}).bind(this).delay(duration);
			this.current = next;
		}
		return this;
	},
	
	reset: function(slide){
		return slide.setStyles({
			'position': 'absolute',
			'z-index': 0,
			'display': 'block',
			'left': 0,
			'top': 0
		}).fade('show');
		return this;
	},
	
	nextSlide: function(){
		var next = this.current.getNext();
		return (next) ? next : this.slides[0];
	},

	previousSlide: function(){
		var previous = this.current.getPrevious();
		return (previous) ? previous : this.slides.getLast();
	},
	
	showNext: function(){
		this.show(this.nextSlide());
		return this;
	},
	
	showPrevious: function(){
		this.show(this.previousSlide());
		return this;
	},
	
	play: function(){
		this.startLoop();
		this.fireEvent('play');
		return this;
	},
	
	pause: function(){
		this.stopLoop();
		this.fireEvent('pause');
		return this;
	},
	
	reverse: function(){
		var fn = (this.loopMethod == this.showNext) ? this.showPrevious : this.showNext;
		this.setLoop(fn, this.options.delay);
		this.fireEvent('reverse');
		return this;
	}
	
});

SlideShow.adders = {
	
	transitions:{},
	
	add: function(className, fn){
		this.transitions[className] = fn;
		this.implement({
			transitions: this.transitions
		});
	},
	
	addAllThese : function(transitions){
		$A(transitions).each(function(transition){
			this.add(transition[0], transition[1]);
		}, this);
	}
	
}

$extend(SlideShow, SlideShow.adders);
SlideShow.implement(SlideShow.adders);

SlideShow.add('fade', function(previous, next, duration, instance){
	previous.set('tween',{duration: duration}).fade('out');
	return this;
});

SlideShow.addAllThese([

	['none', function(previous, next, duration, instance){
		previous.setStyle('display','none');
		return this;
	}],

	['crossFade', function(previous, next, duration, instance){
		previous.set('tween',{duration: duration}).fade('out');
		next.set('tween',{duration: duration}).fade('in');
		return this;
	}],
	
	['fadeThroughBackground', function(previous, next, duration, instance){
		var half = duration/2;
		next.set('tween',{
			duration: half
		}).fade('hide');
		previous.set('tween',{
			duration: half,
			onComplete: function(){
				next.fade('in');
			}
		}).fade('out');
	}],

	['pushLeft', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('width').toInt();
		next.setStyle('left', distance);
		[next, previous].each(function(slide){
			var to = slide.getStyle('left').toInt() - distance;
			slide.set('tween',{duration: duration}).tween('left', to);
		});
		return this;
	}],
	
	['pushRight', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('width').toInt();
		next.setStyle('left', -distance);
		[next, previous].each(function(slide){
			var to = slide.getStyle('left').toInt() + distance;
			slide.set('tween',{duration: duration}).tween('left', to);
		});
		return this;
	}],
	
	['pushDown', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('height').toInt();
		next.setStyle('top', -distance);
		[next, previous].each(function(slide){
			var to = slide.getStyle('top').toInt() + distance;
			slide.set('tween',{duration: duration}).tween('top', to);
		});
		return this;
	}],
	
	['pushUp', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('height').toInt();
		next.setStyle('top', distance);
		[next, previous].each(function(slide){
			var to = slide.getStyle('top').toInt() - distance;
			slide.set('tween',{duration: duration}).tween('top', to);
		});
		return this;
	}],
	
	['blindLeft', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('width').toInt();
		next
			.setStyles({
				'left': distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('left', 0);
		return this;
	}],

	['blindRight', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('width').toInt();
		next
			.setStyles({
				'left': -distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('left', 0);
		return this;
	}],
	
	['blindUp', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('height').toInt();
		next
			.setStyles({
				'top': distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('top', 0);
		return this;
	}],
	
	['blindDown', function(previous, next, duration, instance){
		var distance = instance.element.getStyle('height').toInt();
		next
			.setStyles({
				'top': -distance,
				'z-index': 1
			})
			.set('tween',{duration: duration})
			.tween('top', 0);
		return this;
	}],
	
	['blindDownFade', function(previous, next, duration, instance){
		this.blindDown(previous, next, duration, instance).fade(previous, next, duration, instance);
	}],
	
	['blindUpFade', function(previous, next, duration, instance){
		this.blindUp(previous, next, duration, instance).fade(previous, next, duration, instance);
	}],
	
	['blindLeftFade', function(previous, next, duration, instance){
		this.blindLeft(previous, next, duration, instance).fade(previous, next, duration, instance);
	}],
	
	['blindRightFade', function(previous, next, duration, instance){
		this.blindRight(previous, next, duration, instance).fade(previous, next, duration, instance);
	}]
	
]);

}
/*
     FILE ARCHIVED ON 18:57:18 Feb 02, 2011 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 13:31:24 Jul 07, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  load_resource: 184.956
  captures_list: 200.774
  esindex: 0.022
  exclusion.robots: 0.344
  CDXLines.iter: 19.045 (3)
  RedisCDXSource: 4.058
  PetaboxLoader3.datanode: 164.357 (4)
  LoadShardBlock: 155.624 (3)
  PetaboxLoader3.resolve: 148.815 (2)
  exclusion.robots.policy: 0.32
*/