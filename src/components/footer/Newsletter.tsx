'use client';

import { useState } from 'react';
import RoundedButton from '@/components/RoundedButton';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email address!');
      return;
    }

    //  Hook this up to your backend, API, or service like Mailchimp
    console.log('Subscribed with:', email);
    alert(`Subscribed with: ${email}`);

    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-8">
      <div className="flex flex-col gap-8 flex-wrap">
        <p className="flex flex-col">
          <span className="text-lg text-content font-black">
            Want to know when I publish new pieces?
          </span>
          <span className="text-sm">Enter your email to join my free newsletter:</span>
        </p>
        <label htmlFor="newsletter" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="newsletter"
          id="newsletter"
          placeholder="yourusername@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-full border border-border-subtle focus:outline-none focus:ring-2 focus:ring-flame-500 placeholder:text-content-muted text-flame-500"
        />
      </div>
      <RoundedButton
        type="submit"
        backgroundColor="var(--flame-500)"
        className="min-w-[80px] min-h-[80px] xs:w-[110px] xs:h-[110px] sm:w-[150px] sm:h-[150px] rounded-full bg-surface-inverse text-content-soft text-lg text-center hover:text-gray-100"
      >
        <p className="w-full p-1 sm:p-2 text-lg">Subscribe</p>
      </RoundedButton>
    </form>
  );
};

export default Newsletter;
