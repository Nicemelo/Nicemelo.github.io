/* global window, document */
window.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var currentIndex = 0;
  var totalSlides = 8;
  var slidesToShow = 1;
  var track = document.getElementById("track");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var pager = document.getElementById("pager");
  var pagerText = document.getElementById("pager-text");

  function getSlidesToShow() {
    if (window.innerWidth >= 768) {
      return 3;
    }
    return 1;
  }

  function updatePager() {
    var totalPages = totalSlides - slidesToShow + 1;
    var i;
    var dot;

    pager.innerHTML = "";
    
    for (i = 0; i < totalPages; i += 1) {
      dot = document.createElement("button");
      dot.className = "dot";
      if (i === currentIndex) {
        dot.className += " active";
      }
      dot.setAttribute("type", "button");
      dot.setAttribute("data-index", i);
      
      dot.addEventListener("click", function (event) {
        var index = parseInt(event.target.getAttribute("data-index"), 10);
        currentIndex = index;
        updateSlider();
      });
      
      pager.appendChild(dot);
    }
    
    pagerText.textContent = "Страница " + (currentIndex + 1) + " из " + totalPages;
  }

  function updateSlider() {
    var shiftPercent = currentIndex * (100 / slidesToShow);
    track.style.transform = "translateX(-" + shiftPercent + "%)";
    updatePager();
  }

  function handleResize() {
    var newSlidesToShow = getSlidesToShow();
    var totalPages;
    
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      totalPages = totalSlides - slidesToShow + 1;
      
      if (currentIndex >= totalPages) {
        currentIndex = totalPages - 1;
      }
      updateSlider();
    }
  }

  /*ПРОКРУТКА*/

  nextBtn.addEventListener("click", function () {
    var totalPages = totalSlides - slidesToShow + 1;
    
    if (currentIndex < totalPages - 1) {
      currentIndex += 1; //вправо
    } else {
      currentIndex = 0;  //с конеца — на первый
    }
    updateSlider();
  });

  prevBtn.addEventListener("click", function () {
    var totalPages = totalSlides - slidesToShow + 1;
    
    if (currentIndex > 0) {
      currentIndex -= 1; //влево
    } else {
      currentIndex = totalPages - 1; //с начало — на последний
    }
    updateSlider();
  });

  window.addEventListener("resize", handleResize);

  slidesToShow = getSlidesToShow();
  updateSlider();
});
