document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.querySelector("#amount");
  const fromCurrencySelect = document.querySelector("#from-currency");
  const toCurrencySelect = document.querySelector("#to-currency");
  const convertBtn = document.querySelector("#convertBtn");
  const swapIcon = document.querySelector(".icon-arrow");

  // Fetch API key from config.json
  async function fetchApiKey() {
    try {
      const response = await fetch("config.json");
      const data = await response.json();
      return data.apiKey;
    } catch (error) {
      console.error("Error fetching API key:", error);
      return null;
    }
  }

  // Fetch currency data and populate dropdowns
  fetchCurrencies();

  async function fetchCurrencies() {
    const apiKey = await fetchApiKey();
    if (!apiKey) return;

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      );
      const data = await response.json();
      const currencies = Object.keys(data.conversion_rates);

      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.text = currency;
        fromCurrencySelect.add(option);
        toCurrencySelect.add(option.cloneNode(true));
      });

      // Trigger conversion when currencies are populated
      convertCurrency();
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  }

  // Conversion logic
  async function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = amountInput.value;

    const apiKey = await fetchApiKey();
    if (!apiKey) return;

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
      );
      const data = await response.json();
      console.log(data);

      // Check if the response contains data for the selected currencies
      if (data.conversion_rates[toCurrency]) {
        const exchangeRate = data.conversion_rates[toCurrency];
        const convertedAmount = amount * exchangeRate;
        document.getElementById("result").textContent =
          `${amount} ${fromCurrency} = ` +
          `${convertedAmount.toFixed(2)} ${toCurrency}`;
      } else {
        console.error("Error: Selected currencies not supported");
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  }

  // Conversion logic on button click
  convertBtn.addEventListener("click", convertCurrency);

  // Swap functionality
  swapIcon.addEventListener("click", function () {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency(); // Trigger conversion after swapping
  });
});
