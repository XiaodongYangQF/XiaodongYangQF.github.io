---
title: "Interactive Tools"
permalink: /interactive-tools/
layout: single
classes: wide
author_profile: false
toc: false
---

<link rel="stylesheet" href="{{ '/assets/css/interactive-tools.css' | relative_url }}">

<div class="tools-page">

  <section class="tools-hero">
    <p class="tools-label">Quant Finance · Analytics · Research Prototypes</p>
    <!-- <h1>Interactive Tools</h1> -->
    <p>
      A collection of browser-based and Python-powered tools for exploring
      option pricing, Greeks, payoff profiles, market-implied information,
      research workflows, and sports market analytics.
    </p>
  </section>

  <section class="tools-grid">

    <article class="tool-card">
      <div class="tool-icon">📈</div>
      <div class="tool-tag">Browser Demo</div>
      <h2>Black-Scholes Browser Demo</h2>
      <p>
        A lightweight in-browser calculator for Black-Scholes option prices,
        Greeks, payoff profiles, and spot-price sensitivity. Use sliders for
        fast exploration or exact input boxes for precise values.
      </p>
      <div class="tool-actions">
        <a class="tool-button" href="{{ '/interactive-tools/option-pricing/' | relative_url }}">
          Open browser demo →
        </a>
      </div>
    </article>

    <article class="tool-card">
      <div class="tool-icon">🧮</div>
      <div class="tool-tag">Python · Streamlit</div>
      <h2>Option Pricing Lab — Full Streamlit App</h2>
      <p>
        A Python-powered option pricing lab with interactive controls, Greeks,
        sensitivity charts, implied volatility, volatility smile construction,
        and scenario analysis.
      </p>
      <div class="tool-actions">
        <a class="tool-button" href="https://xiaodong-option-pricing-lab.streamlit.app/" target="_blank" rel="noopener noreferrer">
          Launch live app →
        </a>
        <a class="tool-link" href="https://github.com/XiaodongYangQF/quant-finance-pricing-lab" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </div>
    </article>

    <article class="tool-card featured-tool">
      <div class="tool-icon">📚</div>
      <div class="tool-tag">Research Workflow</div>
      <h2>BibFlow</h2>

      <p>
        A research workflow tool for cleaning references, retrieving DOI metadata,
        checking duplicates, and exporting cleaner BibTeX records.
      </p>

      <div class="tool-meta">
        Streamlit · DOI Metadata · BibTeX · RIS/HTML · Literature Review
      </div>

      <div class="tool-actions">
        <a class="tool-button" href="https://research-bibflow.streamlit.app/" target="_blank" rel="noopener noreferrer">
          Launch live app →
        </a>
        <a class="tool-link" href="https://github.com/XiaodongYangQF/bibflow-streamlit" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </div>
    </article>

    <article class="tool-card">
      <div class="tool-icon">⚽</div>
      <div class="tool-tag">Sports Analytics · Streamlit</div>
      <h2>Football Market Analytics Dashboard</h2>
      <p>
        Explore historical Asian Handicap and Asian Total forecasts, settlement outcomes,
        simulated returns, and market-level performance through interactive charts
        and a searchable fixture ledger.
      </p>
      <div class="tool-meta">
        Python · Streamlit · Football Markets · Historical Research
      </div>
      <div class="tool-actions">
        <a class="tool-button" href="https://football-market-analytics.streamlit.app/" target="_blank" rel="noopener noreferrer">
          Launch live dashboard →
        </a>
        <a class="tool-link" href="https://github.com/XiaodongYangQF/football-market-analytics-public" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </div>
    </article>

  </section>

</div>
