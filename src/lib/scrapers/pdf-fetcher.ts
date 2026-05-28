/**
 * PDF Fetcher with fallback mechanisms
 * Tries multiple methods to fetch PDFs from NCERT
 */

import https from 'https';
import http from 'http';

/**
 * Fetch PDF using native https module (more reliable than fetch)
 */
export async function fetchPDFWithHTTPS(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
    };

    client.get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          return fetchPDFWithHTTPS(redirectUrl).then(resolve).catch(reject);
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch PDF with fallback to native https if fetch fails
 */
export async function fetchPDF(url: string): Promise<Buffer> {
  // Try fetch first
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (fetchError) {
    console.log('   ⚠️  fetch() failed, trying native https...');

    // Fallback to native https
    try {
      return await fetchPDFWithHTTPS(url);
    } catch (httpsError) {
      throw new Error(`Both fetch and https failed: ${fetchError}`);
    }
  }
}
