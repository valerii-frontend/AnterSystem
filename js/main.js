const body = document.querySelector("body");
const burger = document.querySelector(".header__burger");
const navMenu = document.querySelector(".menu");
const navMenuLinks = document.querySelectorAll(".menu__item a");
const menuBg = document.querySelector(".header__row");
// @@EVENTS
burger.addEventListener("click", function (e) {
	const burgerActive = document.querySelector(".header__burger_active");
	if (burgerActive) {
		burger.classList.remove("header__burger_active");
		navMenu.classList.remove("menu_active");
		menuBg.classList.remove("header__row_active");
		body.classList.remove("_lock");
	} else {
		burger.classList.add("header__burger_active");
		navMenu.classList.add("menu_active");
		menuBg.classList.add("header__row_active");
		body.classList.add("_lock");
	}
});
navMenuLinks.forEach((menuLink) => {
	menuLink.addEventListener("click", function (e) {
		if (e.target == menuLink) {
			burger.classList.remove("header__burger_active");
			navMenu.classList.remove("menu_active");
			body.classList.remove("_lock");
			menuBg.classList.remove("header__row_active");
		}
	});
});

// #PRELOADER

const wrapper = document.querySelector(".wrapper");
setTimeout(() => {
	wrapper.classList.add("wrapper_load");
}, 500);
