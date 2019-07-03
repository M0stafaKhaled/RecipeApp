import SCearch from './modles/Search';
import {element , renderLoader ,clearLoader , elementStrings} from './view/base';
import * as Searchview from './view/SearchView';
import * as recipeView from './view/recipeView';
import Recipes from './modles/Recipes';
import List from './modles/List';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Likes from './modles/Likes';
// const search = new SCearch('pizza');

//console.log(search);


/** search controll */
 const state= {};
const   controlSearch = async () =>{

        //(1)Get quiry from View
        const quiry =  Searchview.getInput();
       

        if(quiry){

            // (2) new Serch objact and to add state 
            state.search =new SCearch(quiry);
            //(3) prerper UI for th e result 
             Searchview.clearInput();
             Searchview.clearResult();

            renderLoader(element.searchRes);

            //(4) search for the recipes 
            await state.search.getResult();
           

            //(5) reander Result
            clearLoader();
            Searchview.renderResult(state.search.result);
        }


}
element.searchForm.addEventListener('submit' , e =>{

    e.preventDefault();
    controlSearch();



});
element.searchResPage.addEventListener('click', e=>{

    const btn = e.target.closest('.btn-inline');
    if(btn){

        const gotTo = parseInt( btn.dataset.goto);
        Searchview.clearResult();
        Searchview.renderResult(state.search.result ,gotTo)

    }

})

// recipe controller 
const controlRecipe =  async ()=> {
    
    const id = window.location.hash.replace('#','');
   
    if(id){
            recipeView.clearRecipe();
         renderLoader(element.recipe);
         if (state.search) Searchview.highlightSelected(id);

        state.recipe = new  Recipes(id);
       // await state.recipe.getRecipe();
       try{
        await state.recipe.getRecipe();
     //   console.log(state.recipe.ingredients)
      
         state.recipe. parseIngredients();

        state.recipe.calcTime();
        state.recipe.calcServing();
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
    
       }
       catch(error){
           alert(error);                                                                                
       }
    }
    
    


}
//window.addEventListener('hashchange' , controlRecipe);
['hashchange' , 'load'].forEach(event => window.addEventListener(event,controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
element.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling recipe button clicks
element.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
