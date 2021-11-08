const d = document;
const url = "http://dousiyoumonai.jf.land.to/img/teiki/";
const headerTitle = "宇宙一般";

const root = d.createElement("div");
const wrapper = d.createElement("div");

const createHeader = function(config) {
  const h = d.createElement("header");
  const a = d.createElement("a");
  a.textContent = headerTitle;
  a.href = config.rootPath;
  h.appendChild(a);
  return h;
};

const createNav = function(config) {
  const n = d.createElement("nav");
  const ol = d.createElement("ol");
  const crumbs = config.crumbs;
  for(let i = 0; i < crumbs.length; i++) {
    const li = d.createElement("li");
    const a = d.createElement("a");
    if(i > 0) li.textContent = ">";
    a.textContent = crumbs[i].text;
    a.href = crumbs[i].path;
    li.appendChild(a);
    ol.appendChild(li);
  }
  n.appendChild(ol);
  return n;
};

const createMain = function(config) {
  const m = d.createElement("main");
  const c = config.content;
  for(let i = 0; i < c.length; i++) {
    const key = c[i];
    const prof = contentObj[key](config.inner[key], config);
    m.appendChild(prof);
  }
  return m;
};

const createFooter = function() {
  const f = d.createElement("footer");
  f.textContent = "© 2021 ssz.";
  return f;
};

const createContent = function(config) {
  const h = createHeader(config);
  const n = createNav(config);
  const m = createMain(config);
  const f = createFooter();
  return [h, n, m, f];
};

const wrapperAppendChilds = function(elems) {
  for(let i = 0; i < elems.length; i++) wrapper.appendChild(elems[i]);
};

const profBlock = function(text, fn) {
  const prof = d.createElement("div");
  const detail = d.createElement("div");
  const h3 = d.createElement("h3");
  const inner = d.createElement("div");
  prof.classList.add("prof");
  detail.classList.add("prof-detail");
  inner.classList.add("prof-inner");
  h3.textContent = text;
  fn(inner);
  detail.appendChild(h3);
  detail.appendChild(inner);
  prof.appendChild(detail);
  return prof;
};

const main = function(config) {
  if(arguments.length > 1) {
    for(let i = 1; i < arguments.length; i++) {
      const o = arguments[i];
      if(!!o) innerMerge(config, o);
    }
  }
  wrapperAppendChilds(createContent(config));
  d.body.appendChild(root);
};

const innerMerge = function(config, object) {
  Object.keys(object.inner).forEach(key => {
    config.inner[key] = object.inner[key];
  });
};

const contentObj = {};

contentObj.title = function(conf) {
  const div = d.createElement("div");
  const ol = d.createElement("ol");
  for(let i = 0; i < conf.length; i++) {
    const t = conf[i];
    const li = d.createElement("li");
    const a = d.createElement("a");
    a.textContent = t[0];
    a.href = t[1];
    li.appendChild(a);
    ol.appendChild(li);
  }
  div.id = "title";
  div.appendChild(ol);
  return div;
};

contentObj.header = function(conf) {
  const h1 = d.createElement("h1");
  h1.textContent = conf;
  return h1;
};

contentObj.name = function(conf) {
  const h2 = d.createElement("h2");
  h2.textContent = conf;
  return h2;
};

contentObj.top = function(conf) {
  return profBlock("プロフィール絵", inner => {
    for(let i = 0; i < conf.length; i++) {
      const img = d.createElement("img");
      const ia = conf[i];
      img.width = ia[1];
      img.height = ia[2];
      img.src = url + ia[0];
      inner.appendChild(img);
    }
  });
};

contentObj.icon = function(conf) {
  return profBlock("アイコン", inner => {
    for(let i = 0; i < conf.url.length; i++) {
      const row = conf.url[i];
      const div = d.createElement("div");
      div.classList.add("icons");
      for(let j = 0; j < row.length; j++) {
        const img = d.createElement("img");
        img.width = conf.width;
        img.height = conf.height;
        img.src = url + row[j];
        div.appendChild(img);
      }
      inner.appendChild(div);
    }
  });
};

contentObj.cutin = function(conf) {
  return profBlock("カットイン", inner => {
    for(let i = 0; i < conf.length; i++) {
      const img = d.createElement("img");
      const ia = conf[i];
      img.width = ia[1];
      img.height = ia[2];
      img.src = url + ia[0];
      inner.appendChild(img);
    }
  });
};

contentObj.prof = function(conf, config) {
  return profBlock("プロフィール", inner => {
    inner.innerHTML = textAnalysis(conf, config);
  });
};

contentObj.text = function(conf, config) {
  return profBlock("テキスト", inner => {
    inner.innerHTML = textAnalysis(conf, config);
  });
};

contentObj.diary = function(conf) {
  return profBlock("日記", inner => {
    const div = d.createElement("div");
    const ol = d.createElement("ol");
    for(let i = 0; i < conf.length; i++) {
      const link = conf[i];
      const li = d.createElement("li");
      const a = d.createElement("a");
      a.textContent = link[0];
      a.href = link[1];
      li.appendChild(a);
      ol.appendChild(li);
    }
    div.id = "diary";
    div.appendChild(ol);
    inner.appendChild(div);
  });
};

const textAnalysis = function(text, config) {
  const texts = text.split(/\n/);
  const arr = [];
  const br = "<br>";
  for(let i = 0; i < texts.length; i++) {
    const str = texts[i];
    const o = checkMessage(str);
    if(!!o) {
      const img = getIcon(o.icon, config.inner.icon);
      const outer = talkObj[o.type](img, config.inner.icon, o);
      arr.push(outer + br);
    } else {
      arr.push(escapeChar(str) + br);
    }
  }
  return arr.join("");
};

const escapeChar = function(str) {
  return str.replace(/[&<>"`']/g, match => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#x27;",
      '"': "&quot;",
      "`": "&#x60;"
    }[match];
  });
};

const checkMessage = function(str) {
  if(/^\/[I|T]\d+\//.test(str)) {
    const t = str.split(/^\/(I|T)(\d+)\//);
    switch (t[1]) {
      case 'I': {
        return {"type": t[1], "icon": parseInt(t[2], 10)};
      }
      case 'T': {
        const match = t[3].match(/~\//i);
        if(match) {
          const s1 = t[3].slice(0, match.index);
          const s2 = t[3].slice(match.index+2, t[3].length);
          return {"type": t[1], "icon": parseInt(t[2], 10), "name": s1, "msg": s2};
        }
        return {"type": t[1], "icon": parseInt(t[2], 10), "msg": t[3]};
      }
    }
  }
  return null;
};


const getIcon = function(iconNum, icon) {
  if(iconNum < 1) return null;
  const column = Math.floor(iconNum / 10);
  const row = (iconNum - 1) % 10;
  const img = d.createElement("img");
  img.width = icon.width;
  img.height = icon.height;
  img.src = url + icon.url[column][row];
  return img;
};

const talkObj = {};

talkObj.I = function(img, icon, obj) {
  const imgOuter = !!img ? img.outerHTML : "";
  return `
    <div class="talk-i">
      <div style="width:${icon.width}px;height:${icon.height}px;">
        ${imgOuter}
      </div>
    </div>
  `;
};

talkObj.T = function(img, icon, obj) {
  const imgOuter = !!img ? img.outerHTML : "";
  const name = !!obj.name ? `<span class="talk-t_name">${escapeChar(obj.name)}</span><br>` : "";
  return `
    <div class="talk-t">
      <div style="width:${icon.width}px;height:${icon.height}px;">
        ${imgOuter}
      </div>
      <div class="talk-t_msg">
        ${name}${escapeChar(obj.msg)}
      </div>
    </div>
  `;
};

root.id = "root";
wrapper.id = "wrapper";

root.appendChild(wrapper);

export {main};
