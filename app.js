$(window).on("load", () => {
	let long, lat;
	let tempDesc = $(".temprature-desc");
	let tempDeg = $(".temprature-degree");
	let locationTimeZone = $(".location-timezone");
	let tempIcon = $(".wicon");
	let tempSection = $(".degree-section");
	let tempSpan = $(".degree-section span");
	let dayLabel = $(".day");
	let maxMinTemp = $(".max-min-temp");

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((pos) => {
			long = pos.coords.longitude;
			lat = pos.coords.latitude;
			const proxy = `https://cors-anywhere.herokuapp.com/`;
			const openWeatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=028a691f87ae6b42cd0c7b8560723ec8&units=metric`;
			fetch(openWeatherApi)
				.then((respon) => {
					return respon.json();
				})
				.then((data) => {
					getForecast(data);

					// // Set DOM Ele from the API
					tempDeg.text(data.current.temp);
					tempSpan.css("display", "block");
					locationTimeZone.text(data.timezone);
					tempDesc.text(data.current.weather[0].description);

					// Change temp to C/F
					tempSection.on("click", () => {
						if (tempSpan.text() === "F") {
							tempSpan.text("C");
							tempDeg.text(data.current.temp);
							getForecast(data);
						} else chanageToF(data);
					});
				});
		});

		function chanageToF(data) {
			tempDeg.text(Math.floor((tempDeg.text() / 5) * 9 + 32));
			tempSpan.text("F");

			for (let index = 0; index < 5; index++) {
				maxMinTemp[index].textContent = `${Math.floor(
					(data.daily[index + 1].temp.max / 5) * 9 + 32
				)} / ${Math.floor((data.daily[index + 1].temp.min / 5) * 9 + 32)}`;
			}
		}

		function timeStampToLocal(timeStamp, opt) {
			// multiplied by 1000 so that the argument is in milliseconds, not seconds.
			let date = new Date(timeStamp * 1000);

			// array of days reponding to the array index given by the api for day
			let days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			if (opt === "time") {
				// Hours part from the timestamp
				let hours = date.getHours();
				// Minutes part from the timestamp
				let minutes = "0" + date.getMinutes();
				// Seconds part from the timestamp
				let seconds = "0" + date.getSeconds();
				// Will display time in 10:30:23 format
				let formattedTime = hours + ":" + minutes.substr(-2);

				console.log(formattedTime);
				return formattedTime;
			} else if (opt === "day") {
				let day = days[date.getDay()];
				// console.log(day);
				return day;
			}
		}

		function getForecast(data) {
			for (let index = 0; index < 5; index++) {
				dayLabel[index].textContent = timeStampToLocal(
					data.daily[index + 1].dt,
					"day"
				);

				maxMinTemp[index].textContent = `${Math.floor(
					data.daily[index + 1].temp.max
				)} / ${Math.floor(data.daily[index + 1].temp.min)}`;
			}
			dayLabel.css("display", "flex");
			maxMinTemp.css("display", "flex");
		}
	}
});
