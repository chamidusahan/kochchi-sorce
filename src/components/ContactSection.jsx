import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

const ContactSection = () => {
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: ''
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [feedback, setFeedback] = React.useState({ type: '', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    setFeedback({ type: '', message: '' })
    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.message.trim()) {
      setFeedback({ type: 'error', message: 'Please provide your name, email, and a message.' })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('http://localhost/backend/user/api/submit-contact-message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message')
      }

      setFeedback({ type: 'success', message: 'Thanks! we will get back to you shortly.' })
      setFormValues({ name: '', email: '', phone: '', topic: '', message: '' })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <section id="contact" className="py-20 bg-gradient-to-b from-black via-black to-red-950 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="text-red-500">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Have questions about our products or need to place a custom order?
            Reach out to us!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-red-900/30 p-3 rounded-full">
                  <Phone className="text-red-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Phone</h4>
                  <p className="text-gray-300">+94 77 123 4567</p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-red-900/30 p-3 rounded-full">
                  <Mail className="text-red-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email</h4>
                  <p className="text-gray-300">info@spiceup.lk</p>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-red-900/30 p-3 rounded-full">
                  <MapPin className="text-red-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Address</h4>
                  <p className="text-gray-300">
                    123 Spice Road, Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-red-900/30 p-3 rounded-full hover:bg-red-600/30 transition-colors">
                  <Facebook className="text-red-500" size={20} />
                </a>
                <a href="#" className="bg-red-900/30 p-3 rounded-full hover:bg-red-600/30 transition-colors">
                  <Instagram className="text-red-500" size={20} />
                </a>
                <a href="#" className="bg-red-900/30 p-3 rounded-full hover:bg-red-600/30 transition-colors">
                  <Twitter className="text-red-500" size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-lg lg:col-span-2"
          >
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            {feedback.message && (
              <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-green-900/20 border-green-700/50 text-green-200' : 'bg-red-900/20 border-red-700/50 text-red-200'}`}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>{feedback.message}</span>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name"
                    value={formValues.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your phone number"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <select
                    name="topic"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formValues.topic}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option>Order Inquiry</option>
                    <option>General Question</option>
                    <option>Wholesale Request</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows="4"
                    name="message"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Your message"
                    value={formValues.message}
                    onChange={handleChange}
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className={`flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors w-full ${submitting ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-800">
        
        </div>
      </div>
    </section>
  )
}

export default ContactSection
