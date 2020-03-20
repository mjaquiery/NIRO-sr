function parseMD(md, opts = {}) {
    const show = new showdown.Converter(opts);
    if(!show)
        return md;

    const parsed = show.makeHtml(md);
    return parsed || md;
}

async function getChecklistData() {
    let checklist = null;
    await fetch('/assets/data/checklist.json')
        .then(r => r.json())
        .then(json => checklist = json);

    return checklist;
}

async function unpackChecklist() {
    const checklist = await getChecklistData();
    const target = document.querySelector(".checklist");

    for(const section in checklist.sections) {
        const s = target.appendChild(document.createElement('section'));
        s.classList.add('post', 'section', section);
        s.innerHTML = `
<header class="post-header ${section}">
    <h3>
        <a href="#checklist" id="${section}" class="post-title" title="${section}">${parseMD(checklist.sections[section].name)}</a>
    </h3>
</header>
`;
        checklist.items.filter(i => i.section === section).forEach(
            (i, index) => {
                const item = s.appendChild(document.createElement('section'));
                item.classList.add('post', 'item');
                item.innerHTML = `
<header class="post-title ${section}">
<h4>
    <a href="#${section}" id="${section}-${index}" class="post-title" title="${i.name}">${parseMD(i.name)}</a>
</h4>
</header>
<div class="post-content" title="${i.rationale}">
</div>
                `;
                const div = item.querySelector('div');
                for(const c in i.content) {
                    const e = div.appendChild(document.createElement('p'));
                    e.innerHTML = `<span class="who ${c}">${c}:</span> ${parseMD(i.content[c])}`;
                }
            }
        );
    }

    // Remove the link to raw JSON
    target.querySelector('.temp').remove();
}

unpackChecklist();

/*
{% for section in sections %}
<section class="post">
    <header class="post-header">
    <h3>
    <a href="#" id="{{ section }}" class="post-title" title="{{ section | escape }}">{{ section }}</a>
</h3>
</header>

{% assign items = site.checklist-items | where: 'section', section %}
{% for item in items %}
<section class="post checklist-item">
    <header class="post-title">
    <h4>
    <a href="#" id="{{ item.section }}-{{ item.title }}" class="post-title" title="{{ item.title | escape }}">{{ item.title }}</a>
</h4>
</header>

<div class="post-content" title="{{ item.rationale | escape }}">
    {{ item.content }}
</div>
</section>
{% unless forloop.last %}<hr class="post-listing-separator"/>{% endunless %}
{% endfor %}
</section>
{% endfor %}
*/
