// test-scraper.js
import { scrapeProduct } from './src/services/scraper.js';

const targetUrl = "https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX2F5QT";

console.log("🔍 Scraping started...");

scrapeProduct(targetUrl)
  .then(data => {
    console.log("✅ Success! Data extracted:");
    console.table(data); // Prints a nice table in the terminal
  })
  .catch(err => console.log("❌ Failed:", err.message));