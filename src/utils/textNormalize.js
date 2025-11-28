/**
 * Normalizes Arabic text for search and comparison.
 * - Removes "Al-" (ال) prefix.
 * - Normalizes Alef forms (أ, إ, آ -> ا).
 * - Normalizes Taa Marbuta (ة -> ه).
 * - Normalizes Yaa (ي -> ى).
 * - Converts Arabic digits to English digits.
 * - Lowercases English text.
 */
export const normalizeText = (text) => {
  if (!text) return '';
  
  let normalized = String(text).toLowerCase().trim();

  // Remove "Al-" (ال) at the beginning of words
  normalized = normalized.replace(/\bال/g, '');

  // Normalize Alef
  normalized = normalized.replace(/[أإآ]/g, 'ا');

  // Normalize Taa Marbuta
  normalized = normalized.replace(/ة/g, 'ه');

  // Normalize Yaa
  normalized = normalized.replace(/ي/g, 'ى');

  // Normalize Arabic digits
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(new RegExp(arabicDigits[i], 'g'), englishDigits[i]);
  }

  // Remove diacritics (Tashkeel)
  normalized = normalized.replace(/[\u064B-\u065F]/g, '');

  return normalized;
};

/**
 * Checks if a target string contains a search query using fuzzy matching.
 */
export const fuzzyMatch = (target, query) => {
  const normTarget = normalizeText(target);
  const normQuery = normalizeText(query);
  return normTarget.includes(normQuery);
};
