async function getProblemCounts() {
  const urlParams = new URLSearchParams(window.location.search);
  const handle = urlParams.get('handle');
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

      const problems = data.result;
      const problemCountsByTags = {};

      problems.forEach(problem => {
          if (problem.verdict === 'OK') {

              // Count by tags
              problem.problem.tags.forEach(tag => {
                  if (!problemCountsByTags[tag]) {
                      problemCountsByTags[tag] = 0;
                  }
                  problemCountsByTags[tag]++;
              });
          }
      });
      displayChartTags(problemCountsByTags);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}
function displayChartTags(problemCountsByTags) {
  const ctx = document.getElementById('problemChartTags').getContext('2d');
  const tags = Object.keys(problemCountsByTags);
  const counts = Object.values(problemCountsByTags);

  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: tags,
          datasets: [{
              label: 'Number of Problems Solved',
              data: counts,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}
getProblemCounts();
