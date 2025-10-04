import axios from 'axios';


export async function proxyCheck(ip: string): Promise<boolean> {
  if (!ip) return false;

  if (ip === '127.0.0.1' || ip === '172.17.0.1')
    return false;

  try {
    const url = `https://blackbox.ipinfo.app/lookup/${encodeURIComponent(ip)}`;
    const res = await axios.get(url, {
      responseType: 'text',
      timeout: 5000,
      validateStatus: s => s >= 200 && s < 500,
    });

    if (!res.data) return false;

    const text = res.data.toString().trim().toUpperCase();
    return text.includes('Y');
  } catch (err) {
    console.error('isProxyCheck error:', err);
    return false;
  }
}
