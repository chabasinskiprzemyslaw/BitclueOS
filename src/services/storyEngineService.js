const API_BASE_URL = 'https://localhost:5001';

export const getCurrentStepObjectives = async (scenarioId, userIdentityId) => {
  try {
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(
      `${API_BASE_URL}/story-engine/scenarios/${scenarioId}/current-step-objectives?userIdentityId=${userIdentityId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      if (response.status === 404) {
        throw new Error('No scenario progress found for the user and scenario');
      }
      throw new Error('Failed to fetch objectives');
    }

    const objectives = await response.json();
    return objectives;
  } catch (error) {
    console.error('Error fetching objectives:', error);
    throw error;
  }
}; 