
var selectProtein = $('#select-protein');
var selectMeal = $('#select-meal');
var selectLiquor = $('#select-liquor');
var mealsList = $('#mealsList');
var drinksList = $('#drinksList');
var chosenMeal = $('#chosen-meal');
var chosenDrink = $('#chosen-drink');

var apiUrl;
var isCategory; // Boolean for the first meal dropdown
var dropdownList = []; // Array to populate the dropdown for meals

var dropdownDisplay = '';
var selectedProtein;
var selectedMealOption;
var selectedMeal;
var selectedLiquor;

var mealUrl;
var mealsFromApi = []; // Full list of meals from search
var mealsToDisplay = []; // Randonmly selecting 3 meals from search
var drinkUrl;
var drinksFromApi = []; // Full list of drinks from search
var drinksToDisplay = []; // Randomly selecting 3 drinks from search
var randomIndex;
var randomIndexArray = [];

// The following functions have been tested
// generateDropdown();
// generateMealOptions();
// generateDrinkOptions();
// generateUniqueIndex(array);


// Event listener for first dropdown
selectProtein.change(function() {
    selectedProtein = this.value;
    if(selectedProtein === 'Entree'){
        isCategory = true;
    } else {
        isCategory = false;
    }
    dropdownDisplay = '';
    generateDropdown();
});

// Event listener for second dropdown
selectMeal.change(function() {
    selectedMealOption = this.value;
    generateMealOptions();
});

// Event listener for liquor dropdown
selectLiquor.change(function() {
    selectedLiquor = this.value;
    generateDrinkOptions();
});


// This function generates the options for the pulldown
function generateDropdown() {
    selectMeal.removeClass('hidden');
    dropdownDisplay = '<option value=" ">(Please select from the following)</option>';
    if (isCategory) {
        apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (var i = 0; i < data.meals.length; i++) {
                    dropdownList[i] = data.meals[i].strCategory;
                    dropdownDisplay += '<option value ="' + dropdownList[i] + '">' + dropdownList[i] + '</option>';
                }
                selectMeal.html(dropdownDisplay);
            });
    } else {
        apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (var i = 0; i < data.meals.length; i++) {
                    dropdownList[i] = data.meals[i].strArea;
                    dropdownDisplay += '<option value ="' + dropdownList[i] + '">' + dropdownList[i] + '</option>';
                }
                selectMeal.html(dropdownDisplay);
            });
    }
}

// This function generates the 3 meal options that will be displayed on screen
function generateMealOptions() {

    if (isCategory) {
        mealUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + selectedMealOption;
    } else {
        mealUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=' + selectedMealOption;
    }
    // Grab options for url and populate them in an array
    fetch(mealUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0; i < data.meals.length; i++) {
                mealsFromApi[i] = data.meals[i].strMeal;
            }
            if (mealsFromApi.length <= 3) {
                for (var j = 0; j < mealsFromApi.length; j++) {
                    mealsToDisplay[j] = mealsFromApi[j];
                }
            } else {
                generateUniqueIndex(mealsFromApi);
                for (var i = 0; i < randomIndexArray.length; i++) {
                    mealsToDisplay[i] = mealsFromApi[randomIndexArray[i]];
                }
            }
            renderMealOptions();
        });

}

// This function renders the 3 meal options to the screen
function renderMealOptions() {

    mealsHTML = 'Click to see recipe:';
    for (var i = 0; i < mealsToDisplay.length; i++) {
        mealsHTML += '<li>' + mealsToDisplay[i] + '</li>';
        mealsList.html(mealsHTML);
    }
    var mealOptions = mealsList.children();
    // Event listener for meal options
    mealOptions.click(function () {
        selectedMeal = this.innerHTML;
        renderMealRecipe();
    });
}

// This function renders the meal recipe
function renderMealRecipe() {
    recipeUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + selectedMeal.trim();
    console.log(recipeUrl);

  for (var i = 0; i < mealsToDisplay.length; i++) {
    mealsList.append("<li>" + mealsToDisplay[i] + "</li>");
  }

}

// This function generated the 3 drink options that will be displayed on screen
function generateDrinkOptions() {
  drinkUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" +
    userSelectionDrink.text();
  // Grab options for url and populate them in an array
  fetch(drinkUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < data.drinks.length; i++) {
        drinksFromApi[i] = data.drinks[i].strDrink;
      }
      generateUniqueIndex(drinksFromApi);
      for (var i = 0; i < randomIndexArray.length; i++) {
        drinksToDisplay[i] = drinksFromApi[randomIndexArray[i]];
      }
      renderDrinkOptions();
    });
}

// This function renders the 3 drink options
function renderDrinkOptions() {

    drinksHTML = 'Click to see recipe:';
    for (var i = 0; i < drinksToDisplay.length; i++) {
        drinksHTML += '<li>' + drinksToDisplay[i] + '</li>';
        drinksList.html(drinksHTML);
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

//This function gets the array of meals and drinks, turns them
// into a string, then saves the user choice of meal and drink to local storage
function savePairingtoLocalStorage(meal, drink) {

    var meal = JSON.stringify();
    var drink = JSON.stringify();
    localStorage.setItem("meal", meal);
    localStorage.setItem("drink", drink);
  }
  
  //This function gets the pairings from the local storage
  // displays and  appends the saved pairings on the page as a button
  function appendSavedPairings() {
    var savedPairings = $("saved_pairings");
    var mealChoice = localStorage.getItem("meal");
    var drinkChoice = localStorage.getItem("drink");
    var button = document.createElement("button");
  
    button.addEventListener("click", function () {
      if ((mealChoice !== null) & (drinkChoice !== null)) {
        savedPairings.innerHTML = "You picked " + mealChoice + "and a " + drinkChoice;
      }
      savedPairings.appendChild(button);
    });
  }
  
  //This function lets the user click the saved options to display them on the page again
