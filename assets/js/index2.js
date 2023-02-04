// let place = "clowne"

// const apiKey = "85ab5ccbe5924069b86a34a443887846"

fetch (`https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=200b90c2ad55452fac862d3c287dd3b2`)
        .then(response => response.json())
        .then(cityGeo =>{
            console.log("geolocation found") ;
            console.log(cityGeo) ;
        })

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

// getLocation(userInputt).then(placeId => {
//     getRestaurants(placeId).then(restaurants => {
//         console.log(restaurants)
//     })
// })
// .features.map(x => x.properties.name).filter(x => x)