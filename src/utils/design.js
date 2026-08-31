const DESIGN = {

  // ================================
  // BOT BRANDING
  // ================================

  botName: 'Test Bot',

  botDescription: 'YOUR BOT DESCRIPTION',

  // ================================
  // EMOJIS
  // ================================

  emojis: {
    success: '✔️',
    error: '❌',
    warning: '⚠️',
    loading: '⏳',
    info: 'ℹ️',
    verified: '🔰',
    user: '👤',
    id: '🆔',
    ticket: '🎫',
    staff: '🛡️'
  },

  // ================================
  // EMBED COLORS
  // ================================

  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    error: 0xED4245,
    warning: 0xFEE75C,
    info: 0x3498DB
  },

  // ================================
  // FOOTER
  // ================================

  footer: {
    text: 'YOUR BOT NAME • Torn City'
  },

  // ================================
  // VERIFICATION
  // ================================

  verification: {
    title: 'Verify',

    description:
      'Link your Torn City API key to your Discord account.',

    buttonText: 'Verify Account',

    successTitle: 'Verification Successful!',

    successMessage:
      'Your Torn City account has been successfully linked.',

    errorTitle: 'Verification Failed',

    errorMessage:
      'We could not verify your Torn City API key, please use full access or custom API Key'
  },

  // ================================
  // TICKETS
  // ================================

  tickets: {
    title: 'Support Ticket',

    description:
      'Click the button below to create a support ticket.',

    createButton: 'Create Ticket',

    closeButton: 'Close Ticket'
  }

};

module.exports = DESIGN;
