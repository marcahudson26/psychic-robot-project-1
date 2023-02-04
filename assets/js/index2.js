let locationInput = "birmingham"
let completeLocationName;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '7459094a29mshad16f6228de91d6p184fa3jsncd93466b41d1',
        'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
    }
};

getGeolocation()
function getGeolocation () {   
    // get info on location full address, lat/lon and location id for restaurant search
    fetch(`https://the-fork-the-spoon.p.rapidapi.com/locations/v2/auto-complete?text=${locationInput}`, options)
        .then(response => response.json())
        .then(completedLocation => {
            // retrieve autocompleted location id, name & type
            let locationId = completedLocation.data.geolocation[0].id.id;
            let geoText = completedLocation.data.geolocation[0].name.text;
            let locationType = completedLocation.data.geolocation[0].id.type;
            // convert location text to api format
            geoText = geoText.replace(/,/g, '%2C');
            geoText = geoText.replace(/ /g, '%20');
            return fetch(`https://the-fork-the-spoon.p.rapidapi.com/locations/v2/list?google_place_id=${locationId}&geo_ref=false&geo_text=${geoText}&geo_type=${locationType}`, options)
        })

        .then(response => response.json())
	    .then(cityGeo => {
            let lat = cityGeo.coordinates.latitude;
            let lon = cityGeo.coordinates.longitude;
            let cityId = cityGeo.id_city;
            let fullAddress = cityGeo.prediction.address_components;
            completeLocationName = fullAddress;
            // console.log(fullAddress);
            return getRestaurants (cityId)
        })
        .catch(err => console.error(err));
}

function getRestaurants (cityId) {
    // get list of restaurant in nearby
    fetch(`https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/list?queryPlaceValueCityId=${cityId}&pageSize=10&pageNumber=1`, options)
	.then(response => response.json())
	.then(restaurants => {
        let restaurantsData = restaurants.data
        return renderNearbyRestaurants (restaurantsData)
        })
	.catch(err => console.error(err));  
}

function renderNearbyRestaurants (restaurantsData) {
    // render restaurant list to page
    for (let i = 0; i < restaurantsData.length; i++) {
        const restaurant = restaurantsData[i];
        console.log(restaurantsData[0])
        let restaurantBtns = document.createElement("div");
        restaurantBtns.innerHTML = `
                                    <button>${restaurant.name}</button>
                                    `;
        document.querySelector("#restaurant-container").append(restaurantBtns);
    }    
}