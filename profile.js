async function fetchUserProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const handle = urlParams.get('handle');
    if (!handle) {
        alert('Please enter a Codeforces handle');
        return;
    }

    const userInfoUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
    const userRatingUrl = `https://codeforces.com/api/user.rating?handle=${handle}`;
    try {
        const [userInfoResponse, userRatingResponse] = await Promise.all([
            fetch(userInfoUrl),
            fetch(userRatingUrl)
        ]);

        if (!userInfoResponse.ok || !userRatingResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const userInfoData = await userInfoResponse.json();
        const userRatingData = await userRatingResponse.json();

        if (userInfoData.status !== 'OK' || userRatingData.status !== 'OK') {
            throw new Error('Error fetching data');
        }

        const user = userInfoData.result[0];
        const ratings = userRatingData.result;
        displayUserProfile(user);
        displayRatingChart(ratings);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred while checking the handle. Please try again later.');
    }
}

function displayUserProfile(user) {
    const profileContainer = document.getElementById('userProfile');
    profileContainer.innerHTML = `
        <img src="${user.avatar}" alt="${user.handle}'s avatar" class="profile-avatar">
        <div class="profile-item"><strong>Handle:</strong> ${user.handle}</div>
        <div class="profile-item"><strong>Rank:</strong> ${user.rank}</div>
        <div class="profile-item"><strong>Rating:</strong> ${user.rating}</div>
        <div class="profile-item"><strong>Max Rank:</strong> ${user.maxRank}</div>
        <div class="profile-item"><strong>Max Rating:</strong> ${user.maxRating}</div>
        <div class="profile-item"><strong>Contribution:</strong> ${user.contribution}</div>
        <div class="profile-item"><strong>Country:</strong> ${user.country || 'N/A'}</div>
        <div class="profile-item"><strong>Organization:</strong> ${user.organization || 'N/A'}</div>
        <div class="profile-item"><strong>Last Online:</strong> ${new Date(user.lastOnlineTimeSeconds * 1000).toLocaleString()}</div>
        <div class="profile-item"><strong>Registered:</strong> ${new Date(user.registrationTimeSeconds * 1000).toLocaleString()}</div>
    `;
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = `
        <button onclick="location.href='index.html'">Home</button>
        <button onclick="location.href='graph.html?handle=${user.handle}'">View Problem Graph</button>
        <button onclick="location.href='verdict.html?handle=${user.handle}'">View Verdict Chart</button>
        <button onclick="location.href='tag.html?handle=${user.handle}'">View Tag Graph</button>
        <button onclick="location.href='compare.html?handle=${user.handle}'">Compare Profile</button>
    `;
}

function displayRatingChart(ratings) {
    const ctx = document.getElementById('originalRatingChart').getContext('2d');
    
    const labels = ratings.map(rating => new Date(rating.ratingUpdateTimeSeconds * 1000));
    const data = ratings.map(rating => rating.newRating);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rating',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Rating: ${tooltipItem.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        tooltipFormat: 'll'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Rating'
                    }
                }
            }
        }
    });
}

fetchUserProfile();
