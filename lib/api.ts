// API layer to handle database operations
export async function registerUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization: string;
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
} 