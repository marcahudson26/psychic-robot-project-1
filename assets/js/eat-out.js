let locationInput;
let searchedCities = [];
let completeLocationName;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '7459094a29mshad16f6228de91d6p184fa3jsncd93466b41d1',
        'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
    }
};

renderSearchCityForm ();
// Function to render form to search city for restaurants available
function renderSearchCityForm () {
    let searchForm = document.createElement("form");
    searchForm.setAttribute("class", "col-lg-12 text-center");
    searchForm.innerHTML = `
    <div class="mb-3">
    <label for="inputCity" class="form-label fs-1 fw-bold text-center">WHAT CITY WOULD YOU LIKE TO SEARCH?</label>
    <input type="email" class="form-control" id="inputCity" aria-describedby="inputCityHelp" placeholder="London, York, Birmigham...">
    <div id="inputCityHelp" class="form-text">Please enter your city name.</div>
    </div>
    <button type="submit" class="btn btn-primary search-city-btn" id = "find-restaurants">Submit</button>
    `;
    document.querySelector("#search-city").append(searchForm);
}

// Function to handle click on button to find restaurants in city
function findRestaurant (event) {
    // Prevent searh form default to save form input
    event.preventDefault();
    
    // Store search input value (i.e, name of city)
    locationInput = document.querySelector("#inputCity").value
    console.log(locationInput)
    storeSearchedCity();
}

// Function to store searched cities to local storage
function storeSearchedCity (){
    isSearchHistory = localStorage.getItem("searchHistory")
    if (isSearchHistory) {
        // If there is no search history reset class from null to array
        searchedCities = JSON.parse(localStorage.getItem("searchHistory")); 
    } 
    searchedCities.push(locationInput);
    console.log(locationInput)
    console.log(searchedCities)
    // Reverse searched cities array and remove duplicates
    searchedCities = [...new Set(searchedCities.reverse())];
    // Store reveresed array in search history local storage 
    localStorage.setItem("searchHistory", JSON.stringify(searchedCities.reverse()));
    
    
    console.log(localStorage)

    // Clear search input value
    document.querySelector("#inputCity").value = "";
}
                        
                        
// Function to find lon, lat and city id for searched city
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

// Function to find restaurants available in searched city
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

// Function to display restaurants found for searched city
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

// blur screen on nav-bar click
$('.dropdown').on('show.bs.dropdown', function () {
    document.querySelector(".overlay").classList.remove("d-none")
})
$('.dropdown').on('hide.bs.dropdown', function () {
    document.querySelector(".overlay").classList.add("d-none")
})

// Event listener for the button to get restaurants available in city
document.querySelector("#find-restaurants").addEventListener("click", findRestaurant);


// Marc's Code
// let userInput = "sushi"

// // this gets the ingredients
// fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
//     .then(response => response.json())
//     .then(response => {

//         if (!response.meals) {
//             // if there is no data throw an error
//             throw "No Data";
//         }
//         const meal = response.meals[0]
//         const ingredients = []
//         const measurements = []

//         for (const key in meal) {
//             //because the api response doesn't  contain an array of ingredients we loop thought the keys to create an array
//             if (key.startsWith("strIngredient")) {
//                 if (meal[key] !== "") {
//                     ingredients.push(meal[key].trim())
//                 }
//             }
//             if (key.startsWith("strMeasure")) {
//                 if (meal[key] !== "") {
//                     measurements.push(meal[key].trim())
//                 }
//             }
//         }
//         const recipeIngredents = []
//         for (let i = 0; i < ingredients.length; i++) {
//             const ingredent = ingredients[i];
//             const measurement = measurements[i]
//             recipeIngredents.push(`${measurement} ${ingredent}`)
//         }
//         //for the meal name
//         console.log(response.meals[0].strMeal)
//         //this gets the ingredents
//         console.log(recipeIngredents)
//         //cooking instructions
//         console.log(response.meals[0].strInstructions)
//         //for the the thumbnail image
//         console.log(response.meals[0].strMealThumb)
//         // for the u tube video link
//         console.log(response.meals[0].strYoutube)
//         console.log(ingredients)
//     })

//     .catch(() => {
//         // if there is an error render some error message
//         console.log("There was an error")
//     })


// userInput = "burger"

// const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': 'bda18aceb6msh4cfb8ec1d5bdafep1699e7jsnf33daa16b16d',
//         'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
//     }
// };
//fetch request with loop to pull put the ingredients and push into the ingredients array
// fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${userInput}`, options)
//     .then(response => response.json())
//     .then(response => {
//         ingredients = []
//         const path = response.hits[3].recipe.ingredientLines
//         for (let i = 0; i < path.length; i++) {
//             ingredients.push(path[i]);
//         }
//         // meal name
//         console.log(response.q)
//         // ingredients
//         console.log(ingredients)
//         // calorie content
//         console.log(Math.trunc(response.hits[3].recipe.calories))
//         // // fat content an nutrience
//         console.log(response.hits[3].recipe.digest)
//         // health lables
//         console.log(response.hits[3].recipe.healthLabels)
//         //image
//         console.log(response.hits[3].recipe.image)
//         //link to cooking istructions
//         console.log(response.hits[3].recipe.url)
//     })
