// ============================================================
// Black-Scholes Browser Demo
// Pricing, Greeks, linked sliders/input boxes, and Plotly charts
// ============================================================

(function () {
  "use strict";

  const pairedControls = [
    { valueId: "spot", sliderId: "spotSlider", defaultValue: 100 },
    { valueId: "strike", sliderId: "strikeSlider", defaultValue: 100 },
    { valueId: "maturity", sliderId: "maturitySlider", defaultValue: 1 },
    { valueId: "rate", sliderId: "rateSlider", defaultValue: 0.05 },
    { valueId: "dividend", sliderId: "dividendSlider", defaultValue: 0.0 },
    { valueId: "volatility", sliderId: "volatilitySlider", defaultValue: 0.20 }
  ];

  const plotConfig = {
    responsive: true,
    displayModeBar: false
  };

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
      (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
        t *
        Math.exp(-x * x));

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

  function getElement(id) {
    return document.getElementById(id);
  }

  function getNumber(id) {
    const element = getElement(id);
    const value = parseFloat(element.value);

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
    const optionType = getElement("optionType").value;

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

  function clampToSliderRange(value, slider) {
    const minValue = parseFloat(slider.min);
    const maxValue = parseFloat(slider.max);

    if (Number.isNaN(value)) {
      return slider.value;
    }

    return Math.min(Math.max(value, minValue), maxValue);
  }

  function syncSliderFromNumber(numberInput, sliderInput) {
    const value = parseFloat(numberInput.value);
    sliderInput.value = clampToSliderRange(value, sliderInput);
  }

  function syncNumberFromSlider(numberInput, sliderInput) {
    numberInput.value = sliderInput.value;
  }

  function setupLinkedControls() {
    pairedControls.forEach(function (control) {
      const numberInput = getElement(control.valueId);
      const sliderInput = getElement(control.sliderId);

      if (!numberInput || !sliderInput) {
        return;
      }

      sliderInput.addEventListener("input", function () {
        syncNumberFromSlider(numberInput, sliderInput);
        updateDashboard();
      });

      numberInput.addEventListener("input", function () {
        syncSliderFromNumber(numberInput, sliderInput);
        updateDashboard();
      });

      numberInput.addEventListener("change", function () {
        syncSliderFromNumber(numberInput, sliderInput);
        updateDashboard();
      });
    });
  }

  function resetInputs() {
    pairedControls.forEach(function (control) {
      const numberInput = getElement(control.valueId);
      const sliderInput = getElement(control.sliderId);

      if (!numberInput || !sliderInput) {
        return;
      }

      numberInput.value = control.defaultValue;
      sliderInput.value = control.defaultValue;
    });

    getElement("optionType").value = "call";
    updateDashboard();
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

    const gamma = (discountDividend * pdfD1) / (S * sigma * sqrtT);
    const vegaRaw = S * discountDividend * pdfD1 * sqrtT;

    if (optionType === "call") {
      price = S * discountDividend * Nd1 - K * discountRiskFree * Nd2;
      delta = discountDividend * Nd1;
      thetaAnnual =
        -(S * discountDividend * pdfD1 * sigma) / (2.0 * sqrtT) -
        r * K * discountRiskFree * Nd2 +
        q * S * discountDividend * Nd1;
      rhoRaw = K * T * discountRiskFree * Nd2;
    } else {
      price = K * discountRiskFree * NminusD2 - S * discountDividend * NminusD1;
      delta = discountDividend * (Nd1 - 1.0);
      thetaAnnual =
        -(S * discountDividend * pdfD1 * sigma) / (2.0 * sqrtT) +
        r * K * discountRiskFree * NminusD2 -
        q * S * discountDividend * NminusD1;
      rhoRaw = -K * T * discountRiskFree * NminusD2;
    }

    return {
      price: price,
      delta: delta,
      gamma: gamma,

      // Vega = price change for 1 percentage point volatility change.
      vega: vegaRaw / 100.0,

      // Theta = price change per calendar day.
      theta: thetaAnnual / 365.0,

      // Rho = price change for 1 percentage point interest-rate change.
      rho: rhoRaw / 100.0,
      d1: d1,
      d2: d2
    };
  }

  // ------------------------------------------------------------
  // Chart helpers
  // ------------------------------------------------------------

  function optionPayoff(ST, K, optionType) {
    if (optionType === "call") {
      return Math.max(ST - K, 0.0);
    }

    return Math.max(K - ST, 0.0);
  }

  function linspace(start, end, n) {
    const arr = [];

    if (n === 1) {
      return [start];
    }

    const step = (end - start) / (n - 1);

    for (let i = 0; i < n; i += 1) {
      arr.push(start + step * i);
    }

    return arr;
  }

  function generateSpotGrid(S, K) {
    const lower = Math.max(0.01, Math.min(S, K) * 0.5);
    const upper = Math.max(S, K) * 1.5;

    return linspace(lower, upper, 121);
  }

  function verticalLine(xValue, dashStyle) {
    return {
      type: "line",
      x0: xValue,
      x1: xValue,
      y0: 0,
      y1: 1,
      yref: "paper",
      line: {
        dash: dashStyle,
        width: 1
      }
    };
  }

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
        line: { dash: "dot" }
      }
    ];

    const layout = {
      margin: { l: 50, r: 20, t: 20, b: 45 },
      xaxis: { title: "Underlying Price at Maturity" },
      yaxis: { title: "Payoff" },
      legend: { orientation: "h", y: -0.25 },
      hovermode: "x unified",
      shapes: [verticalLine(K, "dash")],
      annotations: [
        {
          x: K,
          y: 1,
          yref: "paper",
          text: "K",
          showarrow: false,
          yshift: 10
        }
      ]
    };

    Plotly.react("payoffChart", traces, layout, plotConfig);
  }

  function plotSingleChart(chartId, spotGrid, yValues, traceName, yTitle, currentSpot, strike) {
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
      margin: { l: 45, r: 20, t: 10, b: 40 },
      xaxis: { title: "Spot Price" },
      yaxis: { title: yTitle },
      hovermode: "x unified",
      showlegend: false,
      shapes: [verticalLine(currentSpot, "dot"), verticalLine(strike, "dash")]
    };

    Plotly.react(chartId, traces, layout, plotConfig);
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
      const result = blackScholes(spotValue, K, T, r, q, sigma, optionType);

      priceValues.push(result.price);
      deltaValues.push(result.delta);
      gammaValues.push(result.gamma);
      vegaValues.push(result.vega);
      thetaValues.push(result.theta);
      rhoValues.push(result.rho);
    });

    plotSingleChart("priceChart", spotGrid, priceValues, "Option Value", "Value", S, K);
    plotSingleChart("deltaChart", spotGrid, deltaValues, "Delta", "Delta", S, K);
    plotSingleChart("gammaChart", spotGrid, gammaValues, "Gamma", "Gamma", S, K);
    plotSingleChart("vegaChart", spotGrid, vegaValues, "Vega", "Vega / 1% vol", S, K);
    plotSingleChart("thetaChart", spotGrid, thetaValues, "Theta", "Theta / day", S, K);
    plotSingleChart("rhoChart", spotGrid, rhoValues, "Rho", "Rho / 1% rate", S, K);
  }

  // ------------------------------------------------------------
  // Display helpers
  // ------------------------------------------------------------

  function formatNumber(x, digits = 4) {
    return Number.isFinite(x) ? x.toFixed(digits) : "--";
  }

  function setText(id, value) {
    const element = getElement(id);

    if (element) {
      element.textContent = value;
    }
  }

  function clearResults() {
    [
      "priceResult",
      "deltaResult",
      "gammaResult",
      "vegaResult",
      "thetaResult",
      "rhoResult",
      "moneynessResult",
      "d1Result",
      "d2Result"
    ].forEach(function (id) {
      setText(id, "--");
    });
  }

  function setError(message) {
    const errorBox = getElement("inputError");

    if (errorBox) {
      errorBox.textContent = message || "";
    }
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

      setText("priceResult", formatNumber(result.price, 4));
      setText("deltaResult", formatNumber(result.delta, 4));
      setText("gammaResult", formatNumber(result.gamma, 4));
      setText("vegaResult", formatNumber(result.vega, 4));
      setText("thetaResult", formatNumber(result.theta, 4));
      setText("rhoResult", formatNumber(result.rho, 4));
      setText("moneynessResult", formatNumber(inputs.S / inputs.K, 4));
      setText("d1Result", formatNumber(result.d1, 4));
      setText("d2Result", formatNumber(result.d2, 4));

      setError("");
      plotPayoffChart(inputs, result);
      plotGreekGrid(inputs);
    } catch (error) {
      clearResults();
      setText("priceResult", "Input error");
      setError(error.message);
      console.error(error.message);
    }
  }


  function resizeVisibleCharts() {
    [
      "payoffChart",
      "priceChart",
      "deltaChart",
      "gammaChart",
      "vegaChart",
      "thetaChart",
      "rhoChart"
    ].forEach(function (chartId) {
      const chart = getElement(chartId);

      if (chart && window.Plotly) {
        Plotly.Plots.resize(chart);
      }
    });
  }

  function setupTabs() {
    const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));

    if (tabButtons.length === 0) {
      return;
    }

    tabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.getAttribute("data-tab-target");

        tabButtons.forEach(function (otherButton) {
          const isActive = otherButton === button;
          otherButton.classList.toggle("active", isActive);
          otherButton.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        document.querySelectorAll(".tab-panel").forEach(function (panel) {
          const isActivePanel = panel.id === targetId;
          panel.hidden = !isActivePanel;
          panel.classList.toggle("active-tab-panel", isActivePanel);
        });

        // Redraw after the selected panel becomes visible so Plotly can measure widths correctly.
        window.setTimeout(function () {
          updateDashboard();
          resizeVisibleCharts();
        }, 50);
      });
    });
  }

  // ------------------------------------------------------------
  // Event listeners
  // ------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    setupLinkedControls();
    setupTabs();

    const calculateBtn = getElement("calculateBtn");
    const resetBtn = getElement("resetBtn");
    const optionType = getElement("optionType");

    if (calculateBtn) {
      calculateBtn.addEventListener("click", updateDashboard);
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", resetInputs);
    }

    if (optionType) {
      optionType.addEventListener("change", updateDashboard);
    }

    updateDashboard();
  });
})();
