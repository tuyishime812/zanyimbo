import { CreditCard, Smartphone, Globe, Shield } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ResourcePages.css'

export default function PaymentMethods() {
  const methods = [
    {
      icon: CreditCard,
      title: 'Credit/Debit Cards',
      description: 'Visa, MasterCard, American Express',
      regions: 'Global'
    },
    {
      icon: Smartphone,
      title: 'Mobile Money',
      description: 'Airtel Money, TNM Mpamba',
      regions: 'Malawi'
    },
    {
      icon: Globe,
      title: 'PayPal',
      description: 'Secure online payments',
      regions: 'International'
    },
    {
      icon: Shield,
      title: 'Bank Transfer',
      description: 'Direct bank transfers',
      regions: 'Selected Countries'
    }
  ]

  return (
    <div className="resource-page">
      <Header />
      <main className="main-content no-player">
        <div className="resource-hero">
          <div className="hero-content">
            <CreditCard size={48} color="#ff6b35" />
            <h1>Payment Methods</h1>
            <p>Multiple secure payment options for your convenience.</p>
          </div>
        </div>

        <div className="methods-section">
          <h2>Accepted Payment Methods</h2>
          <div className="methods-grid">
            {methods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">
                  <method.icon size={40} color="#ff6b35" />
                </div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <span className="region-tag">{method.regions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="security-section">
          <h2>Secure Payments</h2>
          <div className="security-info">
            <p>All transactions are secured with 256-bit SSL encryption. We never store your full card details on our servers. Payments are processed through trusted third-party payment processors.</p>
          </div>
        </div>

        <div className="faq-section">
          <h2>Payment FAQs</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Is my payment information secure?</h3>
              <p>Yes, we use industry-standard encryption and never store your full card details.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use multiple payment methods?</h3>
              <p>Currently, each transaction must use a single payment method.</p>
            </div>
            <div className="faq-item">
              <h3>What currency are prices in?</h3>
              <p>Prices are displayed in USD and MWK. Your bank may apply conversion fees for international transactions.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
