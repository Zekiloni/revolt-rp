import { Router } from 'express';
import https from 'https';
import http from 'http';

const router = Router();

router.get('', async (req, res) => {
  const streamUrl = req.query.url as string;

  if (!streamUrl) {
    return res.status(400).json({ error: 'Missing stream URL' });
  }

  try {
    console.log('Fetching stream from URL:', streamUrl);
    fetchStream(streamUrl, req, res, 5);
  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

function fetchStream(url: string, clientReq: any, res: any, maxRedirects: number) {
  if (maxRedirects === 0) {
    return res.status(500).json({ error: 'Too many redirects' });
  }

  const protocol = url.startsWith('https') ? https : http;

  const request = protocol.get(url, (response) => {
    const statusCode = response.statusCode || 200;

    // Handle redirects (301, 302, 307, 308)
    if ([301, 302, 307, 308].includes(statusCode)) {
      const redirectUrl = response.headers.location;

      if (!redirectUrl) {
        return res.status(500).json({ error: 'Redirect without location' });
      }

      console.log(`Following redirect (${statusCode}): ${url} -> ${redirectUrl}`);

      // Destroy current request and follow redirect
      request.destroy();
      return fetchStream(redirectUrl, clientReq, res, maxRedirects - 1);
    }

    // Success - stream the content
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.status(statusCode);

    if (response.headers['content-type']) {
      res.setHeader('Content-Type', response.headers['content-type']);
    }

    console.log('Streaming audio data from URL:', url);
    response.pipe(res);

    // Handle client disconnect
    clientReq.on('close', () => {
      request.destroy();
    });
  });

  request.on('error', (error) => {
    console.error('Stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch stream' });
    }
  });
}

export default router;
