export const SHOP = {
  name: 'Shree Balaji Jewellers',
  tagline: 'Crafting Elegance Since Generations',
  whatsapp: '918652761185',          // ← replace with actual number
  phone: '+91 86527 61185',          // ← replace with actual number
  phoneTel: 'tel:+918652761185',     // ← replace with actual number
  email: 'sonu540mane@gmail.com',
  address: '123, Jewellers Market, Main Road, Kalyān, Maharashtra 421301',
  instagram: 'https://instagram.com/shreebalajijewellers',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.4!2d73.1!3d19.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zShree+Balaji+Jewellers!5e0!3m2!1sen!2sin!4v1234567890',
  timing: 'Mon–Sun: 10:00 AM – 9:00 PM',
};

export const CATEGORIES = [
  'All',
  'Gold',
  'Silver',
  'Diamond',
  'Rings',
  'Necklaces',
  'Bangles',
  'Earrings',
  'Bridal Sets',
  'Pendants',
  'Chains',
  'Bracelets',
  'Anklets',
];

export const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');

export const buildWhatsAppUrl = (product) => {
  const price = product.priceVisible && product.price
    ? `₹${product.price.toLocaleString('en-IN')}`
    : 'Price on request';

  const imageUrl = product.images?.[0]?.url || '';

  const msg = `Hello *${SHOP.name}*,

I am interested in this product:

🏷️ *Product Name:* ${product.name}
💰 *Price:* ${price}
📂 *Category:* ${product.category}
🖼️ *Product Image:* ${imageUrl}

Please share more details. Thank you!`;

  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(msg)}`;
};
