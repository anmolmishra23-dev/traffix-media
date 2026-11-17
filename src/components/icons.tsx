type P = { className?: string };

// Bubble icons from the logo. The heart / dots are cut out, so the background shows through on any colour.
export function HeartBubble({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 6h40a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H38l-8 10-6-10H12a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8ZM32 40s-12-7.2-12-15.2A6.6 6.6 0 0 1 32 21a6.6 6.6 0 0 1 12 3.8C44 32.8 32 40 32 40Z"
      />
    </svg>
  );
}

export function ChatBubble({ className }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10 8h44a7 7 0 0 1 7 7v24a7 7 0 0 1-7 7H28L14 58l2-12h-6a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7Zm10 15.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm12 0a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm12 0a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z"
      />
    </svg>
  );
}

export function ArrowUpRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsappIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export function MailIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
