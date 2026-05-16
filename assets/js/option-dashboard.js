// ============================================================
// Option Pricing & Greeks Dashboard
// Step 3: Black-Scholes pricing logic
// ============================================================

(function () {
  "use strict";

  // ------------------------------------------------------------
  // Normal distribution helpers
  // ------------------------------------------------------------

  function erf(x) {
    // Abramowitz and Stegun approximation
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x);

    return sign * y;
  }

  function normalCDF(x) {
    return 0.5 * (1.0 + erf(x / Math.sqrt(2.0)));
  }

  // ------------------------------------------------------------
  // Input handling
  // ------------------------------------------------------------

  function getNumber(id) {
    const value = parseFloat(document.getElementById(id).value);

    if (Number.isNaN(value)) {
      throw new Error(`Invalid input: ${id}`);
    }

    return value;
  }

  function getInputs() {
    const S = getNumber("spot");
    const K = getNumber("strike");
    const T = getNumber("maturity");
    const r = getNumber("rate");
    const q = getNumber("dividend");
    const sigma = getNumber("volatility");
    const optionType = document.getElementById("optionType").value;

    if (S <= 0) {
      throw new Error("Spot price must be positive.");
    }

    if (K <= 0) {
      throw new Error("Strike price must be positive.");
    }

    if (T <= 0) {
      throw new Error("Time to maturity must be positive.");
    }

    if (sigma <= 0) {
      throw new Error("Volatility must be positive.");
    }

    return { S, K, T, r, q, sigma, optionType };
  }

  // ------------------------------------------------------------
  // Black-Scholes pricing
  // ------------------------------------------------------------

  function blackScholesPrice(S, K, T, r, q, sigma, optionType) {
    const sqrtT = Math.sqrt(T);

    const d1 =
      (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) /
      (sigma * sqrtT);

    const d2 = d1 - sigma * sqrtT;

    const discountRiskFree = Math.exp(-r * T);
    const discountDividend = Math.exp(-q * T);

    let price;

    if (optionType === "call") {
      price =
        S * discountDividend * normalCDF(d1) -
        K * discountRiskFree * normalCDF(d2);
    } else {
      price =
        K * discountRiskFree * normalCDF(-d2) -
        S * discountDividend * normalCDF(-d1);
    }

    return price;
  }

  // ------------------------------------------------------------
  // Display results
  // ------------------------------------------------------------

  function formatNumber(x, digits = 4) {
    return Number.isFinite(x) ? x.toFixed(digits) : "--";
  }

  function updateDashboard() {
    try {
      const { S, K, T, r, q, sigma, optionType } = getInputs();

      const price = blackScholesPrice(S, K, T, r, q, sigma, optionType);

      document.getElementById("priceResult").textContent = formatNumber(price);

      // Greeks will be added in Step 4
      document.getElementById("deltaResult").textContent = "--";
      document.getElementById("gammaResult").textContent = "--";
      document.getElementById("vegaResult").textContent = "--";
      document.getElementById("thetaResult").textContent = "--";
      document.getElementById("rhoResult").textContent = "--";
    } catch (error) {
      document.getElementById("priceResult").textContent = "Input error";

      console.error(error.message);
    }
  }

  // ------------------------------------------------------------
  // Event listeners
  // ------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById("calculateBtn");

    calculateBtn.addEventListener("click", updateDashboard);

    const inputIds = [
      "spot",
      "strike",
      "maturity",
      "rate",
      "dividend",
      "volatility",
      "optionType"
    ];

    inputIds.forEach(function (id) {
      document.getElementById(id).addEventListener("change", updateDashboard);
      document.getElementById(id).addEventListener("input", updateDashboard);
    });

    updateDashboard();
  });
})();


// ============================================================
// Option Pricing & Greeks Dashboard
// Step 4: Black-Scholes pricing + Greeks
// ============================================================

(function () {
  "use strict";

  // ------------------------------------------------------------
  // Normal distribution helpers
  // ------------------------------------------------------------

  function erf(x) {
    // Abramowitz and Stegun approximation
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x);

    return sign * y;
  }

  function normalCDF(x) {
    return 0.5 * (1.0 + erf(x / Math.sqrt(2.0)));
  }

  function normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2.0 * Math.PI);
  }

  // ------------------------------------------------------------
  // Input handling
  // ------------------------------------------------------------

  function getNumber(id) {
    const value = parseFloat(document.getElementById(id).value);

    if (Number.isNaN(value)) {
      throw new Error(`Invalid input: ${id}`);
    }

    return value;
  }

  function getInputs() {
    const S = getNumber("spot");
    const K = getNumber("strike");
    const T = getNumber("maturity");
    const r = getNumber("rate");
    const q = getNumber("dividend");
    const sigma = getNumber("volatility");
    const optionType = document.getElementById("optionType").value;

    if (S <= 0) {
      throw new Error("Spot price must be positive.");
    }

    if (K <= 0) {
      throw new Error("Strike price must be positive.");
    }

    if (T <= 0) {
      throw new Error("Time to maturity must be positive.");
    }

    if (sigma <= 0) {
      throw new Error("Volatility must be positive.");
    }

    return { S, K, T, r, q, sigma, optionType };
  }

  // ------------------------------------------------------------
  // Black-Scholes price and Greeks
  // ------------------------------------------------------------

  function blackScholes(S, K, T, r, q, sigma, optionType) {
    const sqrtT = Math.sqrt(T);

    const d1 =
      (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) /
      (sigma * sqrtT);

    const d2 = d1 - sigma * sqrtT;

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const NminusD1 = normalCDF(-d1);
    const NminusD2 = normalCDF(-d2);
    const pdfD1 = normalPDF(d1);

    const discountRiskFree = Math.exp(-r * T);
    const discountDividend = Math.exp(-q * T);

    let price;
    let delta;
    let thetaAnnual;
    let rhoRaw;

    const gamma =
      (discountDividend * pdfD1) / (S * sigma * sqrtT);

    const vegaRaw =
      S * discountDividend * pdfD1 * sqrtT;

    if (optionType === "call") {
      price =
        S * discountDividend * Nd1 -
        K * discountRiskFree * Nd2;

      delta = discountDividend * Nd1;

      thetaAnnual =
        -(
          S *
          discountDividend *
          pdfD1 *
          sigma
        ) /
          (2.0 * sqrtT) -
        r * K * discountRiskFree * Nd2 +
        q * S * discountDividend * Nd1;

      rhoRaw = K * T * discountRiskFree * Nd2;
    } else {
      price =
        K * discountRiskFree * NminusD2 -
        S * discountDividend * NminusD1;

      delta = discountDividend * (Nd1 - 1.0);

      thetaAnnual =
        -(
          S *
          discountDividend *
          pdfD1 *
          sigma
        ) /
          (2.0 * sqrtT) +
        r * K * discountRiskFree * NminusD2 -
        q * S * discountDividend * NminusD1;

      rhoRaw = -K * T * discountRiskFree * NminusD2;
    }

    return {
      price: price,
      delta: delta,
      gamma: gamma,

      // Common dashboard convention:
      // Vega = price change for 1 percentage point volatility change
      vega: vegaRaw / 100.0,

      // Theta = price change per calendar day
      theta: thetaAnnual / 365.0,

      // Rho = price change for 1 percentage point interest-rate change
      rho: rhoRaw / 100.0,

      d1: d1,
      d2: d2
    };
  }

  // ------------------------------------------------------------
  // Display helpers
  // ------------------------------------------------------------

  function formatNumber(x, digits = 4) {
    return Number.isFinite(x) ? x.toFixed(digits) : "--";
  }

  function formatGreek(x) {
    return Number.isFinite(x) ? x.toFixed(4) : "--";
  }

  function clearResults() {
    document.getElementById("priceResult").textContent = "--";
    document.getElementById("deltaResult").textContent = "--";
    document.getElementById("gammaResult").textContent = "--";
    document.getElementById("vegaResult").textContent = "--";
    document.getElementById("thetaResult").textContent = "--";
    document.getElementById("rhoResult").textContent = "--";
  }

  function updateDashboard() {
    try {
      const { S, K, T, r, q, sigma, optionType } = getInputs();

      const result = blackScholes(S, K, T, r, q, sigma, optionType);

      document.getElementById("priceResult").textContent =
        formatNumber(result.price, 4);

      document.getElementById("deltaResult").textContent =
        formatGreek(result.delta);

      document.getElementById("gammaResult").textContent =
        formatGreek(result.gamma);

      document.getElementById("vegaResult").textContent =
        formatGreek(result.vega);

      document.getElementById("thetaResult").textContent =
        formatGreek(result.theta);

      document.getElementById("rhoResult").textContent =
        formatGreek(result.rho);
    } catch (error) {
      clearResults();
      document.getElementById("priceResult").textContent = "Input error";
      console.error(error.message);
    }
  }

  // ------------------------------------------------------------
  // Event listeners
  // ------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById("calculateBtn");

    calculateBtn.addEventListener("click", updateDashboard);

    const inputIds = [
      "spot",
      "strike",
      "maturity",
      "rate",
      "dividend",
      "volatility",
      "optionType"
    ];

    inputIds.forEach(function (id) {
      document.getElementById(id).addEventListener("change", updateDashboard);
      document.getElementById(id).addEventListener("input", updateDashboard);
    });

    updateDashboard();
  });
})();



// ============================================================
// Option Pricing & Greeks Dashboard
// Step 5: Black-Scholes pricing + Greeks + Plotly charts
// ============================================================

(function () {
  "use strict";

  // ------------------------------------------------------------
  // Normal distribution helpers
  // ------------------------------------------------------------

  function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x);

    return sign * y;
  }

  function normalCDF(x) {
    return 0.5 * (1.0 + erf(x / Math.sqrt(2.0)));
  }

  function normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2.0 * Math.PI);
  }

  // ------------------------------------------------------------
  // Input handling
  // ------------------------------------------------------------

  function getNumber(id) {
    const value = parseFloat(document.getElementById(id).value);

    if (Number.isNaN(value)) {
      throw new Error(`Invalid input: ${id}`);
    }

    return value;
  }

  function getInputs() {
    const S = getNumber("spot");
    const K = getNumber("strike");
    const T = getNumber("maturity");
    const r = getNumber("rate");
    const q = getNumber("dividend");
    const sigma = getNumber("volatility");
    const optionType = document.getElementById("optionType").value;

    if (S <= 0) {
      throw new Error("Spot price must be positive.");
    }

    if (K <= 0) {
      throw new Error("Strike price must be positive.");
    }

    if (T <= 0) {
      throw new Error("Time to maturity must be positive.");
    }

    if (sigma <= 0) {
      throw new Error("Volatility must be positive.");
    }

    return { S, K, T, r, q, sigma, optionType };
  }

  // ------------------------------------------------------------
  // Black-Scholes price and Greeks
  // ------------------------------------------------------------

  function blackScholes(S, K, T, r, q, sigma, optionType) {
    const sqrtT = Math.sqrt(T);

    const d1 =
      (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) /
      (sigma * sqrtT);

    const d2 = d1 - sigma * sqrtT;

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const NminusD1 = normalCDF(-d1);
    const NminusD2 = normalCDF(-d2);
    const pdfD1 = normalPDF(d1);

    const discountRiskFree = Math.exp(-r * T);
    const discountDividend = Math.exp(-q * T);

    let price;
    let delta;
    let thetaAnnual;
    let rhoRaw;

    const gamma =
      (discountDividend * pdfD1) / (S * sigma * sqrtT);

    const vegaRaw =
      S * discountDividend * pdfD1 * sqrtT;

    if (optionType === "call") {
      price =
        S * discountDividend * Nd1 -
        K * discountRiskFree * Nd2;

      delta = discountDividend * Nd1;

      thetaAnnual =
        -(
          S *
          discountDividend *
          pdfD1 *
          sigma
        ) /
          (2.0 * sqrtT) -
        r * K * discountRiskFree * Nd2 +
        q * S * discountDividend * Nd1;

      rhoRaw = K * T * discountRiskFree * Nd2;
    } else {
      price =
        K * discountRiskFree * NminusD2 -
        S * discountDividend * NminusD1;

      delta = discountDividend * (Nd1 - 1.0);

      thetaAnnual =
        -(
          S *
          discountDividend *
          pdfD1 *
          sigma
        ) /
          (2.0 * sqrtT) +
        r * K * discountRiskFree * NminusD2 -
        q * S * discountDividend * NminusD1;

      rhoRaw = -K * T * discountRiskFree * NminusD2;
    }

    return {
      price: price,
      delta: delta,
      gamma: gamma,

      // Vega = price change for 1 percentage point volatility change
      vega: vegaRaw / 100.0,

      // Theta = price change per calendar day
      theta: thetaAnnual / 365.0,

      // Rho = price change for 1 percentage point interest-rate change
      rho: rhoRaw / 100.0,

      d1: d1,
      d2: d2
    };
  }

  // ------------------------------------------------------------
  // Payoff functions
  // ------------------------------------------------------------

  function optionPayoff(ST, K, optionType) {
    if (optionType === "call") {
      return Math.max(ST - K, 0.0);
    }

    return Math.max(K - ST, 0.0);
  }

  // ------------------------------------------------------------
  // Grid generation
  // ------------------------------------------------------------

  function linspace(start, end, n) {
    const arr = [];

    if (n === 1) {
      return [start];
    }

    const step = (end - start) / (n - 1);

    for (let i = 0; i < n; i++) {
      arr.push(start + step * i);
    }

    return arr;
  }

  function generateSpotGrid(S, K) {
    const lower = Math.max(0.01, Math.min(S, K) * 0.5);
    const upper = Math.max(S, K) * 1.5;

    return linspace(lower, upper, 101);
  }

  // ------------------------------------------------------------
  // Plotly charts
  // ------------------------------------------------------------

  function plotPayoffChart(inputs, result) {
    const { S, K, optionType } = inputs;

    const spotGrid = generateSpotGrid(S, K);

    const grossPayoff = spotGrid.map(function (ST) {
      return optionPayoff(ST, K, optionType);
    });

    const netPayoff = grossPayoff.map(function (payoff) {
      return payoff - result.price;
    });

    const zeroLine = spotGrid.map(function () {
      return 0.0;
    });

    const traces = [
      {
        x: spotGrid,
        y: grossPayoff,
        type: "scatter",
        mode: "lines",
        name: "Gross payoff"
      },
      {
        x: spotGrid,
        y: netPayoff,
        type: "scatter",
        mode: "lines",
        name: "Net payoff"
      },
      {
        x: spotGrid,
        y: zeroLine,
        type: "scatter",
        mode: "lines",
        name: "Break-even line",
        line: {
          dash: "dot"
        }
      }
    ];

    const layout = {
      margin: {
        l: 50,
        r: 20,
        t: 20,
        b: 45
      },
      xaxis: {
        title: "Underlying Price at Maturity"
      },
      yaxis: {
        title: "Payoff"
      },
      legend: {
        orientation: "h",
        y: -0.25
      },
      hovermode: "x unified"
    };

    const config = {
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot("payoffChart", traces, layout, config);
  }

  function plotSingleChart(chartId, spotGrid, yValues, traceName, yTitle) {
  const traces = [
    {
      x: spotGrid,
      y: yValues,
      type: "scatter",
      mode: "lines",
      name: traceName
    }
  ];

  const layout = {
    margin: {
      l: 45,
      r: 20,
      t: 10,
      b: 40
    },
    xaxis: {
      title: "Spot Price"
    },
    yaxis: {
      title: yTitle
    },
    hovermode: "x unified",
    showlegend: false
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  Plotly.newPlot(chartId, traces, layout, config);
}

    function plotGreekGrid(inputs) {
    const { S, K, T, r, q, sigma, optionType } = inputs;

    const spotGrid = generateSpotGrid(S, K);

    const priceValues = [];
    const deltaValues = [];
    const gammaValues = [];
    const vegaValues = [];
    const thetaValues = [];
    const rhoValues = [];

    spotGrid.forEach(function (spotValue) {
        const result = blackScholes(
        spotValue,
        K,
        T,
        r,
        q,
        sigma,
        optionType
        );

        priceValues.push(result.price);
        deltaValues.push(result.delta);
        gammaValues.push(result.gamma);
        vegaValues.push(result.vega);
        thetaValues.push(result.theta);
        rhoValues.push(result.rho);
    });

    plotSingleChart(
        "priceChart",
        spotGrid,
        priceValues,
        "Option Value",
        "Value"
    );

    plotSingleChart(
        "deltaChart",
        spotGrid,
        deltaValues,
        "Delta",
        "Delta"
    );

    plotSingleChart(
        "gammaChart",
        spotGrid,
        gammaValues,
        "Gamma",
        "Gamma"
    );

    plotSingleChart(
        "vegaChart",
        spotGrid,
        vegaValues,
        "Vega",
        "Vega / 1% vol"
    );

    plotSingleChart(
        "thetaChart",
        spotGrid,
        thetaValues,
        "Theta",
        "Theta / day"
    );

    plotSingleChart(
        "rhoChart",
        spotGrid,
        rhoValues,
        "Rho",
        "Rho / 1% rate"
    );
    }

  // ------------------------------------------------------------
  // Display helpers
  // ------------------------------------------------------------

  function formatNumber(x, digits = 4) {
    return Number.isFinite(x) ? x.toFixed(digits) : "--";
  }

  function formatGreek(x) {
    return Number.isFinite(x) ? x.toFixed(4) : "--";
  }

  function clearResults() {
    document.getElementById("priceResult").textContent = "--";
    document.getElementById("deltaResult").textContent = "--";
    document.getElementById("gammaResult").textContent = "--";
    document.getElementById("vegaResult").textContent = "--";
    document.getElementById("thetaResult").textContent = "--";
    document.getElementById("rhoResult").textContent = "--";
  }

  // ------------------------------------------------------------
  // Main update function
  // ------------------------------------------------------------

  function updateDashboard() {
    try {
      const inputs = getInputs();

      const result = blackScholes(
        inputs.S,
        inputs.K,
        inputs.T,
        inputs.r,
        inputs.q,
        inputs.sigma,
        inputs.optionType
      );

      document.getElementById("priceResult").textContent =
        formatNumber(result.price, 4);

      document.getElementById("deltaResult").textContent =
        formatGreek(result.delta);

      document.getElementById("gammaResult").textContent =
        formatGreek(result.gamma);

      document.getElementById("vegaResult").textContent =
        formatGreek(result.vega);

      document.getElementById("thetaResult").textContent =
        formatGreek(result.theta);

      document.getElementById("rhoResult").textContent =
        formatGreek(result.rho);

      plotPayoffChart(inputs, result);
      plotGreekGrid(inputs);
    } catch (error) {
      clearResults();
      document.getElementById("priceResult").textContent = "Input error";
      console.error(error.message);
    }
  }

  // ------------------------------------------------------------
  // Event listeners
  // ------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById("calculateBtn");

    calculateBtn.addEventListener("click", updateDashboard);

    const inputIds = [
      "spot",
      "strike",
      "maturity",
      "rate",
      "dividend",
      "volatility",
      "optionType"
    ];

    inputIds.forEach(function (id) {
      document.getElementById(id).addEventListener("change", updateDashboard);
      document.getElementById(id).addEventListener("input", updateDashboard);
    });

    updateDashboard();
  });
})();