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

function unpackChecklist(checklist) {
    const target = document.querySelector(".checklist");

    const sections = checklist.items
        .map(i => i.section)
        .filter((x, i, a) => a.indexOf(x) === i);

    for(const section of sections) {
        const s = target.appendChild(document.createElement('section'));
        s.classList.add('post', 'section', section);
        s.innerHTML = `
<header class="post-header ${section}">
    <h3>
        <a href="#checklist" id="${section}" class="post-title" title="Got to the top of the page">${parseMD(checklist.sections[section].name)}</a>
    </h3>
</header>
`;
        checklist.items.filter(i => i.section === section).forEach(
            (i, index) => {
                const item = s.appendChild(document.createElement('section'));
                item.classList.add(
                    'post',
                    'item',
                    i.optional? 'optional' : 'mandatory'
                );
                item.innerHTML = `
<header class="post-title ${section}">
<h4>
    <a href="#${section}" id="${section}-${index}" class="post-title" title="Go to section heading">${parseMD(i.name)}</a>
</h4>
</header>
<div class="post-content" title="${i.rationale}">
</div>
                `;
                const div = item.querySelector('div');
                for(const c in i.content) {
                    const e = div.appendChild(document.createElement('p'));
                    const who = Object.keys(i.content).length > 1?
                        `<span class="who ${c}">${c}:</span>` : "";
                    e.innerHTML = who + parseMD(i.content[c]);
                }
            }
        );
    }

    // Remove the link to raw JSON
    target.querySelector('.temp').remove();
}