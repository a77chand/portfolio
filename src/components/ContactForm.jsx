import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('xgognzqb');

  if (state.succeeded) {
    return <p className="form-success">Message sent — thanks! I'll get back to you soon. ✓</p>;
  }

  return (
    <form className="c-form" onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="f-email">Email</label>
      <input className="form-input" id="f-email" type="email" name="email" placeholder="you@email.com" required />
      <ValidationError prefix="Email" field="email" errors={state.errors} />

      <label className="form-label" htmlFor="f-subject">Subject</label>
      <input className="form-input" id="f-subject" type="text" name="subject" required />

      <label className="form-label" htmlFor="f-message">Message</label>
      <textarea className="form-input" id="f-message" name="message" placeholder="Hi Anusha..." required />
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <button className="form-submit" type="submit" disabled={state.submitting}>
        {state.submitting ? 'Sending…' : 'Submit'}
      </button>
    </form>
  );
}
