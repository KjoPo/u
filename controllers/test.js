// Add this test endpoint to your server
router.get('/network-test', async (req, res) => {
    const testUrls = [
      'https://api.telegram.org',
      'https://google.com',
      'https://example.com'
    ];
  
    const results = await Promise.all(testUrls.map(async url => {
      try {
        await axios.head(url, { timeout: 5000 });
        return { url, status: 'reachable' };
      } catch (error) {
        return { url, status: 'unreachable', error: error.message };
      }
    }));
  
    res.json({ networkTest: results });
  });