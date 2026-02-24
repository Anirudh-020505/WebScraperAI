
import { prisma } from '../config/db.js';
import { scrapeProduct } from '../services/scraper.js';


export const trackProduct = async (req, res) => {
    const { url, email } = req.body;

    try {

        let product = await prisma.product.findUnique({
            where: { url }
        });


        if (!product) {
            console.log("🕵️ New product detected. Scraping...");
            const details = await scrapeProduct(url);

            product = await prisma.product.create({
                data: {
                    url,
                    title: details.title,
                    currentPrice: details.price,
                    image: details.image,
                    lowestPrice: details.price,
                    highestPrice: details.price,
                }
            });
        }


        const user = await prisma.user.upsert({
            where: { email },
            update: {
                trackedProducts: { connect: { id: product.id } }
            },
            create: {
                email,
                trackedProducts: { connect: { id: product.id } }
            }
        });

        res.status(200).json({
            message: "Product is now being tracked!",
            product
        });

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};