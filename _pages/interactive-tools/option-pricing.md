---
title: "Black-Scholes Browser Demo"
permalink: /interactive-tools/option-pricing/
layout: single
classes: wide
author_profile: false
toc: false
---

<link rel="stylesheet" href="{{ '/assets/css/option-dashboard.css' | relative_url }}">

<script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>

<div class="option-dashboard">

  <p class="back-link">
    <a href="{{ '/interactive-tools/' | relative_url }}">← Back to Interactive Tools</a>
  </p>

  <section class="dashboard-hero">
    <p class="dashboard-label">Interactive Quant Finance Tool</p>
    <h1>Black-Scholes Browser Demo</h1>
    <p class="dashboard-subtitle">
      A lightweight browser-based demo for exploring Black-Scholes option prices,
      Greeks, payoff profiles, and spot-price sensitivity. Use the sliders for quick
      exploration or the exact input boxes for precise values.
    </p>
    <div class="dashboard-hero-actions">
      <a class="dashboard-action-button" href="https://xiaodong-option-pricing-lab.streamlit.app/" target="_blank" rel="noopener noreferrer">
        Launch full Streamlit app →
      </a>
      <a class="dashboard-action-link" href="https://github.com/XiaodongYangQF/quant-finance-pricing-lab" target="_blank" rel="noopener noreferrer">
        Source code
      </a>
    </div>
  </section>

  <section class="dashboard-layout">

    <aside class="dashboard-card input-card">
      <h2>Model Inputs</h2>
      <p class="input-help">
        Rates and volatility are entered in decimal form. For example, 0.05 means 5%.
      </p>

      <div class="control-stack">

        <div class="control-group">
          <div class="control-header">
            <label for="spot">Spot Price S</label>
            <span>Underlying price today</span>
          </div>
          <div class="dual-control">
            <input id="spotSlider" type="range" min="1" max="300" value="100" step="1" aria-label="Spot Price S slider">
            <input id="spot" type="number" min="0.01" value="100" step="1" aria-label="Spot Price S exact value">
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="strike">Strike Price K</label>
            <span>Exercise price</span>
          </div>
          <div class="dual-control">
            <input id="strikeSlider" type="range" min="1" max="300" value="100" step="1" aria-label="Strike Price K slider">
            <input id="strike" type="number" min="0.01" value="100" step="1" aria-label="Strike Price K exact value">
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="maturity">Time to Maturity T</label>
            <span>Years to maturity</span>
          </div>
          <div class="dual-control">
            <input id="maturitySlider" type="range" min="0.01" max="5" value="1" step="0.01" aria-label="Time to Maturity T slider">
            <input id="maturity" type="number" min="0.001" value="1" step="0.01" aria-label="Time to Maturity T exact value">
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="rate">Risk-free Rate r</label>
            <span>Continuously compounded rate</span>
          </div>
          <div class="dual-control">
            <input id="rateSlider" type="range" min="-0.05" max="0.15" value="0.05" step="0.001" aria-label="Risk-free Rate r slider">
            <input id="rate" type="number" value="0.05" step="0.001" aria-label="Risk-free Rate r exact value">
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="dividend">Dividend Yield q</label>
            <span>Continuous dividend yield</span>
          </div>
          <div class="dual-control">
            <input id="dividendSlider" type="range" min="0" max="0.15" value="0.00" step="0.001" aria-label="Dividend Yield q slider">
            <input id="dividend" type="number" value="0.00" step="0.001" aria-label="Dividend Yield q exact value">
          </div>
        </div>

        <div class="control-group">
          <div class="control-header">
            <label for="volatility">Volatility σ</label>
            <span>Annualized volatility</span>
          </div>
          <div class="dual-control">
            <input id="volatilitySlider" type="range" min="0.01" max="1" value="0.20" step="0.01" aria-label="Volatility sigma slider">
            <input id="volatility" type="number" min="0.001" value="0.20" step="0.01" aria-label="Volatility sigma exact value">
          </div>
        </div>

        <div class="control-group option-type-group">
          <div class="control-header">
            <label for="optionType">Option Type</label>
            <span>Call or put payoff</span>
          </div>
          <select id="optionType" aria-label="Option Type">
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </div>

      </div>

      <div class="dashboard-actions">
        <button id="calculateBtn" type="button">Update dashboard</button>
        <button id="resetBtn" type="button" class="secondary-button">Reset inputs</button>
      </div>

      <div id="inputError" class="input-error" role="alert" aria-live="polite"></div>
    </aside>

    <main class="dashboard-main">

      <div class="dashboard-tabs" role="tablist" aria-label="Option dashboard views">
        <button class="tab-button active" type="button" data-tab-target="basicPanel" role="tab" aria-selected="true">
          Basic results
        </button>
        <button class="tab-button" type="button" data-tab-target="advancedPanel" role="tab" aria-selected="false">
          Greek sensitivity
        </button>
      </div>

      <section id="basicPanel" class="tab-panel active-tab-panel" role="tabpanel">
        <div class="basic-results-grid">

          <div class="dashboard-card chart-card live-chart-card">
            <h2>Live Payoff Profile</h2>
            <p class="chart-description">
              Gross payoff is the option payoff at maturity. Net payoff subtracts the current model price.
            </p>
            <div id="payoffChart"></div>
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

            <div class="model-summary-grid">
              <div>
                <span>Moneyness S/K</span>
                <strong id="moneynessResult">--</strong>
              </div>
              <div>
                <span>d1</span>
                <strong id="d1Result">--</strong>
              </div>
              <div>
                <span>d2</span>
                <strong id="d2Result">--</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="advancedPanel" class="tab-panel" role="tabpanel" hidden>
        <div class="dashboard-card chart-card greek-sensitivity-card">
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
        </div>
      </section>

    </main>

  </section>

</div>

<script src="{{ '/assets/js/option-dashboard.js' | relative_url }}"></script>
