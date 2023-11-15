// before you forget,p and the small element will have a class is_invalid when their sibling, input is invalid
function find(target) {
  return document.querySelector(target);
}
function addIsInvalid(target, message) {
  let targets = [`.${target} > p`, `.${target} > small`, `.${target} > input`];
  for (const index in targets) {
    find(targets[index]).classList.add("is_invalid");
  }
  find(targets[1]).textContent = message;
}
function removeIsInvalid(target, message) {
  let targets = [`.${target} > p`, `.${target} > small`, `.${target} > input`];
  for (const index in targets) {
    find(targets[index]).classList.remove("is_invalid");
  }
  find(targets[1]).textContent = message;
}

function validateDay() {
  let day = parseInt(find(".input_section_day input").value.trim());
  let msg;
  if (day < 1 || day > 31 || isNaN(day)) {
    msg = day === "" ? "This field is required" : "Invalid day";
    addIsInvalid("input_section_day", msg);
    return false;
  } else {
    removeIsInvalid("input_section_day", "");
    return day;
  }
}

// adding a listener to the day input field
find(".input_section_day input").addEventListener("input", validateDay);
// validating the month that the user will enter.
function validateMonth() {
  //months with only thirty days
  // september,april, june and november
  //  these months cannot have days bigger than 30 submitted.
  let day = validateDay();
  let is_not_30 = false;
  !day
    ? find(".input_section_day input").focus()
    : find(".input_section_day input").blur();

  let month = parseInt(find(".input_section_month input").value.trim());
  is_not_30 = month !== 4 || month !== 6 || month !== 9 || month !== 11;

  if (
    isNaN(month) ||
    month < 1 ||
    month > 12 ||
    (is_not_30 && day > 31) ||
    (!is_not_30 && day > 30)
  ) {
    msg = month === "" ? "This field is required" : "Invalid month";
    addIsInvalid("input_section_month", msg);
    return false;
  } else {
    removeIsInvalid("input_section_month", "");
    return month;
  }
}
//adding an event listener to the month input box.

find(".input_section_month input").addEventListener("input", validateMonth);
// validation the year and the.
function validateYear() {
  let month = validateMonth();
  !month
    ? find(".input_section_month input").focus()
    : find(".input_section_month input").blur();
  let currentYear = new Date().getFullYear();
  let year = parseInt(find(".input_section_year input").value.trim());

  let _is_in_future = year > currentYear;
  if (year < 1 || _is_in_future || isNaN(year)) {
    addIsInvalid("input_section_year", "Invalid year");
    return false;
  } else if (
    (month === 2 && year % 4 === 0 && validateDay() > 29) ||
    (month === 2 && year % 4 !== 0 && validateDay() > 28)
  ) {
    addIsInvalid("input_section_year", "Invalid date");
    addIsInvalid("input_section_day", "Invalid date");
    addIsInvalid("input_section_month", "Invalid date");
    return false;
  } else {
    removeIsInvalid("input_section_year", "");
    return year;
  }
}
let year = find(".input_section_year input");
year.addEventListener("input", validateYear);

function removeSlashesAndUpdateResults() {
  if (!validateDay() || !validateMonth() || !validateYear()) {
    return;
  }
  let day = validateDay();
  let month = validateMonth();
  let year = validateYear();

  // creating a new date instance
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const currentDay = date.getDate();
  let yearsOld, daysOld, monthsOld;
  // calculating how many years old the user has got.
  let _has_celebrated =
    currentMonth > month ||
    (currentMonth === month && currentDay > day) ||
    (currentMonth === month && currentDay === day);

  if (!_has_celebrated) {
    yearsOld = currentYear - 1 - year;
  } else {
    yearsOld = currentYear - year;
  }
  // calculating how many months old the user is .
  // checking if the month we are in is february
  let _isFebruary = currentMonth === 2;
  let _is_30_days =
    currentMonth === 4 ||
    currentMonth === 9 ||
    currentMonth === 11 ||
    currentMonth === 6;

  // checking if this year is a leap year
  let _is_leap_year = year % 4 === 0;
  // checking if we are not in february and a 30 day month and validate if we have ended the current month or not

  if (currentDay < day) {
    // if we have not ended and the day of birth is greater than todays day number, then we subtract one month
    monthsOld = _has_celebrated
      ? currentMonth - 1 - month
      : currentMonth - 1 + (12 - month);
    // calculate day here
    // i have to check the month before this current month and know the number of days that month, since current day is still not equal to or greater than the day of birth
    // then subtract the day the user was born form the total days of the month before.
    // then add the number of days we have in this new month to the rest of the  months before after subtracting
    // that is how many days old the user is now
    let _the_month_before = currentMonth - 1 === 0 ? 12 : currentMonth - 1;

    let _month_before_is_not_30 =
      _the_month_before !== 4 ||
      _the_month_before !== 6 ||
      _the_month_before !== 9 ||
      _the_month_before !== 11;

    let _month_before_is_not_February = _the_month_before !== 2;
    let _is_birthday_month = currentMonth === month;
    let day_before;
    if (_month_before_is_not_30 && _month_before_is_not_February) {
      day_before = 31;
    }
    if (!_month_before_is_not_30 && _month_before_is_not_February) {
      day_before = 30;
    }
    if (_isFebruary && _is_leap_year) {
      day_before = 29;
    }
    if (_isFebruary && !_is_leap_year) {
      day_before = 28;
    }
    daysOld = day_before - day + currentDay;
  }
  if (_has_celebrated && currentDay > day) {
    monthsOld = currentMonth - month;
    // calculate days old here
    daysOld = currentDay - day;
  }
  if (_has_celebrated && currentDay === day) {
    monthsOld = currentMonth - month;
    daysOld = 0;
  }

  if (!_has_celebrated && currentDay === day) {
    monthsOld = currentMonth;
    daysOld = 0;
  }
  if (!_has_celebrated && currentDay > day) {
    monthsOld = 12 - (month - currentMonth);
    // days old here
    daysOld = currentDay - day;
  }

  console.log(
    `years old :${yearsOld} \n months old : ${monthsOld} \n days old:${daysOld}`
  );
}
find(".calculate_button_container .calculate_icon").addEventListener(
  "click",
  removeSlashesAndUpdateResults
);
year.addEventListener("keydown", (e) => {
  e.key === "Enter" &&
    find(".calculate_button_container .calculate_icon").click();
});
