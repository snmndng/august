'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-luxior-black via-gray-900 to-luxior-deep-orange text-white">
        <div className="container-max py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Get in touch with our team. We&apos;re here to help with any questions or concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-lg"
                >
                  <MessageSquare size={20} className="mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We&apos;d love to hear from you! Get in touch with us.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">+254 700 000 000</p>
                    <p className="text-gray-500 text-sm">Monday - Friday, 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">info@luxiormall.com</p>
                    <p className="text-gray-500 text-sm">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">
                      Westlands, Nairobi<br />
                      Kenya
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-luxior-deep-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}