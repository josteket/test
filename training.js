document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript для тренировок загружен и готов к работе.');

    // Элементы страницы
    const trainingButtons = document.querySelectorAll('.training-button');
    const availableTrainings = document.getElementById('available-trainings');
    const totalTrainingsElement = document.getElementById('total-trainings');
    const progressBar = document.querySelector('.progress');

    // Данные
    let trainingsLeft = parseInt(localStorage.getItem('trainingsLeft')) || 3;
    let totalTrainings = parseInt(localStorage.getItem('totalTrainings')) || 0;
    let experiencePoints = parseInt(localStorage.getItem('experiencePoints')) || 0;
    const maxTrainingsPerDay = 3;
    const maxExperiencePerLevel = 10; // Опыт, необходимый для следующего уровня

    // Названия уровней
    const levelNames = [
        'Новичок', 'Любитель', 'Спортсмен', 'Атлет',
        'Эксперт', 'Мастер', 'Чемпион', 'Легенда',
        'Супергерой', 'Олимпийский Чемпион'
    ];

    // Проверка и обновление энергии в полночь
    function resetTrainingsAtMidnight() {
        const lastReset = localStorage.getItem('lastReset');
        const currentDate = new Date().toDateString();

        if (lastReset !== currentDate) {
            trainingsLeft = maxTrainingsPerDay;
            localStorage.setItem('trainingsLeft', trainingsLeft);
            localStorage.setItem('lastReset', currentDate);
        }
    }

    // Функция обновления количества тренировок и опыта
    function updateStats() {
        availableTrainings.textContent = `${trainingsLeft}/${maxTrainingsPerDay}`;
        totalTrainingsElement.textContent = totalTrainings;
        localStorage.setItem('totalTrainings', totalTrainings);
        localStorage.setItem('experiencePoints', experiencePoints);
        localStorage.setItem('trainingsLeft', trainingsLeft);

        // Обновление прогресс-бара
        const levelIndex = Math.floor(experiencePoints / maxExperiencePerLevel);
        const levelProgress = (experiencePoints % maxExperiencePerLevel) / maxExperiencePerLevel * 100;
        progressBar.style.width = `${levelProgress}%`;
    }

    // Обработчики нажатия на кнопки тренировок
    trainingButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (trainingsLeft > 0) {
                trainingsLeft -= 1;
                totalTrainings += 1;
                experiencePoints += 1;
                updateStats();
            } else {
                alert('Вы достигли максимального количества тренировок на сегодня!');
            }
        });
    });

    // Инициализация
    resetTrainingsAtMidnight();
    updateStats();
});