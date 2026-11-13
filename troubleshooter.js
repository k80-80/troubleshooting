"use strict";
	const $ = s => document.querySelector(s);
	const issues = [
	       {
	       id: "missing",
	       icon: "TS_icons/ModsArentShowing.png",
	       name: "Mods Aren’t Showing",
	       desc: "Missing content, careers, or a mod that never appears in game.",
	       },
	       {
	         id: "interaction",
	       icon: "TS_icons/InteractionMissing.png",
	         name: "Interaction Is Missing",
	         desc: "A menu, option, or feature isn’t where you expect.",
	       },
	       {
	         id: "ui",
	       icon: "TS_icons/BrokenMenu.png",
	         name: "UI Is Broken",
	         desc: "Broken menus, odd icons, llamas, or overlapping panels.",
	       },
	       {
	         id: "crash",
	       icon: "TS_icons/Crash.png",
	         name: "Crashes & Errors",
	         desc: "Something breaks when you load or play.",
	       },
	       {
	         id: "book",
	       icon: "TS_icons/Boosk%23.png",
	         name: "Books Can't Be Completed",
	         desc: "Your Sim can’t resume or complete their book.",
	       },
	       {
	         id: "career",
	       icon: "TS_icons/AgencyPack.png",
	         name: "Agency/Pack Career Disappeared",
	         desc: "A career with multiple branches suddenly isn’t showing up in Join Career.",
	       },
	     ];
	issues.find(i=>i.id==='ui').name = 'Menus or Icons Look Broken';
	issues.find(i=>i.id==='crash').name = 'Crashes & Errors';
	issues.find(i=>i.id==='missing').desc = 'A mod, career, downloaded outfit or object is missing.';
	// Add future guides here; each entry becomes a matching guide card.
	const userGuides = [
	  {name:'SimU: Academic Life', icon:'TS_icons/Issuewith1.png', fallback:'TS_icons/Issuewith1.png', url:'https://simu.midnitetechmods.com/'},
	  {name:'AnyShift', icon:'TS_icons/Issuewith2.png', fallback:'TS_icons/Issuewith2.png', url:'https://anyshift.midnitetechmods.com/'},
	  {name:'Clean Launcher', icon:'TS_icons/cleanlauncherapp.png', fallback:'TS_icons/cleanlauncherapp.png', url:'https://cleanlauncher.midnitetechmods.com/'}
	];
	const knownTypes = {
	  typo:{name:'Typo', prompt:'Where is the typo, and what should it say?', help:'Include the exact text, where you saw it, and your suggested correction. Attach a screenshot if helpful.'},
	  conflict:{name:'Mod Conflict', prompt:'Which mods conflict, and how did you confirm it?', help:'Include both mod names, creators and versions, what happens, and whether it works with each mod separately. Attach relevant screenshots or logs.'},
	  error:{name:'lastException / Error', prompt:'What were you doing when the error appeared?', help:'Include the steps that trigger the error and any message shown. Attach your lastException or Better Exceptions report to your support message.'},
	  other:{name:'Other', prompt:'What is the problem, and what should happen instead?', help:'Include where it happens, how to reproduce it, and any testing you have already done. Attach relevant screenshots or logs.'}
	};
	const knownReport = {type:'typo', mod:'', version:'', game:'', details:''};
	function knownSummary(){
	  const t=knownTypes[knownReport.type];
	  return `KNOWN PROBLEM REPORT\nProblem: ${t.name}\nMod / Tool: ${knownReport.mod||'Not supplied'}\nMod / Tool version: ${knownReport.version||'Not supplied'}\nGame version: ${knownReport.game||'Not supplied'}\n\n${t.prompt}\n${knownReport.details||'Not supplied'}\n\nSuggested attachments: ${t.help}\n\nFiles are included when you use Send Report. If sending manually, attach them separately.`;
	}
	function knownForm(){return `<section class="known-problem" aria-labelledby="known-heading"><h3 id="known-heading" class="icon-heading"><img src="TS_icons/EP21-exclamation.png" onerror="this.onerror=null;this.src='TS_icons/StartHere.png'" alt="" width="32" height="32">Already Know the Problem?</h3><p>Found a typo, confirmed a conflict, or have an error report? Describe the problem, attach any relevant files, and send your report here.</p><details id="known-form"><summary>Report a Known Problem</summary><div class="fields"><label class="field wide">Problem Type<select id="known-type">${Object.entries(knownTypes).map(([id,t])=>`<option value="${id}" ${knownReport.type===id?'selected':''}>${esc(t.name)}</option>`).join('')}</select></label><label class="field">Mod / Tool Name<input id="known-mod" type="text" value="${esc(knownReport.mod)}"></label><label class="field">Mod / Tool Version (optional)<input id="known-version" type="text" value="${esc(knownReport.version)}"></label><label class="field">Game Version (if applicable)<input id="known-game" type="text" value="${esc(knownReport.game)}"><small>Bottom left of the game’s main menu, or just "latest"</small></label><label class="field wide"><span id="known-prompt">${knownTypes[knownReport.type].prompt}</span><textarea id="known-details" aria-describedby="known-help">${esc(knownReport.details)}</textarea></label></div><p id="known-help" class="hint">${knownTypes[knownReport.type].help}</p><details><summary>Preview Your Report</summary><pre class="report" id="known-preview"></pre></details>${uploadFields('known')}<p>You can also contact me through ${link('https://discord.com/invite/4JsntVJyg4','Discord')}.</p></details></section>`;}
	function bindKnownForm(){
	  if(!$('#known-type'))return;
	  const update=()=>{
	    knownReport.type=$('#known-type').value;
	    for(const k of ['mod','version','game','details'])knownReport[k]=$('#known-'+k).value;
	    const t=knownTypes[knownReport.type];
	    $('#known-prompt').textContent=t.prompt;
	    $('#known-help').textContent=t.help;
	    $('#known-preview').textContent=knownSummary();
	  };
	  $('#known-preview').textContent=knownSummary();
	  $('#known-type').onchange=update;
	  for(const k of ['mod','version','game','details'])$('#known-'+k).oninput=update;
	  bindUpload('known',()=>{update();return knownSummary();});

	}

const basinEndpoint = 'https://usebasin.com/f/661063b0f584';
const uploads = {known:{name:'',email:'',files:[],busy:false},support:{name:'',email:'',files:[],busy:false}};
function logGuide(key){return `<details id="${key}-log-guide"><summary>How to Create Your ModLibrary Log<\/summary><p>With my current ModLibrary installed and Script Mods Allowed enabled, open the in-game cheat box: <b>Ctrl + Shift + C<\/b> on Windows; <b>Command + Shift + C<\/b> on Mac. Type this and press Enter:<\/p><div class="command"><code>mtlog<\/code><button class="quiet" id="${key}-copy-command" type="button">Copy Command<\/button><\/div><p>Follow the file location shown in game. Attach <code>midnitetech_log.html<\/code> to your support message, along with any Better Exception files, lastExceptions etc. For AnyShift or Custom Uniforms, also attach <code>midnitetech_settings.json<\/code> if available.<\/p><p>Command not working? Check you have the latest ModLibrary, that script mods are enabled, and that the .ts4script file is no more than one folder inside Mods. Restart after changes. ${library}.<\/p><\/details>`;}
function uploadFields(key){const d=uploads[key];return `<div class="upload-report"><label class="field">Your Name<input type="text" id="${key}-name" autocomplete="name" value="${esc(d.name)}"></label><label class="field">Your Email (so I can reply)<input type="email" id="${key}-email" autocomplete="email" required value="${esc(d.email)}"></label><h4 class="icon-heading"><img src="TS_icons/modrequirements.png" alt="" width="32" height="32">Files to Attach</h4><ul class="attachment-guidance"><li>Any <b>lastException</b>, <b>MCCC</b>, and/or <b>Better Exceptions</b> reports</li><li><b>midnitetech_log.html (required)</b></li><li>midnitetech_settings.json (For AnyShift or Custom Uniforms)</li></ul>${logGuide(key)}<label class="field">Attach Files<input type="file" id="${key}-files" multiple accept=".txt,.log,.html,.htm,.json,.png,.jpg,.jpeg" aria-describedby="${key}-file-help"></label><p class="hint" id="${key}-file-help">Add files one at a time or select several. TXT, LOG, HTML, JSON, PNG or JPG; up to 10 MB.</p><ul id="${key}-file-list" class="upload-list"></ul><p class="hint">Your report and selected files will be sent directly to midnitetech. Files stay selected while you navigate this page; reloading clears them.</p><button type="button" class="primary" id="${key}-send">${d.busy?'Sending…':'Send Report'}</button><p id="${key}-send-status" role="status" aria-live="polite"></p></div>`;}
function bindUpload(key,summary){
 const d=uploads[key], email=$('#'+key+'-email');if(!email)return;
 const status=$('#'+key+'-send-status'),button=$('#'+key+'-send');
 const paint=()=>{const list=$('#'+key+'-file-list');list.replaceChildren();d.files.forEach((f,i)=>{const li=document.createElement('li');li.textContent=f.name+' ';const remove=document.createElement('button');remove.type='button';remove.className='quiet';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+f.name);remove.onclick=()=>{d.files.splice(i,1);paint();};li.append(remove);list.append(li);});};
 paint();button.disabled=d.busy;
 $('#'+key+'-copy-command').onclick=()=>copy('mtlog');
 $('#'+key+'-name').oninput=e=>{d.name=e.target.value;};
 email.oninput=()=>{d.email=email.value;};
 $('#'+key+'-files').onchange=e=>{
  const files=[...d.files];for(const f of e.target.files){if(!files.some(x=>x.name===f.name&&x.size===f.size&&x.lastModified===f.lastModified))files.push(f);}
  const error=validateUploads(files);
  if(error)status.textContent=error;else{d.files=files;status.textContent='';paint();}
  e.target.value='';
 };
 button.onclick=async()=>{
  if(d.busy)return;
  d.name=$('#'+key+'-name').value.trim();
  d.email=email.value.trim();if(!email.reportValidity())return;
  const details=key==='known'?$('#known-details'):$('#f-details');
  if(!details.value.trim()){status.textContent='Please describe the problem before sending.';details.focus();return;}
  const error=validateUploads(d.files);if(error){status.textContent=error;return;}
  if(!d.files.some(file=>file.name.toLowerCase()==='midnitetech_log.html' && file.size>0)){
   status.textContent='Attach midnitetech_log.html before sending. Open the guide above for help creating it.';
   $('#'+key+'-files').focus();
   return;
  }
  const data=new FormData();data.append('name',d.name);data.append('email',d.email);data.append('Report',summary());
  for(const f of d.files)data.append('attachments[]',f,f.name);
  d.busy=true;button.disabled=true;button.textContent='Sending…';status.textContent='Sending your report and files…';
  try{
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),60000);
   let response;try{response=await fetch(basinEndpoint,{method:'POST',headers:{Accept:'application/json'},body:data,signal:controller.signal});}finally{clearTimeout(timeout);}
   let result;try{result=await response.json();}catch{throw Error('Unexpected response');}
   if(!response.ok||result.success!==true)throw Error('Submission rejected');
   status.textContent='Report submitted successfully. Thank you! You don’t need to email the summary separately.';
   if($('#'+key+'-send-status'))$('#'+key+'-send-status').textContent=status.textContent;
  }catch{
   status.textContent='We couldn’t confirm submission. Your details and files are still here. Please try again, or email support@midnitetechmods.com with the details and attachments.';
   if($('#'+key+'-send-status'))$('#'+key+'-send-status').textContent=status.textContent;
  }finally{d.busy=false;button.disabled=false;button.textContent='Send Report';const current=$('#'+key+'-send');if(current){current.disabled=false;current.textContent='Send Report';}}
 };
}
function validateUploads(files){
 if(files.some(f=>!/[.](txt|log|html?|json|png|jpe?g)$/i.test(f.name)))return 'Please choose TXT, LOG, HTML, JSON, PNG or JPG files.';
 if(files.reduce((total,f)=>total+f.size,0)>10*1024*1024)return 'The selected files exceed 10 MB combined. Remove a file or use smaller screenshots.';
 return '';
}

	const labels = ['Choose a Problem', 'Try the Fixes', 'Test It', 'Finish/Get Help'];
	let state = fresh();
	function fresh(){ return {step:0, issue:'', platform:'Windows', checks:{}, result:'', mod:'', game:'', details:''}; }
	const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
	const link = (url,label) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗<\/a>`;
	const directory = link('https://k80-80.github.io/ModsDirectory/','Find my mod’s requirements');
	const library = link('https://www.patreon.com/posts/midnitetech-121729961','Get ModLibrary');
	const ea = link('https://help.ea.com/en/articles/the-sims/the-sims-4/mods-and-the-sims-4-game-updates/','EA’s mod troubleshooting guide');
	const checks = {
	enabled:['Turn Mods On', 'In the game, open Game Options → Other. Check <b>Enable Custom Content and Mods<\/b> and <b>Script Mods Allowed<\/b>. Click Apply Changes. Exit, then reopen the game. Updates can turn these settings off.'],
	files:['Check the Files in Mods', 'Open <b>Documents → Electronic Arts → The Sims 4 → Mods<\/b>. Put the mod’s <code>.package<\/code> and/or <code>.ts4script<\/code> files here, or in one folder directly inside Mods. This is in Documents, not the folder where the game is installed.'],
	updates:['Check the Download Page', 'Check that the mod works with your game version and that you own any required Sims packs. Install the latest compatible version and any extra files the original post says it needs. These extra files are called <b>requirements<\/b>. For my mods: '+directory+'.'],
	duplicates:['Remove Old Copies, Then Clear the Cache', 'In Mods, search for *mod-or-creator-name and remove older copies of that mod. Keep the current version and any required files together. Then, delete only <code>localthumbcache.package<\/code> from <b>Documents → Electronic Arts → The Sims 4<\/b>. This is a temporary file; the game makes a new one.'],
	resetStats:['Reset Stats', 'If the interaction appeared previously and now refuses to appear, or its progress is stuck, open the cheat console (<b>Ctrl + Shift + C</b>), then type <code>stats.show_all_statistics</code>.<br><br>Find the stat causing the issue (for Daily Tasks, it will be <code>commodity_CareerBenefit</code>); others should be self-explanatory. To copy the stat you want, get '+link('https://www.patreon.com/TwistedMexi/posts/better-cheat-v1-79790386', 'TwistedMexi’s Better Cheats Console')+'. You can then run <code>stats.remove_stat PasteFullStatNameHere</code>.<br><br>To set it to a specific amount, for example to progress a Daily Task, enter <code>stats.set_stat PasteFullStatNameHere 120</code>.<br><br><code>120</code> will fill a Daily Task commodity; most progress-related statistics use <code>100</code>.<br><br>If you’re trying to complete a SimU assignment and can’t, <b>Shift+Click</b> your Sim’s computer and select <b>SimU Cheats</b>, where you’ll find an option to reset stats.'],
	context:['Check Where the Option Should Appear', 'Read the mod’s download page: which Sim, object or menu do you click? Does it need a certain age, skill or career level? If a computer is locked to another Sim, unlock it. For a mailbox option, try another mailbox.'],
	ui:['Update Mods That Change Menus or Icons', 'Examples: UI Cheats, Better BuildBuy and More Columns in Create-a-Sim. Check each creator’s page for compatibility and replace old versions. If there is no compatible update, leave that mod out. Follow the creator’s removal instructions.'],
	recent:['Check What Changed', 'Did this start after a game update or a new download? Check those mods first. Temporarily move suspected files to a folder outside Mods. Keep each mod and its required files together.'],
	desk:['Clear the Desk and Seat Your Sim', 'Remove clutter from the desk and around the computer. Click the chair to seat your Sim, then try resuming the book. If that fails, try a different desk and computer.'],
	book:['Try a New Book', 'Check whether your Sim can start and finish a different book. This can also happen without mods; a stuck book alone does not prove a mod is broken.'],
	career:['Look for the Last Job Title', 'With my branched career packs, a career you quit may be listed under your last job title. Rejoin under that title, then check the phone or computer for Switch, Contact or Browse options. Follow that career pack’s guide.']
	};
	const routes = {
	missing:{heading:'Start With These Four Fixes', ids:['enabled','files','updates','duplicates'], test:'Start the game. Choose New Game on the main menu to make a separate test game. '},
	interaction:{heading:'Find the Missing Option',ids:['enabled','files','updates','context','duplicates','resetStats'],test:'Choose New Game on the main menu. Use the Sim, object and menu described on the mod’s download page. Meet any listed age, skill or career conditions, then try the option again.'},
	ui:{heading:'Fix Broken Menus or Icons',ids:['ui','duplicates'],test:'Restart the game and check the screen that looked wrong. If it is still broken, temporarily move the mods that change that UI outside Mods. Follow their creators’ removal instructions. Clear localthumbcache.package, restart and check again in a New Game.'},
	crash:{heading:'Check Updates and Recent Downloads',ids:['updates','recent','duplicates'],test:'With the game closed, move all mods and custom content (CC: downloaded clothes, hair, furniture, etc.) to a folder outside Mods. Leave Resource.cfg in Mods. Delete localthumbcache.package from The Sims 4. Restart and choose New Game. Try the action that caused the error or crash.'},
	book:{heading:'Try These Writing Fixes',ids:['desk','book'],test:'Try resuming the stuck book after changing the desk setup. If it still fails, try writing with a different Sim. Note whether only one book or Sim is affected.',extra:link('https://www.patreon.com/midnitetech/posts/mini-mods-69172769','Optional: see my Book Fix instructions')},
	career:{heading:'Find the Career Branch Again',ids:['career','updates'],test:'After rejoining, check Computer → Career or Phone → Business for the branch options described in the career pack’s guide. Note the job title and branch you want.',extra:link('https://www.patreon.com/midnitetech/posts/switch-career-126872391','Optional: Switch Career Branch mini mod')}
	};
	function selected(){return issues.find(i=>i.id===state.issue);}
	function save(){ for(const k of ['platform','mod','game','details']){const el=$('#f-'+k);if(el)state[k]=el.value;} }
	function go(n){ save(); state.step=n; render(); $('#panel-title').focus(); $('#panel-title').scrollIntoView({block:'start'}); }
	function actions(next='Next'){return `<div class="actions"><button class="secondary" id="back">← Back<\/button><button class="primary" id="next">${next}<\/button><\/div>`;}
	function basics(){return `<details><summary>New to Mods? Where Do the Files Go?<\/summary>
	<p><b>Windows:<\/b> Open File Explorer → Documents → Electronic Arts → The Sims 4 → Mods.<br><b>Mac:<\/b> Open Finder → Documents → Electronic Arts → The Sims 4 → Mods.<\/p>
	<p>No Sims 4 folder? Launch the game once, exit, then look again.<\/p>
	<p>A <code>.zip<\/code>, <code>.rar<\/code> or <code>.7z<\/code> is a compressed download. <b>Extract<\/b> means unpack it first. On Windows, right-click a ZIP → Extract All. On Mac, double-click the ZIP. RAR/7z files need an archive app.<\/p>
	<p>Move the unpacked <code>.package<\/code> and <code>.ts4script<\/code> files into Mods. <b>Do not unzip a .ts4script file or try to run it.<\/b> On Windows, select the files → Ctrl + X, open Mods → Ctrl + V. On Mac, select the files → Command + C, open Mods → Option + Command + V.<\/p>
	<p>Example: <code>Mods → MyMod → file.ts4script<\/code> works. <code>Mods → MyMod → AnotherFolder → file.ts4script<\/code> is too deep.<\/p>
	<p>Keep <code>Resource.cfg<\/code>, the game’s settings file, in Mods. Most of my mods also need ModLibrary; check the download page. ${library}.<\/p>
	${link('https://help.ea.com/en/articles/the-sims/the-sims-4/how-to-install-mods-the-sims-4/','EA’s installation guide')}<\/details>
	<details><summary>Downloaded Hair, Clothes or Objects Look Broken<\/summary><p>These downloads are called <b>custom content (CC)<\/b>. Red/white colours, question marks or an invisible item can mean a required file is missing. Check the Download Page for a <b>mesh<\/b> (the item’s shape) or a required Sims pack. Install those requirements too.<\/p><p>Check for an updated copy of the item. If it still looks wrong, remove that item’s files, clear localthumbcache.package and test again. Ask its creator for help with a screenshot.<\/p><\/details>
	<details><summary>Files Are in Mods, but the Game Can’t See Them<\/summary><p>If you have more than one Sims 4 folder, take a new screenshot in the game, then look for it inside that folder’s <b>Screenshots<\/b> folder.<\/p><p>If Documents is in OneDrive or iCloud, make sure the mod files are downloaded onto your computer and syncing has finished. Don’t move or delete your Documents folder to fix this.<\/p><p> ${ea}.<\/p><\/details>`;}
	function protection(){return `<details><summary>Before Moving Files: Protect Your Saved Game<\/summary><ol><li>Close The Sims 4.<\/li><li>Open Documents → Electronic Arts → The Sims 4.<\/li><li><b>Copy<\/b> the <code>saves<\/code> folder to a separate backup folder outside The Sims 4. Keep the original where it is.<\/li><li>For testing, choose <b>New Game<\/b> on the main menu. This makes a separate test game. If you opened your usual save with mods missing, exit <b>without saving<\/b>.<\/li><\/ol><\/details>`;}
	function isolation(){return `<details><summary>Still Broken? Test Just This Mod<\/summary><ol><li>Create a folder outside Mods called, for example, <b>Mods Testing<\/b>.<\/li><li>Move your other mods and custom content into it. Leave only the problem mod, its required files and Resource.cfg in Mods.<\/li><li>Delete <code>localthumbcache.package<\/code> from Documents → Electronic Arts → The Sims 4.<\/li><li>Restart, choose <b>New Game<\/b>, then try the same action. If it works, another mod may be clashing with it. Use the next guide.<\/li><\/ol><p>If it still fails, contact the mod’s creator. Include what you tested.<\/p><\/details>`;}
	function halves(){return `<details><summary>It Works With Fewer Mods. How Do I Find the Culprit?<\/summary><p>A <b>conflict<\/b> is when mods do not work together. Test in a New Game, and clear localthumbcache.package before every test.<\/p><ol><li>Start with a setup you have tested and know works. Keep the affected mod and its required files together, if you are testing a specific mod.<\/li><li>Add back half of the files you moved out. Keep each mod with its requirements.<\/li><li>If the problem returns, remove that batch and try half of that batch. If it works, leave those files in and test half of the files still held outside Mods.<\/li><li>Repeat until you find a suspect. Remove it and retest to confirm. There may be more than one problem mod.<\/li><\/ol><p>Update or leave out the problem mod. Restore the other files before returning to your usual save.<\/p><\/details>`;}
	function report(){return `MOD SUPPORT SUMMARY\nProblem: ${selected().name}\nMod: ${state.mod||'Not supplied'}\nPlatform: ${state.platform}\nGame version: ${state.game||'Not supplied'}\n\nFixes marked as tried:\n${routes[state.issue].ids.map(id=>`[${state.checks[id]?'Tried':'Not marked'}] ${checks[id][0]}`).join('\n')}\n\nTest result: ${state.result==='fixed'?'Works after the quick fixes':state.result==='persists'?'Still happening after the quick fixes':'Not tested yet'}\n\nWhat happened/files used during testing:\n${state.details||'Not supplied'}\n\nAttach screenshots or requested logs separately. Files are included when you use Send Report. If sending manually, attach them separately.`;}
	async function copy(value){try{await navigator.clipboard.writeText(value);$('#status').textContent='Copied.';}catch{ $('#status').textContent='Copy unavailable. Select the text to copy it, or download the summary.';}}
	function checkSections(r){
	const groups=[['Game Settings',['enabled']],['Installation & Updates',['files','updates','ui','recent','duplicates','resetStats']],['Your Sim & Gameplay',['context','desk','book','career']]];
	return groups.map(([title,ids])=>{const shown=r.ids.filter(id=>ids.includes(id));if(!shown.length)return '';return `<section class="fix-section" aria-label="${title}"><h3>${title}<\/h3>${shown.map(id=>`<label class="check"><input type="checkbox" data-check="${id}" ${state.checks[id]?'checked':''}><span><strong>${checks[id][0]}<\/strong><small>${checks[id][1]}<\/small><\/span><\/label>`).join('')}<\/section>`;}).join('');
	}
	function render(){
	const r=routes[state.issue];
	$('#steps').innerHTML=labels.map((label,i)=>`<button class="step" data-step="${i}" ${i===state.step?'aria-current="step"':''} ${i>0&&(!state.issue||state.platform==='Console')?'disabled':''}><span>${i+1}<\/span>${label}<\/button>`).join('');
	$('#stage-label').textContent=`Step ${state.step+1} of 4 · ${labels[state.step]}`;
	$('#status').textContent='';
	let html='';
	if(state.step===0){
	html=`<h2 id="panel-title" tabindex="-1">PICK AN ISSUE<\/h2>
  <p class="lead">What Do You Need Help With?<\/p>

<div class="issue-grid">${issues.map(i=>`<button class="issue ${state.issue===i.id?'selected':''}" data-issue="${i.id}" aria-pressed="${state.issue===i.id}"><img class="issue-icon" src="${esc(i.icon)}" alt=""><span class="issue-text"><strong>${esc(i.name)}<\/strong><small>${esc(i.desc)}<\/small><\/span><\/button>`).join('')}<button type="button" class="issue" id="modlibrary-help-link"><img class="issue-icon" src="TS_icons/Send a ModLibrary Log.png" alt=""><span class="issue-text"><strong>Send a ModLibrary Log<\/strong><small>Find the files required →<\/small><\/span><\/button><button type="button" class="issue" id="other-issue"><img class="issue-icon" src="TS_icons/StartHere.png" alt=""><span class="issue-text"><strong>Other<\/strong><small>Issue not mentioned here?<\/small><\/span><\/button><\/div>

<div class="fields"><label class="field">OS<select id="f-platform">${['Windows','Mac','Console'].map(p=>`<option ${state.platform===p?'selected':''}>${p}<\/option>`).join('')}<\/select><\/label><\/div><div id="console-note" class="note ${state.platform==='Console'?'':'hidden'}">Downloaded .package and .ts4script mods need the PC or Mac version of The Sims 4. They cannot be installed on PlayStation or Xbox.<\/div><div class="actions"><button class="primary" id="next" ${!state.issue||state.platform==='Console'?'disabled':''}>Next →<\/button><\/div>
${knownForm()}
<section class="available-guides" aria-labelledby="guides-heading"><h3 id="guides-heading" class="icon-heading"><img src="TS_icons/UserGuides.png" alt="" width="32" height="32">Available User Guides</h3><div class="guide-grid">${userGuides.map(g=>`<a class="guide-card" href="${esc(g.url)}" target="_blank" rel="noopener"><img class="guide-icon" src="${esc(g.icon)}" onerror="this.onerror=null;this.src='${esc(g.fallback)}'" alt="" width="40" height="40"><strong>${esc(g.name)}</strong><span>Open User Guide ↗</span></a>`).join('')}</div></section>`;
	} else if(state.step===1){
	html=`<h2 id="panel-title" tabindex="-1">${r.heading}<\/h2><p class="lead">Try these in order. Check each one you’ve tried. Skip anything that doesn’t apply.<\/p>${checkSections(r)}${r.extra?`<p>${r.extra}<\/p>`:''}<section class="extra-help" id="extra-help" tabindex="-1"><h3>Extra Help<\/h3>${basics()}<\/section>${actions('Next →')}`;
	} else if(state.step===2){
	html=`<h2 id="panel-title" tabindex="-1">Try It in the Game<\/h2><div class="note"><strong>Protect Your Save:<\/strong> Back up before removing mods. Use <b>New Game<\/b> for tests. Don’t save your usual household while its mods or custom content are missing.<\/div>${protection()}<div class="advice"><p>${r.test}<\/p><\/div><p>Did the quick fixes solve it?<\/p><div class="test-actions">${[['fixed','Yes, It Works'],['persists','No, Still Broken'],['untested','I Can’t Test Yet']].map(([id,label])=>`<button class="secondary" data-result="${id}">${label}<\/button>`).join('')}<\/div><div class="actions"><button class="secondary" id="back">← Back<\/button><\/div>`;
	} else {
	const fixed=state.result==='fixed';
	html=`<h2 id="panel-title" tabindex="-1">${fixed?'You’re Ready to Play':'Here’s What to Do Next'}<\/h2>`;
	if(fixed)html+=`<div class="outcome">Keep the change that helped. If you removed other mods, add them back in batches and check that the problem stays fixed. Restore your usual mods before opening your usual save.<\/div>${halves()}<button class="quiet" id="restart">Check Another Problem<\/button><details><summary>I Still Want a Support Summary<\/summary>${support()}<\/details>`;
	else {
	html+=`<p class="lead">${state.result==='untested'?'Send a Report':'Try testing just the relevant mod, or send a report.'}<\/p>`;
	if(['missing','interaction'].includes(state.issue))html+=isolation()+halves();
	if(state.issue==='crash')html+=`<div class="advice"><p><b>Works with all mods removed?<\/b> A mod or custom content file is likely involved. Use the guide below to find it.<\/p><p><b>Still broken in a New Game with no mods?<\/b> Repair the game in the EA app (Library → The Sims 4 → Manage → Repair), or verify its files in Steam if you use Steam. If that fails, ask EA for help. ${ea}.<\/p><\/div>${halves()}`;
	if(state.issue==='ui')html+=`<p>If it is still broken, test a New Game with all mods and custom content moved out, and clear localthumbcache.package. If it works, use the guide below. If it stays broken, ${ea}.<\/p>${halves()}`;
	if(state.issue==='book')html+=`<p>Tell the creator whether a different book, Sim or desk worked. If you try Book Fix, check its current instructions first; it may help.<\/p>`;
	if(state.issue==='career')html+=`<p>Tell the creator the career pack name, your last job title and the branch you want. Include a screenshot of the available career options.<\/p>`;
	html+=support()+`<div class="actions"><button class="secondary" id="back">← Back to Test<\/button><button class="quiet" id="restart">Start Again<\/button><\/div>`;
	}
	}
	$('#content').innerHTML=html;
	bindKnownForm();
for (const id of ['#general-fixes', '#other-issue']) {
if ($(id)) {
	$(id).onclick = () => {
		save();
		state.issue = 'missing';
		state.checks = {};
		state.result = '';
		go(1);
	};
}
}
	if ($('#modlibrary-help-link')) {
  $('#modlibrary-help-link').onclick = (event) => {
    event.preventDefault();

    save();
    state.issue = 'missing';
    state.result = 'untested';
    go(3);
    const section = $('#support-log-guide');
    if (section) section.open = true;
  };
}
document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>go(+b.dataset.step));
	document.querySelectorAll('[data-issue]').forEach(b=>b.onclick=()=>{save();if(state.issue!==b.dataset.issue){state.checks={};state.result='';}state.issue=b.dataset.issue;render();$('#next').focus();});
	document.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>state.checks[b.dataset.check]=b.checked);
	document.querySelectorAll('[data-result]').forEach(b=>b.onclick=()=>{state.result=b.dataset.result;go(3);});
	if($('#f-platform'))$('#f-platform').onchange=()=>{save();render();$('#f-platform').focus();};
	if($('#next'))$('#next').onclick=()=>go(state.step+1);
	if($('#back'))$('#back').onclick=()=>go(state.step-1);
	if($('#restart'))$('#restart').onclick=()=>{state=fresh();render();$('#panel-title').focus();};
	if($('#report')){
	$('#report').textContent=report();
	bindUpload('support',()=>{save();return report();});
	for(const k of ['mod','game','details'])$('#f-'+k).oninput=()=>{save();$('#report').textContent=report();};

	}
	}
	function support(){return `<h3 class="section-heading">Send Report<\/h3><p>Fill in the details here, attach your ModLibrary log and click <b>Send Report</b>.<\/p><div class="fields"><label class="field">Mod Name (optional)<input type="text" id="f-mod" value="${esc(state.mod)}"><\/label><label class="field">Game Version (optional)<input type="text" id="f-game" value="${esc(state.game)}"><small>Bottom left of the game’s main menu, or just "latest"<\/small><\/label><label class="field wide">What Did You Try, and What Happened?<textarea id="f-details" placeholder="What did you click? What happened? Which mods were left in Mods during your test?">${esc(state.details)}<\/textarea><\/label><\/div>
	${state.issue==='ui'?'<p>For broken menus or icons, include a screenshot and the names of your menu-changing mods.<\/p>':''}
	<details><summary>Preview Your Support Summary<\/summary><pre class="report" id="report"><\/pre><\/details>${uploadFields('support')}<p class="hint">Keep this page open while testing; reloading starts over.<\/p>`;}
	let dark=false;try{dark=localStorage.getItem('mt-theme')==='dark';}catch{}
	function theme(){document.body.classList.toggle('dark',dark);$('#theme').setAttribute('aria-pressed',String(dark));$('#theme').textContent=dark?'☀ Light Mode':'◐ Dark Mode';}
	theme();$('#theme').onclick=()=>{dark=!dark;theme();try{localStorage.setItem('mt-theme',dark?'dark':'light');}catch{}};
    $('#extra-help-link').onclick = (event) => {
        event.preventDefault();
        save();
        if (!state.issue) state.issue = 'missing';
        state.step = 1;
        render();
        const section = $('#extra-help');
        section.focus({ preventScroll: true });
        section.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
	render();

const translateToggle = document.getElementById('translate-toggle');
const translateHelp = document.getElementById('translate-help');

if (translateToggle && translateHelp) {
  function closeTranslateHelp() {
    translateHelp.hidden = true;
    translateToggle.setAttribute('aria-expanded', 'false');
  }

  translateToggle.addEventListener('click', event => {
    event.stopPropagation();
    translateHelp.hidden = !translateHelp.hidden;
    translateToggle.setAttribute('aria-expanded', String(!translateHelp.hidden));
  });

  document.addEventListener('click', event => {
    if (!translateHelp.hidden && !translateHelp.contains(event.target)) {
      closeTranslateHelp();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !translateHelp.hidden) {
      closeTranslateHelp();
      translateToggle.focus();
    }
  });
}

function markNoTranslate() {
  document.querySelectorAll('code, .site-logo, .report, input, textarea').forEach(element => {
    if (element.getAttribute('translate') !== 'no') {
      element.setAttribute('translate', 'no');
      element.classList.add('notranslate');
    }
  });
}

markNoTranslate();
new MutationObserver(markNoTranslate).observe(document.body, { childList: true, subtree: true });
