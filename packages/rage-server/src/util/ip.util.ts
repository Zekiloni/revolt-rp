import axios from 'axios';
import { getLogger } from 'log4js';

const logger = getLogger('ip-util');

export type IpApiResponse = {
  status: 'success' | 'fail';
  message?: string;
  query?: string;       // the IP
  country?: string;
  regionName?: string;
  city?: string;
  isp?: string;         // ISP name
  org?: string;
  as?: string;          // ASN text (e.g. "AS15169 Google LLC")
  proxy?: boolean;      // true if detected as proxy/VPN (sometimes present)
};

export async function getIpInfo(ip: string): Promise<IpApiResponse | null> {
  if (!ip) return null;

  const fields = [
    'status',
    'message',
    'query',
    'country',
    'regionName',
    'city',
    'isp',
    'org',
    'as',
    'proxy'
  ].join(',');

  try {
    const url = `https://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`;
    const response = await axios.get<IpApiResponse>(url, {
      timeout: 5000,
      validateStatus: s => s >= 200 && s < 500,
    });

    const data = response.data;

    if (!data || data.status === 'fail') {
      logger.warn(`ip-api lookup failed for IP ${ip}:`, data?.message ?? 'no data');
      return null;
    }

    return data;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

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
    logger.error(err);
    return false;
  }
}
