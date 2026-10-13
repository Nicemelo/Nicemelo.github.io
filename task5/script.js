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
