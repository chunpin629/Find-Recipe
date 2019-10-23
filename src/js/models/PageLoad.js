import axios from 'axios';

export default class PageLoad {
	constructor() {
		this.results = [];
	}

	async getResults() {
		const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.edamam.com';
		const key = '00dcb7a262f603d7ef8e5d781ebcc90f';
		const id = '83d4f3eb';
		const query = 'noodles';

		const res = await axios(`${baseURL}/search?q=${query}&app_id=${id}&app_key=${key}&from=0&to=15`);
		this.results = res.data.hits.map((el) => el.recipe);
	}
}
