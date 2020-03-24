---
title: Contributors
summary: "NIRO only exists thanks to the expert and selfless work of numerous contributors."
layout: default
---
{% assign max = 0 %}
{% for x in site.contributors %}
    {% assign n = x.contributions | size %}
    {% if n > max %}
        {% assign max = n %}
    {% endif %}
{% endfor %}

<section class="contributors">
{% for i in (1..max) reversed %}
{% for x in site.contributors %}
{% assign n = x.contributions | size %}
{% if n == i %}
{% include contributor-card.html contributor=x %}
{% endif %}
{% endfor %}
{% endfor %}
</section>