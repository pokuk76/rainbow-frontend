import React from 'react';
import Icon from '@ant-design/icons';

import { RainbowSVG } from '../static/rainbowLogoSVG.js';
import { RainbowLogoSVG } from '../static/rainbowLogoFullSVG.js';

const DeleteSVG = () => (
	<svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
		<g>
			<path d="M326.039,513.568h-69.557v-9.441c0-10.531,2.12-19.876,6.358-28.034
		c4.239-8.156,13.165-18.527,26.783-31.117l12.33-11.176c7.322-6.678,12.684-12.973,16.09-18.882
		c3.4-5.907,5.105-11.817,5.105-17.727c0-8.99-3.084-16.022-9.248-21.098c-6.166-5.073-14.773-7.611-25.819-7.611
		c-10.405,0-21.646,2.152-33.719,6.455c-12.075,4.305-24.663,10.693-37.765,19.171v-60.5c15.541-5.395,29.735-9.375,42.582-11.946
		c12.843-2.568,25.241-3.854,37.186-3.854c31.342,0,55.232,6.392,71.678,19.171c16.439,12.783,24.662,31.439,24.662,55.973
		c0,12.591-2.506,23.862-7.516,33.815c-5.008,9.956-13.553,20.649-25.625,32.08l-12.332,10.983
		c-8.736,7.966-14.451,14.354-17.148,19.171s-4.045,10.115-4.045,15.896V513.568z M256.482,542.085h69.557v68.593h-69.557V542.085z"
			/>
		</g>
		<circle cx="299.76" cy="439.067" r="218.516" />
		<g>

			<rect x="267.162" y="307.978" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)" width="65.545" height="262.18" />

			<rect x="266.988" y="308.153" transform="matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)" width="65.544" height="262.179" />
		</g>
	</svg>
);

export const DeleteIcon = props => <Icon component={DeleteSVG} {...props} />;
export const RainbowIcon = props => <Icon component = {RainbowSVG} {...props}/>;
export const RainbowLogoIcon = props => <Icon component = {RainbowLogoSVG} {...props}/>;
export default <div></div>;