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
	/**
	 * ARR_COLOR - Color string array for displaying air pollution and battery
	 * level. ARR_MONTH - Month string array for displaying month-text.
	 * URL_WEATHER_DATA - Address of file contains weather information.
	 * URL_AIR_POLLUTION_DATA - Address of file contains air pollution
	 * information. battery - Object contains the devices's battery information.
	 * updateTimer - Object contains date update timer
	 */
	var ARR_COLOR = [ "red", "orange", "yellow", "green", "blue" ], ARR_MONTH = [
			"JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY",
			"AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ],

	battery = navigator.battery || navigator.webkitBattery
			|| navigator.mozBattery, updateTimer;

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
		// digitElement.style.top = -(finalOffset) * digitSizePx +
		// constantOffset + "px";
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
		var elBatteryIcon = document.querySelector("#battery-icon"), elBatteryStatus = document
				.querySelector("#battery-status"), elBatteryText = document
				.querySelector("#battery-text"), batteryLevel = Math
				.floor(battery.level * 100), batteryGrade = Math
				.floor(batteryLevel / 20), statusColor = ARR_COLOR[batteryGrade];

		elBatteryIcon.style.backgroundImage = "url('./image/color_status/battery_icon_"
				+ statusColor + ".png')";
		elBatteryStatus.style.backgroundImage = "url('./image/color_status/"
				+ statusColor + "_indicator.png')";
		elBatteryText.innerHTML = batteryLevel + "%";
	}

	/**
	 * Updates date and time.
	 * 
	 * @private
	 */
	function updateWatch() {
		updateTime();
	}

	/**
	 * Called when the visibility changes.
	 */
	function updateInformation() {
		var line = document.querySelector("#battery-red-line");
		line.style.width = "60px";

	}
	
	function slideRedLine() {
		console.log("SLIDELINE");
		var line = document.querySelector("#battery-red-line");
		line.style.width = width;

		var width = line.width;
		var t = tau.animation.target;

		t(line).tween({
			translateX : [-width, 225]
		}, {
			duration : 3000
		});

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
		/**
		 * elBattery - Element contains battery icon, status and text elAir -
		 * Element contains air pollution icon, status and text
		 */
		var elBattery = document.querySelector("#body-battery"), elAir = document
				.querySelector("#body-air");

		// Adds eventListener to update the screen immediately when the device
		// wakes up.
		document.addEventListener("visibilitychange", function() {
			if (!document.hidden) {
				updateWatch();
				updateInformation();
			}
		});

		// Adds event listeners to update watch screen when the time zone is
		// changed.
		tizen.time.setTimezoneChangeListener(function() {
			updateWatch();
			updateInformation();
		});

		// Adds event listeners to update battery state when the battery is
		// changed.
		battery.addEventListener("chargingchange", updateBattery);
		battery.addEventListener("chargingtimechange", updateBattery);
		battery.addEventListener("dischargingtimechange", updateBattery);
		battery.addEventListener("levelchange", updateBattery);

		// Adds event listeners to change displaying child element when the
		// battery element is clicked.
		elBattery.addEventListener("click", function() {
			toggleElement("#battery-icon", "#battery-text");
		});

		// Adds event listeners to change displaying child element when the air
		// pollution element is clicked.
		elAir.addEventListener("click", function() {
			toggleElement("#air-icon", "#air-text");
		});
	}

	/**
	 * Initiates the application. Initializes watch(date and time) and
	 * informations(battery and air pollution).
	 * 
	 * @private
	 */
	function init() {
		bindEvents();
		updateWatch();
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