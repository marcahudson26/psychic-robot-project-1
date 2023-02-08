//TO DO 
// history bar with local storage 
//fix styling issues
//hook up to rest of page 
// toggle bar in top right corner not working? 





document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();

let meal = document.getElementById("meal").value;
let queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + meal;

// this gets the ingredients
fetch(queryURL)
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
        const recipeIngriedents = []
        for (let i = 0; i < ingredients.length; i++) {
            const ingredent = ingredients[i];
            const measurement = measurements[i]
            recipeIngriedents.push(`${measurement} ${ingredent}`)
        }

        //for the meal name
        document.getElementById("name").innerHTML = "NAME";
        document.getElementById("name").innerHTML += ':' + ' ' + response.meals[0].strMeal;
        console.log(response.meals[0].strMeal)
        //for the the thumbnail image
        console.log(response.meals[0].strMealThumb)
        //this gets the ingriedents
        document.getElementById("ingredients").innerHTML = "INGREDIENTS";
        document.getElementById("ingredients").innerHTML += ':' + ' ' + recipeIngriedents;
        console.log(recipeIngriedents)
        //cooking instructions
        document.getElementById("instructions").innerHTML = "INSTRUCTIONS";
        document.getElementById("instructions").innerHTML += ':' + ' ' + response.meals[0].strInstructions;
        console.log(response.meals[0].strInstructions)
        // for the youtube video link
        document.getElementById("youtube").innerHTML = "YOUTUBE";
        document.getElementById("youtube").innerHTML += ':' + ' ' + response.meals[0].strYoutube;
        console.log(response.meals[0].strYoutube)

        
        // console.log(meal.strMeal)
        localStorage.setItem("meal", meal.strMeal);
        let meals = localStorage.getItem("meal");

        // Create a new list item for each saved search input
        let mealList = document.createElement("li");
        mealList.innerHTML = meals;
    
        // Append the new list item to the list under the form
        let list = document.getElementById("meal-list");
        list.appendChild(mealList);
    })

    .catch(() => {
        // if there is an error render some error message
        console.log("There was an error")
    })
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'bda18aceb6msh4cfb8ec1d5bdafep1699e7jsnf33daa16b16d',
        'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
    }
};


//fetch request with loop to pull put the ingredients and push into the ingredients array
fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${meal}`, options)
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
        console.log(Math.trunc(response.hits[3].recipe.calories))
        // // fat content an nutrience
        console.log(response.hits[3].recipe.digest)
        // health lables
        console.log(response.hits[3].recipe.healthLabels)
        //image
        console.log(response.hits[3].recipe.image)
        //link to cooking istructions
        console.log(response.hits[3].recipe.url)
    })
})
