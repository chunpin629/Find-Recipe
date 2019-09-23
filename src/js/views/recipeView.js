import $ from 'jquery';
import fracty from 'fracty';

export const clearRecipe = () => {
	$('.recipe').empty();
};

const rankToStar = (rank) => {
	if (rank === 100) {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </span>
        `;
	} else if (rank >= 90 && rank < 100) {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
            </span>
        `;
	} else if (rank >= 80 && rank < 90) {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </span>
        `;
	} else if (rank >= 70 && rank < 80) {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
            </span>
        `;
	} else if (rank >= 60 && rank < 70) {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </span>
        `;
	} else {
		return `
            <span class="stars text-warning">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
            </span>
        `;
	}
};

export const formatCount = (count) => {
	if (count) {
		return fracty(count);
	}
	return '';
};

const renderIngredients = (ingredients) => {
	const stringIngredients = ingredients.map(
		(ingredient) => `
        <li class="col-6 my-2">
            <i class="far fa-check-square"></i>
            <span class="ingredient-count">${formatCount(ingredient.count)}</span>
            <span class="ingredient-unit">${ingredient.unit}</span>
            <span class="ingredient-name">${ingredient.ingredient}</span>
        </li>
        `
	);
	return stringIngredients.join(' ');
};

export const renderRecipe = (recipe, isLiked) => {
	const markup = `
        <div class="card text-center">
            <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
            <button class="btn btnLike float-right rounded-circle m-3 p-0 text-dark">
                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
            </button>

            <div class="card-body text-dark">
                <h1 class="card-title recipe-title display-4 mb-3">${recipe.title}</h1>

                <div class="recipe-author mb-3">
                    <span>By </span>
                    <span class="author font-italic">${recipe.publisher}</span>
                </div>

                <div class="recipe-rank mb-4">
                    ${rankToStar(recipe.rank)}
                    <span class="ml-1">${Math.floor(recipe.rank * 100) / 100}</span>
                </div>

                <div class="recipe-details">
                    <span class="servings">${recipe.servings}</span>
                    <span class="px-2"> servings</span>

                    <button class="btn btnPlus p-0 ml-1 text-dark">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                    <button class="btn btnMinus p-0 ml-1 text-dark">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </div>

                <div class="ingredients mt-3">
                    <ul class="ingredients-list row p-0 text-left">
                        ${renderIngredients(recipe.ingredients)}
                    </ul>
                </div>
                
                <a href="${recipe.url}" target="_blank" class="btn btn-outline-info">How to Cook</a>
            </div>
        </div>
    `;

	$('.recipe').append(markup);
};

export const updateServIng = (recipe) => {
	$('.servings').text(recipe.servings);

	$('.ingredient-count').each((i, el) => {
		$(el).text(formatCount(recipe.ingredients[i].count));
	});
};

export const errorRecipe = () => {
	$('.recipe').prepend(`
        <div class="error-recipe text-dark text-center my-3">
            <h1 class="display-4 text-danger"><i class="fas fa-exclamation-circle"></i></h1>
            <h2>Oops! Something went wrong.</h2>
            <h5>Please try another recipe.</h5>
        </div>
    `);
};

export const recipeReminder = () => {
	$('.recipe').prepend(`
        <h4 class="reminder text-dark text-center my-3">Click on a recipe to see more details!</h4>
    `);
};
