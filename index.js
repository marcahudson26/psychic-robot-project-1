userInput = "burger"

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'bda18aceb6msh4cfb8ec1d5bdafep1699e7jsnf33daa16b16d',
        'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
    }
};

fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${userInput}`, options)
    .then(response => response.json())
    .then(response => {
        ingredients = []
        const path = response.hits[3].recipe.ingredientLines
        for (let i = 0; i < path.length; i++) {
            ingredients.push(path[i]);
        }
        // meal name
        console.log(response.q)
        // ingredients
        console.log(ingredients)
        // calorie content
        console.log(response.hits[3].recipe.calories)
        // // fat content an nutrience
        console.log(response.hits[3].recipe.digest)
        // health lables
        console.log(response.hits[3].recipe.healthLabels)
        //image
        console.log(response.hits[3].recipe.image)
        //link to cooking istructions
        console.log(response.hits[3].recipe.url)
    })




