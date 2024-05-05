function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dropdown = document.querySelector(".drop-down");
const list = document.querySelector(".list");
const selected = document.querySelector(".selected");
const selectedImg = document.querySelector(".selectedImg");
const prices = document.querySelectorAll(".price");

// Currency conversion rates fetched from an API
async function fetchConversionRates() {
  try {
    const response = await fetch(
      "https://openexchangerates.org/api/latest.json?app_id=722f3c9531ad46f19ae1d786fc55303a"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conversion rates:", error);
  }
}

// Function to update prices based on currency
async function updatePrices(currency) {
  const conversionRates = await fetchConversionRates();

  prices.forEach((price) => {
    const priceNGN = parseFloat(price.getAttribute("data-price-ngn"));
    const priceUSD = parseFloat(price.getAttribute("data-price-usd"));

    if (currency === "USD") {
      if (
        conversionRates &&
        conversionRates.rates &&
        conversionRates.rates["NGN"]
      ) {
        const convertedPrice = (
          priceNGN / conversionRates.rates["NGN"]
        ).toFixed(2);
        price.textContent = "$" + addCommas(convertedPrice);
      } else {
        console.error("Conversion rate for NGN not found");
      }
    } else if (currency === "NGN") {
      price.textContent = "₦" + addCommas(priceNGN);
    }
  });
}

// Event listener for dropdown click
dropdown.addEventListener("click", () => {
  list.classList.toggle("show");
});

// Event listener for currency selection
list.addEventListener("click", (e) => {
  const currency = e.target.closest(".item").dataset.currency;
  const img = e.target.closest(".item").querySelector("img");
  const text = e.target.closest(".item").querySelector(".text");

  selectedImg.src = img.src;
  selected.innerHTML = text.innerHTML;

  updatePrices(currency);
});
