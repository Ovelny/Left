"use strict";

function Navi()
{
  this.el = document.createElement('navi');

  this.install = function(host)
  {
    host.appendChild(this.el);
  }

  this.update = function()
  {
    let html = ""
    let current = this.marker()

    for(let pid in left.project.pages){
      let page = left.project.pages[pid];
      if(!page){ continue; }
      html += this._page(pid,page);
      let markers = page.markers();
      for(let i in markers){
        let marker = markers[i]
        html += this._marker(pid,current,marker,markers);
      }
    }
    this.el.innerHTML = html;
  }

  this._page = function(id,page)
  {
    return `<li class='page ${left.project.index == id ? 'active' : ''} ${left.project.pages[id].has_changes() ? 'changes' : ''}' onclick='left.go.to_page(${id})'>${page.name()}</li>`;
  }

  this._marker = function(pid,current,marker,markers)
  {
    return `<li class='marker ${marker.type} ${current && current.line == marker.line ? 'active' : ''}' onclick='left.go.to_page(${pid}, ${marker.line})'><span>${marker.text}</span></li>`;
  }

  this.next_page = function()
  {
    let page = clamp(parseInt(left.project.index)+1,0,left.project.pages.length-1)
    left.go.to_page(page,0);
  }

  this.prev_page = function()
  {
    let page = clamp(parseInt(left.project.index)-1,0,left.project.pages.length-1)
    left.go.to_page(page,0);
  }

  this.next_marker = function()
  {
    let page = clamp(parseInt(left.project.index),0,left.project.pages.length-1)
    let marker = this.marker();

    if(!marker){ return; }

    let markers = left.project.page().markers();
    let next_index = clamp(marker.id+1,0,markers.length-1);

    left.go.to_page(page,markers[next_index].line);
  }

  this.prev_marker = function()
  {
    let page = clamp(parseInt(left.project.index),0,left.project.pages.length-1)
    let marker = this.marker();

    if(!marker){ return; }
    
    let markers = left.project.page().markers();
    let next_index = clamp(marker.id-1,0,markers.length-1);

    left.go.to_page(page,markers[next_index].line);
  }

  this.marker = function()
  {
    if(!left.project.page()){ return []; }

    let markers = left.project.page().markers();
    let pos = left.active_line_id();

    if(markers.length < 1){ return; }

    let prev = null;
    for(let id in markers){
      let marker = markers[id];
      if(marker.line > pos){ return markers[parseInt(id)-1]; }
    }
    return markers[markers.length-1];
  }

  this.on_scroll = function()
  {
    let scroll_distance = left.textarea_el.scrollTop;
    let scroll_max = left.textarea_el.scrollHeight - left.textarea_el.offsetHeight;
    let scroll_perc = Math.min(1, (scroll_max == 0) ? 0 : (scroll_distance / scroll_max));
    let navi_overflow_perc = Math.max(0, (left.navi.el.scrollHeight / window.innerHeight) - 1);

    left.navi.el.style.transform = "translateY(" + (-100 * scroll_perc * navi_overflow_perc) + "%)";
  }

  this.toggle = function()
  {
    document.body.classList.toggle('mobile');
  }

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
}
