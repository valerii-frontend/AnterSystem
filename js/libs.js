// e.x. data-da="item,767,last,max"

class DynamicAdapt {
	// массив объектов
	elementsArray = [];
	daClassname = "_dynamic_adapt_";

	constructor(type) {
		this.type = type;
	}

	init() {
		// массив DOM-элементов
		this.elements = [...document.querySelectorAll("[data-da]")];

		// наполнение elementsArray объктами
		this.elements.forEach((element) => {
			const data = element.dataset.da.trim();
			if (data !== "") {
				const dataArray = data.split(",");

				const oElement = {};
				oElement.element = element;
				oElement.parent = element.parentNode;
				oElement.destination = document.querySelector(`.${dataArray[0].trim()}`);
				oElement.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
				oElement.place = dataArray[2] ? dataArray[2].trim() : "last";

				oElement.index = this.indexInParent(oElement.parent, oElement.element);

				this.elementsArray.push(oElement);
			}
		});

		this.arraySort(this.elementsArray);

		// массив уникальных медиа-запросов
		this.mediaArray = this.elementsArray
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index);

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		this.mediaArray.forEach((media) => {
			const mediaSplit = media.split(",");
			const mediaQuerie = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const elementsFilter = this.elementsArray.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
			mediaQuerie.addEventListener("change", () => {
				this.mediaHandler(mediaQuerie, elementsFilter);
			});
			this.mediaHandler(mediaQuerie, elementsFilter);
		});
	}

	// Основная функция
	mediaHandler(mediaQuerie, elementsFilter) {
		if (mediaQuerie.matches) {
			elementsFilter.forEach((oElement) => {
				// получение индекса внутри родителя
				oElement.index = this.indexInParent(oElement.parent, oElement.element);
				this.moveTo(oElement.place, oElement.element, oElement.destination);
			});
		} else {
			elementsFilter.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index);
				}
			});
		}
	}

	// Функция перемещения
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === "last" || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === "first") {
			destination.prepend(element);
			return;
		}
		destination.children[place].before(element);
	}

	// Функция возврата
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element);
		} else {
			parent.append(element);
		}
	}

	// Функция получения индекса внутри родителя
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	// Функция сортировки массива по breakpoint и place
	// по возрастанию для this.type = min
	// по убыванию для this.type = max
	arraySort(arr) {
		if (this.type === "min") {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === "first" || b.place === "last") {
						return -1;
					}
					if (a.place === "last" || b.place === "first") {
						return 1;
					}
					return a.place - b.place;
				}
				return a.breakpoint - b.breakpoint;
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === "first" || b.place === "last") {
						return 1;
					}
					if (a.place === "last" || b.place === "first") {
						return -1;
					}
					return b.place - a.place;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
}

const da = new DynamicAdapt("max");
da.init();
;	
//=================
//Spollers
let spollers = document.querySelectorAll("._spoller");
let spollersGo = true;
if (spollers.length > 0) {
	for (let index = 0; index < spollers.length; index++) {
		const spoller = spollers[index];
		spoller.addEventListener("click", function (e) {
			if (spollersGo) {
				spollersGo = false;
				if (spoller.classList.contains("_spoller-992") && window.innerWidth > 992) {
					return false;
				}
				if (spoller.classList.contains("_spoller-768") && window.innerWidth > 767.98) {
					return false;
				}
				if (spoller.closest("._spollers").classList.contains("_one")) {
					let curent_spollers = spoller.closest("._spollers").querySelectorAll("._spoller");
					for (let i = 0; i < curent_spollers.length; i++) {
						let el = curent_spollers[i];
						if (el != spoller) {
							el.classList.remove("_active");
							_slideUp(el.nextElementSibling);
						}
					}
				}
				spoller.classList.toggle("_active");
				_slideToggle(spoller.nextElementSibling);

				setTimeout(function () {
					spollersGo = true;
				}, 500);
			}
		});
		if (spoller.classList.contains("_active")) {
			_slideToggle(spoller.nextElementSibling);
		}
	}
}

//SlideToggle
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = target.offsetHeight + "px";
	target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = "none";
		target.style.removeProperty("height");
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
};
let _slideDown = (target, duration = 500) => {
	target.style.removeProperty("display");
	let display = window.getComputedStyle(target).display;
	if (display === "none") display = "block";

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = "hidden";
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + "ms";
	target.style.height = height + "px";
	target.style.removeProperty("padding-top");
	target.style.removeProperty("padding-bottom");
	target.style.removeProperty("margin-top");
	target.style.removeProperty("margin-bottom");
	window.setTimeout(() => {
		target.style.removeProperty("height");
		target.style.removeProperty("overflow");
		target.style.removeProperty("transition-duration");
		target.style.removeProperty("transition-property");
		target.classList.remove("_slide");
	}, duration);
};
let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		if (window.getComputedStyle(target).display === "none") {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
};
;	