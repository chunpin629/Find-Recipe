import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.edamam.com';
		const key = '00dcb7a262f603d7ef8e5d781ebcc90f';
		const id = '83d4f3eb';
		const recipeURL = 'http://www.edamam.com/ontologies/edamam.owl';
		const recipeId = encodeURIComponent(`${recipeURL}#${this.id}`);

		const res = await axios(`${baseURL}/search?r=${recipeId}&app_id=${id}&app_key=${key}`);
		const recipe = res.data[0];
		this.title = recipe.label;
		this.image = recipe.image;
		this.publisher = recipe.source;
		this.url = recipe.url;
		this.ingredients = recipe.ingredientLines;
		this.servings = recipe.yield;
	}

	parseIngredient() {
		// console.log(this.ingredients);
		const unitsOriginal = [
			'tablespoons',
			'tablespoon',
			'tblsp',
			'ounces',
			'ounce',
			'teaspoons',
			'teaspoon',
			'cups',
			'pounds',
			'slices',
			'slice'
		];
		const unitsSimple = [ 'tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'slice', 'slice' ];
		const units = [ ...unitsSimple, 'kg', 'g', 'l', 'ml', 'stick' ];

		const newIngredients = this.ingredients.map((el) => {
			let ingredient = el.toLowerCase();

			unitsOriginal.forEach((el, i) => {
				ingredient = ingredient.replace(el, unitsSimple[i]);
			});

			ingredient = ingredient.trim().replace(/ *\([^)]*\) */g, ' ').replace(/,/g, ' ').replace(/  +/g, ' ');

			const arrayIng = ingredient.split(' ');
			const unitIndex = arrayIng.findIndex((el) => units.includes(el));

			let objIng;
			if (unitIndex > -1) {
				const arrayCount = arrayIng.slice(0, unitIndex);

				let count;
				let unit = arrayIng[unitIndex];
				let ingredient = arrayIng.slice(unitIndex + 1).join(' ');
				if (unitIndex === 0) {
					count = 1;
				} else if (arrayCount.length === 1) {
					//ex: 1, 1-1/2
					count = eval(arrayCount[0].replace('-', '+'));
				} else {
					if (arrayCount.every((el) => parseInt(el, 10))) {
						//ex: 1 1/2 cup
						count = eval(arrayCount.join('+'));
					} else {
						if (parseInt(arrayIng[0], 10)) {
							//ex: 1 large cup
							count = eval(arrayIng[0]);
							unit = '';
							ingredient = arrayIng.slice(1).join(' ');
						} else {
							//ex: large 1 cup
							count = '';
							unit = '';
							ingredient = arrayIng.join(' ');
						}
					}
				}

				objIng = {
					count,
					unit,
					ingredient
				};
			} else if (parseInt(arrayIng[0], 10)) {
				let count;
				let unit = '';
				if (Number(arrayIng[0])) {
					//ex: 1
					count = Number(arrayIng[0]);
				} else if (arrayIng[0].includes('-')) {
					//ex: 3-4
					count = Number(arrayIng[0].split('-')[0]);
				} else if (arrayIng[0].includes('/')) {
					//ex: 1/2
					count = eval(arrayIng[0]);
				} else {
					//ex: 100ml
					const seperate = arrayIng[0].split(/(\d+)/);
					count = Number(seperate[1]);
					unit = seperate[2];
				}

				objIng = {
					count,
					unit,
					ingredient: arrayIng.slice(1).join(' ')
				};
			} else if (unitIndex === -1) {
				objIng = {
					count: '',
					unit: '',
					ingredient
				};
			}

			return objIng;
		});
		this.ingredients = newIngredients;
		// console.log(this.ingredients);
	}

	updateServIng(type) {
		const newServings = type === 'inc' ? this.servings + 1 : this.servings - 1;

		this.ingredients.forEach((ing) => {
			if (ing.count) {
				ing.count *= newServings / this.servings;
			}
		});

		this.servings = newServings;
	}
}
