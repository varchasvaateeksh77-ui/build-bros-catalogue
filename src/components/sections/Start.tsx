import React, { useState } from 'react';
import { SectionLabel } from '../ui/Pill';
import { Field } from '../ui/Field';
import { Button } from '../ui/Button';
import {
  ContactFormErrors,
  ContactFormInput,
  validateContactForm,
} from '../windows/demoStore';
import contactData from '../../data/contact.json';
import { soundFX } from '../../lib/soundEffects';

const INITIAL_FORM: ContactFormInput = {
  name: '',
  restaurantName: '',
  city: '',
  tablesCount: '',
  level: 'Not sure',
  phone: '',
  notes: '',
};

export const Start: React.FC = () => {
  const [form, setForm] = useState<ContactFormInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submittedData, setSubmittedData] = useState<ContactFormInput | null>(null);

  const handleChange = (
    field: keyof ContactFormInput,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(form);
    if (Object.keys(validationErrors).length > 0) {
      soundFX.play('cartRemove');
      setErrors(validationErrors);
      return;
    }
    soundFX.play('served');
    setErrors({});
    setSubmittedData(form);
  };

  const handleFormFocusCapture = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  };

  const inputClass =
    'w-full h-12 px-4 rounded-[12px] bg-[#F7F2ED] border border-[#E3D9D3] text-[15px] text-[#1A0C06] placeholder:text-[#6C625C]/60 focus:border-[#E8500C] focus:outline-none transition-colors';

  return (
    <section
      id="start"
      style={{ overflowAnchor: 'none' }}
      className="py-16 md:py-24 px-[14px] md:px-6 bg-[#140905] text-[#FBEFE6]"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Heading, note, and real contact details */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <SectionLabel text="Get started" onDark />
          <h2
            className="text-[32px] md:text-[48px] font-semibold text-[#FBEFE6] leading-[1.06] tracking-[-0.035em] m-0"
            style={{ textWrap: 'balance' }}
          >
            Get your restaurant set up in one conversation.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.5] text-[#FBEFE6]/80 m-0">
            Tell us about your restaurant. We will reply with the level that fits
            and what setup involves.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-2 rounded-[12px] bg-[#2A180D] border border-[#F7F2ED]/15 text-[14px] font-mono-code text-[#FBEFE6]/90">
              We send a clear quote.
            </span>
          </div>

          {/* Direct contact card from contact.json */}
          <div
            className="mt-2 p-5 rounded-[20px] bg-[#2A180D] border border-[#F7F2ED]/15 flex flex-col gap-3"
            data-testid="direct-contact-card"
          >
            <span className="text-[12px] font-mono-code font-semibold uppercase tracking-wider text-[#FF8741]">
              Direct contact
            </span>
            <div className="flex flex-col gap-2 text-[14px]">
              {contactData.phones.map((p) => (
                <div
                  key={p.raw}
                  className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#F7F2ED]/10"
                >
                  <a
                    href={`tel:${p.raw}`}
                    className="font-mono-code font-semibold text-[#FBEFE6] hover:text-[#FF8741] no-underline"
                  >
                    {p.display}
                  </a>
                  <a
                    href={`https://wa.me/${p.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-semibold px-2.5 py-1 rounded-[8px] bg-[#140905] border border-[#F7F2ED]/20 text-[#FBEFE6] hover:border-[#FF8741] no-underline"
                  >
                    WhatsApp
                  </a>
                </div>
              ))}
              <div className="pt-1 flex flex-col gap-1">
                <span className="text-[12px] text-[#FBEFE6]/65">Email</span>
                <a
                  href={`mailto:${contactData.email}`}
                  className="font-mono-code text-[13px] sm:text-[14px] font-semibold text-[#FBEFE6] hover:text-[#FF8741] break-all no-underline"
                >
                  {contactData.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: White card with validated contact form */}
        <div className="lg:col-span-7">
          <div className="bg-[#FFFFFF] text-[#1A0C06] rounded-[24px] border border-[#E3D9D3] p-6 md:p-10">
            {submittedData ? (
              <div
                className="py-6 flex flex-col gap-4"
                data-testid="contact-form-success"
              >
                <span className="inline-block w-fit px-3 py-1 rounded-[8px] bg-[#FFEEE3] text-[#C03E0A] font-mono-code text-[12px] font-semibold">
                  Details received
                </span>
                <h3 className="text-[24px] md:text-[28px] font-semibold text-[#1A0C06] m-0">
                  Thanks. We will reply on the phone number you gave.
                </h3>
                <div className="p-4 rounded-[16px] bg-[#F7F2ED] border border-[#E3D9D3] text-[14px] text-[#6C625C] flex flex-col gap-1">
                  <div>
                    <strong className="text-[#1A0C06]">Restaurant:</strong>{' '}
                    {submittedData.restaurantName} ({submittedData.city})
                  </div>
                  <div>
                    <strong className="text-[#1A0C06]">Tables:</strong>{' '}
                    {submittedData.tablesCount} ·{' '}
                    <strong className="text-[#1A0C06]">Level:</strong>{' '}
                    {submittedData.level}
                  </div>
                  <div>
                    <strong className="text-[#1A0C06]">Phone:</strong>{' '}
                    {submittedData.phone}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="accent"
                    href={`https://wa.me/${contactData.phones[0].whatsapp}?text=${encodeURIComponent(
                      `Hi Build Bros, I am ${submittedData.name} from ${submittedData.restaurantName} (${submittedData.city}), ${submittedData.tablesCount} tables, interested in ${submittedData.level}.`
                    )}`}
                  >
                    Message on WhatsApp
                  </Button>
                  <Button
                    variant="dark"
                    showArrow={false}
                    onClick={() => {
                      setSubmittedData(null);
                      setForm(INITIAL_FORM);
                    }}
                  >
                    Send another inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                onFocusCapture={handleFormFocusCapture}
                noValidate
                className="flex flex-col gap-5"
                data-testid="contact-form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="field-name" label="Your name" error={errors.name}>
                    <input
                      id="field-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Alex Rivera"
                      className={inputClass}
                      aria-invalid={Boolean(errors.name)}
                    />
                  </Field>

                  <Field
                    id="field-restaurant"
                    label="Restaurant name"
                    error={errors.restaurantName}
                  >
                    <input
                      id="field-restaurant"
                      type="text"
                      value={form.restaurantName}
                      onChange={(e) =>
                        handleChange('restaurantName', e.target.value)
                      }
                      placeholder="Corner Roast Cafe"
                      className={inputClass}
                      aria-invalid={Boolean(errors.restaurantName)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field id="field-city" label="City" error={errors.city}>
                    <input
                      id="field-city"
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Your city"
                      className={inputClass}
                      aria-invalid={Boolean(errors.city)}
                    />
                  </Field>

                  <Field
                    id="field-tables"
                    label="Number of tables"
                    error={errors.tablesCount}
                  >
                    <input
                      id="field-tables"
                      type="number"
                      min={1}
                      value={form.tablesCount}
                      onChange={(e) =>
                        handleChange('tablesCount', e.target.value)
                      }
                      placeholder="12"
                      className={inputClass}
                      aria-invalid={Boolean(errors.tablesCount)}
                    />
                  </Field>

                  <Field id="field-level" label="Which level">
                    <select
                      id="field-level"
                      value={form.level}
                      onChange={(e) => handleChange('level', e.target.value)}
                      className={inputClass}
                    >
                      <option value="Level 1">Level 1, Digital menu</option>
                      <option value="Level 2">Level 2, Menu and waiter call</option>
                      <option value="Level 3">Level 3, Full ordering</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </Field>
                </div>

                <Field id="field-phone" label="Phone number" error={errors.phone}>
                  <input
                    id="field-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 555 234 5678"
                    className={inputClass}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>

                <Field
                  id="field-notes"
                  label="Anything we should know"
                  optional
                >
                  <textarea
                    id="field-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="How many staff work a busy shift, or questions about your floor."
                    className="w-full p-4 rounded-[12px] bg-[#F7F2ED] border border-[#E3D9D3] text-[15px] text-[#1A0C06] placeholder:text-[#6C625C]/60 focus:border-[#E8500C] focus:outline-none transition-colors resize-y"
                  />
                </Field>

                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full sm:w-auto"
                  >
                    Send details
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
