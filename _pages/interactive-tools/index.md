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
    <h1>Interactive Tools</h1>
    <p>
      A collection of browser-based and Python-powered tools for exploring
      option pricing, Greeks, payoff profiles, market-implied information,
      research workflows, and applied probability models.
    </p>
  </section>

  <section class="tools-grid">

    <article class="tool-card">
      <div class="tool-icon">📈</div>
      <div class="tool-tag">Quant Finance</div>
      <h2>Option Pricing & Greeks Dashboard</h2>
      <p>
        An interactive Black-Scholes dashboard for option prices, Greeks,
        payoff diagrams, and pricing sensitivity.
      </p>
      <div class="tool-actions">
        <a class="tool-button" href="{{ '/interactive-tools/option-pricing/' | relative_url }}">
          Open tool →
        </a>
      </div>
    </article>

    <article class="tool-card">
      <div class="tool-icon">🧮</div>
      <div class="tool-tag">Python · Streamlit</div>
      <h2>Option Pricing Lab — Streamlit App</h2>
      <p>
        A Python-powered dashboard with Black-Scholes pricing, Greeks,
        implied volatility solver, volatility smile construction, and scenario analysis.
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

    <article class="tool-card tool-card-muted">
      <div class="tool-icon">⚽</div>
      <div class="tool-tag">Sports Analytics</div>
      <h2>Late Goal Probability Dashboard</h2>
      <p>
        A research prototype for estimating late-goal probabilities using
        in-play Asian over/under lines, handicap lines, odds, and match state.
      </p>
      <div class="tool-actions">
        <span class="tool-button disabled">Coming soon →</span>
      </div>
    </article>

  </section>

</div>