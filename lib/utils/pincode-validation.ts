// Pincode validation for rental service
// Only Khargone and Indore pincodes are allowed

export const ALLOWED_PINCODES = {
  KHARGONE: ['451001', '451002', '451003', '451004', '451005', '451006'],
  INDORE: ['452001', '452002', '452003', '452004', '452005', '452006', '452007', '452008', '452009', '452010', '452011', '452012', '452013', '452014', '452015', '452016', '452017', '452018', '452019', '452020']
}

export const ALLOWED_PINCODES_FLAT = [
  ...ALLOWED_PINCODES.KHARGONE,
  ...ALLOWED_PINCODES.INDORE
]

export function isValidPincode(pincode: string): boolean {
  if (!pincode) return false
  return ALLOWED_PINCODES_FLAT.includes(pincode.trim())
}

export function getCityFromPincode(pincode: string): string | null {
  if (!pincode) return null
  
  const cleanPincode = pincode.trim()
  
  if (ALLOWED_PINCODES.KHARGONE.includes(cleanPincode)) {
    return 'Khargone'
  }
  
  if (ALLOWED_PINCODES.INDORE.includes(cleanPincode)) {
    return 'Indore'
  }
  
  return null
}

export function getPincodeValidationMessage(): string {
  return 'Rental service is currently available only in Khargone and Indore areas.'
}

export function getSupportedPincodes(): string[] {
  return ALLOWED_PINCODES_FLAT
}

export function getPincodeHelpText(): string {
  return `Supported pincodes:
  Khargone: ${ALLOWED_PINCODES.KHARGONE.join(', ')}
  Indore: ${ALLOWED_PINCODES.INDORE.join(', ')}`
}
