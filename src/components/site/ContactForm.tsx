'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, PaperPlaneTilt, Warning } from '@phosphor-icons/react';
import { dur, ease } from '@/lib/motion';
import { FORMSPREE_ENDPOINT, GMAIL_COMPOSE, SITE, externalLinkProps } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { interpolate, type Dictionary } from '@/content/translations';

type Values = {
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  name: string;
  email: string;
};

type Errors = Partial<Record<keyof Values, string>>;

/** Readable fallback body, mirroring what the route used to send. */
function buildSummary(v: Values) {
  return [
    `New enquiry from ${v.name} <${v.email}>`,
    '',
    `Project:  ${v.projectType}`,
    `Budget:   ${v.budget}`,
    `Timeline: ${v.timeline}`,
    '',
    v.message,
  ].join('\n');
}

const EMPTY: Values = {
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  name: '',
  email: '',
};

const STEP_FIELDS = [
  ['projectType', 'budget', 'timeline'],
  ['message'],
  ['name', 'email'],
] as const;

/** Error text states the cause *and* the fix (error-clarity). */
function validateField(key: keyof Values, v: Values, t: Dictionary): string | undefined {
  const e = t.form.errors;
  switch (key) {
    case 'projectType':
      return v.projectType ? undefined : e.projectType;
    case 'budget':
      return v.budget ? undefined : e.budget;
    case 'timeline':
      return v.timeline ? undefined : e.timeline;
    case 'message':
      if (!v.message.trim()) return e.messageEmpty;
      if (v.message.trim().length < 20)
        return interpolate(e.messageShort, { n: 20 - v.message.trim().length });
      return undefined;
    case 'name':
      return v.name.trim() ? undefined : e.name;
    case 'email':
      if (!v.email.trim()) return e.emailEmpty;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
        return e.emailInvalid;
      return undefined;
  }
}

function Chips({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  required,
}: {
  name: string;
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset id={name} className="scroll-mt-32">
      <legend className="mb-3.5 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-fg">
        {legend}
        {required && (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
      >
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="peer sr-only"
            />
            <span
              className="flex min-h-[46px] items-center border border-line bg-bg px-4 text-[0.75rem] uppercase tracking-[0.12em] text-muted transition-colors duration-300 ease-crisp hover:border-line-strong hover:text-fg peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2.5 flex items-center gap-1.5 text-[0.825rem] text-danger">
          <Warning size={15} weight="fill" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ContactForm() {
  const reduced = useReducedMotion() ?? false;
  const { t, fill } = useLanguage();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [errorNonce, setErrorNonce] = useState(0);
  // What actually went wrong, so the failure state can say something useful
  // instead of a generic "that didn't send".
  const [failMessage, setFailMessage] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  // Honeypot. Real people never see or fill this; bots fill everything.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    // Clear the error as soon as the field becomes valid — don't nag.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const blur = (key: keyof Values) => () => {
    const err = validateField(key, values, t);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const checkStep = (index: number): Errors => {
    const found: Errors = {};
    for (const field of STEP_FIELDS[index]) {
      const err = validateField(field, values, t);
      if (err) found[field] = err;
    }
    return found;
  };

  /**
   * Multiple errors get a focusable summary and focus moves there; a single
   * error focuses its own field instead (focus-management / error-summary).
   *
   * The move happens in an effect keyed on `errorNonce` rather than in a
   * requestAnimationFrame here — the rAF races React's commit, so the summary
   * often isn't in the DOM yet when focus() is called and the move silently
   * does nothing. The nonce makes repeated failed attempts re-fire it.
   */
  const failWith = (found: Errors) => {
    setErrors(found);
    setErrorNonce((n) => n + 1);
  };

  const next = () => {
    const found = checkStep(step);
    if (Object.keys(found).length) return failWith(found);
    setErrors({});
    setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = checkStep(step);
    if (Object.keys(found).length) return failWith(found);

    setStatus('sending');
    setFailMessage(null);
    try {
      // Posted straight to Formspree from the browser, with no server hop.
      // The visitor's own TLS stack does the work, so a local proxy or an
      // antivirus SSL scanner that Node refuses to trust is no longer in the
      // path at all.
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          // Makes "Reply" in the inbox go back to the sender, not to Formspree.
          _replyto: values.email,
          _subject: `${values.projectType} enquiry — ${values.name}`,
          // Discrete fields as well as the summary, so each answer is its own
          // labelled row in the email instead of only a line of body text.
          project_type: values.projectType,
          budget: values.budget,
          timeline: values.timeline,
          message: buildSummary(values),
          // Formspree's own honeypot: anything with _gotcha filled is accepted
          // with a 200 and silently discarded. Server-side spam handling moves
          // to Formspree now that there is no route of ours to drop it in.
          _gotcha: honeypotRef.current?.value ?? '',
        }),
      });

      if (res.ok) {
        setStatus('sent');
        return;
      }

      // Formspree reports problems as { errors: [{ message }] } — surface its
      // wording when there is one, since "form not confirmed" or "limit
      // reached" is far more actionable than a generic failure.
      const data = (await res.json().catch(() => null)) as
        | { errors?: { message?: string }[] }
        | null;
      const detail = data?.errors?.map((e) => e.message).filter(Boolean).join(' ');
      setFailMessage(detail || t.form.failGeneric);
      setStatus('failed');
    } catch {
      setFailMessage(t.form.failNetwork);
      setStatus('failed');
    }
  };

  const errorList = (Object.keys(errors) as (keyof Values)[]).filter((k) => errors[k]);

  // Runs after the summary/field errors have actually rendered.
  useEffect(() => {
    if (errorNonce === 0) return;
    if (summaryRef.current) {
      summaryRef.current.focus();
      return;
    }
    const first = errorList[0];
    if (!first) return;
    const field = document.getElementById(`${first}-input`) ?? document.getElementById(first);
    // A fieldset isn't focusable, so fall back to its first radio.
    const target =
      field instanceof HTMLFieldSetElement ? field.querySelector<HTMLElement>('input') : field;
    target?.focus();
    // errorList is derived from errors, which the nonce already tracks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorNonce]);

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="border border-success/40 bg-elevated p-8 text-center sm:p-12"
      >
        <CheckCircle size={44} weight="fill" className="mx-auto text-success" aria-hidden="true" />
        <h3 className="mt-5 font-display text-h3 font-bold uppercase">{t.form.sentTitle}</h3>
        <p className="mx-auto mt-3 max-w-[46ch] text-body text-muted">
          {fill(t.form.sentBody, { name: values.name.split(' ')[0], email: values.email })}
        </p>
        <Button
          variant="secondary"
          className="mt-8"
          onClick={() => {
            setValues(EMPTY);
            setStep(0);
            setStatus('idle');
          }}
        >
          {t.form.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="bento p-6 sm:p-9">
      {/* Progress (multi-step-progress) */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-[0.8rem]">
          <p className="font-medium text-fg">{t.form.legends[step]}</p>
          <p className="tnum text-muted">
            {fill(t.form.stepOf, { current: step + 1, total: STEP_FIELDS.length })}
          </p>
        </div>
        <div
          className="h-px overflow-hidden bg-line"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={STEP_FIELDS.length}
          aria-label={t.form.progressLabel}
        >
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${((step + 1) / STEP_FIELDS.length) * 100}%` }}
            transition={{ duration: dur.reveal, ease }}
          />
        </div>
      </div>

      {/* Error summary — focusable, each item links to its field. */}
      {errorList.length > 1 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-7 border border-danger/50 bg-danger/10 p-4"
        >
          <p className="flex items-center gap-2 text-[0.9rem] font-semibold text-danger">
            <Warning size={17} weight="fill" aria-hidden="true" />
            {fill(t.form.errorSummary, { count: errorList.length })}
          </p>
          <ul className="mt-2 space-y-1 pl-7">
            {errorList.map((key) => (
              <li key={key}>
                <a href={`#${key}`} className="text-[0.85rem] text-danger underline">
                  {errors[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          // Duration collapses to 0 under reduced motion, but the animation
          // still runs. With mode="wait" a disabled exit would never complete
          // and the form would freeze between steps.
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: reduced ? 0 : dur.hover, ease }}
          className="space-y-7"
        >
          {step === 0 && (
            <>
              <Chips
                name="projectType"
                legend={t.form.projectTypeLabel}
                options={t.form.projectTypes}
                value={values.projectType}
                onChange={set('projectType')}
                error={errors.projectType}
                required
              />
              <Chips
                name="budget"
                legend={t.form.budgetLabel}
                options={t.form.budgets}
                value={values.budget}
                onChange={set('budget')}
                error={errors.budget}
                required
              />
              <Chips
                name="timeline"
                legend={t.form.timelineLabel}
                options={t.form.timelines}
                value={values.timeline}
                onChange={set('timeline')}
                error={errors.timeline}
                required
              />
            </>
          )}

          {step === 1 && (
            <div id="message" className="scroll-mt-32">
              <label htmlFor="message-input" className="mb-2.5 block text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-fg">
                {t.form.messageLabel}
                <span className="ml-1 text-accent" aria-hidden="true">
                  *
                </span>
              </label>
              <p id="message-help" className="mb-3 text-[0.825rem] text-muted">
                {t.form.messageHelp}
              </p>
              <textarea
                id="message-input"
                name="message"
                rows={7}
                value={values.message}
                onChange={(e) => set('message')(e.target.value)}
                onBlur={blur('message')}
                aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
                aria-invalid={errors.message ? true : undefined}
                className={`w-full resize-y border bg-bg px-4 py-3 text-body text-fg placeholder:text-muted/60 ${
                  errors.message ? 'border-danger' : 'border-line focus:border-accent'
                }`}
                placeholder={t.form.messagePlaceholder}
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="mt-2 flex items-center gap-1.5 text-[0.825rem] text-danger"
                >
                  <Warning size={15} weight="fill" aria-hidden="true" />
                  {errors.message}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {(
                [
                  {
                    key: 'name' as const,
                    label: t.form.nameLabel,
                    type: 'text',
                    autoComplete: 'name',
                    placeholder: 'Ada Lovelace',
                  },
                  {
                    key: 'email' as const,
                    label: t.form.emailLabel,
                    type: 'email',
                    autoComplete: 'email',
                    placeholder: 'ada@company.com',
                  },
                ] as const
              ).map((field) => (
                <div key={field.key} id={field.key} className="scroll-mt-32">
                  <label
                    htmlFor={`${field.key}-input`}
                    className="mb-2.5 block text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-fg"
                  >
                    {field.label}
                    <span className="ml-1 text-accent" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id={`${field.key}-input`}
                    name={field.key}
                    type={field.type}
                    inputMode={field.type === 'email' ? 'email' : undefined}
                    autoComplete={field.autoComplete}
                    value={values[field.key]}
                    onChange={(e) => set(field.key)(e.target.value)}
                    onBlur={blur(field.key)}
                    placeholder={field.placeholder}
                    aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                    aria-invalid={errors[field.key] ? true : undefined}
                    className={`min-h-[50px] w-full border bg-bg px-4 text-body text-fg placeholder:text-muted/60 ${
                      errors[field.key] ? 'border-danger' : 'border-line focus:border-accent'
                    }`}
                  />
                  {errors[field.key] && (
                    <p
                      id={`${field.key}-error`}
                      className="mt-2 flex items-center gap-1.5 text-[0.825rem] text-danger"
                    >
                      <Warning size={15} weight="fill" aria-hidden="true" />
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <dl className="border border-line bg-bg p-4 text-[0.85rem]">
                  {(
                    [
                      [t.form.reviewProject, values.projectType],
                      [t.form.reviewBudget, values.budget],
                      [t.form.reviewTimeline, values.timeline],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-1">
                      <dt className="text-muted">{label}</dt>
                      <dd className="text-right text-fg">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Honeypot. Hidden from sight and from assistive tech, and skipped by
          tab order — only an automated filler will put anything in it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Company website</label>
        <input
          ref={honeypotRef}
          id="company-website"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {status === 'failed' && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 border border-danger/50 bg-danger/10 p-4 text-[0.875rem] text-danger"
        >
          <Warning size={17} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {failMessage ?? t.form.failGeneric} {t.form.failSuffix}{' '}
            <a href={GMAIL_COMPOSE} {...externalLinkProps(GMAIL_COMPOSE)} className="underline">
              {SITE.email}
            </a>
            .
          </span>
        </p>
      )}

      <div className="mt-9 flex items-center justify-between gap-4 border-t border-line pt-7">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={back} className="!px-3">
            <ArrowLeft size={17} aria-hidden="true" />
            {t.form.back}
          </Button>
        ) : (
          <p className="text-[0.8rem] text-muted">{t.form.takesAMinute}</p>
        )}

        {step < STEP_FIELDS.length - 1 ? (
          <Button type="button" onClick={next}>
            {t.form.continue}
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent"
                />
                {t.form.sending}
              </>
            ) : (
              <>
                <PaperPlaneTilt size={17} weight="bold" aria-hidden="true" />
                {t.form.send}
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
