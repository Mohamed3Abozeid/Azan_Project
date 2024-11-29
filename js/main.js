//   to get date
const DateItem = document.querySelector("#DateItem");
const TimeItem = document.querySelector("#timeItem");
const fagr = document.querySelector("#fagr");
const sobh = document.querySelector("#sobh");
const dhur = document.querySelector("#dhur");
const asr = document.querySelector("#asr");
const makrb = document.querySelector("#makrb");
const esha = document.querySelector("#esha");
const NextPray = document.querySelector("#NextPray");
const day = document.querySelector("#day");
const dayNumber = document.querySelector("#dayNumber");
const moonName = document.querySelector("#moonName");
const yearNumber = document.querySelector("#yearNumber");
const SecondLate = document.querySelector("#SecondLate");
const lightBox = document.querySelector("#lightBox");
const MiunsLate = document.querySelector("#MiunsLate");
const HoursLate = document.querySelector("#HoursLate");
const egypt_governorates = document.querySelector("#egypt-governorates");
let date = "";
let times = [];

async function Azan_Time(city, country, date) {
  const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&date=${date}`;
  try {
    const respnse = await fetch(apiUrl);
    const data = await respnse.json();
    times = data.data;

    NextPrayFunc();
  } catch (error) {
    console.log("we have Eroo", error);
  }
}

function TimeFormater(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const amPm = hours >= 12 ? "مساء" : "صباحا";
  const convertedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${convertedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
}

function dateFunc() {
  const theDate = new Date();

  const year = theDate.getFullYear();
  const month = String(theDate.getMonth() + 1).padStart(2, "0");
  const day = String(theDate.getDate()).padStart(2, "0");
  DateItem.innerHTML = `${year}-${month}-${day}`;
  return `${year}-${month}-${day}`;
}
//to get the time naw and show it ///
function Timer() {
  const theTime = new Date();

  const hours = String(theTime.getHours()).padStart(2, "0");
  const minutes = String(theTime.getMinutes()).padStart(2, "0");
  const seconds = String(theTime.getSeconds()).padStart(2, "0");
  let amPm = hours >= 12 ? "مساء" : "صباحا";
  TimeItem.innerHTML = `${hours % 12}:${minutes}:${seconds}` + ` ${amPm}`;

  return `${hours % 12}:${minutes}:${seconds} ${amPm}`;
}
async function handleOuput(city) {
  lightBox.classList.replace("d-none", "d-flex");

  await Azan_Time(city, "eg", date);
  fagr.innerHTML = TimeFormater(times.timings.Fajr);
  sobh.innerHTML = TimeFormater(times.timings.Sunrise);
  dhur.innerHTML = TimeFormater(times.timings.Dhuhr);
  asr.innerHTML = TimeFormater(times.timings.Asr);
  makrb.innerHTML = TimeFormater(times.timings.Maghrib);
  esha.innerHTML = TimeFormater(times.timings.Isha);

  day.innerHTML = times.date.hijri.weekday.ar;
  dayNumber.innerHTML = times.date.hijri.day;
  moonName.innerHTML = times.date.hijri.month.ar;
  yearNumber.innerHTML = times.date.hijri.year;
  lightBox.classList.replace("d-flex", "d-none");
}

function NextPrayFunc() {
  const now = new Date();
  let nextPrayer = null;
  let nextPrayerTime = null;

  const currentTime = now.toTimeString().split(" ")[0];

  for (const [pray, time] of Object.entries(times.timings)) {
    if (
      time > currentTime &&
      (pray != "Midnight" ||
        pray != "Firstthird" ||
        pray != "Imsak" ||
        pray != "Firstthird" ||
        pray != "Sunrise")
    ) {
      nextPrayer = pray;
      nextPrayerTime = time;
      break;
    }
  }

  calculateTimeDifference(currentTime, nextPrayerTime);
}

Timer();
setInterval(Timer, 1000); //to change the time every second
setInterval(NextPrayFunc, 1000); //to change the time every second
date = dateFunc();
handleOuput("cairo");

function calculateTimeDifference(currentTime, targetTime) {
  targetTime += ":00";
  const [currentHours, currentMinutes, currentSeconds] = currentTime
    .split(":")
    .map(Number);

  const [targetHours, targetMinutes, targetSeconds] = targetTime
    .split(":")
    .map(Number);

  const now = new Date();
  now.setHours(currentHours, currentMinutes, currentSeconds, 0);

  const target = new Date();
  target.setHours(targetHours, targetMinutes, targetSeconds, 0);

  if (target < now) {
    target.setDate(target.getDate() + 1);
  }

  const timeDifference = target - now;

  const hours = String(Math.floor(timeDifference / (1000 * 60 * 60))).padStart(
    2,
    "0"
  );
  const minutes = String(
    Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  ).padStart(2, "0");
  const seconds = String(
    Math.floor((timeDifference % (1000 * 60)) / 1000)
  ).padStart(2, "0");
  HoursLate.innerHTML = hours;
  MiunsLate.innerHTML = minutes;
  SecondLate.innerHTML = seconds;
}

egypt_governorates.addEventListener("change", function () {
  handleOuput(this.value);
});
