async function navigateToProfile() {
  const handle = document.getElementById('handleInput').value.trim();
  if (!handle) {
    alert('Please enter a Codeforces handle.');
    return;
  }

  const url = `https://codeforces.com/api/user.info?handles=${handle}`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    
    // Check if the response status is OK and if the result array is empty
    if (data.status === 'OK' && data.result.length > 0) {
      // Navigate to the profile page with the valid handle
      window.location.href = `profile.html?handle=${handle}`;
    } else {
      // Handle case when handle is not found
      alert('The Codeforces handle you entered is incorrect. Please check and try again.');
    }
  } catch (error) {
    // Log the error and display a user-friendly message
    console.error('Error:', error);
    alert('An error occurred while checking the handle. Please try again later.');
  }
}
