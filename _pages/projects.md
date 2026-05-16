---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}

This page highlights selected projects in quantitative finance, derivatives pricing, risk management, and data-driven modelling.

## Featured Projects

### [Quant Finance Pricing Lab](/projects/quant-finance-pricing-lab/)

### [Option-Implied Distribution and Tail Risk Toolkit](/projects/option-implied-density/)

### [Live Football Odds Analytics](/projects/live-football-odds/)

## Technical Notes

### [Quant Interview Notes](/projects/quant-interview-notes/)

### [FRM Study Notes](/projects/frm-study-notes/)
