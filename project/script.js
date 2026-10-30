/* global window, document, localStorage, history, fetch */
window.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var modal = document.getElementById("modalOverlay");
  var openBtn = document.getElementById("openModalBtn");
  var closeBtn = document.getElementById("closeModalBtn");
  var form = document.getElementById("contactForm");
  var statusDiv = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");
  var policyCheckbox = document.getElementById("policy");

  // !!! Твой URL от Formcarry
  var API_URL = "https://formcarry.com/s/Rub4NGEecDV";

  var inputs = {
    fio: document.getElementById("fio"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    org: document.getElementById("org"),
    message: document.getElementById("message")
  };

  var errors = {
    fio: document.getElementById("error-fio"),
    email: document.getElementById("error-email"),
    phone: document.getElementById("error-phone")
  };

  var patterns = {
    fio: /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\+\-\(\)\s]{5,25}$/ 
  };

  /* --- Вспомогательная функция для очистки статуса --- */
  function clearStatus() {
    statusDiv.textContent = "";
    statusDiv.className = "form-status";
  }

  /* --- 1. Управление попапом и History API --- */
  function openModal() {
    modal.classList.remove("hidden");
    history.pushState({ modal: true }, "", "#feedback");
    document.body.style.overflow = "hidden";
    
    // Очищаем старое сообщение и сбрасываем кнопку при открытии
    clearStatus();
    submitBtn.disabled = !policyCheckbox.checked;

    loadFromStorage();
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    clearStatus();
    if (window.location.hash === "#feedback") {
      history.back();
    }
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.modal) {
      openModal();
    } else {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
      clearStatus();
    }
  });

  if (window.location.hash === "#feedback") openModal();

  /* --- 2. Блокировка кнопки до согласия --- */
  policyCheckbox.addEventListener("change", function () {
    submitBtn.disabled = !this.checked;
    clearStatus(); // Убираем старое сообщение при клике на галочку
  });

  /* --- 3. Валидация с визуальной подсветкой --- */
  function validateField(input, pattern, errorDiv, errorMsg) {
    if (input.value.trim() === "") {
      input.classList.remove("input-valid", "input-invalid");
      errorDiv.textContent = "";
      return false;
    }
    
    if (pattern.test(input.value.trim())) {
      input.classList.add("input-valid");
      input.classList.remove("input-invalid");
      errorDiv.textContent = "";
      return true;
    } else {
      input.classList.add("input-invalid");
      input.classList.remove("input-valid");
      errorDiv.textContent = errorMsg;
      return false;
    }
  }

  // Слушатели для полей (добавлена очистка статуса при вводе)
  inputs.fio.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, "");
    validateField(this, patterns.fio, errors.fio, "Только буквы, пробелы и дефис.");
    clearStatus();
    saveToStorage();
  });

  inputs.phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^\d\+\-\(\)\s]/g, "");
    validateField(this, patterns.phone, errors.phone, "Введите корректный номер.");
    clearStatus();
    saveToStorage();
  });

  inputs.email.addEventListener("input", function () {
    validateField(this, patterns.email, errors.email, "Формат: example@mail.ru");
    clearStatus();
    saveToStorage();
  });

  inputs.org.addEventListener("input", function() {
    clearStatus();
    saveToStorage();
  });
  
  inputs.message.addEventListener("input", function() {
    clearStatus();
    saveToStorage();
  });

  /* --- 4. LocalStorage --- */
  function saveToStorage() {
    var data = {
      fio: inputs.fio.value,
      email: inputs.email.value,
      phone: inputs.phone.value,
      org: inputs.org.value,
      message: inputs.message.value
    };
    localStorage.setItem("feedbackForm", JSON.stringify(data));
  }

  function loadFromStorage() {
    var saved = localStorage.getItem("feedbackForm");
    if (saved) {
      try {
        var data = JSON.parse(saved);
        inputs.fio.value = data.fio || "";
        inputs.email.value = data.email || "";
        inputs.phone.value = data.phone || "";
        inputs.org.value = data.org || "";
        inputs.message.value = data.message || "";
      } catch (e) {
        console.error("Ошибка чтения localStorage", e);
      }
    }
  }

  /* --- 5. Отправка --- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // На всякий случай проверяем галочку (если нажали Enter в поле)
    if (!policyCheckbox.checked) {
      statusDiv.className = "form-status error";
      statusDiv.textContent = "Необходимо согласие с политикой.";
      return;
    }

    var isValid = true;
    
    if (!patterns.fio.test(inputs.fio.value.trim())) {
      errors.fio.textContent = "Заполните ФИО корректно.";
      isValid = false;
    }
    if (!patterns.email.test(inputs.email.value.trim())) {
      errors.email.textContent = "Заполните Email корректно.";
      isValid = false;
    }
    if (!patterns.phone.test(inputs.phone.value.trim())) {
      errors.phone.textContent = "Заполните телефон корректно.";
      isValid = false;
    }
    if (inputs.message.value.trim() === "") {
      isValid = false;
    }

    if (!isValid) {
      statusDiv.className = "form-status error";
      statusDiv.textContent = "Пожалуйста, исправьте ошибки в форме.";
      return;
    }

    submitBtn.disabled = true;
    statusDiv.className = "form-status";
    statusDiv.textContent = "Отправка...";

    // ИСПРАВЛЕНО: ключ email маленькими буквами для Formcarry
    var formData = {
      "ФИО": inputs.fio.value.trim(),
      email: inputs.email.value.trim(), 
      "Телефон": inputs.phone.value.trim(),
      "Организация": inputs.org.value.trim(),
      "Сообщение": inputs.message.value.trim()
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.code === 200) {
        statusDiv.className = "form-status success";
        statusDiv.textContent = "Сообщение успешно отправлено!";
        form.reset();
        localStorage.removeItem("feedbackForm");
        
        // Убираем зеленые рамки после сброса (через классический цикл, чтобы JSLint не ругался)
        var validInputs = document.querySelectorAll('.input-valid');
        for (var i = 0; i < validInputs.length; i += 1) {
          validInputs[i].classList.remove('input-valid');
        }
        
        setTimeout(closeModal, 2000);
      } else {
        statusDiv.className = "form-status error";
        statusDiv.textContent = "Ошибка: " + data.message;
        submitBtn.disabled = !policyCheckbox.checked;
      }
    })
    .catch(function (error) {
      statusDiv.className = "form-status error";
      statusDiv.textContent = "Ошибка сети. Проверьте соединение.";
      submitBtn.disabled = !policyCheckbox.checked;
      console.error(error);
    });
  });
});
