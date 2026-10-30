"use strict";

/* Замените ВАШ_ID на идентификатор своей формы Formcarry. */
var API_URL = "https://formcarry.com/s/Rub4NGEecDV";

/* -------------------------------------------------------------------------- */
/* Мобильная навигация                                                        */
/* -------------------------------------------------------------------------- */

var menuToggle = document.querySelector(".menu-toggle");
var navigation = document.querySelector("#main-navigation");
var dropdownToggle = document.querySelector(".nav-dropdown-toggle");
var dropdownItem = document.querySelector(".nav-item--dropdown");
var navigationLinks = document.querySelectorAll("#main-navigation a");

/* Закрывает мобильное меню и выпадающий список. */
function closeNavigation() {
    if (menuToggle && navigation) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
        menuToggle.classList.remove("is-active");
        navigation.classList.remove("is-open");
    }

    if (dropdownToggle && dropdownItem) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownItem.classList.remove("is-open");
    }
}

/* Открытие и закрытие мобильного меню. */
if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function () {
        var isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
        menuToggle.classList.toggle("is-active", !isOpen);
        navigation.classList.toggle("is-open", !isOpen);
    });
}

/* На телефонах список туров открывается нажатием. */
if (dropdownToggle && dropdownItem) {
    dropdownToggle.addEventListener("click", function () {
        var isOpen = dropdownToggle.getAttribute("aria-expanded") === "true";

        dropdownToggle.setAttribute("aria-expanded", String(!isOpen));
        dropdownItem.classList.toggle("is-open", !isOpen);
    });
}

/* После перехода по ссылке закрываем мобильное меню. */
Array.prototype.forEach.call(navigationLinks, function (link) {
    link.addEventListener("click", closeNavigation);
});

/* Escape также закрывает меню. */
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeNavigation();
    }
});

/* -------------------------------------------------------------------------- */
/* Бесконечный слайдер галереи                                                */
/* -------------------------------------------------------------------------- */

var sliderViewport = document.querySelector(".gallery-slider__viewport");
var sliderTrack = document.querySelector(".gallery-slider__track");
var previousButton = document.querySelector(".slider-arrow--prev");
var nextButton = document.querySelector(".slider-arrow--next");
var dotsContainer = document.querySelector(".slider-dots");
var counter = document.querySelector(".slider-counter");

/* Храним исходные изображения отдельно от создаваемых копий. */
var originalSlides = sliderTrack ? Array.prototype.slice.call(sliderTrack.children) : [];
var currentSlide = 0;
var visibleSlides = 1;

/* Возвращает число изображений, видимых одновременно. */
function getVisibleSlides() {
    if (window.innerWidth >= 960) {
        return 3;
    }

    if (window.innerWidth >= 640) {
        return 2;
    }

    return 1;
}

/* Форматирует число с ведущим нулём. */
function formatNumber(number) {
    return number < 10 ? "0" + number : String(number);
}

/* Добавляет копии с начала и конца ленты для перехода по кругу. */
function buildInfiniteSlider() {
    var startClones = [];
    var endClones = [];
    var index;
    var clone;

    if (!sliderTrack || originalSlides.length === 0) {
        return;
    }

    /* Копии последних карточек размещаем в начале ленты. */
    index = originalSlides.length - visibleSlides;

    while (index < originalSlides.length) {
        clone = originalSlides[index].cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        startClones.push(clone);
        index += 1;
    }

    /* Копии первых карточек размещаем в конце ленты. */
    index = 0;

    while (index < visibleSlides) {
        clone = originalSlides[index].cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        endClones.push(clone);
        index += 1;
    }

    sliderTrack.innerHTML = "";

    Array.prototype.forEach.call(startClones, function (slide) {
        sliderTrack.appendChild(slide);
    });

    Array.prototype.forEach.call(originalSlides, function (slide) {
        sliderTrack.appendChild(slide);
    });

    Array.prototype.forEach.call(endClones, function (slide) {
        sliderTrack.appendChild(slide);
    });

    /* Начальная позиция — первое оригинальное изображение. */
    moveTrackTo(visibleSlides + currentSlide, false);
}

/* Перемещает ленту на заданную физическую позицию. */
function moveTrackTo(physicalIndex, animate) {
    var trackStyle;
    var gap;
    var referenceSlide;
    var slideWidth;

    if (!sliderTrack) {
        return;
    }

    if (animate) {
        sliderTrack.style.transition = "";
    } else {
        sliderTrack.style.transition = "none";
    }

    referenceSlide = sliderTrack.children[visibleSlides];

    if (!referenceSlide) {
        return;
    }

    trackStyle = window.getComputedStyle(sliderTrack);
    gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
    slideWidth = referenceSlide.getBoundingClientRect().width;

    sliderTrack.style.transform =
        "translateX(-" + (physicalIndex * (slideWidth + gap)) + "px)";

    if (!animate) {
        /* Применяем позицию без анимации и возвращаем CSS-переход. */
        sliderTrack.offsetHeight;
        sliderTrack.style.transition = "";
    }
}

/* Создаёт восемь точек — по одной на каждое исходное изображение. */
function createSliderDots() {
    var index = 0;
    var dot;

    if (!dotsContainer) {
        return;
    }

    dotsContainer.innerHTML = "";

    while (index < originalSlides.length) {
        dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Показать изображение " + (index + 1));
        dot.setAttribute("data-slide", String(index));

        dotsContainer.appendChild(dot);
        index += 1;
    }
}

/* Обновляет активную точку и счётчик. */
function updateSliderInfo() {
    var dots;

    if (dotsContainer) {
        dots = dotsContainer.querySelectorAll(".slider-dot");

        Array.prototype.forEach.call(dots, function (dot, index) {
            dot.classList.toggle("is-active", index === currentSlide);

            if (index === currentSlide) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    if (counter) {
        counter.textContent =
            formatNumber(currentSlide + 1) + " / " + formatNumber(originalSlides.length);
    }
}

/* Переключает слайд с циклическим переходом на краях ленты. */
function moveSlider(direction) {
    var lastSlide = originalSlides.length - 1;

    if (!sliderTrack || originalSlides.length === 0) {
        return;
    }

    sliderTrack.removeAttribute("data-reset-position");

    if (direction > 0) {
        /* Переход с последнего изображения на первое. */
        if (currentSlide === lastSlide) {
            currentSlide = 0;
            sliderTrack.setAttribute("data-reset-position", "first");

            /* Двигаемся к копии первого слайда в конце ленты. */
            moveTrackTo(visibleSlides + originalSlides.length, true);
        } else {
            currentSlide += 1;
            moveTrackTo(visibleSlides + currentSlide, true);
        }
    } else if (currentSlide === 0) {
        /* Переход с первого изображения на последнее. */
        currentSlide = lastSlide;
        sliderTrack.setAttribute("data-reset-position", "last");

        /* Двигаемся к копии последнего слайда перед оригиналами. */
        moveTrackTo(visibleSlides - 1, true);
    } else {
        currentSlide -= 1;
        moveTrackTo(visibleSlides + currentSlide, true);
    }

    updateSliderInfo();
}

/* Настраиваем слайдер и подключаем элементы управления. */
if (sliderTrack && originalSlides.length > 0) {
    visibleSlides = Math.min(getVisibleSlides(), originalSlides.length - 1);

    buildInfiniteSlider();
    createSliderDots();
    updateSliderInfo();

    if (previousButton) {
        previousButton.addEventListener("click", function () {
            moveSlider(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            moveSlider(1);
        });
    }

    /* При нажатии на точку переходим к выбранному оригинальному слайду. */
    if (dotsContainer) {
        dotsContainer.addEventListener("click", function (event) {
            var target = event.target;
            var requestedSlide;

            if (target && target.classList.contains("slider-dot")) {
                requestedSlide = parseInt(target.getAttribute("data-slide"), 10);

                if (!isNaN(requestedSlide) &&
                    requestedSlide >= 0 &&
                    requestedSlide < originalSlides.length) {
                    currentSlide = requestedSlide;
                    sliderTrack.removeAttribute("data-reset-position");

                    moveTrackTo(visibleSlides + currentSlide, true);
                    updateSliderInfo();
                }
            }
        });
    }

    /* Поддерживаем переключение с клавиатуры. */
    if (sliderViewport) {
        sliderViewport.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveSlider(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                moveSlider(1);
            }
        });
    }

    /*
     * После анимации по кругу незаметно перемещаем ленту
     * с копии на соответствующее оригинальное изображение.
     */
    sliderTrack.addEventListener("transitionend", function (event) {
        var resetPosition;

        if (event.target !== sliderTrack) {
            return;
        }

        resetPosition = sliderTrack.getAttribute("data-reset-position");

        if (resetPosition) {
            sliderTrack.removeAttribute("data-reset-position");
            moveTrackTo(visibleSlides + currentSlide, false);
        }
    });

    /* Перестраиваем копии при изменении числа видимых изображений. */
    window.addEventListener("resize", function () {
        var nextVisibleSlides = Math.min(getVisibleSlides(), originalSlides.length - 1);

        if (nextVisibleSlides !== visibleSlides) {
            visibleSlides = nextVisibleSlides;
            buildInfiniteSlider();
        } else {
            moveTrackTo(visibleSlides + currentSlide, false);
        }
    });
}

/* -------------------------------------------------------------------------- */
/* Живая валидация формы и отправка через Fetch API                           */
/* -------------------------------------------------------------------------- */

var contactForm = document.querySelector("#contact-form");
var formStatus = document.querySelector("#form-status");
var submitButton = contactForm ?
    contactForm.querySelector("button[type='submit']") : null;
var consentCheckbox = document.querySelector("#consent");
var fieldsToValidate = contactForm ?
    contactForm.querySelectorAll("[data-validate]") : [];
var isSubmitting = false;

/* Выводит сообщение об успешной отправке либо ошибке. */
function showFormMessage(message, messageType) {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.classList.remove("is-success", "is-error");

    if (message) {
        formStatus.classList.add(
            messageType === "success" ? "is-success" : "is-error"
        );
    }
}

/* Проверяет поле по типу. Для Email обязательны @ и точка. */
function isFieldValid(field) {
    var value = field.value.trim();
    var fieldType = field.getAttribute("data-validate");
    var digits;

    if (fieldType === "name") {
        return /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/.test(value);
    }

    if (fieldType === "email") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (fieldType === "phone") {
        digits = value.replace(/\D/g, "");

        return /^\+?[0-9()-]+$/.test(value) &&
            digits.length >= 7 &&
            digits.length <= 15;
    }

    if (fieldType === "message") {
        return value.length >= 10;
    }

    return false;
}

/* Добавляет зелёную или красную рамку вокруг поля. */
function updateFieldState(field) {
    var value = field.value.trim();
    var isValid;

    /* Нетронутое пустое поле не подсвечиваем заранее. */
    if (!field.dataset.touched && value === "") {
        field.classList.remove("is-valid", "is-invalid");
        field.removeAttribute("aria-invalid");
        return false;
    }

    isValid = isFieldValid(field);

    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);
    field.setAttribute("aria-invalid", String(!isValid));

    return isValid;
}

/* Фильтрует ввод имени и телефона непосредственно во время набора. */
function filterFieldInput(field) {
    var oldValue = field.value;
    var cursorPosition = field.selectionStart;
    var beforeCursor;
    var filteredValue;
    var filteredBeforeCursor;

    if (field.getAttribute("data-validate") === "name") {
        /* Для имени разрешены только буквы, пробел и дефис. */
        filteredValue = oldValue.replace(/[^A-Za-zА-Яа-яЁё -]/g, "");

        /* Первая буква становится заглавной, даже если есть пробелы в начале. */
        filteredValue = filteredValue.replace(
            /^(\s*[A-Za-zА-Яа-яЁё])/,
            function (firstLetter) {
                return firstLetter.toLocaleUpperCase("ru-RU");
            }
        );
    } else if (field.getAttribute("data-validate") === "phone") {
        /* Для телефона разрешены цифры, плюс, дефис и круглые скобки. */
        filteredValue = oldValue.replace(/[^0-9()+-]/g, "");
    } else {
        return;
    }

    /* Стараемся сохранить положение курсора после удаления символов. */
    if (filteredValue !== oldValue) {
        beforeCursor = oldValue.slice(0, cursorPosition);

        if (field.getAttribute("data-validate") === "name") {
            filteredBeforeCursor = beforeCursor.replace(/[^A-Za-zА-Яа-яЁё -]/g, "");
        } else {
            filteredBeforeCursor = beforeCursor.replace(/[^0-9()+-]/g, "");
        }

        field.value = filteredValue;
        field.setSelectionRange(
            filteredBeforeCursor.length,
            filteredBeforeCursor.length
        );
    }
}

/* Кнопка доступна после согласия и блокируется на время отправки. */
function updateSubmitButton() {
    if (submitButton) {
        submitButton.disabled =
            !consentCheckbox || !consentCheckbox.checked || isSubmitting;
    }
}

if (contactForm && submitButton && consentCheckbox) {
    /* Живая проверка во время ввода и при уходе из поля. */
    Array.prototype.forEach.call(fieldsToValidate, function (field) {
        field.addEventListener("input", function () {
            field.dataset.touched = "true";

            filterFieldInput(field);
            updateFieldState(field);
            showFormMessage("", "error");
        });

        field.addEventListener("blur", function () {
            field.dataset.touched = "true";
            updateFieldState(field);
        });
    });

    consentCheckbox.addEventListener("change", updateSubmitButton);
    updateSubmitButton();

    contactForm.addEventListener("submit", function (event) {
        var formData;
        var payload;
        var invalidFields = [];

        event.preventDefault();

        /* Сначала проверяем все поля формы. */
        Array.prototype.forEach.call(fieldsToValidate, function (field) {
            field.dataset.touched = "true";

            if (!updateFieldState(field)) {
                invalidFields.push(field);
            }
        });

        if (invalidFields.length > 0) {
            showFormMessage("Проверьте выделенные поля и исправьте ошибки.", "error");
            invalidFields[0].focus();
            return;
        }

        if (!consentCheckbox.checked) {
            showFormMessage(
                "Для отправки необходимо согласиться на обработку данных.",
                "error"
            );
            return;
        }

        /* Не отправляем запрос с учебным ID. */
        if (API_URL.indexOf("ВАШ_ID") !== -1) {
            showFormMessage(
                "Укажите свой ID Formcarry в переменной API_URL в файле script.js.",
                "error"
            );
            return;
        }

        formData = new FormData(contactForm);

        payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: formData.get("message"),
            consent: formData.get("consent") ? "yes" : "no"
        };

        isSubmitting = true;
        updateSubmitButton();
        submitButton.textContent = "Отправляем...";
        showFormMessage("", "error");

        /* Отправляем POST-запрос через Fetch API без перезагрузки страницы. */
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(
                        "Не удалось отправить сообщение. Проверьте настройки Formcarry и повторите попытку."
                    );
                }

                return response.text();
            })
            .then(function () {
                showFormMessage(
                    "Спасибо! Сообщение отправлено. Скоро свяжемся с вами.",
                    "success"
                );

                contactForm.reset();

                Array.prototype.forEach.call(fieldsToValidate, function (field) {
                    field.classList.remove("is-valid", "is-invalid");
                    field.removeAttribute("aria-invalid");
                    field.dataset.touched = "";
                });
            })
            .catch(function (error) {
                showFormMessage(
                    error.message || "Ошибка сети. Проверьте подключение и попробуйте ещё раз.",
                    "error"
                );
            })
            .then(function () {
                isSubmitting = false;
                submitButton.textContent = "Отправить сообщение";
                updateSubmitButton();
            });
    });
}
