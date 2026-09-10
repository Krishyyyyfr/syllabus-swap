import { Link } from 'react-router-dom';
import { ArrowLeft, Bug, MessageSquare, HelpCircle, Mail } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const CONTACT_EMAILS = [
  'Krish Vaswani: 27043@stjohnscollege.co.za',
  'Ginter Shakantu: 27109@stjohnscollege.co.za',
] as const;

export default function Contact() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-white/75 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Back to Edumarts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLogo size="sm" />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8 animate-fade-up">
        <div>
          <h1 className="font-body text-2xl font-extrabold text-foreground tracking-tight">Get in touch</h1>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            Report bugs, share feedback, or send queries to the emails below. We&apos;ll get back to you as soon as we can.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Bug, label: 'Bugs', detail: 'Something broken or not working as expected' },
            { icon: MessageSquare, label: 'Feedback', detail: 'Ideas to improve the marketplace' },
            { icon: HelpCircle, label: 'Queries', detail: 'Questions about listings or your account' },
          ].map(({ icon: Icon, label, detail }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-secondary mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <p className="font-semibold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="font-body text-lg font-bold text-foreground">Email both of us</h2>
          <ul className="space-y-3">
            {CONTACT_EMAILS.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-secondary/40 hover:shadow-card-hover transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="font-medium text-foreground break-all">{email}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
