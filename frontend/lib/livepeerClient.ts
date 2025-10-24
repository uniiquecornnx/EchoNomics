import axios from 'axios';

const LIVEPEER_API_KEY = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
const LIVEPEER_API_URL = 'https://livepeer.studio/api';

if (!LIVEPEER_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_LIVEPEER_API_KEY environment variable');
}

const livepeer = axios.create({
  baseURL: LIVEPEER_API_URL,
  headers: {
    Authorization: `Bearer ${LIVEPEER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function createStream(name: string, record: boolean = true) {
  try {
    console.log('Creating Livepeer stream with:', { name, record });
    
    const response = await livepeer.post('/stream', {
      name,
      record,
    });
    
    console.log('Livepeer API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating Livepeer stream:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error('Failed to create Livepeer stream');
  }
}

export async function getStream(streamId: string) {
  try {
    const response = await livepeer.get(`/stream/${streamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Livepeer stream ${streamId}:`, error);
    throw new Error(`Failed to fetch Livepeer stream ${streamId}`);
  }
}
