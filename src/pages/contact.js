import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmission = (event) => {
    event.preventDefault();
    // Handle the submission, e.g., sending the data somewhere
    console.log(name, email, message);
  };

  return (
        <div className="contact-container">
            <h2>Contact Us</h2>
            <p>
                Whether you&apos;re seeking more information about improving your Building Energy Rating (BER),
                interested in partnership opportunities, or have any questions about our
                platform, we&apos;re here to help. Reach out to us, and let&apos;s drive positive
                change together.
            </p>
            <form onSubmit={handleSubmission} className="contact-form">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                    required
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
  );
};

export default Contact;
