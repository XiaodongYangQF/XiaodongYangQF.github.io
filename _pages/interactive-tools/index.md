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
      and applied probability models.
    </p>
  </section>

  <section class="tools-grid">

    <a class="tool-card" href="{{ '/interactive-tools/option-pricing/' | relative_url }}">
      <div class="tool-tag">Quant Finance</div>
      <h2>Option Pricing & Greeks Dashboard</h2>
      <p>
        An interactive Black-Scholes dashboard for option prices, Greeks,
        payoff diagrams, and pricing sensitivity.
      </p>
      <span>Open tool →</span>
    </a>

    <a class="tool-card" href="https://xiaodong-option-pricing-lab.streamlit.app/" target="_blank" rel="noopener noreferrer">
        <div class="tool-tag">Python · Streamlit</div>
        <h2>Option Pricing Lab — Streamlit App</h2>
        <p>
            A Python-powered dashboard with Black-Scholes pricing, Greeks,
            implied volatility solver, volatility smile construction, and scenario analysis.
        </p>
        <span>Launch live app →</span>
    </a>

    <p>
        <a href="https://github.com/XiaodongYangQF/quant-finance-pricing-lab"
            target="_blank" rel="noopener noreferrer">
            View source code on GitHub
        </a>
    </p>

    <a class="tool-card" href="https://research-bibflow.streamlit.app/" target="_blank" rel="noopener noreferrer">
        <div class="tool-tag">Python · Streamlit</div>
        <h2>BibFlow: Zotero–Overleaf BibTeX Workflow Assistant</h2>
        <p>
            BibFlow is a lightweight research workflow tool that helps researchers generate, clean, deduplicate, and export Overleaf-ready BibTeX entries from DOI metadata.
        </p>
        <span>Launch live app →</span>
    </a>

    <p>
        <a href="https://github.com/XiaodongYangQF/bibflow-streamlit"
            target="_blank" rel="noopener noreferrer">
            View source code on GitHub
        </a>
    </p>


    <a class="tool-card" href="{{ '/interactive-tools/late-goal-probability/' | relative_url }}">
      <div class="tool-tag">Sports Analytics</div>
      <h2>Late Goal Probability Dashboard</h2>
      <p>
        A research prototype for estimating late-goal probabilities using
        in-play Asian over/under lines, handicap lines, odds, and match state.
      </p>
      <span>Coming soon →</span>
    </a>

  </section>

</div>