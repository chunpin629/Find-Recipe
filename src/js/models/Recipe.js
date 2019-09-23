import axios from 'axios';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		const key = '8213d137c0608c2a2fce7b3085011b9b';
		// const key = '08e6929dad5b6344b6fce2a3e530d9f2';
		// const key = '5071eb71117192c0a9f866ea2bb97d2f';
		// const key = 'e5527b65c76a4bfef81db134e4a3a11c';

		const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
		this.title = res.data.recipe.title;
		this.image = res.data.recipe.image_url;
		this.publisher = res.data.recipe.publisher;
		this.url = res.data.recipe.source_url;
		this.ingredients = res.data.recipe.ingredients;
		this.rank = res.data.recipe.social_rank;
	}

	calcServings() {
		this.servings = 2;
	}

	parseIngredient() {
		// console.log(this.ingredients);
		const unitsOriginal = [
			'tablespoons',
			'tablespoon',
			'ounces',
			'ounce',
			'teaspoons',
			'teaspoon',
			'cups',
			'pounds',
			'slices',
			'slice'
		];
		const unitsSimple = [ 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'slice', 'slice' ];
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
				if (unitIndex === 0) {
					count = 1;
				} else if (arrayCount.length === 1) {
					count = eval(arrayCount[0].replace('-', '+'));
				} else {
					count = eval(arrayCount.join('+'));
				}

				objIng = {
					count,
					unit: arrayIng[unitIndex],
					ingredient: arrayIng.slice(unitIndex + 1).join(' ')
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
