import axios from 'axios';

export async function fetchYoutubeVideo(videoId: string) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('Missing YOUTUBE_API_KEY');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${key}`;
  const resp = await axios.get(url);
  return resp.data;
}
