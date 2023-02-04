let locationInput = "birmingham"

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '7459094a29mshad16f6228de91d6p184fa3jsncd93466b41d1',
		'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
	}
};

fetch(`https://the-fork-the-spoon.p.rapidapi.com/locations/v2/auto-complete?text=${locationInput}`, options)
	.then(response => response.json())
	.then(response => {
        let locationId = response.data.geolocation[0].id.id;
        let fullLocation = response.data.geolocation[0].name.text;
        console.log(locationId)
        console.log(fullLocation)
    })
	.catch(err => console.error(err));
// const userInputt = "clowne"

// const apiKey = `85ab5ccbe5924069b86a34a443887846`

// //
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