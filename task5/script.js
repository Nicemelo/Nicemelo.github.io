document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var form = document.getElementById("order-form");
  var product = document.getElementById("product");
  var count = document.getElementById("count");
  var error = document.getElementById("error");
  var result = document.getElementById("result");
  var resultDetails = document.getElementById("result-details");
  var resultSum = document.getElementById("result-sum");

  var countPattern = /^\d+$/;

  count.addEventListener("input", function () {
      result.hidden = true;

      if (count.value === "" || countPattern.test(count.value)) {
          error.textContent = "";
      } else {
          error.textContent = "Введите количество цифрами.";
      }
  });

  product.addEventListener("change", function () {
      result.hidden = true;
  });

  form.addEventListener("submit", function (event) {
      var value;
      var quantity;
      var price;
      var total;
      var productName;

      event.preventDefault();
      result.hidden = true;

      value = count.value.trim();

      if (value === "") {
          error.textContent = "Введите количество товара.";
          return;
      }

      if (!countPattern.test(value)) {
          error.textContent = "Количество должно содержать только цифры.";
          return;
      }

      quantity = parseInt(value, 10);

      if (quantity < 1) {
          error.textContent = "Количество должно быть больше нуля.";
          return;
      }

      error.textContent = "";

      price = parseInt(product.value, 10);
      productName = product.options[product.selectedIndex].text
          .split("—")[0].trim();

      total = price * quantity;

      resultDetails.textContent =
          productName + " — " + quantity + " шт. по " +
          price.toLocaleString("ru-RU") + " ₽";

      resultSum.textContent = total.toLocaleString("ru-RU");
      result.hidden = false;
  });
});  
