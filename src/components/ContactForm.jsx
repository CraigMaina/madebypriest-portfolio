import React from 'react';

const ContactForm = () => {
  return (
    <div id="contact" className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-8 md:p-16">
      
      {/* --- 1. Video Background --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/contact-bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* --- 2. Dark Overlay --- */}
      {/* Increased darkness a bit for better text contrast */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* --- 3. Content Container (NOW A 2-COLUMN GRID) --- */}
      <div className="relative z-20 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* --- COLUMN 1: Personal Mission --- */}
        <div className="text-white">
          <img 
            src="/images/profile.jpg" // <-- ADD YOUR PHOTO HERE
            alt="MadeByPriest"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover mb-6 border-4 border-gray-700"
            onError={(e) => { e.target.src = 'https://placehold.co/200x200/1a1a1a/fff?text=Priest'; }}
          />
          <h2 className="text-5xl md:text-7xl font-bold">
            Let's Create.
          </h2>
          <p className="text-lg text-gray-300 mt-6 max-w-lg">
            "I'm Priest, a visual artist specializing in creating
            immersive experiences. My work blends cinematic techniques with
            generative art to produce visuals that aren't just seen, but felt.
            If you have a vision, I have the craft to bring it to life."
          </p>
        </div>

        {/* --- COLUMN 2: Contact Form --- */}
        <div className="w-full">
          <form 
            action="https://formspree.io/f/your-formspree-id" // <-- REMEMBER TO REPLACE THIS
            method="POST" 
            className="flex flex-col gap-6"
          >
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                placeholder="Your Name" 
                required 
                className="w-full p-4 bg-transparent border-b border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Your Email" 
                required 
                className="w-full p-4 bg-transparent border-b border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea 
                name="message" 
                id="message" 
                rows="4" 
                placeholder="Tell me about your project..." 
                required 
                className="w-full p-4 bg-transparent border-b border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button 
                type="submit" 
                className="w-full px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;