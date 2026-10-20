/* global window, document */
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
  
    var quantityInput = document.getElementById("quantity");
    var error = document.getElementById("error");
    var typeRadios = document.getElementsByName("serviceType");
    var optionsGroup = document.getElementById("options-group");
    var optionSelect = document.getElementById("option");
    var propertyGroup = document.getElementById("property-group");
    var propertyCheckbox = document.getElementById("property");
    var resultSum = document.getElementById("result-sum");
    var resultDetails = document.getElementById("result-details");
  
    var quantityPattern = /^\d+$/;
    var typeNames = {
      "1": "Диагностика",
      "2": "Ремонт",
      "3": "Установка Windows",
      "4": "Настройка Wi-Fi",
      "5": "Заправка картриджа"
    };
  
    function getPrices() {
      return {
        types: {
          "1": 1300,
          "2": 1360,
          "3": 2500,
          "4": 1500,
          "5": 360
        },
        options: {
          standard: 0,
          fast: 1000,
          urgent: 2500
        },
        properties: {
          support: 800
        }
      };
    }
  
    function getSelectedType() {
      var i;
      for (i = 0; i < typeRadios.length; i += 1) {
        if (typeRadios[i].checked) {
          return typeRadios[i].value;
        }
      }
      return "1";
    }
  
    function getOptionLabel() {
      return optionSelect.options[optionSelect.selectedIndex].text
        .split("—")[0].trim();
    }
  
    function updatePrice() {
      var prices = getPrices();
      var type = getSelectedType();
      var quantity;
      var price;
      var total;
      var details;
  
      optionsGroup.classList.toggle("hidden", type !== "2");
      propertyGroup.classList.toggle("hidden", type !== "3");
  
      price = prices.types[type] || 0;
  
      if (type === "2") {
        price += prices.options[optionSelect.value] || 0;
      }
  
      if (type === "3" && propertyCheckbox.checked) {
        price += prices.properties.support;
      }
  
      quantity = parseInt(quantityInput.value, 10);
      if (isNaN(quantity) || quantity < 1) {
            quantity = 0;
        }
  
      total = price * quantity;
  
      if (type === "2") {
        details = typeNames[type] + " (" + getOptionLabel().toLowerCase() +
                  ") × " + quantity + " шт.";
      } else if (type === "3" && propertyCheckbox.checked) {
        details = typeNames[type] + " (с поддержкой) × " + quantity + " шт.";
      } else {
        details = typeNames[type] + " × " + quantity + " шт.";
      }
  
      resultDetails.textContent = details;
      resultSum.textContent = total.toLocaleString("ru-RU");
    }
  
    quantityInput.addEventListener("input", function () {
        var value = quantityInput.value;
    
        if (value !== "" && quantityPattern.test(value) !== true) {
          quantityInput.value = value.replace(/\D/g, "");
        }
    
        if (quantityInput.value === "" ||
            quantityPattern.test(quantityInput.value)) {
          error.textContent = "";
        } else {
          error.textContent = "Только цифры.";
        }
    
        updatePrice();
    });
  
    var i;
    for (i = 0; i < typeRadios.length; i += 1) {
      typeRadios[i].addEventListener("change", updatePrice);
    }
  
    optionSelect.addEventListener("change", updatePrice);
    propertyCheckbox.addEventListener("change", updatePrice);
  
    updatePrice();
  });
