
import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeProduct = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(html);
    let scrapedData = { title: '', price: 0, image: '', currency: 'INR' };


    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        
        const product = json['@type'] === 'Product' ? json : json['@graph']?.find(item => item['@type'] === 'Product');
        
        if (product) {
          scrapedData.title = product.name || scrapedData.title;
          scrapedData.image = product.image || scrapedData.image;
          const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
          if (offer) {
            scrapedData.price = parseFloat(offer.price);
            scrapedData.currency = offer.priceCurrency || 'INR';
          }
        }
      } catch (e)
    });

    
    if (!scrapedData.price) {
      scrapedData.title = scrapedData.title || $('#productTitle').text().trim();
      const priceText = $('.a-price-whole').first().text().trim() || $('#priceblock_ourprice').text().trim();
      scrapedData.price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    }

    return scrapedData;

  } catch (error) {
    console.error(`Scraping error for ${url}:`, error.message);
    throw new Error('Failed to extract data from the target website.');
  }
}