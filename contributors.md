---
title: Contributors
summary: "NIRO only exists thanks to the expertise and enthusiasm of numerous contributors."
layout: default
---

{% assign leads = site.contributors | where: "projectLead", true %}
{% assign contributors = site.contributors | where_exp: "projectLead", "projectLead != true" %}

<h1>Project leaders</h1>
<section class="contributors leads">
{% for x in leads %}
    {% include contributor-card.html contributor = x %}
{% endfor %}
</section>

<h1>Contributors</h1>
<section class="contributors">
{% for x in contributors %}
    {% include contributor-card.html contributor=x %}
{% endfor %}
</section>
