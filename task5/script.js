/* global window, document */
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
  
    var form = document.getElementById("order-form");
    var product = document.getElementById("product");
    var count = document.getElementById("count");
    var error = document.getElementById("error");
    var result = document.getElementById("result");
    var resultDetails = document.getElementById("result-details");
    var resultSum = document.getElementById("result-sum");
  
    var pattern = /^\d+$/;
    var animationTimer = null;
  
    function showError(message) 
    {
      error.textContent = message;
      result.classList.add("hidden");
    }
    function clearError() 
    {
      error.textContent = "";
    }
    function animateNumber(element, target) 
    {
      var duration = 500;
      var start = new Date().getTime();
      var progress;
      var value;
  
      if (animationTimer !== null) 
        {
        window.clearTimeout(animationTimer);
        animationTimer = null;
        }
  
      element.textContent = "0";
  
      function step() 
      {
        var now = new Date().getTime();
        progress = (now - start) / duration;
        if (progress > 1) 
        {
          progress = 1;
        }
        value = Math.round(target * progress);
        element.textContent = value.toLocaleString("ru-RU");
        if (progress < 1) 
        {
          animationTimer = window.setTimeout(step, 16);
        } else 
        {
          animationTimer = null;
        }
      }
  
      step();
    }
  
    count.addEventListener("input", function () 
    {
      var value = count.value;
  
      if (value === "") 
        {
        clearError();
        return;
        }
  
      if (pattern.test(value) !== true) 
        {
        showError("Только цифры. Остальное недопустимо.");
        } else 
        {
        clearError();
        }
    });
  
    form.addEventListener("submit", function (event) 
    {
      event.preventDefault();
  
      var value = count.value.trim();
      var qty;
      var price;
      var productName;
      var total;
  
      if (value === "") 
        {
        showError("Введите количество.");
        return;
        }
      if (pattern.test(value) !== true) 
        {
        showError("Только цифры. Остальное недопустимо.");
        return;
        }
  
      qty = parseInt(value, 10);
  
      if (qty === 0)
        {
        showError("Количество должно быть больше нуля.");
        return;
        }
  
      clearError();
  
      price = parseInt(product.value, 10);
      productName = product.options[product.selectedIndex].text.split("—")[0].trim();
      total = price * qty;
  
      resultDetails.textContent =
        productName + " × " + qty + " шт. = " +
        price.toLocaleString("ru-RU") + " ₽/шт.";
  
      result.classList.remove("hidden");
      animateNumber(resultSum, total);
    });
  });
