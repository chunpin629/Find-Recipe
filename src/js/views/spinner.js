export const renderLoader = (parent) => {
	const markup = `
        <div class="loader col-12 text-center my-5">
            <i class="fas fa-spinner h1"></i>
        </div>
    `;
	parent.prepend(markup);
};

export const clearLoader = (parent) => {
	parent.children('.loader').remove();
};
