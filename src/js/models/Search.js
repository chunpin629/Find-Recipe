import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		const key = '8213d137c0608c2a2fce7b3085011b9b';
		// const key = '08e6929dad5b6344b6fce2a3e530d9f2';
		// const key = '5071eb71117192c0a9f866ea2bb97d2f';
		// const key = 'e5527b65c76a4bfef81db134e4a3a11c';

		const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
		this.results = res.data.recipes.slice(0, 20);
	}
}
