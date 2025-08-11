// Advanced dashboard features: uptime chart, node geo map, and validator ranking

// Example uptime data for chart (simulate last 10 hours)
let uptimeHistory = [99.9, 99.8, 99.7, 99.9, 99.95, 99.92, 99.97, 99.99, 99.98, 99.96];
let uptimeChart;

// Example node geo locations (simulate)
const nodeLocations = [
  { name: "Validator-1", country: "US", lat: 37.77, lng: -122.42 },
  { name: "Validator-2", country: "DE", lat: 52.52, lng: 13.40 },
  { name: "Validator-3", country: "SG", lat: 1.35, lng: 103.82 },
  { name: "Validator-4", country: "BR", lat: -23.55, lng: -46.63 },
  { name: "Validator-5", country: "ZA", lat: -33.92, lng: 18.42 }
];

// Example validator ranking (simulate)
const validatorRanking = [
  { name: "Validator-1", score: 98.7 },
  { name: "Validator-4", score: 97.9 },
  { name: "Validator-2", score: 97.2 },
  { name: "Validator-5", score: 96.8 },
  { name: "Validator-3", score: 95.5 }
];

// Render uptime chart
function renderUptimeChart() {
  const canvas = document.getElementById('uptimeChart');
  if (!canvas) return;
  uptimeChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({length: uptimeHistory.length}, (_, i) => `H-${uptimeHistory.length - i}`),
      datasets: [{
        label: 'Uptime (%)',
        data: uptimeHistory,
        borderColor: '#7eff7e',
        backgroundColor: 'rgba(126,255,126,0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 2
      }]
    },
    options: {
      scales: {
        x: { display: false },
        y: { beginAtZero: false, min: 95, max: 100 }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Render validator ranking
function renderValidatorRanking() {
  const container = document.getElementById('validatorRanking');
  if (!container) return;
  container.innerHTML = '<h2 style="color:#a8d0ff;text-align:center;">Validator Ranking</h2><ol style="color:#e0f0ff;font-size:1.1rem;">'
    + validatorRanking.map(v => `<li>${v.name} <span style="color:#7eff7e;">${v.score}%</span></li>`).join('')
    + '</ol>';
}

// Render node geo map (simple text version)
function renderNodeGeoMap() {
  const container = document.getElementById('nodeGeoMap');
  if (!container) return;
  container.innerHTML = '<h2 style="color:#a8d0ff;text-align:center;">Node Locations</h2><ul style="color:#e0f0ff;font-size:1.05rem;">'
    + nodeLocations.map(n => `<li>${n.name}: ${n.country} (${n.lat}, ${n.lng})</li>`).join('')
    + '</ul>';
}

// Simulate uptime update every 10 seconds
setInterval(() => {
  uptimeHistory.push((99.7 + Math.random() * 0.3).toFixed(2));
  if (uptimeHistory.length > 10) uptimeHistory.shift();
  if (uptimeChart) {
    uptimeChart.data.datasets[0].data = uptimeHistory;
    uptimeChart.update();
  }
}, 10000);

// Initial render (call these from your dashboard.html after DOM is ready)
renderUptimeChart();
renderValidatorRanking();
renderNodeGeoMap();