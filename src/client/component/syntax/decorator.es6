// decorate lines
// put some annotation properties to page.lines

import clone from "clone";

export function getBlock(lines, start, func){
  const indent = lines[start].indent;
  const block = {
    indent, start, end: start,
    get length(){ return this.end - this.start + 1; }
  };
  if(typeof func === "function") func(lines[start]);
  for(let i = start+1; i < lines.length; i++){
    let line = lines[i];
    if(indent >= line.indent) break;
    if(typeof func === "function") func(line);
    block.end = i;
  }
  return block;
}

export function decorateLines(lines){
  const _lines = clone(lines);
  codeblock(_lines);
  showUserIcon(_lines);
  cli(_lines);
  return _lines;
}

function cli(lines){
  for(let line of lines){
    const m = line.value.match(/^([\%\$]) (.+)/);
    if(m){
      const [, prefix, command] = m;
      line.cli = {prefix, command};
    }
  }
}

function detectCodeblockStart(str){
  const m = str.match(/^code:(.+)$/);
  if(m){
    const [, filename] = m;
    const lang = m[1].split('.').pop();
    if(lang === filename) return {lang};
    return {filename, lang};
  }
  return {};
}

function codeblock(lines){
  let lang, indent;
  for(let i = 0; i < lines.length; i++){
    let {filename, lang} = detectCodeblockStart(lines[i].value);
    if(lang){
      let block = getBlock(lines, i, (line) => {
        line.codeblock = {lang, filename, start: false};
      });
      lines[i].codeblock.start = true;
      i = block.end;
    }
  }
}

function showUserIcon(lines){
  for(let i = 0; i < lines.length; i++){
    lines[i].showUserIcon =
      ((position) => {
        if(position < 1) return true;
        const currentLine = lines[position];
        if(!currentLine.user) return false;
        for(let i = position-1; i >= 0; i--){
          let line = lines[i];
          if(line.indent <= currentLine.indent){
            if(line.user === currentLine.user) return false;
            if(line.user !== currentLine.user) return true;
          }
          if(line.indent < 1) break;
        }
        return true;
      })(i);
  }
}

