async function fetchUserSubmissions(handle) {
  const userStatusUrl = `https://codeforces.com/api/user.status?handle=${handle}`;

  const userStatusResponse = await fetch(userStatusUrl);
  if (!userStatusResponse.ok) {
      throw new Error('Network response was not ok');
  }

  const userStatusData = await userStatusResponse.json();
  if (userStatusData.status !== 'OK') {
      throw new Error('Error fetching data');
  }

  return userStatusData.result;
}


function countProblemsByRating(submissions) {
  const problemCounts = {};

  submissions.forEach(submission => {
      if (submission.verdict === 'OK' && submission.problem.rating) {
          const rating = submission.problem.rating;
          problemCounts[rating] = (problemCounts[rating] || 0) + 1;
      }
  });

  return problemCounts;
}

async function compareProfiles() {
    const handle1 = document.getElementById('handle1').value;
    const handle2 = document.getElementById('handle2').value;

    if (!handle1 || !handle2) {
        alert('Please enter both Codeforces handles');
        return;
    }

    try {
        const [submissions1, submissions2] = await Promise.all([
            fetchUserSubmissions(handle1),
            fetchUserSubmissions(handle2)
        ]);

        const problemCounts1 = countProblemsByRating(submissions1);
        const problemCounts2 = countProblemsByRating(submissions2);

        displayProblemChart(handle1, problemCounts1, handle2, problemCounts2);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


function displayProblemChart(handle1, problemCounts1, handle2, problemCounts2) {
  const ctx = document.getElementById('compare-profile-rating').getContext('2d');

  const allRatings = [...new Set([...Object.keys(problemCounts1), ...Object.keys(problemCounts2)])].sort((a, b) => a - b);
  const data1 = allRatings.map(rating => problemCounts1[rating] || 0);
  const data2 = allRatings.map(rating => problemCounts2[rating] || 0);

  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: allRatings,
          datasets: [
              {
                  label: handle1,
                  data: data1,
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              },
              {
                  label: handle2,
                  data: data2,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              }
          ]
      },
      options: {
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Problem Rating'
                  }
              },
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Number of Problems Solved'
                  }
              }
          }
      }
  });
}