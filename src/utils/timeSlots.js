/**
 * Time Slot Utilities
 * Handles the strict time slot rules for the ironing service
 */

/**
 * Available time slots configuration
 * Based on business rules:
 * - Monday → Thursday: 20:30 → 23:00
 * - Sunday: 09:00 → 14:00, 19:00 → 23:00
 * - Friday: 09:00 → 15:00
 * - Saturday: CLOSED
 */
export const TIME_SLOT_CONFIG = {
  // 0 = Sunday, 1 = Monday, etc.
  0: [ // Sunday
    { start: '09:00', end: '14:00' },
    { start: '19:00', end: '23:00' }
  ],
  1: [ // Monday
    { start: '20:30', end: '23:00' }
  ],
  2: [ // Tuesday
    { start: '20:30', end: '23:00' }
  ],
  3: [ // Wednesday
    { start: '20:30', end: '23:00' }
  ],
  4: [ // Thursday
    { start: '20:30', end: '23:00' }
  ],
  5: [ // Friday
    { start: '09:00', end: '15:00' }
  ],
  6: null // Saturday - CLOSED
};

/**
 * Day names in Hebrew and French
 */
export const DAY_NAMES = {
  he: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
};

/**
 * Generate time slots for a given date range
 * @param {number} daysAhead - Number of days to generate slots for
 * @returns {Array} - Array of available time slots
 */
export function generateTimeSlots(daysAhead = 14) {
  const slots = [];
  const now = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const daySlots = TIME_SLOT_CONFIG[dayOfWeek];
    
    // Skip if no slots for this day (e.g., Saturday)
    if (!daySlots) continue;
    
    daySlots.forEach(slot => {
      const slotDate = new Date(date);
      const [startHour, startMin] = slot.start.split(':').map(Number);
      slotDate.setHours(startHour, startMin, 0, 0);
      
      // Skip if slot is in the past
      if (slotDate <= now) return;
      
      // Skip if less than 2 hours from now (give some buffer)
      const hoursUntilSlot = (slotDate - now) / (1000 * 60 * 60);
      if (hoursUntilSlot < 2) return;
      
      slots.push({
        id: `${date.toISOString().split('T')[0]}_${slot.start}`,
        date: date.toISOString().split('T')[0],
        dayOfWeek,
        start: slot.start,
        end: slot.end,
        timestamp: slotDate.getTime()
      });
    });
  }
  
  return slots;
}

/**
 * Format a time slot for display
 * @param {Object} slot - Time slot object
 * @param {string} lang - Language code ('he' or 'fr')
 * @returns {string} - Formatted string
 */
export function formatTimeSlot(slot, lang = 'he') {
  const dayName = DAY_NAMES[lang][slot.dayOfWeek];
  const date = new Date(slot.date);
  
  const dateStr = date.toLocaleDateString(lang === 'he' ? 'he-IL' : 'fr-FR', {
    day: 'numeric',
    month: 'short'
  });
  
  return `${dayName} ${dateStr} • ${slot.start} - ${slot.end}`;
}

/**
 * Group time slots by date for display
 * @param {Array} slots - Array of time slots
 * @returns {Object} - Slots grouped by date
 */
export function groupSlotsByDate(slots) {
  return slots.reduce((groups, slot) => {
    const key = slot.date;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(slot);
    return groups;
  }, {});
}

/**
 * Check if a given day/time is within allowed slots
 * @param {Date} dateTime - Date and time to check
 * @returns {boolean}
 */
export function isValidTimeSlot(dateTime) {
  const dayOfWeek = dateTime.getDay();
  const daySlots = TIME_SLOT_CONFIG[dayOfWeek];
  
  if (!daySlots) return false;
  
  const time = dateTime.toTimeString().slice(0, 5); // HH:MM
  
  return daySlots.some(slot => {
    return time >= slot.start && time <= slot.end;
  });
}

export default {
  TIME_SLOT_CONFIG,
  DAY_NAMES,
  generateTimeSlots,
  formatTimeSlot,
  groupSlotsByDate,
  isValidTimeSlot
};
