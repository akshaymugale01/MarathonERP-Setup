export const getSites = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pms/sites.json', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch sites');
  }
  
  return response.json();
};