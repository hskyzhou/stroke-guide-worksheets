const $ = (id) => document.getElementById(id);
const ids = ['worksheetType','letterCase','letterLayout','content','showEndpoints','showStrokeOrder','strokeOrderSize','progressivePractice','focusStrokeEnabled','focusSelections','showPinyin','blankRows','blankCols','gridType','gridSize','rowGap','margin','fontFamily','fontWeight','fontSize','verticalOffset','traceMode','traceCount','traceColor','lineColor'];
const defaults = Object.fromEntries(ids.map(id => [id, $(id).type === 'checkbox' ? $(id).checked : $(id).value]));
const cache = new Map();
let renderToken = 0;
let renderFrame = 0;
const fonts = { kai:'KaiTi, STKaiti, serif', song:'SimSun, "Songti SC", serif', hei:'"PingFang SC", "Microsoft YaHei", sans-serif', primary:'"Patrick Hand", "Comic Sans MS", "Chalkboard SE", cursive', school:'"Comic Sans MS", "Chalkboard SE", "Chalkboard", cursive', arial:'Arial, sans-serif', rounded:'"Arial Rounded MT Bold", "Avenir Next", sans-serif' };

function syncViewportChrome() {
  const topbar=document.querySelector('.topbar'), footer=document.querySelector('.site-footer');
  if(topbar)document.documentElement.style.setProperty('--topbar-height',`${Math.ceil(topbar.getBoundingClientRect().height)}px`);
  if(footer)document.documentElement.style.setProperty('--footer-height',`${Math.ceil(footer.getBoundingClientRect().height)}px`);
}
const chromeObserver=new ResizeObserver(syncViewportChrome);
['.topbar','.site-footer'].forEach(selector=>{const element=document.querySelector(selector);if(element)chromeObserver.observe(element);});
syncViewportChrome();

const infoPages = {
  support: { title:'支持起收笔字帖', content:`<div class="support-hero"><span class="support-heart" aria-hidden="true">♡</span><div><h3>让免费字帖持续更新</h3><p>如果这个工具对你有帮助，可以自愿支持项目。无论是否支持，所有基础字帖功能都可以继续免费使用。</p></div></div><div class="support-use"><h3>支持将用于</h3><div><span>服务器与域名</span><span>教材字表整理</span><span>书写顺序校对</span><span>打印体验维护</span></div></div><div class="support-options"><section class="support-qr-section"><div class="support-section-title"><div><h3>国内支持</h3><p>使用微信扫描赞赏码</p></div><span class="wechat-label">微信赞赏</span></div><img class="support-qr" src="./assets/support/wechat-appreciation.jpg" alt="周文的微信赞赏码" width="1152" height="1152"><p class="support-check">付款前请核对微信显示的收款方信息。</p></section><section class="support-global-section"><span class="support-globe" aria-hidden="true">◎</span><h3>海外支持</h3><p>Support this project securely through Ko-fi and PayPal.</p><a class="kofi-button" href="https://ko-fi.com/hskylab" target="_blank" rel="noopener noreferrer">Support via Ko-fi <span aria-hidden="true">↗</span></a><small>支持页面将在新窗口打开</small></section></div><p class="support-footnote">支持完全自愿，不构成商品购买、会员订阅或公益慈善募捐。</p>` },
  feedback: { title:'反馈与建议', content:`<div class="info-lead"><span class="info-badge">欢迎反馈</span><p>发现字表、笔顺或打印问题，或者有功能建议，可以提交 GitHub Issue 或发送邮件。信息越完整，越容易复现和处理。</p></div><div class="feedback-topics"><span>字表纠错</span><span>笔顺纠错</span><span>打印问题</span><span>功能建议</span></div><section class="feedback-guide"><h3>建议在邮件中写明</h3><ul><li>问题所属模式：中文、英文或数字字帖</li><li>操作步骤、当前结果和期望结果</li><li>浏览器、系统、设备，以及必要的页面截图</li><li>教材纠错请注明出版社、版次、印次、年级、册次和页码</li></ul></section><div class="info-actions"><a class="feedback-email" href="https://github.com/hskyzhou/stroke-guide-worksheets/issues/new/choose" target="_blank" rel="noopener noreferrer">在 GitHub 提交反馈 <span>Issues ↗</span></a><a class="info-action" href="mailto:xezw211@gmail.com?subject=%E8%B5%B7%E6%94%B6%E7%AC%94%E5%AD%97%E5%B8%96%E5%8F%8D%E9%A6%88">发送反馈邮件 <span>xezw211@gmail.com</span></a></div><p class="feedback-privacy">请勿在邮件或截图中包含学生姓名、学校、联系方式等个人信息；安全漏洞请在标题中注明“安全问题”，且不要公开披露细节。</p>` },
  license: { title:'AGPL-3.0 开源许可', content:`<div class="info-lead"><span class="info-badge">开源</span><p>本项目拥有权利的原创程序代码采用 GNU Affero General Public License v3.0。你可以运行、研究、修改、复制、分发和商业使用这些代码，但必须遵守许可证条件。</p></div><div class="info-grid"><section class="info-card"><h3>你可以做什么</h3><ul><li>个人或商业使用</li><li>查看并修改源代码</li><li>复制和重新发布</li><li>部署自己的在线版本</li></ul></section><section class="info-card"><h3>发布或部署修改版时</h3><ul><li>保留版权、许可及免责声明</li><li>向接收者提供相应源代码</li><li>许可覆盖的衍生作品继续遵守 AGPL-3.0</li><li>允许远程用户免费取得运行版本的相应源码</li></ul></section></div><div class="info-note"><strong>许可边界与免责声明</strong><p>项目名称、标识、教材相关内容，以及第三方字体和笔画数据适用各自的权利与许可说明。本程序按现状提供，不附带许可证所述的任何担保。页面摘要仅用于帮助理解，发生差异时以完整英文许可证为准。</p></div><a class="info-action" href="https://github.com/hskyzhou/stroke-guide-worksheets" target="_blank" rel="noopener noreferrer">查看项目源代码 <span>GitHub ↗</span></a><details class="license-details" id="fullLicense"><summary>查看完整英文许可证</summary><pre class="license-text">展开后载入法律原文…</pre></details>` },
  privacy: { title:'隐私与网络请求', content:`<div class="info-lead"><span class="info-badge">本地优先</span><p>字帖在浏览器中生成。当前版本没有账户、广告、访问统计，也不会把输入内容发送到项目自己的服务器。</p></div><div class="info-grid"><section class="info-card"><h3>保存在当前浏览器</h3><ul><li>输入的练习文字</li><li>字帖排版与书写设置</li><li>自定义配置名称和配置内容</li></ul><p>这些内容保存在 localStorage 中。可通过“重置默认配置”和删除已保存配置清理，也可清除该网站的浏览器数据。</p></section><section class="info-card"><h3>网站本地资源</h3><ul><li>Patrick Hand 英文字体</li><li>pinyin-pro 拼音库</li><li>Hanzi Writer Data 汉字笔画库</li></ul><p>这些资源随网站部署并从同一站点加载，页面启动时不需要连接 Google Fonts、jsDelivr 或外部笔画服务。</p></section></div><div class="info-note"><strong>外部链接与其他部署版本</strong><p>只有点击 Ko-fi、数据来源或其他外部链接后才会访问对应网站。其他部署者如果加入统计、广告、账户或服务端功能，应提供与其实际处理方式一致的隐私说明。</p></div>` },
  'third-party': { title:'第三方材料说明', content:`<div class="info-lead"><span class="info-badge">许可边界</span><p>以下资源不属于项目原创程序代码，仍适用各自作者提供的许可证和版权声明。</p></div><div class="dependency-list"><section class="dependency-card"><div><h3>Patrick Hand</h3><span>英文字帖默认字体 · 本地加载</span></div><b>OFL-1.1</b><p>字体文件和 OFL.txt 已保存在 assets/vendor/patrick-hand/，再分发时应保留许可证与版权信息。</p></section><section class="dependency-card"><div><h3>pinyin-pro 3.18.2</h3><span>汉字拼音转换 · 本地加载</span></div><b>MIT</b><p>浏览器版本、package.json 和 LICENSE 已保存在 assets/vendor/pinyin-pro/，再分发时应保留 MIT 许可证与版权声明。</p></section><section class="dependency-card"><div><h3>Hanzi Writer Data 2.0.1</h3><span>汉字笔画轮廓、中线与顺序</span></div><b>ARPHIC</b><p>完整数据随网站保存并按需加载。再分发或修改前，请阅读数据目录内随附的 ARPHICPL.TXT。</p></section><section class="dependency-card"><div><h3>设备系统字体</h3><span>Arial、楷体、宋体、黑体等</span></div><b>系统提供</b><p>仓库不包含这些字体文件；实际显示和使用许可取决于用户设备所安装的字体。</p></section></div><div class="info-note"><strong>教材字表</strong><p>教材预设是按会写字表整理的选择数据，不包含课文、插图或整本教材扫描件。不同版次可能存在差异，项目不对第三方教材内容作再授权。</p></div>` },
  contributing: { title:'参与贡献', content:`<div class="info-lead"><span class="info-badge">欢迎参与</span><p>可以帮助修正教材字表、书写顺序和打印问题，也欢迎改进界面、兼容性和代码。</p></div><ol class="contribution-steps"><li><b>说明问题</b><span>写明字帖类型、使用的设置、浏览器、实际结果和期望结果。</span></li><li><b>提供依据</b><span>字表或笔顺纠错请注明出版社、版次、印次、年级、册次和页码。</span></li><li><b>验证修改</b><span>检查中文、英文、数字模式，以及桌面、窄屏和 A4 打印预览。</span></li><li><b>说明权利</b><span>代码或材料贡献需注明来源和许可证，并确认有权提交。</span></li></ol><div class="info-note"><strong>请勿提交</strong><p>真实学生信息、整本教材扫描件、来源不明的字体、商业素材或无权再分发的内容。</p></div><div class="info-actions"><a class="feedback-email" href="https://github.com/hskyzhou/stroke-guide-worksheets/issues/new/choose" target="_blank" rel="noopener noreferrer">提交 Issue <span>GitHub ↗</span></a><a class="info-action" href="mailto:xezw211@gmail.com?subject=%E8%B5%B7%E6%94%B6%E7%AC%94%E5%AD%97%E5%B8%96%E8%B4%A1%E7%8C%AE">联系维护者 <span>xezw211@gmail.com</span></a></div>` }
};

async function loadFullLicense(details){
  if(!details.open||details.dataset.loaded)return;
  const text=details.querySelector('.license-text');details.dataset.loaded='true';
  try {const response=await fetch('./LICENSE');if(!response.ok)throw new Error();text.textContent=await response.text();}
  catch {text.textContent='许可证原文暂时无法载入，请查看项目根目录中的 LICENSE 文件。';}
}
function openInfoDialog(key) {
  const page=infoPages[key];if(!page)return;
  const dialog=$('infoDialog'), body=$('infoDialogBody');
  $('infoDialogTitle').textContent=page.title;body.className='info-dialog-body';body.innerHTML=page.content;
  body.querySelector('#fullLicense')?.addEventListener('toggle',event=>loadFullLicense(event.currentTarget));
  dialog.showModal();body.scrollTop=0;
}
document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>openInfoDialog(button.dataset.info)));
$('closeInfoDialog').addEventListener('click',()=>$('infoDialog').close());
$('infoDialog').addEventListener('click',event=>{if(event.target===$('infoDialog'))$('infoDialog').close();});

function state() { return Object.fromEntries(ids.map(id => [id, $(id).type === 'checkbox' ? $(id).checked : $(id).value])); }
function saveSettings() {
  try { localStorage.setItem('stroke-worksheet-settings',JSON.stringify(state())); return true; }
  catch { return false; }
}
function restore() { try { const saved = JSON.parse(localStorage.getItem('stroke-worksheet-settings') || '{}'); for (const id of ids) if (id in saved) $(id).type === 'checkbox' ? $(id).checked = !!saved[id] : $(id).value = saved[id]; if(['uppercase','lowercase'].includes(saved.worksheetType)){$('worksheetType').value='letters';$('letterCase').value=saved.worksheetType;} if($('worksheetType').value==='letters' && (!saved.fontFamily||saved.fontFamily==='school'))$('fontFamily').value='primary'; if(!$('showStrokeOrder').checked) $('showEndpoints').checked=false; $('rowGap').value=Math.max(2,Number($('rowGap').value)||2); if(!saved.focusSelections && saved.focusChar) $('focusSelections').value=JSON.stringify({[saved.focusChar]:[Number(saved.focusStroke)||1]}); } catch {} }
function isHanzi(char) { return /\p{Script=Han}/u.test(char); }
const samples={hanzi:'一二三',numbers:'0123456789',uppercase:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lowercase:'abcdefghijklmnopqrstuvwxyz'};
function activeType(){return $('worksheetType').value==='letters'?$('letterCase').value:$('worksheetType').value;}
function updateLetterPicker(cfg){
  const pageMode=cfg.worksheetType==='letters' && cfg.letterLayout==='page';
  $('letterPickerControl').hidden=!pageMode;
  if(!pageMode)return;
  const letters=[...samples[cfg.letterCase]];
  const custom=document.createElement('option');custom.value='';custom.textContent='按输入内容';
  $('letterPicker').replaceChildren(custom,...letters.map(char=>{const option=document.createElement('option');option.value=char;option.textContent=char;return option;}));
  const selected=practiceChars(cfg.content,cfg.letterCase);
  $('letterPicker').value=selected.length===1?selected[0]:'';
}
function practiceChars(text,type='hanzi') { const match={hanzi:isHanzi,numbers:char=>/[0-9]/.test(char),uppercase:char=>/[A-Z]/.test(char),lowercase:char=>/[a-z]/.test(char)}[type]||isHanzi;return [...text].filter(match); }
function selectedFocusStrokes() {
  try {
    const value=JSON.parse($('focusSelections').value);
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    return Object.fromEntries(Object.entries(value).map(([char,strokes])=>[char,Array.isArray(strokes)?[...new Set(strokes.map(Number).filter(n=>Number.isInteger(n)&&n>0))]:[]]).filter(([,strokes])=>strokes.length));
  } catch { return {}; }
}
function updateFocusStrokes(selections) {
  $('focusSelections').value=JSON.stringify(selections);
  scheduleRender();
}
let expandedFocusChars=new Set(), focusChoicesInitialized=false;
function renderFocusChoices(chars,dataList) {
  const selections=selectedFocusStrokes(), unique=[...new Set(chars)];
  expandedFocusChars=new Set([...expandedFocusChars].filter(char=>unique.includes(char)));
  if(!focusChoicesInitialized&&unique.length){
    Object.keys(selections).forEach(char=>expandedFocusChars.add(char));
    if(!expandedFocusChars.size)expandedFocusChars.add(unique[0]);
    focusChoicesInitialized=true;
  }
  const items=unique.map(char=>{
    const data=dataList[chars.indexOf(char)], selected=Array.isArray(selections[char])?selections[char]:[];
    const item=document.createElement('div');item.className='focus-char-item';
    if(selected.length)item.classList.add('has-selection');
    const expanded=expandedFocusChars.has(char);
    const summary=document.createElement('button');summary.type='button';summary.className='focus-char-summary';summary.disabled=!data;
    summary.setAttribute('aria-expanded',expanded);summary.setAttribute('aria-controls',`focus-strokes-${char.codePointAt(0)}`);
    summary.innerHTML=`<span class="focus-char-glyph">${char}</span><span class="focus-char-meta">${data?`${data.strokes.length} 笔 · ${selected.length?`已选 ${selected.length} 笔`:'未选择'}`:'无笔画数据'}</span><span class="focus-char-chevron" aria-hidden="true"></span>`;
    summary.addEventListener('click',()=>{if(expandedFocusChars.has(char))expandedFocusChars.delete(char);else expandedFocusChars.add(char);renderFocusChoices(chars,dataList);});
    item.append(summary);
    if(data){
      const panel=document.createElement('div');panel.className='focus-char-panel';panel.id=`focus-strokes-${char.codePointAt(0)}`;panel.hidden=!expanded;
      const actions=document.createElement('div');actions.className='focus-char-actions';
      const selectAll=document.createElement('button');selectAll.type='button';selectAll.textContent='全选笔画';selectAll.addEventListener('click',()=>updateFocusStrokes({...selectedFocusStrokes(),[char]:data.strokes.map((_,i)=>i+1)}));
      const clear=document.createElement('button');clear.type='button';clear.textContent='清空';clear.disabled=!selected.length;clear.addEventListener('click',()=>{const next=selectedFocusStrokes();delete next[char];updateFocusStrokes(next);});
      actions.append(selectAll,clear);
      const strokes=document.createElement('div');strokes.className='focus-stroke-choices';strokes.setAttribute('role','group');strokes.setAttribute('aria-label',`${char}的笔画`);
      data.strokes.forEach((_,index)=>{
        const number=index+1, stroke=document.createElement('button');stroke.type='button';stroke.className='focus-stroke-choice';stroke.textContent=`${number}`;
        stroke.setAttribute('aria-label',`${char}第${number}笔`);stroke.setAttribute('aria-pressed',selected.includes(number));
        stroke.addEventListener('click',()=>{const next=selectedFocusStrokes();const set=new Set(next[char]||[]);if(set.has(number))set.delete(number);else set.add(number);if(set.size)next[char]=[...set].sort((a,b)=>a-b);else delete next[char];updateFocusStrokes(next);});
        strokes.append(stroke);
      });
      panel.append(actions,strokes);item.append(panel);
    }
    return item;
  });
  $('focusCharChoices').replaceChildren(...items);
}
let curriculumSelection = new Set();
function selectedCurriculumBook(){return curriculumByGrade[$('curriculumGrade').value][$('curriculumTerm').value];}
function selectedLesson() { return selectedCurriculumBook()[Number($('curriculumLesson').value)]; }
function updateCurriculumStatus() {
  const count=[...selectedLesson()[2]].length;
  $('curriculumStatus').textContent=`本课 ${count} 字 · 已选 ${curriculumSelection.size} 字`;
  $('loadCurriculum').disabled=curriculumSelection.size===0;
}
function renderCurriculumCharacters() {
  const chars=[...selectedLesson()[2]];
  curriculumSelection=new Set(chars);
  const buttons=chars.map(char=>{
    const button=document.createElement('button');
    button.type='button';button.className='curriculum-character';button.textContent=char;
    button.setAttribute('aria-label',`练习「${char}」`);
    button.setAttribute('aria-pressed',curriculumSelection.has(char));
    button.addEventListener('click',()=>{
      if(curriculumSelection.has(char))curriculumSelection.delete(char);else curriculumSelection.add(char);
      button.setAttribute('aria-pressed',curriculumSelection.has(char));
      updateCurriculumStatus();
    });
    return button;
  });
  $('curriculumCharacters').replaceChildren(...buttons);
  updateCurriculumStatus();
}
function populateCurriculumLessons() {
  const options=selectedCurriculumBook().map(([unit,title,chars],index)=>{
    const option=document.createElement('option');option.value=index;option.textContent=`${unit} · ${title}（${[...chars].length}字）`;return option;
  });
  $('curriculumLesson').replaceChildren(...options);
  renderCurriculumCharacters();
}
function medianPoint(point) { return {x:point[0], y:900-point[1]}; }
function endpointMarkup(median, compact=false) {
  if (!median || median.length < 2) return '';
  const points=median.map(medianPoint);
  const a=points[0], b=points[points.length-1];
  const distances=[0];
  for(let i=1;i<points.length;i++) distances.push(distances[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));
  const total=distances[distances.length-1];
  if(total<1) return '';
  const pointAt=(distance)=>{
    const index=Math.max(1,distances.findIndex(value=>value>=distance));
    const length=distances[index]-distances[index-1]||1;
    const ratio=(distance-distances[index-1])/length;
    return {x:points[index-1].x+(points[index].x-points[index-1].x)*ratio,y:points[index-1].y+(points[index].y-points[index-1].y)*ratio};
  };
  const begin=pointAt(total*.12), tip=pointAt(total*.78), before=pointAt(total*.72);
  const between=points.filter((_,i)=>distances[i]>total*.12 && distances[i]<total*.78);
  const route=[begin,...between,tip];
  const ang=Math.atan2(tip.y-before.y,tip.x-before.x);
  const wing=Math.min(68,Math.max(35,total*.18));
  const size=compact?37:31, stroke=compact?18:16;
  const routePath=route.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const arrowPath=`M ${tip.x} ${tip.y} L ${tip.x-Math.cos(ang-.65)*wing} ${tip.y-Math.sin(ang-.65)*wing} M ${tip.x} ${tip.y} L ${tip.x-Math.cos(ang+.65)*wing} ${tip.y-Math.sin(ang+.65)*wing}`;
  return `<path d="${routePath} ${arrowPath}" fill="none" stroke="white" stroke-width="43" stroke-linecap="round" stroke-linejoin="round"/><path d="${routePath} ${arrowPath}" fill="none" stroke="#2589be" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${a.x}" cy="${a.y}" r="${size}" fill="#299968" stroke="white" stroke-width="${stroke}"/><circle cx="${b.x}" cy="${b.y}" r="${size}" fill="#dc6656" stroke="white" stroke-width="${stroke}"/>`;
}
function pathMarkup(data, count, active=-1, color='#29374a') {
  return data.strokes.slice(0,count).map((d,i)=>`<path d="${d}" fill="${i===active?'#253b56':color}" opacity="${i===active?1:.9}"/>`).join('');
}
function svgGlyph(data, cfg, count=data.strokes.length, numbered=false, small=false) {
  const end=cfg.showEndpoints && data.medians?.[count-1] ? endpointMarkup(data.medians[count-1],!small) : '';
  return `<svg class="glyph-svg" viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${numbered?pathMarkup(data,count,count-1,'#aeb8c6'):pathMarkup(data,count,-1,cfg.traceColor)}</g>${end}${numbered?`<circle cx="845" cy="145" r="145" fill="#eff3f7"/><text x="845" y="203" text-anchor="middle" font-size="170" font-weight="700" fill="#34475f">${count}</text>`:''}</svg>`;
}
function progressiveCell(data,cfg,index) {
  const box=document.createElement('div');
  box.className=`cell grid-${cfg.gridType} progressive-cell${cfg.showPinyin?' pinyin-cell':''}`;
  box.setAttribute('aria-label',`前 ${index+1} 笔，共 ${data.strokes.length} 笔`);
  box.innerHTML=`${traceGlyphSvg(data,cfg,index+1)}<span class="progressive-step-number">${index+1}</span>`;
  return box;
}
function traceGlyphSvg(data,cfg,count=data.strokes.length) {
  const paths=data.strokes.slice(0,count).map(path=>`<path d="${path}" fill="${cfg.traceColor}"/>`).join('');
  return `<svg class="glyph-svg" viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${paths}</g></svg>`;
}
function positionedStrokeSvg(data,index,cfg) {
  return `<svg class="glyph-svg" viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)"><path d="${data.strokes[index]}" fill="${cfg.traceColor}"/></g></svg>`;
}
function focusStrokeRow(char,data,index,cfg,slots) {
  const wrap=document.createElement('div');wrap.className='practice-group focus-stroke-row';
  const label=document.createElement('div');label.className='whole-practice-heading';label.textContent=`第一步 · ${char}第 ${index+1} 笔单练（原字位置与大小）`;
  const line=document.createElement('div');line.className='practice-line';
  for(let n=0;n<slots;n++){
    const box=document.createElement('div');box.className=`cell grid-${cfg.gridType} positioned-stroke-cell`;
    box.innerHTML=positionedStrokeSvg(data,index,cfg);
    line.append(box);
  }
  wrap.append(label,line);return wrap;
}
async function loadData(char) {
  if (cache.has(char)) return cache.get(char);
  const promise=fetch(`./assets/hanzi-writer-data/${encodeURIComponent(char)}.json`)
    .then(r=>{if(!r.ok) throw Error('missing');return r.json()}).then(d=>d?.strokes?.length && d?.medians?.length ? d : null).catch(()=>null);
  cache.set(char,promise);
  return promise;
}
function cell(char, kind, cfg, data, index=0) {
  const c=document.createElement('div');
  c.className=`cell grid-${cfg.gridType} ${kind}`;
  if(cfg.showPinyin) { c.classList.add('pinyin-cell');if(kind!=='blank'){const p=document.createElement('span');p.className='pinyin';p.textContent=pinyinFor(char);c.append(p);} }
  if(kind!=='blank') {
    if(cfg.worksheetType==='letters'){
      c.append(letterGlyph(char,kind,cfg));
    }else if(cfg.progressivePractice && data){
      c.classList.add('practice-glyph-cell');
      c.insertAdjacentHTML('beforeend',traceGlyphSvg(data,cfg));
    }else{
      const g=document.createElement('span');
      g.className='glyph';
      g.textContent=char;
      if(kind==='demo')g.style.color=cfg.traceColor;
      c.append(g);
    }
  }
  return c;
}
const pinyinMap={永:'yǒng',字:'zì',八:'bā',法:'fǎ',你:'nǐ',好:'hǎo',世:'shì',界:'jiè',中:'zhōng',国:'guó',人:'rén',天:'tiān',地:'dì',日:'rì',月:'yuè',山:'shān',水:'shuǐ',一:'yī',二:'èr',三:'sān',大:'dà',小:'xiǎo',上:'shàng',下:'xià',学:'xué',习:'xí',春:'chūn',夏:'xià',秋:'qiū',冬:'dōng'};
function pinyinFor(char) { return window.pinyinPro?.pinyin?.(char) || pinyinMap[char] || ''; }
function setupStyles(cfg) {
  const hanzi=cfg.worksheetType==='hanzi';
  updateLetterPicker(cfg);
  document.title=`${hanzi?'中文':cfg.worksheetType==='numbers'?'数字':'英文'}字帖 · 起收笔字帖`;
  document.querySelectorAll('.type-buttons button').forEach(button=>button.setAttribute('aria-pressed',button.dataset.type===cfg.worksheetType));
  $('letterCaseControl').hidden=cfg.worksheetType!=='letters';
  document.querySelector('.sidebar .panel-section:first-of-type').hidden=!hanzi;
  $('contentLabel').textContent=hanzi?'输入汉字':cfg.worksheetType==='numbers'?'输入数字':'输入字母';
  $('contentHint').textContent=hanzi?'支持多行文字，生成整字练习字帖':'可自行输入，也可载入整套练习';
  $('content').placeholder=hanzi?'输入你想练习的汉字…':cfg.worksheetType==='numbers'?'输入 0–9…':cfg.letterCase==='uppercase'?'输入大写字母 A–Z…':'输入小写字母 a–z…';
  document.querySelectorAll('.sidebar .panel-section:first-of-type .toggle-row, .sidebar .panel-section:first-of-type .legend, #strokeOrderSizeOption, #focusStrokeControls').forEach(el=>el.hidden=!hanzi);
  document.querySelector('.curriculum-picker').hidden=!hanzi;
  const preview=$('previewWrap');
  preview.style.setProperty('--cell-size',`${cfg.gridSize}mm`);
  preview.style.setProperty('--stroke-order-size',`${cfg.strokeOrderSize}mm`);
  preview.style.setProperty('--row-gap',`${cfg.rowGap}mm`);
  preview.style.setProperty('--line-color',cfg.lineColor);
  preview.style.setProperty('--trace-color',cfg.traceColor);
  preview.style.setProperty('--font-scale',Number(cfg.fontSize)/100);
  preview.style.setProperty('--vertical-shift',`${cfg.verticalOffset}%`);
  preview.style.setProperty('--hanzi-font',fonts[cfg.fontFamily]);
  preview.style.setProperty('--hanzi-weight',cfg.fontWeight);
  preview.style.setProperty('--page-margin',`${cfg.margin}mm`);
  $('traceCount').disabled=cfg.traceMode==='auto';
  $('blankColsHint').textContent='开启后，描红字之间留一格；每行末格仍留白。';
  $('focusStrokeControls').hidden=!hanzi||!cfg.focusStrokeEnabled;
  $('endpointOption').hidden=!hanzi||!cfg.showStrokeOrder;
  $('strokeOrderSizeOption').hidden=!hanzi||!cfg.showStrokeOrder;
  $('showEndpoints').disabled=!cfg.showStrokeOrder;
  $('strokeOrderSize').disabled=!cfg.showStrokeOrder;
  for(const id of ['strokeOrderSize','gridSize','rowGap','fontSize','verticalOffset','traceCount']) $(id+'Value').textContent=$(id).value+({strokeOrderSize:'mm',gridSize:'mm',rowGap:'mm',fontSize:'%',verticalOffset:'%',traceCount:''}[id]);
}
function updateFontAvailability(chars,dataList,cfg) {
  const vectorOnly=cfg.worksheetType==='hanzi' && chars.length>0 && cfg.progressivePractice && dataList.every(Boolean);
  const letters=cfg.worksheetType==='letters';
  $('fontFamily').disabled=vectorOnly;
  $('fontWeight').disabled=vectorOnly;
  $('fontSize').disabled=false;
  $('verticalOffset').disabled=false;
  $('fontHint').textContent=letters?'字体、粗细、大小和上下偏移会应用到字母示范与描红；笔顺图只表示书写方向。':cfg.worksheetType==='numbers'?'数字使用所选字体。':vectorOnly?'这些字使用笔画轮廓，字体与粗细不适用；字体大小仍可调整。':!cfg.progressivePractice?'当前整字描红使用所选字体。':'字体与粗细仅影响没有笔画数据的字。';
}
function updatePreviewSummary(chars,preview) {
  const pages=preview.querySelectorAll('.paper').length;
  const traced=preview.querySelectorAll('.cell.trace,.progressive-cell,.practice-glyph-cell,.positioned-stroke-cell').length;
  const blanks=preview.querySelectorAll('.cell.blank').length;
  $('previewSummary').textContent=`${pages} 页 · ${chars.length} 字 · ${traced} 个可描格 · ${blanks} 个空白格`;
}
function createPage(number,compact=false,type='hanzi') {
  const paper=document.createElement('div');
  paper.className='paper';
  if(compact)paper.classList.add('compact-eight');
  if(number===1)paper.id='paper';
  const header=document.createElement('div');
  header.className='paper-header';
  header.innerHTML=`<span>${{hanzi:'汉字',numbers:'数字',uppercase:'大写字母',lowercase:'小写字母'}[type]||'汉字'}书写练习</span><span>姓名：____________　日期：____________</span>`;
  const worksheet=document.createElement('div');
  worksheet.className='worksheet';
  if(number===1)worksheet.id='worksheet';
  const footer=document.createElement('div');
  footer.className='paper-footer';
  footer.innerHTML=`<span>起收笔字帖 · handwriting.hskylab.com</span><span>第 ${number} 页</span>`;
  paper.append(header,worksheet,footer);
  return {paper,worksheet};
}
const directionCues={
  0:['M 27 31 Q 21 39 20 49'],
  2:['M 77 35 Q 77 49 65 60'],
  3:['M 73 44 Q 64 51 53 51'],
  4:['M 20 63 L 42 63'],
  5:['M 29 47 Q 46 40 62 47'],
  6:['M 24 66 Q 28 81 45 85'],
  7:['M 80 17 L 68 39'],
  8:['M 41 49 Q 51 53 62 59'],
  9:['M 70 25 Q 63 18 55 17']
};
function formationPath(char,path){
  if(!/[A-Za-z]/.test(char))return path;
  let coordinate=0;
  return path.replace(/[-+]?\d*\.?\d+/g,value=>{
    const axis=coordinate++%2;
    if(axis===0)return value;
    const y=Number(value);
    const mapped=y<=42?10+(y-15)*30/27:y<=85?40+(y-42)*30/43:70+(y-85)*30/23;
    return String(Math.round(mapped*10)/10);
  });
}
function letterGlyph(char,kind,cfg){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 100 110');
  svg.setAttribute('preserveAspectRatio','none');
  svg.setAttribute('aria-hidden','true');
  svg.classList.add(kind==='hero'?'latin-hero-svg':'latin-practice-svg');
  const glyph=document.createElementNS('http://www.w3.org/2000/svg','text');
  glyph.setAttribute('x','50');
  glyph.setAttribute('y',String(70+Number(cfg.verticalOffset)*.45));
  glyph.setAttribute('text-anchor','middle');
  glyph.setAttribute('font-family',fonts[cfg.fontFamily]||fonts.school);
  glyph.setAttribute('font-size',String(82*Number(cfg.fontSize)/72));
  glyph.setAttribute('font-weight',cfg.fontWeight);
  glyph.textContent=char;
  svg.style.color=kind==='hero'?'#27384d':cfg.traceColor;
  svg.append(glyph);
  return svg;
}
function letterOrderGuide(char,compact=false){
  const strokes=(letterStrokes[char]||[]).map(path=>formationPath(char,path));
  const guide=document.createElement('section');guide.className=`letter-order-guide${compact?' compact-order-guide':''}`;
  const title=document.createElement('div');title.className='letter-order-title';title.textContent=compact?`书写顺序 · ${strokes.length} 笔`:`书写顺序 · ${strokes.length} 笔（绿点起笔，箭头指向收笔）`;
  const steps=document.createElement('div');steps.className='letter-order-steps';
  strokes.forEach((stroke,index)=>{
    const step=document.createElement('div');step.className='letter-order-step';
    const label=document.createElement('span');label.textContent=`第 ${index+1} 笔`;
    const start=stroke.match(/^M\s*([\d.]+)\s+([\d.]+)/);
    const previous=strokes.slice(0,index).map(path=>`<path d="${path}" class="letter-prior-stroke"/>`).join('');
    const dot=start?`<circle cx="${start[1]}" cy="${start[2]}" r="4.5" class="letter-start-dot"/>`:'';
    const directionCue=(directionCues[char]?.[index] ? `<path d="${directionCues[char][index]}" class="letter-direction-cue" marker-end="url(#arrow-${char}-${index})"/>` : '');
    step.innerHTML=`<svg viewBox="0 0 100 ${/[A-Za-z]/.test(char)?110:115}" role="img" aria-label="${char} 第 ${index+1} 笔的方向"><defs><marker id="arrow-${char}-${index}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#2589be"/></marker></defs>${previous}<path d="${stroke}" class="letter-active-stroke" marker-end="url(#arrow-${char}-${index})"/>${directionCue}${dot}</svg>`;
    step.prepend(label);steps.append(step);
  });
  guide.append(title,steps);return guide;
}
function renderLetterPages(chars,cfg,preview,slots,type){
  preview.replaceChildren();
  const margin=Number(cfg.margin),size=Number(cfg.gridSize),gap=Number(cfg.rowGap);
  const rows=Math.max(4,Math.min(20,Math.floor((297-2*margin-86)/(size+gap+3))));
  chars.forEach((char,index)=>{
    const {paper,worksheet}=createPage(index+1,false,type);
    paper.classList.add('letter-page');
    paper.querySelector('.paper-header span:first-child').textContent=`字母 ${char} · 书写练习`;
    const hero=document.createElement('div');hero.className='letter-page-hero';
    const exemplar=document.createElement('span');exemplar.className='letter-page-exemplar';exemplar.append(letterGlyph(char,'hero',cfg));
    const intro=document.createElement('div');intro.innerHTML='<strong>先描红，再自己写</strong><small>每一行都练习同一个字母</small>';
    hero.append(exemplar,intro);worksheet.append(hero,letterOrderGuide(char));
    for(let row=0;row<rows;row++){
      const group=document.createElement('div');group.className='letter-page-row';
      const label=document.createElement('div');label.className='practice-label';label.textContent=row===0?'描红练习':row===2?'独立书写':'';
      const line=document.createElement('div');line.className='practice-line';
      for(let col=0;col<slots;col++)line.append(cell(char,col===0?'demo':row<2 && col<slots-2?'trace':'blank',cfg,null));
      group.append(label,line);worksheet.append(group);
    }
    preview.append(paper);
  });
}
async function render() {
  const cfg=state(), token=++renderToken;
  const type=cfg.worksheetType==='letters'?cfg.letterCase:cfg.worksheetType;
  saveSettings();
  if(cfg.worksheetType!=='hanzi')Object.assign(cfg,{showPinyin:false,showStrokeOrder:false,showEndpoints:false,progressivePractice:false,focusStrokeEnabled:false});
  setupStyles(cfg);
  const chars=practiceChars(cfg.content,type);
  const dataList=cfg.worksheetType==='hanzi'?await Promise.all(chars.map(loadData)):chars.map(()=>null);
  if(token!==renderToken) return;
  renderFocusChoices(chars,dataList);
  updateFontAvailability(chars,dataList,cfg);
  const preview=$('previewWrap');
  const compactEight=Number(cfg.gridSize)<=12 && Number(cfg.rowGap)<=2 && Number(cfg.margin)<=12;
  let pageNumber=1, {paper,worksheet}=createPage(pageNumber,compactEight,type);
  preview.replaceChildren(paper);
  if(!chars.length) {worksheet.innerHTML='<p class="hint">在上方输入对应的练习内容，字帖会显示在这里。</p>';updatePreviewSummary(chars,preview);return;}
  const cellPx=Number(cfg.gridSize)*96/25.4;
  const usable=794-2*Number(cfg.margin)*96/25.4;
  const slots=Math.max(3,Math.floor(usable/cellPx));
  if(cfg.worksheetType==='letters' && cfg.letterLayout==='page'){
    renderLetterPages(chars,cfg,preview,slots,type);
    updatePreviewSummary(chars,preview);
    return;
  }
  const appendGroup=(group)=>{
    worksheet.append(group);
    const marginPx=Number(cfg.margin)*96/25.4;
    const bottom=paper.getBoundingClientRect().bottom-marginPx;
    const groupBottom=group.getBoundingClientRect().bottom+parseFloat(getComputedStyle(group).marginBottom);
    if(groupBottom>bottom && worksheet.children.length>1){
      ({paper,worksheet}=createPage(++pageNumber,compactEight,type));
      preview.append(paper);
      worksheet.append(group);
    }
  };
  chars.forEach((char,i)=>{
    const data=dataList[i];
    const selected=cfg.focusStrokeEnabled && data && i===chars.indexOf(char) ? selectedFocusStrokes()[char] : null;
    const focusNumbers=Array.isArray(selected) ? selected.filter(n=>Number.isInteger(n)&&n>=1&&n<=data.strokes.length).sort((a,b)=>a-b) : [];
    const group=document.createElement('div');group.className='practice-group character-group';
    const label=document.createElement('div');label.className='practice-label';label.textContent=`${String(i+1).padStart(2,'0')} · ${char}${cfg.worksheetType==='hanzi' ? data ? `　${data.strokes.length} 笔` : '　笔画数据未覆盖' : ''}`;group.append(label);
    if(cfg.showStrokeOrder && data) {
      const strip=document.createElement('div');strip.className='stroke-strip';
      const count=data.strokes.length;
      for(let n=1;n<=count;n++) { const box=document.createElement('div');box.className='stroke-mini';box.innerHTML=svgGlyph(data,{...cfg,showEndpoints:cfg.showEndpoints},n,true,true);strip.append(box); }
      group.append(strip);
    }
    if(cfg.worksheetType!=='hanzi')group.append(letterOrderGuide(char,true));
    const hasProgressive=cfg.progressivePractice && data;
    if(hasProgressive){
      const heading=document.createElement('div');heading.className='whole-practice-heading';
      heading.textContent=focusNumbers.length?'第二步 · 逐笔加画（每格多一笔） → 第三步 · 整字练习':'第一步 · 逐笔加画（每格多一笔） → 第二步 · 整字练习';
      group.append(heading);
    }
    let line=document.createElement('div');line.className='practice-line';group.append(line);
    const nextLine=()=>{line=document.createElement('div');line.className='practice-line continued-line';group.append(line);};
    if(cfg.traceMode==='auto'){
      const appendPracticeCell=(item)=>{
        if(line.children.length===slots-1){line.append(cell(char,'blank',cfg,data));nextLine();}
        line.append(item);
      };
      if(hasProgressive)data.strokes.forEach((_,index)=>appendPracticeCell(progressiveCell(data,cfg,index)));
      appendPracticeCell(cell(char,'demo',cfg,data));
      while(line.children.length<slots-1){
        line.append(cell(char,'trace',cfg,data));
        if(cfg.blankCols && line.children.length<slots-1)line.append(cell(char,'blank',cfg,data));
      }
      line.append(cell(char,'blank',cfg,data));
    }else{
      const appendCell=(item)=>{
        if(line.children.length===slots)nextLine();
        line.append(item);
      };
      if(hasProgressive)data.strokes.forEach((_,index)=>appendCell(progressiveCell(data,cfg,index)));
      appendCell(cell(char,'demo',cfg,data));
      const trace=Math.min(Number(cfg.traceCount),slots-1);
      for(let n=0;n<trace;n++){appendCell(cell(char,'trace',cfg,data));if(cfg.blankCols && line.children.length<slots)appendCell(cell(char,'blank',cfg,data));}
      while(line.children.length<slots)appendCell(cell(char,'blank',cfg,data));
    }
    if(cfg.blankRows){const gap=document.createElement('div');gap.className='practice-line extra-blank';for(let n=0;n<slots;n++)gap.append(cell(char,'blank',cfg,data));group.append(gap);}
    if(focusNumbers.length){
      const rows=focusNumbers.map(n=>focusStrokeRow(char,data,n-1,cfg,slots));
      // Keep the character title and stroke-order guide attached to the first
      // selected stroke; a page break must not leave that guide behind.
      rows[0].prepend(...[label,group.querySelector('.stroke-strip')].filter(Boolean));
      rows.forEach(appendGroup);
    }
    appendGroup(group);
  });
  updatePreviewSummary(chars,preview);
}

function scheduleRender() {
  if(renderFrame)cancelAnimationFrame(renderFrame);
  renderFrame=requestAnimationFrame(()=>{renderFrame=0;render();});
}
ids.forEach(id=>{
  const onUserChange=()=>{$('saveState').textContent='设置自动保存在本机';scheduleRender();};
  $(id).addEventListener('input',onUserChange);
  $(id).addEventListener('change',onUserChange);
});
$('worksheetType').addEventListener('change',()=>{
  if($('worksheetType').value==='letters'){$('gridType').value='english';$('fontFamily').value='primary';}
  else {if($('gridType').value==='english')$('gridType').value=$('worksheetType').value==='hanzi'?'tian':'square';if(['primary','school'].includes($('fontFamily').value))$('fontFamily').value='kai';}
  $('content').value=$('worksheetType').value==='letters' && $('letterLayout').value==='page'?samples[activeType()][0]:samples[activeType()]||samples.hanzi;
  scheduleRender();
});
document.querySelectorAll('.type-buttons button').forEach(button=>button.addEventListener('click',()=>{
  if($('worksheetType').value===button.dataset.type)return;
  $('worksheetType').value=button.dataset.type;
  $('worksheetType').dispatchEvent(new Event('change',{bubbles:true}));
}));
$('letterCase').addEventListener('change',()=>{
  if($('letterLayout').value==='page'){
    const previousType=activeType()==='uppercase'?'lowercase':'uppercase';
    const previous=practiceChars($('content').value,previousType)[0]||'A';
    $('content').value=activeType()==='uppercase'?previous.toUpperCase():previous.toLowerCase();
  }else $('content').value=samples[activeType()];
  scheduleRender();
});
$('letterLayout').addEventListener('change',()=>{
  if($('letterLayout').value==='page')$('content').value=practiceChars($('content').value,activeType())[0]||samples[activeType()][0];
  else $('content').value=samples[activeType()];
  scheduleRender();
});
$('letterPicker').addEventListener('change',()=>{$('content').value=$('letterPicker').value;scheduleRender();});
$('showStrokeOrder').addEventListener('change',()=>{
  $('showEndpoints').checked=$('showStrokeOrder').checked;
  scheduleRender();
});
const presets={
  recommended:{gridSize:'12',rowGap:'4',margin:'12',strokeOrderSize:'16',showEndpoints:true,showStrokeOrder:true,progressivePractice:true,focusStrokeEnabled:true,showPinyin:true,traceMode:'auto',blankCols:false,blankRows:false},
  tracing:{gridSize:'14',rowGap:'4',margin:'18',strokeOrderSize:'12',showEndpoints:true,showStrokeOrder:true,progressivePractice:false,showPinyin:false,traceMode:'auto',blankCols:false,blankRows:false},
  compact:{gridSize:'12',rowGap:'2',margin:'6',strokeOrderSize:'12',showEndpoints:true,showStrokeOrder:true,progressivePractice:false,showPinyin:false,traceMode:'auto',blankCols:false,blankRows:false}
};
document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{
  for(const [id,value] of Object.entries(presets[button.dataset.preset]))$(id).type==='checkbox'?$(id).checked=value:$(id).value=value;
  $('saveState').textContent=`已应用「${button.textContent}」，仍可继续微调`;
  scheduleRender();
}));
const namedConfigKey='stroke-worksheet-named-configs';
const configIds=ids.filter(id=>id!=='content' && id!=='focusSelections');
function namedConfigs() {
  try { const configs=JSON.parse(localStorage.getItem(namedConfigKey)||'[]'); return Array.isArray(configs)?configs.filter(item=>item && typeof item.name==='string' && item.settings && typeof item.settings==='object'):[]; }
  catch { return []; }
}
function renderNamedConfigs() {
  const entries=namedConfigs().map(({name})=>{
    const row=document.createElement('div');row.className='saved-config-row';
    const apply=document.createElement('button');apply.type='button';apply.className='saved-config-apply';apply.textContent=name;apply.title=`应用「${name}」`;
    apply.addEventListener('click',()=>{
      const settings=namedConfigs().find(item=>item.name===name)?.settings;
      if(!settings)return;
      for(const id of configIds)if(Object.hasOwn(settings,id))$(id).type==='checkbox'?$(id).checked=!!settings[id]:$(id).value=settings[id];
      if(['uppercase','lowercase'].includes(settings.worksheetType)){$('worksheetType').value='letters';$('letterCase').value=settings.worksheetType;}
      if(!$('showStrokeOrder').checked)$('showEndpoints').checked=false;
      $('saveConfigStatus').textContent=`已应用「${name}」；输入内容未改变。`;
      scheduleRender();
    });
    const remove=document.createElement('button');remove.type='button';remove.className='saved-config-remove';remove.textContent='删除';remove.setAttribute('aria-label',`删除配置「${name}」`);
    remove.addEventListener('click',()=>{
      if(!confirm(`删除配置「${name}」？`))return;
      try { localStorage.setItem(namedConfigKey,JSON.stringify(namedConfigs().filter(item=>item.name!==name)));renderNamedConfigs();$('saveConfigStatus').textContent=`已删除「${name}」。`; }
      catch { $('saveConfigStatus').textContent='删除失败：当前浏览器无法更新本地存储。'; }
    });
    row.append(apply,remove);return row;
  });
  $('savedConfigs').replaceChildren(...entries);
}
$('saveConfigForm').addEventListener('submit',event=>{
  event.preventDefault();
  const name=$('configName').value.trim();
  if(!name){$('saveConfigStatus').textContent='请先输入配置名称。';return;}
  const configs=namedConfigs();
  if(configs.some(item=>item.name===name)){$('saveConfigStatus').textContent='名称已存在，请换一个名称。';return;}
  const current=state();
  const settings=Object.fromEntries(configIds.map(id=>[id,current[id]]));
  try {
    localStorage.setItem(namedConfigKey,JSON.stringify([{name,settings},...configs]));
    $('configName').value='';
    $('saveConfigStatus').textContent=`已将「${name}」保存在当前浏览器。`;
    renderNamedConfigs();
  } catch { $('saveConfigStatus').textContent='保存失败：当前浏览器可能禁止本地存储。'; }
});
renderNamedConfigs();
$('resetBtn').addEventListener('click',()=>{
  if(renderFrame){cancelAnimationFrame(renderFrame);renderFrame=0;}
  for(const id of ids) $(id).type==='checkbox' ? $(id).checked=defaults[id] : $(id).value=defaults[id];
  $('curriculumGrade').value='1';
  $('curriculumTerm').value='upper';populateCurriculumLessons();
  localStorage.removeItem('stroke-worksheet-settings');
  render();
  $('saveState').textContent='已恢复默认配置';
  clearTimeout(window.resetNoticeTimer);
  window.resetNoticeTimer=setTimeout(()=>$('saveState').textContent='设置自动保存在本机',3000);
});
$('printBtn').addEventListener('click',()=>window.print());
$('shareBtn').addEventListener('click',async()=>{
  const button=$('shareBtn'), original=button.textContent;
  const shareData={title:'起收笔字帖',text:'免费生成中文、英文和数字书写练习字帖',url:'https://handwriting.hskylab.com/'};
  try {
    if(navigator.share)await navigator.share(shareData);
    else {
      await navigator.clipboard.writeText(shareData.url);
      button.textContent='网址已复制';
      window.setTimeout(()=>button.textContent=original,2000);
    }
  } catch(error) {
    if(error?.name!=='AbortError'){
      const input=document.createElement('textarea');input.value=shareData.url;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
      const copied=document.execCommand('copy');input.remove();
      button.textContent=copied?'网址已复制':'复制失败';window.setTimeout(()=>button.textContent=original,2000);
    }
  }
});
  $('curriculumGrade').addEventListener('change',populateCurriculumLessons);
  $('curriculumTerm').addEventListener('change',populateCurriculumLessons);
  $('curriculumLesson').addEventListener('change',renderCurriculumCharacters);
  $('loadCurriculum').addEventListener('click',()=>{
    const chars=[...selectedLesson()[2]].filter(char=>curriculumSelection.has(char));
    if(!chars.length)return;
    $('content').value=chars.join('');
    scheduleRender();
  });
populateCurriculumLessons();
restore();
render();
window.addEventListener('pinyin-ready',scheduleRender);
