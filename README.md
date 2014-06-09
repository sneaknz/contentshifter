# Contentshifter plugin

A plugin for specifying alternate locations for blocks of content within a page. Useful for moving content for mobile layouts.

## Usage

Specify the alternate locations for a block of content by passing in a properly formatted JSON object on the `data-shift` attribute:

	<section data-shift='{"mobile": "#mobile"}'>
		<p>This block will move to the #mobile element.</p>
	</section>

And make sure you have an element with the matching ID for the alternate location somewhere. This is where the content will move to when called:
	
	<div id="mobile"></div>

If you want the content to be in different places when different criteria are met (e.g. specific breakpoints), then specify multiple locations in the `data-shift` object:
	
	<section data-shift='{"mobile": "#mobile", "tablet": "#tablet"}'>
		...
	</section>
	
To initialise the plugin, call it first:

	var shifter = $('body').contentshifter();
	
By default it will look for all elements that have a `data-shift` attribute and set those up for shifting. Once initialised, you can then call the shift actions with a line like this:

	shifter.contentshifter("shift", "mobile");

The first parameter is the function call, and the second is the key name for an alternate location. In this example, all elements that have a location for 'mobile' specified in the `data-shift` object will get shifted to their destination element, unless they are already there. Anything that doesn't match will be moved back to their original location.