import PageLoad from './models/PageLoad';
import Search from './models/Search';
import Recipe from './models/Recipe';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likeView from './views/likeView';
import { renderLoader, clearLoader } from './views/spinner';
import $ from 'jquery';

const state = {};

//page load
$(async () => {
	state.load = new PageLoad();
	renderLoader($('.results'));

	try {
		await state.load.getResults();
		clearLoader($('.results'));
		searchView.renderResults(state.load.results);
		if (!window.location.hash) recipeView.recipeReminder();
	} catch (err) {
		clearLoader($('.results'));
		// console.log(err);
		searchView.errorSearch();
	}
});

//control search
const controlSearch = async () => {
	const query = searchView.getInput();

	if (query) {
		state.search = new Search(query);
		searchView.clearInput();
		searchView.clearResults();
		renderLoader($('.results'));

		try {
			await state.search.getResults();
			clearLoader($('.results'));
			if (state.search.results.length === 0) {
				searchView.noResutsReminder();
			} else {
				searchView.renderResults(state.search.results);
				if (!window.location.hash) {
					recipeView.clearRecipe();
					recipeView.recipeReminder();
				}
			}
		} catch (err) {
			clearLoader($('.results'));
			// console.log(err);
			searchView.errorSearch();
		}
	}
};

$('.searchInput').keypress((e) => {
	if (e.which === 13) {
		controlSearch();
	}
});

//control recipe
const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');

	if (id) {
		state.recipe = new Recipe(id);

		if (state.search) searchView.activeResult(id);
		likeView.activeLike(id);

		recipeView.clearRecipe();
		renderLoader($('.recipe'));

		try {
			await state.recipe.getRecipe();
			state.recipe.parseIngredient();
			clearLoader($('.recipe'));
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			clearLoader($('.recipe'));
			// console.log(err);
			recipeView.errorRecipe();
		}
	}
};

$(window).on('hashchange load', controlRecipe);

$('.recipe').on('click', '.btnPlus', () => {
	if (state.recipe.servings < 15) {
		state.recipe.updateServIng('inc');
		recipeView.updateServIng(state.recipe);
	}
});

$('.recipe').on('click', '.btnMinus', () => {
	if (state.recipe.servings > 1) {
		state.recipe.updateServIng('dec');
		recipeView.updateServIng(state.recipe);
	}
});

//control likes
$(() => {
	state.likes = new Like();

	state.likes.readData();

	state.likes.likes.forEach(likeView.renderLike);
});

const controlLikes = () => {
	const rec = state.recipe;

	if (!state.likes.isLiked(rec.id)) {
		//not liked -> add
		const like = state.likes.addLike(rec.id, rec.image, rec.title, rec.publisher);
		likeView.renderLike(like);
		likeView.changeBtn(false);
	} else {
		//liked -> remove
		state.likes.removeLike(rec.id);
		likeView.removeLike(rec.id);
		likeView.changeBtn(true);
	}
};

$('.recipe').on('click', '.btnLike', controlLikes);
