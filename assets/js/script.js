
var cocktailDBUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list';
var mealDBUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=chicken';

var userSelectionMeal = $('#mealDropdown').find(':selected');
var userSelectionDrink = $('#drinkDropdown').find(':selected');

var apiUrl;
var isCategory = true;
var dropdownList = [];
var mealUrl;

generateDropdown();

function generateDropdown() {
    if (isCategory) {
        apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
        fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for(var i = 0; i < data.meals.length; i++) {
                dropdownList[i] = data.meals[i].strCategory;
            }
        });
    } else {
        apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
        fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for(var i = 0; i < data.meals.length; i++) {
                dropdownList[i] = data.meals[i].strArea;
            }
        });
    }
}

function generateMealOptions() {
    if (isCategory) {
        mealUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=' + userSelection.text();
    } else {
        mealUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=' + userSelection.text();
    }
    // Grab options for url and populate them in an array
    fetch(mealUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // for(var i = 0; i < data.meals.length; i++) {
            //     dropdownList[i] = data.meals[i].strArea;
            // }
            // console.log(dropdownList);
        });
}