import $ from 'jquery';

export const getInput = () => $('.searchInput').val();

export const clearInput = () => {
	$('.searchInput').val('');
};

export const clearResults = () => {
	$('.results').children().not('ul').remove();
	$('.results-list').empty();
};

export const limitTitle = (title, limit = 15) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0);
		return `${newTitle.join(' ')}...`;
	}
	return title;
};

const renderRecipe = (recipe) => {
	const markup = `
    <li class="col-4 col-sm-3 col-md-12 px-1">
        <div class="card border-0 text-center text-lg-left">
            <a class="results-link" href="#${recipe.uri.split('#')[1]}">
                <div class="row no-gutters align-items-center">
                    <div class="img-container col-lg-4 p-1 m-auto">
                        <img src="${recipe.image}" class="card-img rounded-circle" alt="${recipe.label}">
                    </div>
                    <div class="col-lg-8">
                        <div class="card-body p-2">
                            <h5 class="card-title text-danger text-uppercase">${limitTitle(recipe.label)}</h5>
                            <p class="card-text text-dark d-none d-lg-block">${recipe.source}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </li>
    `;

	$('.results-list').append(markup);
};

export const renderResults = (results) => {
	results.forEach(renderRecipe);
};

export const activeResult = (id) => {
	$('.results-link').removeClass('results-link-active');
	$(`.results-link[href="#${id}"]`).addClass('results-link-active');
};

export const errorSearch = () => {
	$('.results').prepend(`
        <div class="error-search text-dark text-center my-3">
            <h1 class="display-4 text-danger"><i class="fas fa-exclamation-circle"></i></h1>
            <h2>Oops! Something went wrong.</h2>
            <h5>Please try again later.</h5>
            <h6>(The API calls limits are 5/minute.)</h6>
        </div>
    `);
};

export const noResutsReminder = () => {
	$('.results').prepend(`
        <h4 class="no-results text-dark text-center my-3">No results found. Please try again!</h4>
    `);
};
