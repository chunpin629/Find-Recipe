export default class Like {
	constructor() {
		this.likes = [];
	}

	addLike(id, image, title, publisher) {
		const like = {
			id,
			image,
			title,
			publisher
		};
		this.likes.push(like);

		this.storeData();

		return like;
	}

	removeLike(id) {
		const index = this.likes.findIndex((el) => el.id === id);
		this.likes.splice(index, 1);

		this.storeData();
	}

	isLiked(id) {
		return this.likes.findIndex((el) => el.id === id) !== -1;
	}

	storeData() {
		localStorage.setItem('likes', JSON.stringify(this.likes));
	}

	readData() {
		const data = JSON.parse(localStorage.getItem('likes'));
		if (data) this.likes = data;
	}
}
