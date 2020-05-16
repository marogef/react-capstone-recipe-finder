// mouse event functions

function getRecipes() {
  const url = getUrl();
  
  $.get(url).done(function(data){
    if(data.count > 0) {
      data.hits.forEach((hit) => { 
        const recipeItems = recipeItemTemplate(hit);
        const eachRecipe = recipeTemplate(hit.recipe.url, hit.recipe.label, recipeItems, hit.recipe.calories, hit.recipe.yield);
        $('.recipes').append(eachRecipe);
       });
    }else if(data.count === 0){
      displayError();
    }
  }).fail(function(data){
    console.log(data);
    displayError();
  });
  
  resetQuery();
}

$('ul').on( "mouseover", "li", function() {
    $(this).children().fadeIn();
});


// helper methods
function clearElements(elements){
  elements.map( (element) => {
    let mySelector = $("." + element);
    mySelector.is('input') ? 
      mySelector.val('') 
            : 
      mySelector.empty();
  });
}

function getUrl() {
  const id = "54d5d928";
  const key = "bd794a4c8694121da1a2bfe15bdf0537";
  const health =$("input:radio[name='health']:checked").val(); 
  const query = $('.query').val();
  const limit = $('.limit').val();
  const url = `https://api.edamam.com/search?q=${query}` + 
              `&app_id=${id}` +
              `&app_key=${key}` +
              `&from=0&to=${limit}` +
              `&health=${health}`;
  return url;
}

function displayError(){
  $('#error_message').addClass('error');
  $('.error').text("No Results Found");
  $('.error').fadeIn("slow");
}

function resetQuery(){
  clearElements(['recipes', 'limit', 'query', 'error']);
  $('#error_message').removeClass('error');
}

function recipeTemplate(rUrl, rLabel, rItems, rCalories, rYield){
  const eachRecipe = '<li class="recipe">'+ 
                     '<span class="recipeName">' +
                     '<a href="' +
                        rUrl +
                     '" target="_blank">' +
                        rLabel + 
                     '</a>' +
                     '</span>' +
                     '<span class="servings">' +
                      'Servings: ' +
                       rYield +
                     '</span>' +
                      '<br/>' +
                     '<span class="calories">' +
                      'Calories per serving: ' +
                       (rCalories/rYield).toFixed(0) +
                     '</span>' +
                     '<br/>' +
                     '<span class="ingreds">' +
                       rItems +
                     '</span>' +
                     '</li>';
  return eachRecipe;
}

function recipeItemTemplate(hit) {
  let recipeItems = '';
  $.each(hit.recipe.ingredientLines, function( index, value ) {
    recipeItems +='<br/>' + value + '<br/>';
  });
  return recipeItems;
}