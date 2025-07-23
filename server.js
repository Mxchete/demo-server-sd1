const express = require('express'); // Express for backend framework, handle incoming HTTP requests
const axios = require('axios'); // send outgoing requests to ESP32
const app = express();
const PORT = 3000;

let latest_data = null;
let esp_ip = null;

app.use(express.json());

// POST method for getting data from ESP32
app.post('/submit', (req, res) => {
  latest_data = req.body;
  // Keep IP of ESP32 so we can send data to it
  esp_ip = req.ip.replace(/^.*:/, '');
  console.log('Received data from ESP32 at IP:', esp_ip);
  console.log('Received JSON:', latest_data);
  res.sendStatus(200);
});

// GET method for showing recieved data in browser
app.get('/', (req, res) => {
  if (!latest_data) {
    return res.send('<h1>No data received yet</h1>');
  }

  let html = `<h1>Received Data</h1><ul>`;
  for (const [key, value] of Object.entries(latest_data)) {
    html += `<li><strong>${key}</strong>: ${value}</li>`;
  }
  html += `</ul>`;

  res.send(html);
});

// POST method to send data to ESP32
app.post('/send-to-esp', async (req, res) => {
  if (!esp_ip) {
    return res.status(500).json({ error: 'ESP32 IP unknown. No data received yet.' });
  }

  const payload = req.body;

  const cleanIP = esp_ip.trim();
  const url = `http://${cleanIP}:80/update`;
  console.log("Posting to:", url);

  const esp_result = await axios.post(url, payload)
  .then(resp => {
    console.log('ESP32 response:', resp.data);
  })
  .catch(err => {
    console.error('Error contacting ESP32:', err.message);
    return res.status(502).json({ error: 'Failed to contact ESP32' });
  });

  return res.status(200).json({ status: "sent", esp_result: "updated" });
});

// Start Server on given port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
