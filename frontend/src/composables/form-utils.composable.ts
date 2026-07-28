export const required_field = (value: string): boolean | string => !!value || '*¡Campo requerido!'
export const valid_email = (value: string): boolean | string => is_valid_email(value) || '*¡Correo no válido!'
export const valid_phone = (value: string): boolean | string => is_valid_phone(value, 'MX') 
  || is_valid_phone(value, 'US')
  || is_valid_phone(value, 'CA')
  || is_valid_phone(value, 'FR')
  || is_valid_phone(value, 'ES')
  || is_valid_phone(value, 'GB')
  || '*¡Teléfono no válido!'

export const is_valid_email = (email: string): boolean => {
  // Basic Null/Length Check (RFC 5321 limit is 254)
  if (!email || email.length > 254) return false;

  // Matches: non-whitespace chars @ non-whitespace chars . non-whitespace chars (min 2)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export const is_valid_phone = (phone: string, country: 'MX' | 'CA'  | 'FR' | 'ES' | 'US' | 'GB' | 'IN' | 'DE'): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)\.+]/g, ''); // Remove formatting

  const patterns: Record<string, RegExp> = {
    // US & CA: NANP Plan. 10 digits. Area code 2-9, Exchange 2-9.
    // Optional leading '1'.
    US: /^1?[2-9]\d{2}[2-9]\d{6}$/,      // 10 digits, optional '1'
    CA: /^1?[2-9]\d{2}[2-9]\d{6}$/,      // 10 digits, optional '1'
    // MX: 10 digits total. Optional '52' or '+52'.
    // Since Aug 2019, no '1' after country code.
    MX: /^(52)?\d{10}$/,                  //10 digits, optional 52
    // FR: 10 digits. Starts with 0.
    // International: +33 followed by 9 digits (drop the leading 0).
    // Pattern allows: 0XXXXXXXXX (10 digits) OR 33XXXXXXXXX (11 digits)
    FR: /^(0\d{9}|33\d{9})$/,

    // ES: 9 digits total.
    // Mobile starts with 6 or 7. Landline with 8 or 9.
    // International: +34 followed by 9 digits.
    ES: /^(34)?[6-9]\d{8}$/,
    GB: /^(?:44)?0?[1-9]\d{8,9}$/,       // 10-11 digits, optional '44'
    IN: /^(?:91)?[6-9]\d{9}$/,           // 10 digits starting with 6-9
    DE: /^(?:49)?0?[1-9]\d{4,13}$/       // Variable length
  };

  const regex = patterns[country];
  if (!regex) return false;

  return regex.test(cleaned);
}