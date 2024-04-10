function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
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

document.addEventListener('DOMContentLoaded', function() {
    const searchName = document.getElementById('search-name');
    const searchStatus = document.getElementById('search-status');

    let searchTimeout;

    function searchExams() {
        clearTimeout(searchTimeout); // Hủy timeout hiện tại nếu có
        searchTimeout = setTimeout(function() {
            const name = searchName.value;
            const status = document.getElementById('search-status').value;
            const query = new URLSearchParams({ name, status }).toString();
            window.location.href = `/search?${query}`;
        }, 200); 
    }

    // Lưu giá trị của ô search vào session storage khi người dùng thay đổi giá trị
    searchName.addEventListener('input', function() {
        sessionStorage.setItem('searchName', this.value);
        searchExams(); // Gọi hàm searchExams khi người dùng nhập vào ô search
    });

    // Lấy giá trị từ session storage và đặt nó vào ô search khi trang tải lại
    const savedSearchName = sessionStorage.getItem('searchName');
    if (savedSearchName) {
        searchName.value = savedSearchName;
    }

    // Lưu giá trị của select vào session storage khi người dùng thay đổi giá trị
    searchStatus.addEventListener('change', function() {
        sessionStorage.setItem('searchStatus', this.value);
    });

    // Lấy giá trị từ session storage và đặt nó vào select khi trang tải lại
    const savedSearchStatus = sessionStorage.getItem('searchStatus');
    if (savedSearchStatus) {
        searchStatus.value = savedSearchStatus;
    }
    
    searchName.addEventListener('keyup', searchExams);
    searchStatus.addEventListener('change', searchExams);
});