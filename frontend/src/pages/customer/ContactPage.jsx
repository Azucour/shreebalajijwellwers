import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Send } from 'lucide-react';
import { SHOP } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    // Send via WhatsApp
    const msg = `Hello *${SHOP.name}*,\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n\n*Message:*\n${form.message}`;
    const url = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    toast.success('Opening WhatsApp with your message…');
    setForm({ name: '', phone: '', message: '' });
    setSending(false);
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      lines: [SHOP.phone],
      action: { href: SHOP.phoneTel, label: 'Call Now' },
      color: 'text-blue-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      lines: [SHOP.phone, 'Quick response guaranteed'],
      action: { href: `https://wa.me/${SHOP.whatsapp}`, label: 'Chat Now', external: true },
      color: 'text-green-500',
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: [SHOP.email],
      action: { href: `mailto:${SHOP.email}`, label: 'Send Email' },
      color: 'text-gold-500',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      lines: ['@shreebalajijewellers'],
      action: { href: SHOP.instagram, label: 'Follow Us', external: true },
      color: 'text-pink-500',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us – Shree Balaji Jewellers</title>
        <meta name="description" content="Contact Shree Balaji Jewellers. Visit our showroom in Kalyān or reach us via WhatsApp, phone or email." />
      </Helmet>

      {/* Header */}
      <div className="bg-charcoal pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold-400 font-cormorant italic text-xl mb-2">We'd love to hear from you</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-white">Get in Touch</h1>
        </div>
      </div>

      <div className="bg-cream py-14 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Contact cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {contactCards.map(({ icon: Icon, title, lines, action, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-5 text-center border border-gray-100 hover:border-gold-200
                  hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3
                  group-hover:scale-110 transition-transform duration-300 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-playfair font-semibold text-charcoal mb-1">{title}</h3>
                {lines.map((line, j) => (
                  <p key={j} className="text-gray-500 text-xs">{line}</p>
                ))}
                <a
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                  className="inline-block mt-3 text-xs font-semibold text-gold-600 hover:text-gold-800 underline-offset-2 hover:underline"
                >
                  {action.label} →
                </a>
              </motion.div>
            ))}
          </div>

          {/* Main section: form + info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <h2 className="font-playfair text-2xl font-semibold text-charcoal mb-1">Send a Message</h2>
              <p className="text-gray-400 text-sm mb-6">We'll get back to you within 24 hours</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    type="tel"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what you're looking for…"
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send size={15} />
                  {sending ? 'Sending…' : 'Send via WhatsApp'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  This will open WhatsApp with your message pre-filled
                </p>
              </form>
            </motion.div>

            {/* Info + Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Info card */}
              <div className="bg-charcoal rounded-xl p-6 text-white">
                <h2 className="font-playfair text-xl font-semibold text-gold-300 mb-5">Visit Our Showroom</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-0.5">{SHOP.name}</p>
                      <p className="text-gray-400 text-sm">{SHOP.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={18} className="text-gold-400 shrink-0" />
                    <p className="text-gray-400 text-sm">{SHOP.timing}</p>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={18} className="text-gold-400 shrink-0" />
                    <a href={SHOP.phoneTel} className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                      {SHOP.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <a
                    href={`https://wa.me/${SHOP.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white
                      py-3 rounded text-sm font-medium hover:bg-[#1DAA55] transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                  <a
                    href={SHOP.phoneTel}
                    className="flex-1 flex items-center justify-center gap-2 border border-gold-500 text-gold-400
                      py-3 rounded text-sm font-medium hover:bg-gold-500 hover:text-charcoal transition-all"
                  >
                    <Phone size={16} />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.678764692!2d77.4581519!3d13.0584688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae250051c87995%3A0x84a5d6de745d2a4a!2sShree%20Balaji%20Jewellers!5e0!3m2!1sen!2sin!4v1714020000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Shree Balaji Jewellers location"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
