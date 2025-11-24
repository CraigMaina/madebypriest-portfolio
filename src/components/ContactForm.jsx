import React from 'react';

const ContactForm = ({ referralProject }) => {
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
      <div className="absolute inset-0 bg-black/80 z-10" />

      <div className="relative z-20 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        
        {/* --- COLUMN 1: The "About" Copy --- */}
        <div className="text-white space-y-6">
          <img 
            src="/images/profile.jpg"
            alt="MadeByPriest"
            className="w-32 h-32 rounded-full object-cover border-2 border-white/20 mb-4"
            onError={(e) => { e.target.src = 'https://placehold.co/200x200/1a1a1a/fff?text=Priest'; }}
          />
          
          {/* Headline derived from [cite: 3] */}
          <h2 className="text-4xl md:text-6xl font-bold font-heading leading-none">
            Don't just look good.<br/>
            <span className="text-gray-400">Connect.</span>
          </h2>

          {/* Body copy from [cite: 4, 5] */}
          <p className="text-lg text-gray-300 leading-relaxed">
            "My specialty is cinematic, high-quality editing that makes your brand feel bigger, sharper, and more magnetic. From campaign reels to full-length productions, I shape each frame to tell a story people actually want to watch, and remember."
          </p>

          {/* Closing statement from [cite: 8] */}
          <p className="text-lg text-gray-300 leading-relaxed font-medium border-l-2 border-lime-400 pl-4">
            "I deliver fast, collaborative, premium editing that feels effortless for you, and unforgettable for your audience."
          </p>
        </div>

        {/* --- COLUMN 2: Contact Form --- */}
        <div className="w-full bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
          <form 
            action="https://formspree.io/f/your-formspree-id"
            method="POST" 
            className="flex flex-col gap-6"
          >
            <input 
              type="hidden" 
              name="Interested In Project" 
              value={referralProject || "General Inquiry"} 
            />

            {referralProject && (
              <div className="text-lime-400 text-sm font-medium">
                Inquiring about: {referralProject}
              </div>
            )}

            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                placeholder="Your Name" 
                required 
                className="w-full p-4 bg-transparent border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Your Email" 
                required 
                className="w-full p-4 bg-transparent border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea 
                name="message" 
                id="message" 
                rows="4" 
                placeholder={referralProject ? `I saw your work on ${referralProject} and want something similar...` : "Tell me about your vision..."}
                required 
                className="w-full p-4 bg-transparent border-b border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
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