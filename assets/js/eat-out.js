let locationInput;
let searchedCities = [];
let favRestaurants = [];
let completeLocationName;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'effe14985cmsh962d7b641918161p1bf3e5jsn92b6af363b24',
        'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
    }
};

init()
function init() {
    // Display form to search for restaurants by city
    renderSearchCityForm();
    // Display search history on page
    renderSearchHistory();
}

// Function to render form to search city for restaurants available
function renderSearchCityForm() {
    let searchForm = document.createElement("form");
    searchForm.setAttribute("class", "search-form col-lg-12 text-center");
    searchForm.innerHTML = `
    <div class="mb-3">
    <label for="inputCity" class="form-label fs-1 fw-bold text-center">WHAT CITY WOULD YOU LIKE TO SEARCH?</label>
    <input type="text" class="form-control" id="inputCity" aria-describedby="inputCityHelp" placeholder="London, York, Birmigham...">
    <div id="inputCityHelp" class="form-text">Please enter your city name.</div>
    </div>
    <button type="submit" class="btn btn-primary search-city-btn" id = "find-restaurants">Submit</button>
    `;
    document.querySelector("#city-input").append(searchForm);
}

// Function to handle click on button to find restaurants in city
function findRestaurant(event) {
    // Prevent searh form default to save form input
    event.preventDefault();
    // Store search input value (i.e, name of city)
    locationInput = document.querySelector("#inputCity").value

    if (locationInput === "") {
        // if no city is entered
        document.querySelector("#inputCityHelp").style.color = "red";
        document.querySelector("#inputCityHelp").style.fontSize = "1.275em";
        return;
    }
    document.querySelector("#inputCityHelp").style.color = 'black'
    document.querySelector("#inputCityHelp").style.fontSize = ".875em";
    storeSearchedCity();
    // find restaurants available for inputted city
    getGeolocation();
}

// Function to store searched cities to local storage
function storeSearchedCity() {
    isSearchHistory = localStorage.getItem("searchHistory")
    if (isSearchHistory) {
        // If there is search hitory update searched cities array
        searchedCities = JSON.parse(localStorage.getItem("searchHistory"));
    }
    else if (searchedCities === null) {
        // If there is no search history reset class from null to array
        searchedCities = [];
    }
    searchedCities.push(locationInput);
    // Reverse searched cities array and remove duplicates
    searchedCities = [...new Set(searchedCities.reverse())];
    // Store reveresed array in search history local storage 
    localStorage.setItem("searchHistory", JSON.stringify(searchedCities.reverse()));
    // Clear search input value
    document.querySelector("#inputCity").value = "";
}

// Function to find lon, lat and city id for searched city
function getGeolocation() {
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
            return getRestaurants(cityId)
        })
        .catch(err => console.error(err));
}

// Function to find restaurants available in searched city
function getRestaurants(cityId) {
    // get list of restaurant in nearby
    fetch(`https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/list?queryPlaceValueCityId=${cityId}&pageSize=10&pageNumber=1`, options)
        .then(response => response.json())
        .then(restaurants => {
            let restaurantsData = restaurants.data
            return renderNearbyRestaurants(restaurantsData)
        })
        .catch(err => console.error(err));
}

// Function to display restaurants found for searched city
function renderNearbyRestaurants(restaurantsData) {
    // Reset content for restaurants container
    document.querySelector("#restaurant-container").textContent = "";
    // Display styles for restaurants container (i.e., change style from display none to block)
    document.getElementById("restaurant-container").style.display = "block"
    // document.querySelector("#complete-input-city").textContent = completeLocationName
    // render restaurant list to page
    for (let i = 0; i < restaurantsData.length; i++) {
        const restaurant = restaurantsData[i];
        let restaurantBtns = document.createElement("div");
        restaurantBtns.setAttribute("id", "restaurantDiv")
        restaurantBtns.setAttribute("class", "row")
        restaurantBtns.innerHTML = `
                                    <button class="restaurant-button col-lg-9" id= "${restaurant.id}" >${restaurant.name}</button>
                                    <button class="col-lg-2" id = "fav-btn"><i class="fas fa-star fav-icon"></i></button>
                                    <div id="restaurantInfo" class="hideRestaurantInfo col-lg-11">
                                        <div class="card card-body restaurant-card">
                                            <img src="${restaurant.mainPhotoSrc}" class="card-img-top" alt="restaurant cover image">
                                            <div class="card-body">
                                                <h5 class="card-title">Address</h5>
                                                <p class="card-text">Street: ${restaurant.address.street}</p>
                                                <p class="card-text">Postcode: ${restaurant.address.postalCode}</p>
                                                <p class="card-text">Locality: ${restaurant.address.locality}</p>
                                                <p class="card-text">Country: ${restaurant.address.country}</p>
                                                <h5 class="card-title">The fork Rating</h5>
                                                <p class="card-text">${restaurant.aggregateRatings.thefork.ratingValue}</p>
                                                <h5 class="card-title">Cuisine</h5>
                                                <p class="card-text">${restaurant.servesCuisine}</p>
                                            </div>
                                        </div>
                                    </div>
                                    `;
        document.querySelector("#restaurant-container").append(restaurantBtns);
    }
    // Event listener to store favorite restaurants in search history 

    document.querySelector("#restaurant-container").addEventListener("click", addFavorite);
    // Event listener to display restaurant info 
    document.querySelector("#restaurant-container").addEventListener("click", renderRestaurantInfo);
    // Display updated search history on page
    renderSearchHistory();
}


// Function to render search history 
function renderSearchHistory() {
    // Reset History Section display content
    document.querySelector("#search-history").textContent = "";
    searchedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchedCities !== null) {
        for (let i = 0; i < searchedCities.length; i++) {
            const city = searchedCities[i];
            // Generate search history buttons: create/set content and prepend buttons to search form
            let cityBtns = document.createElement("div");
            cityBtns.innerHTML = `
                                        <button class="btn city-button col-lg-12" id = "${city}-button">${capitalizeFirstLetter(city)}</button>
                                        `;
            document.querySelector("#search-history").prepend(cityBtns);
        }
    }
}

// Function to capitalize the first letter of cities displayed in search history
function capitalizeFirstLetter(city) {
    return city.charAt(0).toUpperCase() + city.slice(1);
}

// Function to display restaurants from click of button in search history
function renderRestaurantFromHistory(event) {
    if (event.target.matches("button")) {
        // Set default for displaying weather info to London
        locationInput = event.target.textContent;
        // find restaurants available for inputted city
        getGeolocation();
    }
}

// Function to add restaurant as favorite
function addFavorite(event) {
    if (event.target.matches("#fav-btn")) {
        isFavRestaurants = JSON.parse(localStorage.getItem("favRestaurants"));
        if (isFavRestaurants !== null) {
            favRestaurants = isFavRestaurants;
        }
        // Restaurant name/id
        let restaurantName = (event.target).previousElementSibling.textContent;
        // store restaurant name and remove duplicates
        favRestaurants.push(restaurantName);
        favRestaurants = [...new Set(favRestaurants.reverse())];
        localStorage.setItem("favRestaurants", JSON.stringify(favRestaurants));
    }
}

// Function to display restaurant info on restaurant button click
function renderRestaurantInfo(event) {
    if (event.target.matches(".restaurant-button")) {

        let restaurantBtn = event.target;
        restaurantBtn.parentElement.children[2].classList.toggle('hideRestaurantInfo');

    }

}


// blur screen on nav-bar click
$('.dropdown').on('show.bs.dropdown', function () {
    document.querySelector(".overlay").classList.remove("d-none")
})
$('.dropdown').on('hide.bs.dropdown', function () {
    document.querySelector(".overlay").classList.add("d-none")
})


// Event listener for buttons in search history to get restaurant info
document.querySelector("#search-history").addEventListener("click", renderRestaurantFromHistory);
// Event listener for the button to get restaurants available in city
document.querySelector("#find-restaurants").addEventListener("click", findRestaurant);


// Marc's Code using origanal APi for eat out with map image, website link, phone number opening times.
// const apiKey = `85ab5ccbe5924069b86a34a443887846`

// const button = document.getElementById("buttonSearch");

// document.getElementById("location").addEventListener("input", (e) => {
//     if (e.target.value === "") {
//         button.classList.add("disabled")
//         return;
//     }
//     button.classList.remove("disabled");
// });

// function setLoading(isLoading) {
//     const loadingSpinner = document.querySelector("#buttonSearch .loading")
//     if (isLoading) {
//         loadingSpinner.classList.remove("d-none");
//         button.classList.add("disabled")
//         return
//     }
//     loadingSpinner.classList.add("d-none");
//     button.classList.remove("disabled")
// }

// function saveCache(places) {
//     localStorage.setItem("location-history", JSON.stringify(places));
// }

// function getCache() {
//     if (localStorage.getItem("location-history") === null) {
//         return [];
//     }
//     return JSON.parse(localStorage.getItem("location-history"));
// }


// function getSpecificPlace(e) {
//     const { id } = e.dataset;

//     const width = 400;
//     const height = 300;

//     const place = getCache().find(history => history.properties.place_id === id).properties
//     const lon = place.lon
//     const lat = place.lat

//     let website = "";
//     if (place.datasource.raw.website) {
//         website = `<p><a target="_blank" href="${place.datasource.raw.website}">Website</a></p>`
//     }

//     let openingHours = ""
//     if (place.datasource.raw.opening_hours) {
//         openingHours = `<p> Opening hours ${place.datasource.raw.opening_hours}</p>`
//     }

//     let phone = "";
//     if (place.datasource.raw.phone) {
//         phone = `<p>Contact Number: <a href="tel:${place.datasource.raw.phone}">${place.datasource.raw.phone}</a></p>`
//     }

//     document.getElementById("selected-restaurant").innerHTML = `
//         <h1>${place.name}</h1>
//         ${website}
//         <p> ${place.address_line2}</p>
//         ${openingHours}
//         ${phone}
//         <img width="${width}" height="${height}" class="map-image" src="https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${lon},${lat}&zoom=13&marker=lonlat:${lon},${lat};type:material;color:%23ff3421;icontype:awesome|lonlat:${lon},${lat};type:material;color:%23ff3421;icontype:awesome&apiKey=${apiKey}"></img>
//     `
// }

// // https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A-122.29009844646316%2C47.54607447032754&zoom=14.3497&marker=lonlat%3A-122.29188334609739%2C47.54403990655936%3Btype%3Aawesome%3Bcolor%3A%23bb3f73%3Bsize%3Ax-large%3Bicon%3Apaw%7Clonlat%3A-122.29282631194182%2C47.549609195001494%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome%7Clonlat%3A-122.28726954893025%2C47.541766557545884%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome&apiKey=85ab5ccbe5924069b86a34a443887846

// button.addEventListener("click", e => {
//     e.preventDefault();

//     const locationSelecton = document.getElementById("location").value;
//     setLoading(true)
//     getLocation(locationSelecton).then(placeId => {
//         getRestaurants(placeId).then(restaurants => {
//             const places = restaurants.features.filter(x => x.properties.name)
//             saveCache(places);

//             document.getElementById("input-locations").innerHTML = `
//                 ${places.map(place => `<button class="btn" data-id="${place.properties.place_id}" onclick="getSpecificPlace(this)">${place.properties.name}</button>`).join("")}
//             `

//             setLoading(false)
//         })
//     }).catch(() => {
//         setLoading(false)
//     })
// })



// function getLocation(place) {
//     return fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${place}&type=city&format=json&apiKey=${apiKey}`)
//         .then(response => response.json())
//         .then(result => result.results[0].place_id);
// }

// function getRestaurants(placeId) {
//     return fetch(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=place:${placeId}&limit=20&apiKey=${apiKey}`)
//         .then(response => response.json())
//         .then(result => result)
// }
