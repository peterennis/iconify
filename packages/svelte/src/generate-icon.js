import { defaults } from '@iconify/core/lib/customisations';
import {
	flipFromString,
	alignmentFromString,
} from '@iconify/core/lib/customisations/shorthand';
import { rotateFromString } from '@iconify/core/lib/customisations/rotate';
import { fullIcon } from '@iconify/core/lib/icon';
import { iconToSVG } from '@iconify/core/lib/builder';
import { replaceIDs } from '@iconify/core/lib/builder/ids';
import { merge } from '@iconify/core/lib/misc/merge';

/**
 * Default SVG attributes
 */
const svgDefaults = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
	'aria-hidden': true,
	'focusable': false,
	'role': 'img',
};

/**
 * Generate icon from properties
 */
export function generateIcon(props) {
	let iconData = fullIcon(props.icon);
	if (!iconData) {
		return {
			attributes: svgDefaults,
			body: '',
		};
	}

	const customisations = merge(defaults, props);
	const componentProps = merge(svgDefaults);

	// Create style if missing
	let style = typeof props.style === 'string' ? props.style : '';

	// Get element properties
	for (let key in props) {
		const value = props[key];
		switch (key) {
			// Properties to ignore
			case 'icon':
			case 'style':
				break;

			// Flip as string: 'horizontal,vertical'
			case 'flip':
				flipFromString(customisations, value);
				break;

			// Alignment as string
			case 'align':
				alignmentFromString(customisations, value);
				break;

			// Color: copy to style
			case 'color':
				style = 'color: ' + value + '; ' + style;
				break;

			// Rotation as string
			case 'rotate':
				if (typeof value !== 'number') {
					customisations[key] = rotateFromString(value);
				} else {
					componentProps[key] = value;
				}
				break;

			// Remove aria-hidden
			case 'ariaHidden':
			case 'aria-hidden':
				if (value !== true && value !== 'true') {
					delete componentProps['aria-hidden'];
				}
				break;

			// Copy missing property if it does not exist in customisations
			default:
				if (defaults[key] === void 0) {
					componentProps[key] = value;
				}
		}
	}

	// Generate icon
	const item = iconToSVG(iconData, customisations);

	// Add icon stuff
	for (let key in item.attributes) {
		componentProps[key] = item.attributes[key];
	}

	if (item.inline) {
		style = 'vertical-align: -0.125em; ' + style;
	}

	// Style
	if (style !== '') {
		componentProps.style = style;
	}

	// Generate HTML
	return {
		attributes: componentProps,
		body: replaceIDs(item.body),
	};
}
