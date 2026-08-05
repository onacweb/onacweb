/*
  Geri sayım her ziyaretçide sayfanın açıldığı andan itibaren 3 gün başlar.
  Sabit bir açılış tarihi kullanmak için aşağıdaki satırı değiştirin:

  const targetDate = new Date("2026-08-08T20:00:00+03:00").getTime();
*/

const targetDate = Date.now() + (3 * 24 * 60 * 60 * 1000);

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const remaining = targetDate - Date.now();

  if (remaining <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    document.querySelector("h1").textContent = "Web Sitemiz Yeniden Yayında";
    document.querySelector(".intro").textContent =
      "Planlı bakım çalışmalarımız tamamlanmıştır. Web sitemizi kullanmaya devam edebilirsiniz.";

    clearInterval(timer);

    // Süre dolunca yönlendirmek için aşağıdaki satırı aktif edin:
    // window.location.href = "anasayfa.html";
    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  daysElement.textContent = pad(days);
  hoursElement.textContent = pad(hours);
  minutesElement.textContent = pad(minutes);
  secondsElement.textContent = pad(seconds);
}

updateCountdown();
const timer = setInterval(updateCountdown, 1000);
