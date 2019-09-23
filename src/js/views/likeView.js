import { limitTitle } from './searchView';
import $ from 'jquery';

export const changeBtn = (isLiked) => {
	const className = isLiked ? 'far' : 'fas';

	$('.btnLike i').removeClass('far fas').addClass(className);
};

export const renderLike = (like) => {
	const markup = `
    <li class="col-4 col-sm-3 col-md-12 px-1">
        <div class="card border-0 text-center text-lg-left">
            <a class="like-link" href="#${like.id}">
                <div class="row no-gutters align-items-center">
                    <div class="img-container col-lg-4 p-1 m-auto">
                        <img src="${like.image}" class="card-img rounded-circle" alt="${like.title}">
                    </div>
                    <div class="col-lg-8">
                        <div class="card-body p-2">
                            <h5 class="card-title text-danger text-uppercase">${limitTitle(like.title)}</h5>
                            <p class="card-text text-dark d-none d-lg-block">${like.publisher}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </li>        
    `;
	$('.like-list').append(markup);
};

export const removeLike = (id) => {
	$(`.like-link[href="#${id}"]`).parents('li').remove();
};

export const activeLike = (id) => {
	$('.like-link').removeClass('like-link-active');
	$(`.like-link[href="#${id}"]`).addClass('like-link-active');
};
