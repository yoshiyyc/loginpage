// Color mode (adjusted from Bootstrap example)
/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  "use strict";

  const storedTheme = localStorage.getItem("theme");

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = function (theme) {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) {
      return;
    }

    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
      element.setAttribute("aria-pressed", "false");
    });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (storedTheme !== "light" || storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        localStorage.setItem("theme", theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();

// Clock from https://www.geeksforgeeks.org/how-to-design-digital-clock-using-javascript/
setInterval(showTime, 1000);
function showTime() {
  let time = new Date();
  let hour = time.getHours();
  let min = time.getMinutes();
  let sec = time.getSeconds();
  am_pm = "AM";

  if (hour > 12) {
    hour -= 12;
    am_pm = "PM";
  }
  if (hour == 0) {
    hr = 12;
    am_pm = "AM";
  }

  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  let currentTime = hour + ":" + min + ":" + sec + " " + am_pm;

  document.getElementById("clock").innerHTML = currentTime;
}
showTime();

// i18n from https://phrase.com/blog/posts/step-step-guide-javascript-localization/

// The locale our app first shows
const defaultLocale = "zh-TW";

// The active locale
let locale;

let translations = {};

const languageRow = document.querySelector("#languageRow");
const languageLinks = document.querySelectorAll("[data-language]");

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  // Translate the page to the default locale
  setLocale(defaultLocale);
  bindLocaleSwitcher(defaultLocale);
});

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
  updateLanguageLinks();
}

// Retrieve translations JSON object for the given locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`https://yoshiyyc.github.io/loginpage/lang/${newLocale}.json`);
  return await response.text();
}

// Replace the inner text of each element that has a data-i18n-key attribute with the translation corresponding to its data-i18n-key
function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

// Replace the inner text of the given HTML element with the translation in the active locale, corresponding to the element's data-i18n-key
function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");

  const translation = translations[key];

  if (element.tagName.toLowerCase() === "input") {
    element.setAttribute("placeholder", translation);
  } else {
    element.innerText = translation;
  }
}

// Whenever the user selects a new locale, we load the locale's translations and update the page
function bindLocaleSwitcher(initialValue) {
  languageRow.addEventListener("click", (e) => {
    setLocale(e.target.dataset.language);
  });
}

// Update language links
function updateLanguageLinks() {
  languageLinks.forEach((i) => {
    if (i.dataset.language === locale) {
      i.classList.add("pe-none");
    } else {
      i.classList.remove("pe-none");
    }
  });
}

// Actions after submitting the form
const account = document.querySelector("#account");
const password = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (account.value === "abc123" && password.value === "abc123") {
    Swal.fire({
      icon: "success",
      text: `${translations.loginSuccess}`,
      confirmButtonText: `${translations.confirm}`,
    });
  } else {
    Swal.fire({
      icon: "error",
      text: `${translations.loginFail}`,
      confirmButtonText: `${translations.reenter}`,
    });
    account.value = "";
    password.value = "";
  }
});
