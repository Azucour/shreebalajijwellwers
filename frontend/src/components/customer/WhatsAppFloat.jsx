import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SHOP } from '../../utils/constants';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${SHOP.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full
        flex items-center justify-center shadow-2xl whatsapp-float"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={28} className="text-white" fill="white" />
    </motion.a>
  );
}
