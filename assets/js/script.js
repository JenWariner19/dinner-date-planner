var selectProtein = $("#select-protein");
var selectMeal = $("#select-meal");
var selectLiquor = $("#select-liquor");
var mealsList = $("#mealsList");
var drinksList = $("#drinksList");
var chosenMeal = $("#chosen-meal");
var chosenDrink = $("#chosen-drink");
var savedPairings = $("#saved_pairings");
var savedMeal = $("#meal-drink");
var pairingList = $("#PairingsList");

var apiUrl;
var isCategory; // Boolean for the first meal dropdown
var dropdownList = []; // Array to populate the dropdown for meals
var dropdownDisplay = "";
var selectedProtein;
var selectedMealOption;
var selectedMeal;
var selectedMealID;
var selectedLiquor;
var selectedDrink;
var selectedDrinkID;
var mealUrl;
var mealIDs;
var mealsFromApi = []; // Full list of meals from search
var mealIDFromApi = [];
var mealsToDisplay = []; // Randonmly selecting 3 meals from search
var mealIDToDisplay = [];
var mealsHTML;
var mealRecipeUrl;
var mealRecipeDisplay;
var mealRecipeYoutube;
var mealRecipeThumb;
var drinkUrl;
var drinksFromApi = []; // Full list of drinks from search
var drinkIDFromApi = [];
var drinksToDisplay = []; // Randomly selecting 3 drinks from search
var drinkIDToDisplay = [];
var drinksHTML;
var drinkRecipeUrl;
var drinkRecipeDisplay;
var drinkRecipeThumb;
var drinkIngredients = [];
var drinkMeasures = [];
var drinkIngredientDisplay;
var randomIndexArray = [];
var randomIndex;
var randomIndexArray = [];
var mealArray = [];
var drinkArray = [];
var mealArrayID = [];
var drinkArrayID = [];
var savedHTML;

displaySavedPairingsStorage();
// Event listener for first dropdown
selectProtein.change(function () {
    selectedProtein = this.value;
    if (selectedProtein === "Entree") {
        isCategory = true;
    } else {
        isCategory = false;
    }
    dropdownDisplay = "";
    generateDropdown();
});

// Event listener for second dropdown
selectMeal.change(function () {
    selectedMealOption = this.value;
    generateMealOptions();
});

// Event listener for liquor dropdown
selectLiquor.change(function () {
    selectedLiquor = this.value;
    generateDrinkOptions();
});

// This function generates the options for the pulldown
function generateDropdown() {
    selectMeal.removeClass("hidden");
    dropdownDisplay =
        '<option value=" ">(Please select from the following)</option>';
    if (isCategory) {
        apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (var i = 0; i < data.meals.length; i++) {
                    dropdownList[i] = data.meals[i].strCategory;
                    dropdownDisplay +=
                        '<option value ="' +
                        dropdownList[i] +
                        '">' +
                        dropdownList[i] +
                        "</option>";
                }
                selectMeal.html(dropdownDisplay);
            });
    } else {
        apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (var i = 0; i < data.meals.length; i++) {
                    dropdownList[i] = data.meals[i].strArea;
                    dropdownDisplay +=
                        '<option value ="' +
                        dropdownList[i] +
                        '">' +
                        dropdownList[i] +
                        "</option>";
                }
                selectMeal.html(dropdownDisplay);
            });
    }
}

// This function generates the 3 meal options that will be displayed on screen
function generateMealOptions() {
    if (isCategory) {
        mealUrl =
            "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
            selectedMealOption;
    } else {
        mealUrl =
            "https://www.themealdb.com/api/json/v1/1/filter.php?a=" +
            selectedMealOption;
    }
    // Grab options for url and populate them in an array
    fetch(mealUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0; i < data.meals.length; i++) {
                mealsFromApi[i] = data.meals[i].strMeal;
                mealIDFromApi[i] = data.meals[i].idMeal;
            }
            if (mealsFromApi.length <= 3) {
                for (var j = 0; j < mealsFromApi.length; j++) {
                    mealsToDisplay[j] = mealsFromApi[j];
                    mealIDToDisplay[j] = mealIDFromApi[j];
                }
            } else {
                generateUniqueIndex(mealsFromApi);
                for (var i = 0; i < randomIndexArray.length; i++) {
                    mealsToDisplay[i] = mealsFromApi[randomIndexArray[i]];
                    mealIDToDisplay[i] = mealIDFromApi[randomIndexArray[i]];
                }
            }
            renderMealOptions();
        });
}

// This function renders the 3 meal options to the screen
function renderMealOptions() {
    mealsHTML = "Select a dish to view:";
    for (var i = 0; i < mealsToDisplay.length; i++) {
        mealsHTML +=
            '<li value="' + mealIDToDisplay[i] + '">' + mealsToDisplay[i] + "</li>";
        mealsList.html(mealsHTML);
    }
    var mealOptions = mealsList.children();
    // Event listener for meal options
    mealOptions.click(function () {
        selectedMeal = this.innerHTML;
        selectedMealID = this.value;
        renderMealRecipe();
    });
}

// This function renders the meal recipe
function renderMealRecipe() {
    mealRecipeUrl =
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + selectedMealID;
    fetch(mealRecipeUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            mealRecipeThumb =
                selectedMeal +
                '<img src="' +
                data.meals[0].strMealThumb +
                '" width=100 height=100>';
            mealRecipeDisplay =
                '<a href="' +
                data.meals[0].strSource +
                '" target="_blank">Click here to see recipe</a>';
            mealRecipeYoutube =
                '<br><a href="' +
                data.meals[0].strYoutube +
                '" target="_blank">Click here to see video</a>';
            chosenMeal.html(mealRecipeThumb + mealRecipeDisplay + mealRecipeYoutube);
        });
}

// This function generates the 3 drink options that will be displayed on screen
function generateDrinkOptions() {
    drinkUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" +
        selectedLiquor;
    // Grab options for url and populate them in an array
    fetch(drinkUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0; i < data.drinks.length; i++) {
                drinksFromApi[i] = data.drinks[i].strDrink;
                drinkIDFromApi[i] = data.drinks[i].idDrink;
            }
            generateUniqueIndex(drinksFromApi);
            for (var i = 0; i < randomIndexArray.length; i++) {
                drinksToDisplay[i] = drinksFromApi[randomIndexArray[i]];
                drinkIDToDisplay[i] = drinkIDFromApi[randomIndexArray[i]];
            }
            renderDrinkOptions();
        });
}

// This function renders the 3 drink options
function renderDrinkOptions() {
    drinksHTML = "Select a drink to view:";
    for (var i = 0; i < drinksToDisplay.length; i++) {
        drinksHTML +=
            '<li value="' + drinkIDToDisplay[i] + '">' + drinksToDisplay[i] + "</li>";
        drinksList.html(drinksHTML);
    }
    var drinkOptions = drinksList.children();
    // Event listener for meal options
    drinkOptions.click(function () {
        selectedDrink = this.innerHTML;
        selectedDrinkID = this.value;
        renderDrinkRecipe();
    });
}

// This function renders the drink recipe
function renderDrinkRecipe() {
    drinkRecipeUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
        selectedDrinkID;
    fetch(drinkRecipeUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getIngredients(data);
            drinkRecipeThumb =
                selectedDrink +
                '<img src="' +
                data.drinks[0].strDrinkThumb +
                '" width=100 height=100>';
            drinkIngredientDisplay = "<ul>";
            for (var i = 0; i < drinkIngredients.length; i++) {
                drinkIngredientDisplay +=
                    "<li>" + drinkIngredients[i] + " - " + drinkMeasures[i] + "</li>";
            }
            drinkIngredientDisplay += "</ul>";
            drinkRecipeDisplay = "<p>" + data.drinks[0].strInstructions + "</p>";
            chosenDrink.html(
                drinkRecipeThumb + drinkIngredientDisplay + drinkRecipeDisplay
            );

            appendSavedPairings();
        });
}

// This function gets the ingredients and measurements for the drinks
function getIngredients(data) {
    for (var i = 0; i < 15; i++) {
        drinkIngredients[i] = Object.values(data.drinks[0])[i + 17];
        drinkMeasures[i] = Object.values(data.drinks[0])[i + 32];
    }
    for (var i = 14; i >= 0; i--) {
        if (drinkIngredients[i] === null) {
            drinkIngredients.pop();
        }
        if (drinkMeasures[i] === null) {
            drinkMeasures.pop();
        }
    }
}

// This function generates an array of random number without duplicates
function generateUniqueIndex(array) {
    randomIndexArray[0] = Math.floor(Math.random() * array.length);
    for (var i = 1; i < 3; i++) {
        randomIndexArray[i] = Math.floor(Math.random() * array.length);
        for (var j = 1; j < randomIndexArray.length; j++) {
            if (randomIndexArray[j - 1] === randomIndexArray[i]) {
                randomIndexArray.pop();
                i--;
            }
        }
    }
}

//This function gets the array of meals and drinks, turns them
// into a string, then saves the user choice of meal and drink to local storage
function savePairingtoLocalStorage() {
    mealArray.push(selectedMeal);
    mealArrayID.push(selectedMealID);
    drinkArray.push(selectedDrink);
    drinkArrayID.push(selectedDrinkID);
    localStorage.setItem("meal", JSON.stringify(mealArray));
    localStorage.setItem("mealID", JSON.stringify(mealArrayID));
    localStorage.setItem("drink", JSON.stringify(drinkArray));
    localStorage.setItem("drinkID", JSON.stringify(drinkArrayID));
}

//This function gets the pairings from the local storage
// displays and  appends the saved pairings on the page as a button
function appendSavedPairings() {
    savedMeal.html(
        "<p>You picked " + selectedMeal + " and a " + selectedDrink + "</p>"
    );
    var button = '<button id ="savedBtn"> Save </button>';
    savedMeal.append(button);
    var savedBtn = $("#savedBtn");
    savedBtn.click(function () {
        savePairingtoLocalStorage();
        displaySavedPairing();
    });
}

//This
function displaySavedPairingsStorage() {
    mealArray = JSON.parse(localStorage.getItem("meal"));
    mealArrayID = JSON.parse(localStorage.getItem("mealID"));
    drinkArray = JSON.parse(localStorage.getItem("drink"));
    drinkArrayID = JSON.parse(localStorage.getItem("drinkID"));
    if (
        mealArray === null &&
        mealArrayID === null &&
        drinkArray === null &&
        drinkArrayID === null
    ) {
        mealArray = [];
        mealArrayID = [];
        drinkArray = [];
        drinkArrayID = [];
    }
    displaySavedPairing();
}

//This function lets the user click the saved options to display them on the page again
function displaySavedPairing() {
    for (var i = 0; i < mealArray.length; i++) {
        savedHTML +=
            '<li data-mealID="' +
            mealArrayID[i] +
            '" data-drinkID="' +
            drinkArrayID[i] +
            '">' +
            mealArray[i] +
            " and " +
            drinkArray[i] +
            "</li>";
        pairingList.html(savedHTML);
    }
    var listOptions = pairingList.children();

    listOptions.click(function () {
        selectedMealID = this.data-mealID;
        selectedDrinkID = this.data-drinkID;
        console.log(selectedMealID);
        console.log(selectedDrinkID);
    });
}
