import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Clock3, MapPin, Menu, Scissors, Sparkles, Star, X } from 'lucide-react';
import { useState } from 'react';
import { isValidWhatsAppNumber, prepareWhatsAppBooking } from './data/booking.js';
import { shopConfig } from './data/shopConfig.js';

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: shopConfig.currency,
  maximumFractionDigits: 0,
}).format(price);
const whatsappDigits = shopConfig.whatsappNumber.replace(/\D/g, '');

function BrandMark() {
  return (
    <a className="brand-mark" href="#home" aria-label={`${shopConfig.name}, home`}>
      <span className="brand-star" aria-hidden="true"><Star size={16} strokeWidth={1.5} /></span>
      <span className="brand-copy">
        <span className="brand-name">{shopConfig.name}</span>
        <span className="brand-caption">BARBER SHOP</span>
      </span>
    </a>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ['About', '#about'],
    ['Services', '#services'],
    ['Gallery', '#gallery'],
    ['Visit us', '#visit'],
  ];

  return (
    <header className="site-header bg-ink">
      <div className="header-inner page-wrap">
        <BrandMark />
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <a className="nav-booking" href="#booking">Book a visit <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="page-wrap" aria-label="Mobile navigation">
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              <span className="mobile-nav-index">0{index + 1}</span>{label}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
          <a href="#booking" onClick={() => setMenuOpen(false)}><span className="mobile-nav-index">04</span>Book a visit<ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
      </div>
    </header>
  );
}

function SectionEyebrow({ children, number }) {
  return (
    <p className="section-eyebrow"><span className="eyebrow-line" aria-hidden="true" />{number && <span className="eyebrow-number">{number}</span>}{children}</p>
  );
}

function PhotoPlaceholder({ variant, label, detail, src, alt }) {
  return (
    <div className={`photo-placeholder photo-${variant} ${src ? 'has-shop-photo' : ''}`} role={src ? undefined : 'img'} aria-label={src ? undefined : `${label}. Photography placeholder.`}>
      {src ? <img className="shop-photo" src={src} alt={alt || label} loading={variant === 'hero' ? 'eager' : 'lazy'} decoding="async" /> : (
        <>
          <span className="photo-mark" aria-hidden="true"><Scissors size={26} strokeWidth={1.1} /></span>
          <span className="photo-placeholder-label">{label}</span>
          <span className="photo-placeholder-detail">{detail || 'Photography placeholder'}</span>
        </>
      )}
      <span className="photo-frame-corner photo-frame-tl" aria-hidden="true" />
      <span className="photo-frame-corner photo-frame-br" aria-hidden="true" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-grid page-wrap">
        <div className="hero-copy">
          <SectionEyebrow>Grooming, with intention</SectionEyebrow>
          <h1 id="hero-title" className="text-balance">The art of<br /><em>looking sharp.</em></h1>
          <p className="hero-lede">A considered cut. A closer finish. Your time in the chair, done right.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="#services">Explore services <ArrowDownRight size={17} aria-hidden="true" /></a>
            <a className="text-link" href="#about">Discover the shop <ArrowDown size={14} aria-hidden="true" /></a>
          </div>
          <div className="hero-note"><span className="gold-dot" aria-hidden="true" /> {shopConfig.name} <span className="note-divider" aria-hidden="true">/</span> Gwalior, Madhya Pradesh</div>
        </div>
        <div className="hero-visual-wrap">
          <div className="hero-visual-topline"><span>INSIDE FIVE STAR</span><span>01 — 38</span></div>
          <PhotoPlaceholder variant="hero" label="Inside Five Star Family Salon" src="/shop-gallery/04-abc-gwalior-ssh9z.jpg" alt="Salon chairs and mirrors inside Five Star Family Salon" />
          <div className="hero-side-caption"><span>{shopConfig.name.toUpperCase()}</span><span>CRAFT • CARE • CHARACTER</span></div>
          <div className="hero-roundel" aria-hidden="true"><Star size={14} fill="currentColor" /><span>THE BARBER<br />EXPERIENCE</span></div>
        </div>
        <a className="hero-scroll" href="#about"><span>Scroll to explore</span><span className="scroll-rule" /></a>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section section-pad" id="about" aria-labelledby="about-title">
      <div className="about-grid page-wrap">
        <div className="about-image-column">
          <PhotoPlaceholder variant="about" label="Inside Five Star Family Salon" src="/shop-gallery/05-abc-gwalior-1fbuk.jpg" alt="Hair wash basin and chair inside the salon" />
          <span className="image-index">FIG. 01 <span>THE SPACE</span></span>
        </div>
        <div className="about-copy">
          <SectionEyebrow number="01">A little about us</SectionEyebrow>
          <h2 id="about-title">Good grooming<br />is <em>personal.</em></h2>
          <p className="body-copy">{shopConfig.name} is a family salon in Gwalior for everyday hair and grooming services. Explore the shop through its own photos and send an appointment request directly on WhatsApp.</p>
          <p className="body-copy body-copy-muted">Appointment requests are confirmed by the shop over WhatsApp.</p>
          <a className="underlined-link" href="#visit">Get to know the shop <ArrowRight size={16} aria-hidden="true" /></a>
          <div className="about-stamp"><Sparkles size={19} strokeWidth={1.3} aria-hidden="true" /><span>MADE FOR<br />YOUR MOMENT</span></div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }) {
  return (
    <article className="service-card bg-surface">
      <div className="service-card-top"><span className="service-number">0{index + 1}</span><span className="sample-pill">Sample service</span></div>
      <h3>{service.name}</h3><p>{service.description}</p>
      <div className="service-card-bottom"><span className="service-price">{formatPrice(service.price)}</span><span className="price-note">Sample price</span></div>
    </article>
  );
}

function ServicesSection() {
  return (
    <section className="services-section section-pad" id="services" aria-labelledby="services-title">
      <div className="page-wrap">
        <div className="section-heading-row">
          <div><SectionEyebrow number="02">The menu</SectionEyebrow><h2 id="services-title">The essentials,<br /><em>refined.</em></h2></div>
          <p className="section-intro">An early look at the service menu. Sample prices are for layout preview only and will be confirmed by the shop.</p>
        </div>
        <div className="services-grid">{shopConfig.services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}</div>
        <div className="service-disclaimer"><span className="gold-dot" /><span>Sample services &amp; prices — final menu to be confirmed</span></div>
      </div>
    </section>
  );
}

function GallerySection() {
  const gallery = [
    { label: 'Salon entrance', src: '/shop-gallery/01-5-star-the-family-saloon-lashkar-gwalior-beauty-spas-i8ckd.jpg', number: '01' },
    { label: 'Barber chairs', src: '/shop-gallery/04-abc-gwalior-ssh9z.jpg', number: '02' },
    { label: 'Hair wash station', src: '/shop-gallery/05-abc-gwalior-1fbuk.jpg', number: '03' },
    { label: 'Salon products', src: '/shop-gallery/15-abc-gwalior-gmxi9.jpg', number: '04' },
    { label: 'Five Star signage', src: '/shop-gallery/32-5-star-the-family-saloon-gwalior-1meye.jpg', number: '05' },
    { label: 'Barbershop wall art', src: '/shop-gallery/34-5-star-the-family-saloon-kishanbagh-gwalior-salons-l2gsto1tbi.jpg', number: '06' },
  ];
  return (
    <section className="gallery-section section-pad" id="gallery" aria-labelledby="gallery-title">
      <div className="page-wrap">
        <div className="gallery-heading"><div><SectionEyebrow number="03">The details</SectionEyebrow><h2 id="gallery-title">A closer <em>look.</em></h2></div><p className="section-intro">A selection of Five Star’s entrance, salon setup and details.</p></div>
        <div className="gallery-grid">
          {gallery.map((image) => (
            <figure className="gallery-item" key={image.number}>
              <PhotoPlaceholder variant={`gallery-${image.number}`} label={image.label} src={image.src} alt={image.label} />
              <figcaption><span>{image.number} / {image.label}</span><span className="gallery-caption-tag">FIVE STAR · GWALIOR</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection() {
  const canBook = isValidWhatsAppNumber(shopConfig.whatsappNumber);
  const [values, setValues] = useState({ name: '', serviceId: '', preferredDate: '', preferredTime: '', message: '' });
  const [errors, setErrors] = useState({});
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { errors: validationErrors, url: bookingUrl } = prepareWhatsAppBooking(
      shopConfig.whatsappNumber,
      shopConfig.name,
      values,
      shopConfig.services,
    );
    setErrors(validationErrors);
    if (bookingUrl) window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="booking-section" id="booking" aria-labelledby="booking-title">
      <div className="booking-inner page-wrap">
        <div className="booking-copy">
          <SectionEyebrow>Make it yours</SectionEyebrow>
          <h2 id="booking-title">A moment<br />for <em>yourself.</em></h2>
          <p>Send an appointment request directly to the shop over WhatsApp. The shop will confirm availability with you.</p>
          <form className="booking-form" onSubmit={handleSubmit} noValidate autoComplete="off">
            {!canBook && <p className="booking-unavailable" id="booking-unavailable">Booking is unavailable until the shop confirms its WhatsApp number.</p>}
            {Object.values(errors).some(Boolean) && <p className="booking-validation-summary" role="alert">Please check the highlighted required fields.</p>}
            <fieldset className="booking-form-fields" disabled={!canBook}>
              <div className="booking-field">
                <label htmlFor="booking-name">Your name <span aria-hidden="true">*</span></label>
                <input id="booking-name" name="name" autoComplete="off" value={values.name} onChange={handleChange} required maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'booking-name-error' : undefined} />
                {errors.name && <span className="booking-field-error" id="booking-name-error">{errors.name}</span>}
              </div>
              <div className="booking-field">
                <label htmlFor="booking-service">Service <span aria-hidden="true">*</span></label>
                <select id="booking-service" name="serviceId" value={values.serviceId} onChange={handleChange} required aria-invalid={Boolean(errors.serviceId)} aria-describedby={errors.serviceId ? 'booking-service-error' : undefined}>
                  <option value="">Choose a service</option>
                  {shopConfig.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
                </select>
                {errors.serviceId && <span className="booking-field-error" id="booking-service-error">{errors.serviceId}</span>}
              </div>
              <div className="booking-field">
                <label htmlFor="booking-date">Preferred date <span aria-hidden="true">*</span></label>
                <input id="booking-date" name="preferredDate" type="date" min={minDate} value={values.preferredDate} onChange={handleChange} required aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? 'booking-date-error' : undefined} />
                {errors.preferredDate && <span className="booking-field-error" id="booking-date-error">{errors.preferredDate}</span>}
              </div>
              <div className="booking-field">
                <label htmlFor="booking-time">Preferred time <span aria-hidden="true">*</span></label>
                <input id="booking-time" name="preferredTime" type="time" value={values.preferredTime} onChange={handleChange} required aria-invalid={Boolean(errors.preferredTime)} aria-describedby={errors.preferredTime ? 'booking-time-error' : undefined} />
                {errors.preferredTime && <span className="booking-field-error" id="booking-time-error">{errors.preferredTime}</span>}
              </div>
              <div className="booking-field booking-field-wide">
                <label htmlFor="booking-message">Message <span>(optional)</span></label>
                <textarea id="booking-message" name="message" rows="3" maxLength={500} value={values.message} onChange={handleChange} />
              </div>
            </fieldset>
            <button className={`button ${canBook ? 'button-gold' : 'button-disabled'}`} type="submit" disabled={!canBook} aria-describedby="booking-note">
              {canBook ? 'Continue to WhatsApp' : 'WhatsApp booking coming soon'} <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="booking-note" id="booking-note">Submitting opens WhatsApp with your request. It does not confirm an appointment; the shop must confirm it manually. Your details are not saved on this website.</p>
        </div>
        <div className="booking-mark" aria-hidden="true"><Star size={32} strokeWidth={1} /><span>{shopConfig.name}</span></div>
      </div>
    </section>
  );
}

function VisitSection() {
  const addressReady = Boolean(shopConfig.address);
  const mapsReady = Boolean(shopConfig.directionsUrl);
  return (
    <section className="visit-section section-pad" id="visit" aria-labelledby="visit-title">
      <div className="visit-grid page-wrap">
        <div className="visit-heading"><SectionEyebrow number="04">Plan your visit</SectionEyebrow><h2 id="visit-title">Find your<br /><em>moment.</em></h2></div>
        <div className="visit-details">
          <article className="visit-card"><span className="visit-icon"><MapPin size={19} strokeWidth={1.4} aria-hidden="true" /></span><div><h3>Come by</h3><p>{addressReady ? shopConfig.address : 'Shop address to be confirmed'}</p>{mapsReady ? <a className="underlined-link" href={shopConfig.directionsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} aria-hidden="true" /></a> : <span className="detail-pending">Directions link to come</span>}</div></article>
          <article className="visit-card"><span className="visit-icon"><Clock3 size={19} strokeWidth={1.4} aria-hidden="true" /></span><div><h3>Opening hours</h3>{shopConfig.openingHours.length ? <ul className="hours-list">{shopConfig.openingHours.map(({ day, hours }) => <li key={day}><span>{day}</span><span>{hours}</span></li>)}</ul> : <p>Opening times to be confirmed</p>}</div></article>
          <div className="visit-map-placeholder" role="img" aria-label="Map placeholder. Shop location has not been confirmed."><MapPin size={23} strokeWidth={1.2} aria-hidden="true" /><span>LOCATION PREVIEW</span><small>Map will appear once the shop address is confirmed.</small></div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="testimonial-section" aria-labelledby="testimonial-title">
      <div className="testimonial-inner page-wrap"><SectionEyebrow>Kind words</SectionEyebrow><h2 id="testimonial-title">A good visit<br />speaks for <em>itself.</em></h2>
        <div className="demo-testimonial"><span className="demo-label"><Star size={13} aria-hidden="true" /> DEMO CONTENT</span><p>Review preview area</p><span className="demo-note">Replace with a real customer review only after permission is given.</span></div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer"><div className="page-wrap">
      <div className="footer-main">
        <div className="footer-brand-column"><BrandMark /><p>Good grooming. A little more considered.</p></div>
        <div className="footer-links"><span className="footer-label">Explore</span><a href="#about">About</a><a href="#services">Services</a><a href="#gallery">Gallery</a><a href="#visit">Visit us</a></div>
        <div className="footer-contact"><span className="footer-label">Find us</span><span>{shopConfig.address || 'Address to be confirmed'}</span><span>{isValidWhatsAppNumber(shopConfig.whatsappNumber) ? `+${whatsappDigits}` : 'Contact details to be confirmed'}</span></div>
        <a className="back-to-top" href="#home" aria-label="Back to top"><ArrowUpRight size={19} aria-hidden="true" /></a>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {shopConfig.name}</span><span>LOCAL SHOP · DETAILS SUBJECT TO CONFIRMATION</span><a href="#home">Back to top ↑</a></div>
    </div></footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" className="min-h-screen"><HeroSection /><AboutSection /><ServicesSection /><GallerySection /><BookingSection /><VisitSection /><TestimonialsSection /></main>
      <SiteFooter />
    </>
  );
}
