function toggleWeddingMusic() {
    const audio = document.getElementById('weddingAudio');
    const iconContainer = document.querySelector('.play-center-icon');

    if (audio.paused) {
        audio.play().catch(err => console.log("Аудио заблокировано политикой браузера:", err));
        // Меняем иконку на Pause
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    } else {
        audio.pause();
        // Возвращаем иконку Play
        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
}


// Функция обратного отсчета для таймера
function startWeddingCountdown() {
    // Устанавливаем дату свадьбы: 1 августа 2026 года, 18:00
    const targetDate = new Date('August 1, 2026 18:00:00').getTime();

    const timerInterval = setInterval(function () {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Если дата свадьбы уже наступила
        if (difference < 0) {
            clearInterval(timerInterval);
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        // Математический расчет дней, часов, минут и секунд
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Форматируем вывод, чтобы всегда было две цифры (например, "05" вместо "5")
        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    }, 1000);
}

// Запускаем таймер сразу при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    startWeddingCountdown();
});

// Функция открытия универсального окна
function openCustomModal(text, isError = false) {
    const modal = document.getElementById('customModal');
    const messageElement = document.getElementById('modalMessage');

    // Вставляем переданный текст
    messageElement.innerText = text;

    if (isError) {
        // Если это ошибка — включаем красный режим
        modal.classList.add('error-mode');
    } else {
        // Если все хорошо — убираем его (на случай, если он остался с прошлого раза)
        modal.classList.remove('error-mode');
    }

    // Показываем окно
    modal.classList.add('active');
}

// Функция закрытия окна
function closeCustomModal() {
    document.getElementById('customModal').classList.remove('active');
}

function sendRsvpToGoogleTable(event) {
    event.preventDefault();

    const form = event.target;
    const button = document.getElementById('submitBtn');

    // Блокируем кнопку и стираем текст, оставляя ТОЛЬКО спиннер по центру
    //button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>';
    button.style.opacity = "0.8";

    // Дальше весь твой код отправки идет без изменений...
    // const inputs = form.querySelectorAll('input, select, textarea');
    // inputs.forEach(input => {
    //     input.disabled = true;
    //     input.style.opacity = "0.6";
    // });

    const scriptURL = 'https://script.google.com/macros/s/AKfycbx-rhcce5h2qnHR7ey442Y0jKEbpMbHPWDORHrK6df7PPvhcyGAFjGgleuSP-f-OixqXg/exec';
    const formData = new FormData(form);

    const nameField = form.querySelector('[name="name"]');
    const attendanceField = form.querySelector('[name="attendance"]:checked');
    console.log("1. Элемент инпута имени:", nameField);
    console.log("2. Значение из инпута имени:", nameField ? nameField.value : "НЕ НАЙДЕН ИНПУТ С name='name'");
    console.log("3. Выбранный элемент радиокнопки:", attendanceField);
    console.log("4. Значение выбранной радиокнопки:", attendanceField ? attendanceField.value : "НЕ ВЫБРАН РАДИОБАТТОН С name='attendance'");


    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            openCustomModal('Рахмет! Жауап сәтті қабылданды.', false);

            // Фиксируем финальный статус
            button.innerHTML = "Жіберу";
            //button.disabled = true;
            button.style.opacity = "0.6";
        })
        .catch(error => {
            console.error('Ошибка!', error.message);
            button.disabled = false;
            button.style.opacity = "1";
            inputs.forEach(input => {
                input.disabled = false;
                input.style.opacity = "1";
            });
            openCustomModal('Желіде қате кетті. Кейінірек қайталап көріңіз.', true);
        });
}

