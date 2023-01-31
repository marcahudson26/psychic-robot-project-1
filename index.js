let userInput = "pizza"

// this gets the ingredients 
fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`)
    .then(response => response.json())
    .then(response => {
        if (!response.meals) {
            // if there is no data throw an error  
            throw "No Data";
        }
        const meal = response.meals[0]
        const ingredients = []
        const measurements = []

        for (const key in meal) {
            //because the api response doesn't  contain an array of ingredients we loop thought the keys to create an array
            if (key.startsWith("strIngredient")) {
                if (meal[key] !== "") {
                    ingredients.push(meal[key].trim())
                }
            }
            if (key.startsWith("strMeasure")) {
                if (meal[key] !== "") {
                    measurements.push(meal[key].trim())
                }
            }
        }
        const recipeIngredents = []
        for (let i = 0; i < ingredients.length; i++) {
            const ingredent = ingredients[i];
            const measurement = measurements[i]
            recipeIngredents.push(`${measurement} ${ingredent}`)
        }
        //for the meal name
        console.log(response.meals[0].strMeal)
        //this gets the ingredents
        console.log(recipeIngredents)
        //cooking instructions
        console.log(response.meals[0].strInstructions)
        //for the the thumbnail image
        console.log(response.meals[0].strMealThumb)
        // for the u tube video link
        console.log(response.meals[0].strYoutube)
    })

    .catch(() => {
        // if there is an error render some error message 
        console.log("There was an error")
    })



// this is a random meal gen for the meal

// fetch(`http://www.themealdb.com/api/json/v1/1/random.php`)
//     .then(response => response.json())
//     .then(response => console.log())



