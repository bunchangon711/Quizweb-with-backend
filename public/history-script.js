const ctx = document.getElementById('examChart').getContext('2d');
const completedExams = document.getElementById('examChart').dataset.completedExams;
const remainingExams = document.getElementById('examChart').dataset.remainingExams;

const examChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Đã làm', 'Chưa làm'],
        datasets: [{
            data: [completedExams, remainingExams],
            backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 99, 132, 0.5)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ số bài thi đã làm/Tổng số bài thi'
            }
        }
    }
});

const ctxBar = document.getElementById('scoreChart').getContext('2d');
const examResults = JSON.parse(document.getElementById('scoreChart').dataset.examResults);
const scoreChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: examResults.map(result => result.examName),
        datasets: [{
            label: 'Điểm số',
            data: examResults.map(result => result.score),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});