/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global tau */

(function() {

	var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

	/**
	 * Rotates element.
	 * 
	 * @private
	 * @param {object}
	 *            digitElement - The object to slide
	 * @param {number}
	 *            digitToShow - The digit to display
	 */
	function slideDigit(digitElement, digitToShow) {
		// There are 12 digits on the strip. The first and last one are extra
		// ones which are only shown partially.
		var digitSizePx = 907 / 12.0;
		var constantOffset = -46; // Positions the first number to the
										// center of the background

		var currentDigit = Math.floor(digitToShow);

		var currentDigitRemainder = digitToShow % 1.0;

		var finalOffset = currentDigit + currentDigitRemainder	* currentDigitRemainder * currentDigitRemainder* currentDigitRemainder;

		var t = tau.animation.target;

		t(digitElement).tween({
			translateY : -(finalOffset) * digitSizePx + constantOffset
		}, {
			duration : 1000,
			ease: 'linear'
		});
	}

	/**
	 * Updates the current time.
	 * 
	 * @private
	 */
	function updateTime() {
		var dateTime = tizen.time.getCurrentDateTime(), secondToday = dateTime.getSeconds() + dateTime.getMinutes() * 60 + dateTime.getHours() * 3600,
		minDigitLeft = document.querySelector("#time-min-digit-left"),
		minDigitRight = document.querySelector("#time-min-digit-right"),
		hourDigitLeft = document.querySelector("#time-hour-digit-left"), 
		hourDigitRight = document.querySelector("#time-hour-digit-right");

		var minutesNow = (secondToday % 3600) / 60;
		var hourNow = (secondToday / 3600);
		slideDigit(minDigitRight, minutesNow % 10.0);
		slideDigit(minDigitLeft, minutesNow / 10.0);
		slideDigit(hourDigitRight, hourNow % 10.0);
		slideDigit(hourDigitLeft, hourNow / 10.0);
	}


	/**
	 * Updates battery icon and text.
	 * 
	 * @private
	 */
	function updateBattery() {
		var line = document.querySelector("#battery-red-line");
		console.log("BATTERYLEVEL " + battery.level)
		var width = (1 - battery.level) * 225; 
		line.style.width = width + "px";
	}

	/**
	 * Called when the visibility changes.
	 */
	function updateInformation() {
		updateBattery();

	}
	
	function slideRedLine() {
		var line = document.querySelector("#battery-red-line");

		var width = parseInt(line.style.width, 10); 
		var t = tau.animation.target;

		t(line).tween({
			translateX : [-width, 225]
		}, {
			duration : 3000
		});
		line.style.display = "block";

	}

	/**
	 * Changes display attribute of two elements when occur click event
	 * 
	 * @private
	 * @param {object}
	 *            element1 - The first element id for changing display
	 * @param {object}
	 *            element2 - The second element id for changing display
	 */
	function toggleElement(element1, element2) {
		if (document.querySelector(element1).style.display === "none") {
			document.querySelector(element1).style.display = "block";
			document.querySelector(element2).style.display = "none";
		} else {
			document.querySelector(element1).style.display = "none";
			document.querySelector(element2).style.display = "block";
		}
	}

	/**
	 * Binds events.
	 * 
	 * @private
	 */
	function bindEvents() {
		// Adds eventListener to update the screen immediately when the device
		// wakes up.
		document.addEventListener("visibilitychange", function() {
			if (!document.hidden) {
				updateTime();
				updateInformation();
			}
		});

		// Adds event listeners to update watch screen when the time zone is
		// changed.
		tizen.time.setTimezoneChangeListener(function() {
			updateTime();
			updateInformation();
		});

		// Adds event listeners to update battery state when the battery is
		// changed.
		battery.addEventListener("chargingchange", updateBattery);
		battery.addEventListener("chargingtimechange", updateBattery);
		battery.addEventListener("dischargingtimechange", updateBattery);
		battery.addEventListener("levelchange", updateBattery);
	}

	/**
	 * Initiates the application. Initializes watch(date and time) and
	 * informations(battery and air pollution).
	 * 
	 * @private
	 */
	function init() {
		bindEvents();
		updateTime();
		updateInformation();
		setInterval(function() {
			updateTime();
		}, 1000);
		
		setInterval(function() {
			slideRedLine();
		}, 5000);
	}

	window.onload = init;
}());