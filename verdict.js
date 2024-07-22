async function getVerdicts() {
  const urlParams = new URLSearchParams(window.location.search);
  const handle = urlParams.get('handle') || document.getElementById('handleInput').value;
  if (!handle) {
      alert('Please enter a Codeforces handle');
      return;
  }

  const url = `https://codeforces.com/api/user.status?handle=${handle}`;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      if (data.status !== 'OK') {
          throw new Error('Error fetching data: ' + data.comment);
      }

      const submissions = data.result;
      const verdictCounts = {
          'OK': 0,
          'WRONG_ANSWER': 0,
          'TIME_LIMIT_EXCEEDED': 0,
          'RUNTIME_ERROR': 0,
          'OTHER': 0
      };

      submissions.forEach(submission => {
          const verdict = submission.verdict;
          if (verdict in verdictCounts) {
              verdictCounts[verdict]++;
          } else {
              verdictCounts['OTHER']++;
          }
      });

      displayPieChart(verdictCounts);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

function displayPieChart(verdictCounts) {
  const ctx = document.getElementById('verdictChart').getContext('2d');
  const labels = Object.keys(verdictCounts);
  const counts = Object.values(verdictCounts);

  new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: counts,
              backgroundColor: [
                  'rgba(50, 255, 10, 1)',
                  'rgba(255, 0, 0, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ]
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false
      }
  });
}
getVerdicts();
