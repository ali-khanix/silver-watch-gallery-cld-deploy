export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let phone = digits;

  if (phone.startsWith("0098")) phone = phone.slice(4);
  else if (phone.startsWith("98")) phone = phone.slice(2);

  if (phone.length === 10 && phone.startsWith("9")) phone = "0" + phone;

  const isValid = /^09\d{9}$/.test(phone);
  return isValid ? phone : null;
}
