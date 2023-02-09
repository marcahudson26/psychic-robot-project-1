let mealInput = document.querySelector('#meal');
let searchedMeals = [];

mealHistory = localStorage.getItem("meal")
if (mealHistory) {
    searchedMeals = JSON.parse(localStorage.getItem("meal"));
}
else if (searchedMeals === null) {
    searchedMeals = [];
}

for (let index = 0; index < searchedMeals.length; index++) {
    const element = searchedMeals[index];
    console.log(element)

    // Create a new list item for each saved search input
let mealList = document.createElement("li");
mealList.innerHTML = searchedMeals[index];

// Append the new list item to the list under the form
let list = document.getElementById("meal-list");
list.appendChild(mealList);
}

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();

    let meal = document.getElementById("meal").value;
    let queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + meal;

    // this gets the ingredients
    fetch(queryURL)
        .then(response => response.json())
        .then(response => {
            console.log("in fetch")

            const meal = response.meals[0]
            const ingredients = []
            const measurements = []

            for (const key in meal) {
                //because the api response doesn't  contain an array of ingredients we loop thought the keys to create an array
                if (key.startsWith("strIngredient")) {
                    if (meal[key] !== "") {
                        ingredients.push(meal[key])
                    }
                }
                if (key.startsWith("strMeasure")) {
                    if (meal[key] !== "") {
                        measurements.push(meal[key])
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
            document.getElementById("name").textContent = "NAME";
            document.getElementById("name").textContent += ':' + ' ' + response.meals[0].strMeal;
            document.getElementById("favourites-span").innerHTML = `<button class="btn btn-primary" data-name="${response.meals[0].strMeal}" id="favourites-button">FAVOURITES</button>`
           

            //for the the thumbnail image
            document.getElementById("foodpic").src = response.meals[0].strMealThumb;
            //this gets the ingriedents
            document.getElementById("ingredients").innerHTML = "INGREDIENTS";
            document.getElementById("ingredients").innerHTML += ':' + ' ' + recipeIngriedents;
            //cooking instructions
            document.getElementById("instructions").innerHTML = "INSTRUCTIONS";
            document.getElementById("instructions").innerHTML += ':' + ' ' + response.meals[0].strInstructions;
            // for the youtube video link
            document.getElementById("youtube").href = response.meals[0].strYoutube;
            document.getElementById("youtube").textContent = response.meals[0].strYoutube;

            // localStorage.setItem("meal", JSON.stringify(searchedMeals));
           
            searchedMeals.unshift(mealInput.value);
            searchedMeals = [...new Set(searchedMeals)];
            localStorage.setItem("meal", JSON.stringify(searchedMeals));
            mealInput.value = "";

            document.querySelector("#meal-list").innerHTML = ""
            for (let index = 0; index < searchedMeals.length; index++) {
                console.log("rendering ")
                const element = searchedMeals[index];
                console.log(element)
            
                // Create a new list item for each saved search input
            let mealList = document.createElement("li");
            mealList.innerHTML = searchedMeals[index];
            
            // Append the new list item to the list under the form
            let list = document.getElementById("meal-list");
            list.appendChild(mealList);
            }

            
        })

    
    document.querySelector("#favourite").addEventListener("click",function(event){
            console.log(event.target.dataset.name); 
        })








   /*  const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'bda18aceb6msh4cfb8ec1d5bdafep1699e7jsnf33daa16b16d',
            'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
        }
    };


   fetch request with loop to pull put the ingredients and push into the ingredients array
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
        }) */
}) 