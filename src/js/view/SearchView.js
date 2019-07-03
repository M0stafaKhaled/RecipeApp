import {element} from './base';
export const getInput = () =>  element.searchInput.value;
export const clearInput = () => {

        element.searchInput.value = '';
}
export const clearResult = () => {

     element.searchResult.innerHTML = '';
     element.searchResPage.innerHTML ='';

}
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title , limit =17) =>{

    const newTitle =[];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur)=>{
                if(acc +cur.length <= limit){

                    newTitle.push(cur)
                }
                return acc + cur.length;
            
        } ,0 );
        
        return `${newTitle.join(' ')}...`;
        


    }
    return title;

}
const renderRecipe = recipe =>{

    const  markup = `
<li>
<a class="results__link " href="#${recipe.recipe_id}">
    <figure class="results__fig">
        <img src="${recipe.image_url}" alt="Test">
    </figure>
    <div class="results__data">
        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
        <p class="results__author">${recipe.publisher}</p>
    </div>
</a>
</li>


`

element.searchResult.insertAdjacentHTML('beforeend',markup);

};
const createButton  = (page ,type) =>`



<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
</svg>
</button>

`;
const renderButtons = (page , numREsult ,resINpage)=>{

            const pages = Math.ceil(numREsult /resINpage);

            let button;
            if(page ===1 && pages > 1){
                    // return one button to next page 
                   button= createButton(page,'next');

            }
            else if (page < pages){
                    //return both button
                    button = `
                    ${createButton(page,'prev')}
                    ${createButton(page,'next')}
                    
                    `;
            }
            else if (page === pages && pages >1) {
                //return  prev buuton
               button = createButton(page,'prev');
            }

              element.searchResPage.insertAdjacentHTML('afterbegin',button);

};
export const renderResult =( recipes , page=2 , recipINepage =10) =>{


    const start = (page -1) * recipINepage ;
    const end =  page * recipINepage;

    recipes.slice(start,end).forEach(renderRecipe);


    renderButtons(page ,recipes.length ,recipINepage);

};



