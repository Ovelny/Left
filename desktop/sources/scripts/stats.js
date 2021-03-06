"use strict";

function Stats()
{
  this.el = document.createElement('stats');

  this.install = function(host)
  {
    host.appendChild(this.el);
  }
  
  this.update = function(special = "")
  {
    if(left.insert.is_active){
      this.el.innerHTML = left.insert.status();
      return;
    }

    if(left.textarea_el.selectionStart != left.textarea_el.selectionEnd){
      this.el.innerHTML = this._selection();
    }
    else if(left.synonyms){
      this.el.innerHTML = this._synonyms();
    }
    else if(left.selection.word && left.suggestion){
      this.el.innerHTML = this._suggestion();
    }
    else if(left.selection.url){
      this.el.innerHTML = this._url();
    }
    else{
      this.el.innerHTML = this._default();
    }
  }

  this._default = function()
  {
    let stats = this.parse(left.selected());
    let date = new Date();
    return `${stats.l}L ${stats.w}W ${stats.v}V ${stats.c}C ${stats.p}% <span class='right'>${date.getHours()}:${date.getMinutes()}</span>`
  }

  this._synonyms = function()
  {
    let underlinedSyn = left.synonyms[left.selection.index];
    let html = `<b>${left.selection.word}</b> `

    for(let id in left.synonyms){
      let w = left.synonyms[id];
      html += parseInt(id) == left.selection.index ? `<i>${w}</i> ` : `${w} `;
    }
    return html.trim()
  }

  this._suggestion = function()
  {
    return `<t>${left.selection.word}<b>${left.suggestion.substr(left.selection.word.length,left.suggestion.length)}</b></t>`;
  }

  this._selection = function()
  {
    return `<b>[${left.textarea_el.selectionStart},${left.textarea_el.selectionEnd}]</b> ${this._default()}`
  }

  this._url = function()
  {
    let date = new Date();
    return `Open <b>${left.selection.url}</b> with &lt;c-b&gt; <span class='right'>${date.getHours()}:${date.getMinutes()}</span>`;
  }

  this.on_scroll = function()
  {
    let scroll_distance = left.textarea_el.scrollTop;
    let scroll_max = left.textarea_el.scrollHeight - left.textarea_el.offsetHeight;
    let ratio = Math.min(1, (scroll_max == 0) ? 0 : (scroll_distance / scroll_max));
    let progress = ["|","|","|","|","|","|","|","|","|","|"].map((v,i) => { return i < ratio * 10 ? "<b>|</b>" : v }).join("")

    this.el.innerHTML = `${progress} ${(ratio * 100).toFixed(2)}%`
  }

  this.parse = function(text = left.textarea_el.value)
  {
    text = text.length > 5 ? text.trim() : left.textarea_el.value;

    let h = {};
    let words = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(" ");
    for(let id in words){
      h[words[id]] = 1
    }

    let stats = {};
    stats.l = text.split(EOL).length; // lines_count
    stats.w = text.split(" ").length; // words_count
    stats.c = text.length; // chars_count
    stats.v = Object.keys(h).length;
    stats.p = stats.c > 0 ? clamp((left.textarea_el.selectionEnd/stats.c)*100,0,100).toFixed(2) : 0
    return stats;
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}
