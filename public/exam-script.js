document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('countdown');
    const countdownData = document.getElementById('countdownData');
    let timeLeft = parseInt(countdownData.dataset.time, 10);

    const countdown = setInterval(function() {
        if (timeLeft <= 0) {
            document.getElementById('quiz-form').submit(); // Gửi dữ liệu khi countdown chạy hết
            return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }, 1000);

    const scrollToTopButton = document.getElementById('scrollToTop');
    const scrollToBottomButton = document.getElementById('scrollToBottom');

    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    scrollToBottomButton.addEventListener('click', function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    });

    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10);
            scrollToQuestion(index);
        });
    });

    function scrollToQuestion(index) {
        const questionElement = document.querySelector(`.question:nth-child(${index + 1})`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn nút gửi dữ liệu mặc định
    document.getElementById('confirmModal').style.display = 'block'; // Hiển thị hộp xác nhận
});

document.getElementById('confirmSubmit').addEventListener('click', function() {
    document.getElementById('quiz-form').submit(); // Gửi dữ liệu khi người dùng xác nhận
});

document.getElementById('cancelSubmit').addEventListener('click', function() {
    document.getElementById('confirmModal').style.display = 'none'; // Ẩn hộp xác nhận
});