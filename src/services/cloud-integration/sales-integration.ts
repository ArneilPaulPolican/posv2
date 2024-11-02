export const syncSales = async (sales: [])  => {
  try {
      const response = await fetch('https://api.example.com/data', { // Replace with your API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sales:sales }), // Prepare the data to send
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};
