import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { generateTimeSlots, formatTimeSlot, groupSlotsByDate, DAY_NAMES } from '../utils/timeSlots';
import './TimeSlotPicker.css';

function TimeSlotPicker() {
  const { t, language } = useLanguage();
  const { selectedTimeSlot, setSelectedTimeSlot, deliveryMethod } = useCart();

  // Generate available time slots
  const timeSlots = useMemo(() => generateTimeSlots(14), []);
  const groupedSlots = useMemo(() => groupSlotsByDate(timeSlots), [timeSlots]);

  // Don't show time slots for drop-off
  if (deliveryMethod === 'dropOff') {
    return null;
  }

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = DAY_NAMES[language][date.getDay()];
    const formattedDate = date.toLocaleDateString(
      language === 'he' ? 'he-IL' : 'fr-FR',
      { day: 'numeric', month: 'long' }
    );
    return `${dayName}, ${formattedDate}`;
  };

  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isTomorrow = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateStr === tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="timeslot-picker">
      <h3 className="timeslot-title">{t('timeSlotTitle')}</h3>
      
      {Object.keys(groupedSlots).length === 0 ? (
        <div className="timeslot-empty">
          <span className="timeslot-empty-icon">📅</span>
          <p>{t('noSlotsAvailable')}</p>
        </div>
      ) : (
        <div className="timeslot-groups">
          {Object.entries(groupedSlots).map(([date, slots]) => (
            <div key={date} className="timeslot-group">
              <h4 className="timeslot-date">
                {formatDateHeader(date)}
                {isToday(date) && <span className="date-badge today">{language === 'he' ? 'היום' : "Aujourd'hui"}</span>}
                {isTomorrow(date) && <span className="date-badge tomorrow">{language === 'he' ? 'מחר' : 'Demain'}</span>}
              </h4>
              <div className="timeslot-list">
                {slots.map(slot => (
                  <label 
                    key={slot.id}
                    className={`timeslot-option ${selectedTimeSlot?.id === slot.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.id}
                      checked={selectedTimeSlot?.id === slot.id}
                      onChange={() => setSelectedTimeSlot(slot)}
                    />
                    <div className="timeslot-radio">
                      <div className="timeslot-radio-inner"></div>
                    </div>
                    <div className="timeslot-time">
                      <span className="timeslot-range">{slot.start} - {slot.end}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeSlotPicker;
