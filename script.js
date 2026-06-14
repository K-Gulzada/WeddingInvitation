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

function sendRsvpToTelegram(event) {
    event.preventDefault(); // Запрещаем перезагрузку страницы

    // ВСТАВЬТЕ СЮДА ВАШИ ДАННЫЕ ИЗ ШАГА 1:
    const telegramToken = '8822621557:AAEi9BVjtnVSh3BvpQx9DJUVpa-xoaHh7e8';
    const chatId = '693082270';

    // Получаем имя гостя из формы
    const guestName = document.querySelector('.rsvp-input').value;

    // Получаем выбранный вариант ответа
    const selectedAnswer = document.querySelector('input[name="attendance"]:checked').value;

    // Переводим ответы на красивый язык для сообщения
    let answerText = '';
    if (selectedAnswer === 'yes') answerText = '✅ Әрине келемін';
    if (selectedAnswer === 'pair') answerText = '👩‍❤️‍👨 Жұбыммен келемін';
    if (selectedAnswer === 'no') answerText = '❌ Өкінішке орай, қатыса алмаймын';

    // Формируем красивый текст сообщения
    const message = `🔔 *Жаңа жауап қабылданды!*\n\n👤 *Есімі:* ${guestName}\n💬 *Жауабы:* ${answerText}`;

    // URL для отправки запроса в Telegram API
    // const url = `https://telegram.org/bot${telegramToken}/sendMessage`;
    const url = `https://api.telegram.org/bot8822621557:AAEi9BVjtnVSh3BvpQx9DJUVpa-xoaHh7e8/sendMessage`;

    // Отправляем данные на сервера Telegram
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
    })
        .then(response => {
            if (response.ok) {
                // Успех — передаем текст благодарности
                openCustomModal('Рахмет! Жауап сәтті қабылданды.', false);
                document.querySelector('.rsvp-form').reset(); // Очищаем форму
            } else {
                // Ошибка сервера Telegram (например, неверный токен или ID)
                openCustomModal('Жауап жіберілмеді. Серверде қате кетті.', true);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            // Ошибка сети (интернет отключен или заблокирован запрос)
            openCustomModal('Желіде қате кетті. Кейінірек қайталап көріңіз.', true);
        });
}

