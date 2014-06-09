;(function($) {

	// Setup and utilities
	var namespace = 'contentshifter';
	var logError = typeof console === 'undefined' ? function() {} : function( message ) { console.error( message ); };
	
	var Shifter = function(element, options) {
		this.$el = $( element );
		this.options = $.extend( true, {}, this.defaults, options );
		this.$placeholder = $('<div class="' + this.options.placeholderClass + '" style="display:none;"></div>');
		this._init();
	};
	
	Shifter.prototype = {
		defaults: {
			placeholderClass: 'shift-placeholder',
			containerClass: 'shift-destination'
		},
		
		_init: function() {
			var me = this;
			
			me.blocks = [];
			me.$blocks = me.$el.find('[data-shift]');
			
			// Set up blocks of content for switching
			me.$blocks.each(function(index) {
				var $p = me.$placeholder.clone();
				
				me.blocks.push({
					$el: $(this),
					$origin: $p,
					locations: {},
					current: "",
					atOrigin: true
				});
				
				var block = me.blocks[index];
				block.shift = block.$el.data('shift');
				
				// Add locations for shift
				if ( block.shift ) {
					for (var i in block.shift) {
						block.locations[i] = me.$el.find( block.shift[i] );
					}
				
					block.$origin.insertBefore( block.$el );
				} else {
					logError('You must add values in the data-shift attribute if you want elements shifted.');
				}
			});
		},
		
		shift: function(breakpoint) {
			// Shift all the items for a given breakpoint
			var me = this;
			
			for (var i in me.blocks) {
				var block = me.blocks[i],
					shift = false,
					shiftTo;
				
				// Check if the block has a value for the breakpoint
				for (var b in block.locations) {
					if ( b == breakpoint) {
						shift = true;
						shiftTo = b;
					}
				}
				
				if ( shift ) {
					// Move that sucka!
					if ( block.current !== breakpoint ) {
						block.locations[shiftTo].append( block.$el );
						block.current = breakpoint;
						block.atOrigin = false;
					}
				} else {
					// If the block has been moved, put it back
					if ( !block.atOrigin ) {
						block.$el.insertAfter( block.$origin );
						block.current = '';
						block.atOrigin = true;
					}
				}
			}
		},
		
		option: function(opts) {
			if ( $.isPlainObject( opts ) ) {
				this.options = $.extend( true, this.options, opts );
			}
		}
	};
	
	$.fn[namespace] = function( options ) {
	
		if ( typeof options === 'string' ) {
			// call plugin method when first argument is a string
			// get arguments for method
			var args = Array.prototype.slice.call( arguments, 1 );

			for ( var i=0, len = this.length; i < len; i++ ) {
				var elem = this[i];
				var instance = $.data( elem, namespace );
				if ( !instance ) {
					logError( "cannot call methods on " + namespace + " prior to initialization; " +
					"attempted to call '" + options + "'" );
					continue;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
					logError( "no such method '" + options + "' for " + namespace + " instance" );
					continue;
				}

				// trigger method with arguments
				var returnValue = instance[ options ].apply( instance, args );

				// break look and return first value if provided
				if ( returnValue !== undefined ) {
					return returnValue;
				}
			}
			// return this if no return value
			return this;
		} else {
			return this.each( function() {
				var instance = $.data( this, namespace );
				if ( instance ) {
					// apply options & init
					instance.option( options || {} );
					instance._init();
				} else {
					// initialize new instance
					instance = new Shifter( this, options );
					$.data( this, namespace, instance );
				}
			});
		}
	};
	

})(jQuery);