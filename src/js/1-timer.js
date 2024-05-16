'use strict';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let countdownInterval;
document.querySelector('[data-start]').disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    if (userSelectedDate < currentDate) {
      iziToast.show({
        title: 'Please',
        message: ' choose a date in the future',
        backgroundColor: '#FFA000',
        messageColor: '#FFFFFF',
        titleColor: '#FFFFFF',
      });
      document.querySelector('[data-start]').disabled = true;
    } else {
      document.querySelector('[data-start]').disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

document.querySelector('[data-start]').addEventListener('click', function () {
  const countdownUpdate = () => {
    const now = new Date().getTime();
    const distance = userSelectedDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      document.querySelector('#datetime-picker').disabled = false;
      document.querySelector('[data-start]').disabled = true;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(distance);

    document.querySelector('[data-days]').innerText = days
      .toString()
      .padStart(2, '0');
    document.querySelector('[data-hours]').innerText = hours
      .toString()
      .padStart(2, '0');
    document.querySelector('[data-minutes]').innerText = minutes
      .toString()
      .padStart(2, '0');
    document.querySelector('[data-seconds]').innerText = seconds
      .toString()
      .padStart(2, '0');
  };

  document.querySelector('#datetime-picker').disabled = true;
  document.querySelector('[data-start]').disabled = true;
  countdownUpdate();
  countdownInterval = setInterval(countdownUpdate, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
