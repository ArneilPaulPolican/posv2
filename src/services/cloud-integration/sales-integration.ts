export const syncSales = async (sales: [])  => {
  try {
    let url = 'http://127.0.0.1:8000/api/pos/post/bulk';
      const response = await fetch(url, { // Replace with your API URL
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
