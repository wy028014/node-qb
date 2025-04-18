export function isValidIdentificationNumber(identification_number: string): boolean {
  const regex: RegExp = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
  return regex.test(identification_number);
}
export function isValidPhoneNumber(phone_number: string): boolean {
  const regex: RegExp = /^1[3-9]\d{9}$/;
  return regex.test(phone_number);
}
export function isValidPoliceNumber(police_number: string): boolean {
  const regex: RegExp = /^[1-9]\d{5}$/;
  return regex.test(police_number);
}
export function isValidCertificateNumber(certificate_number: string): boolean {
  const regex: RegExp = /^TL\d{7}$|^TL\d{8}GA$/;
  return regex.test(certificate_number.replace(/[a-zA-Z]/g, (match: string) => match.toUpperCase()));
}
