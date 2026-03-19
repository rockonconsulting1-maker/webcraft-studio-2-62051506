
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Selling',
    message: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="pt-40 pb-20 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-12 text-center shadow-2xl border border-gray-100 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-[#002366] mb-4">Message Received!</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Thank you, {formData.name.split(' ')[0]}! Dillon will review your request and get back to you within 24 hours.
          </p>
          <button 
            onClick={() => {
              setFormState('idle');
              setFormData({ name: '', email: '', phone: '', type: 'Selling', message: '', address: '' });
            }}
            className="bg-[#002366] text-white px-8 py-3 rounded-xl font-bold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info Side */}
            <div>
              <SectionHeader 
                title="Let's Connect" 
                subtitle="Have a question about the Southern Alberta market or the 2% commission model? I'm here to help." 
                centered={false} 
              />
              
              <div className="space-y-10 mt-12">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-white text-[#00A651] rounded-2xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#002366] mb-1">Call or Text</h4>
                    <p className="text-gray-600 mb-2 font-medium">Available 7 days a week</p>
                    <a href="tel:5873287355" className="text-2xl font-bold text-[#00A651] hover:underline">587-328-7355 (SELL)</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-white text-[#00A651] rounded-2xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#002366] mb-1">Email</h4>
                    <p className="text-gray-600 mb-2 font-medium">General inquiries & scheduling</p>
                    <a href="mailto:dillon.rochon@2percentrealty.ca" className="text-lg font-bold text-[#00A651] hover:underline">dillon.rochon@2percentrealty.ca</a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-white text-[#00A651] rounded-2xl shadow-sm flex items-center justify-center mr-6 shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#002366] mb-1">Brokerage</h4>
                    <p className="text-gray-600 font-medium">2% Realty Lethbridge</p>
                    <p className="text-gray-500">Serving Pincher Creek, Lethbridge, & Fort Macleod</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 h-64 bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-300">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover grayscale opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center text-[#002366] font-bold text-center p-8 bg-blue-50/40">
                  <div>
                    <MapPin className="mx-auto mb-2 text-[#00A651]" size={40} />
                    Serving All of Southern Alberta
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 min-h-[600px]">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/fAGECD8hPugBebZjISBE"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '5px' }}
                id="inline-fAGECD8hPugBebZjISBE" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Landing Page - Contact Form"
                data-height="534"
                data-layout-iframe-id="inline-fAGECD8hPugBebZjISBE"
                data-form-id="fAGECD8hPugBebZjISBE"
                title="Landing Page - Contact Form"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
