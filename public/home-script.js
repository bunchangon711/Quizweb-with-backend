function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Giả sử bạn đã truyền dữ liệu từ server đến trang như sau:
    const exams = JSON.parse(document.getElementById('examsData').dataset.exams);

    exams.forEach(exam => {
        const startTimeElement = document.getElementById(`startTime-${exam._id}`);
        const startTime = new Date(exam.timeStart);
        const countdown = setInterval(function() {
            const now = new Date();
            const distance = now - startTime;

            startTimeElement.textContent = formatTime(distance);
        }, 1000);
    });

    exams.forEach(exam => {
        const endTimeElement = document.getElementById(`endTime-${exam._id}`);
        const endTime = new Date(exam.timeEnd);
        const countdown = setInterval(function() {
            const now = new Date();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(countdown);
                endTimeElement.textContent = 'EXPIRED';
                return;
            }

            endTimeElement.textContent = formatTime(distance);
        }, 1000);
    });
});