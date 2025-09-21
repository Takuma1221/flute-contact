declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_EMAIL?: string;
      GOOGLE_PRIVATE_KEY?: string;
      GOOGLE_SPREADSHEET_ID?: string;
      RESEND_API_KEY?: string;
      ADMIN_PASSWORD?: string;
      NEXT_PUBLIC_SITE_URL?: string;
    }
  }
}

export {};
