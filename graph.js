async function getProblemCounts() {
    const urlParams = new URLSearchParams(window.location.search);
    const handle = urlParams.get('handle');
    if (!handle) {
        alert('Please enter a Codeforces handle');
        return;
    }

    const url = `https://codeforces.com/api/user.status?handle=${handle}`; // Enclosed in backticks
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error('Error fetching data: ' + data.comment);
        }

        const problems = data.result;
        const problemCounts = {};

        problems.forEach(problem => {
            if (problem.verdict === 'OK') {
                const rating = problem.problem.rating || 'Unrated';
                if (!problemCounts[rating]) {
                    problemCounts[rating] = 0;
                }
                problemCounts[rating]++;
            }
        });

        displayChart(problemCounts);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayChart(problemCounts) {
    const ctx = document.getElementById('problemChartRating').getContext('2d');
    const ratings = Object.keys(problemCounts);
    const counts = Object.values(problemCounts);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ratings,
            datasets: [{
                label: 'Number of Problems Solved',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Ensures the chart resizes properly
            maintainAspectRatio: false, // Allows chart to fill container
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} problems`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Rating'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Problems'
                    }
                }
            }
        }
    });
}

// If the handle is passed via URL, automatically fetch the problem counts
getProblemCounts();
