---
title: "Option Pricing & Greeks Dashboard"
permalink: /interactive-tools/option-pricing/
layout: single
classes: wide
author_profile: false
toc: false
---

<link rel="stylesheet" href="{{ '/assets/css/option-dashboard.css' | relative_url }}">

<script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>

<div class="option-dashboard">

  <p>
    <a href="{{ '/interactive-tools/' | relative_url }}">← Back to Interactive Tools</a>
  </p>

  <section class="dashboard-hero">
    <p class="dashboard-label">Interactive Quant Finance Tool</p>
    <h1>Option Pricing & Greeks Dashboard</h1>
    <p class="dashboard-subtitle">
      A browser-based Black-Scholes dashboard for exploring option prices,
      Greeks, payoff profiles, and pricing sensitivity under different market assumptions.
    </p>
  </section>

  <section class="dashboard-grid">

    <div class="dashboard-card input-card">
      <h2>Model Inputs</h2>

      <div class="input-grid">

        <label>
          Spot Price S
          <input id="spot" type="number" value="100" step="1">
        </label>

        <label>
          Strike Price K
          <input id="strike" type="number" value="100" step="1">
        </label>

        <label>
          Time to Maturity T
          <input id="maturity" type="number" value="1" step="0.01">
        </label>

        <label>
          Risk-free Rate r
          <input id="rate" type="number" value="0.05" step="0.001">
        </label>

        <label>
          Dividend Yield q
          <input id="dividend" type="number" value="0.00" step="0.001">
        </label>

        <label>
          Volatility sigma
          <input id="volatility" type="number" value="0.20" step="0.01">
        </label>

        <label>
          Option Type
          <select id="optionType">
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </label>

      </div>

      <button id="calculateBtn">Calculate</button>
    </div>

    <div class="dashboard-card results-card">
      <h2>Pricing Results</h2>

      <div class="results-grid">
        <div>
          <span>Option Price</span>
          <strong id="priceResult">--</strong>
        </div>

        <div>
          <span>Delta</span>
          <strong id="deltaResult">--</strong>
        </div>

        <div>
          <span>Gamma</span>
          <strong id="gammaResult">--</strong>
        </div>

        <div>
          <span>Vega / 1% vol</span>
          <strong id="vegaResult">--</strong>
        </div>

        <div>
          <span>Theta / day</span>
          <strong id="thetaResult">--</strong>
        </div>

        <div>
          <span>Rho / 1% rate</span>
          <strong id="rhoResult">--</strong>
        </div>
      </div>
    </div>

  </section>

  <section class="dashboard-card chart-card">
    <h2>Payoff Profile</h2>
    <div id="payoffChart"></div>
  </section>

  <!-- <section class="dashboard-card chart-card">
    <h2>Option Value and Delta Sensitivity</h2>
    <div id="valueChart"></div>
  </section> -->

<section class="dashboard-card chart-card greek-sensitivity-card">
  <h2>Greek Sensitivity Analysis</h2>
  <p class="chart-description">
    Each plot shows how the option value or Greek changes as the underlying spot price changes,
    while keeping maturity, volatility, interest rate, dividend yield, and strike fixed.
  </p>

  <div class="greek-chart-grid">

    <div class="mini-chart-card">
      <h3>Option Value</h3>
      <div id="priceChart" class="mini-plot"></div>
    </div>

    <div class="mini-chart-card">
      <h3>Delta</h3>
      <div id="deltaChart" class="mini-plot"></div>
    </div>

    <div class="mini-chart-card">
      <h3>Gamma</h3>
      <div id="gammaChart" class="mini-plot"></div>
    </div>

    <div class="mini-chart-card">
      <h3>Vega</h3>
      <div id="vegaChart" class="mini-plot"></div>
    </div>

    <div class="mini-chart-card">
      <h3>Theta</h3>
      <div id="thetaChart" class="mini-plot"></div>
    </div>

    <div class="mini-chart-card">
      <h3>Rho</h3>
      <div id="rhoChart" class="mini-plot"></div>
    </div>

  </div>
</section>

</div>

<script src="{{ '/assets/js/option-dashboard.js' | relative_url }}"></script>