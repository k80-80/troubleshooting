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
	         name: "Errors, Crashes, or Loading Issues",
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
	issues.find(i=>i.id==='crash').name = 'Crashes, Errors or Stuck Loading';
	issues.find(i=>i.id==='missing').desc = 'A mod, career, downloaded outfit or object is missing.';
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
	context:['Check Where the Option Should Appear', 'Read the mod’s download page: which Sim, object or menu do you click? Does it need a certain age, skill or career level? If a computer is locked to another Sim, unlock it. For a mailbox option, try another mailbox.'],
	ui:['Update Mods That Change Menus or Icons', 'Examples: UI Cheats, Better BuildBuy and More Columns in Create-a-Sim. Check each creator’s page for compatibility and replace old versions. If there is no compatible update, leave that mod out. Follow the creator’s removal instructions.'],
	recent:['Check What Changed', 'Did this start after a game update or a new download? Check those mods first. Temporarily move suspected files to a folder outside Mods. Keep each mod and its required files together.'],
	desk:['Clear the Desk and Seat Your Sim', 'Remove clutter from the desk and around the computer. Click the chair to seat your Sim, then try resuming the book. If that fails, try a different desk and computer.'],
	book:['Try a New Book', 'Check whether your Sim can start and finish a different book. This can also happen without mods; a stuck book alone does not prove a mod is broken.'],
	career:['Look for the Last Job Title', 'With my branched career packs, a career you quit may be listed under your last job title. Rejoin under that title, then check the phone or computer for Switch, Contact or Browse options. Follow that career pack’s guide.']
	};
	const routes = {
	missing:{heading:'Start With These Four Fixes', ids:['enabled','files','updates','duplicates'], test:'Start the game. Choose New Game on the main menu to make a separate test game. '},
	interaction:{heading:'Find the Missing Option',ids:['enabled','files','updates','context','duplicates'],test:'Choose New Game on the main menu. Use the Sim, object and menu described on the mod’s download page. Meet any listed age, skill or career conditions, then try the option again.'},
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
	function report(){return `MOD SUPPORT SUMMARY\nProblem: ${selected().name}\nMod: ${state.mod||'Not supplied'}\nPlatform: ${state.platform}\nGame version: ${state.game||'Not supplied'}\n\nFixes marked as tried:\n${routes[state.issue].ids.map(id=>`[${state.checks[id]?'Tried':'Not marked'}] ${checks[id][0]}`).join('\n')}\n\nTest result: ${state.result==='fixed'?'Works after the quick fixes':state.result==='persists'?'Still happening after the quick fixes':'Not tested yet'}\n\nWhat happened/files used during testing:\n${state.details||'Not supplied'}\n\nAttach screenshots or requested logs separately. This page does not scan your files or send anything.`;}
	async function copy(value){try{await navigator.clipboard.writeText(value);$('#status').textContent='Copied.';}catch{ $('#status').textContent='Copy unavailable. Select the text to copy it, or download the summary.';}}
	function checkSections(r){
	const groups=[['Game Settings',['enabled']],['Installation & Updates',['files','updates','ui','recent','duplicates']],['Your Sim & Gameplay',['context','desk','book','career']]];
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
  <p class="lead">Pick the closest match.<\/p>

<div class="advice1">
  <h3 class="mod-log-heading">
    <img src="TS_icons/Send a ModLibrary Log.png"
         alt="" width="40" height="40">
    Send a ModLibrary Log
  <\/h3>

  <p>Skip the troubleshooting steps, and send me your log.<\/p>

  <p>
    <a href="#modlibrary-help" id="modlibrary-help-link">
      Find the files required →
    <\/a>
  <\/p>
<\/div>

<div class="issue-grid">${issues.map(i=>`<button class="issue ${state.issue===i.id?'selected':''}" data-issue="${i.id}" aria-pressed="${state.issue===i.id}"><img class="issue-icon" src="${esc(i.icon)}" alt=""><span class="issue-text"><strong>${esc(i.name)}<\/strong><small>${esc(i.desc)}<\/small><\/span><\/button>`).join('')}<\/div>

<div class="advice">
	<h3 class="mod-help-heading">
	<img src="TS_icons/Issuewith1.png" alt="" width="40" height="40">
	<img src="TS_icons/Issuewith2.png" alt="" width="40" height="40">
	<img src="TS_icons/Issuewith3.png" alt="" width="40" height="40">

	Issue With a Particular Mod?
</h3><p>Check the FAQ section in that mod’s user guide or try my general fixes</p>
	<p>
		
		<a href="https://midnitetechmods.com/support"
		   target="_blank" rel="noopener">User Guides ↗</a>,
		
		<button type="button" class="text-link" id="general-fixes">
	General Troubleshooting →
</button>
	</p>
</div>

<div class="fields"><label class="field">OS<select id="f-platform">${['Windows','Mac','Console'].map(p=>`<option ${state.platform===p?'selected':''}>${p}<\/option>`).join('')}<\/select><\/label><\/div><div id="console-note" class="note ${state.platform==='Console'?'':'hidden'}">Downloaded .package and .ts4script mods need the PC or Mac version of The Sims 4. They cannot be installed on PlayStation or Xbox.<\/div><div class="actions"><button class="primary" id="next" ${!state.issue||state.platform==='Console'?'disabled':''}>Next →<\/button><\/div>`;
	} else if(state.step===1){
	html=`<h2 id="panel-title" tabindex="-1">${r.heading}<\/h2><p class="lead">Try these in order. Check each one you’ve tried. Skip anything that doesn’t apply.<\/p>${checkSections(r)}${r.extra?`<p>${r.extra}<\/p>`:''}<section class="extra-help" id="extra-help" tabindex="-1"><h3>Extra Help<\/h3>${basics()}<\/section>${actions('Now Test It →')}`;
	} else if(state.step===2){
	html=`<h2 id="panel-title" tabindex="-1">Try It in the Game<\/h2><div class="note"><strong>Protect Your Save:<\/strong> Back up before removing mods. Use <b>New Game<\/b> for tests. Don’t save your usual household while its mods or custom content are missing.<\/div>${protection()}<div class="advice"><p>${r.test}<\/p><\/div><p>Did the quick fixes solve it?<\/p><div class="test-actions">${[['fixed','Yes, It Works'],['persists','No, Still Broken'],['untested','I Can’t Test Yet']].map(([id,label])=>`<button class="secondary" data-result="${id}">${label}<\/button>`).join('')}<\/div><div class="actions"><button class="secondary" id="back">← Back<\/button><\/div>`;
	} else {
	const fixed=state.result==='fixed';
	html=`<h2 id="panel-title" tabindex="-1">${fixed?'You’re Ready to Play':'Here’s What to Do Next'}<\/h2>`;
	if(fixed)html+=`<div class="outcome">Keep the change that helped. If you removed other mods, add them back in batches and check that the problem stays fixed. Restore your usual mods before opening your usual save.<\/div>${halves()}<button class="quiet" id="restart">Check Another Problem<\/button><details><summary>I Still Want a Support Summary<\/summary>${support()}<\/details>`;
	else {
	html+=`<p class="lead">${state.result==='untested'?'You can return to the test when you’re ready, or ask for help now.':'Try the extra test below, or send the details to the creator of the affected mod.'}<\/p>`;
	if(['missing','interaction'].includes(state.issue))html+=isolation()+halves();
	if(state.issue==='crash')html+=`<div class="advice"><p><b>Works with all mods removed?<\/b> A mod or custom content file is likely involved. Use the guide below to find it.<\/p><p><b>Still broken in a New Game with no mods?<\/b> Repair the game in the EA app (Library → The Sims 4 → Manage → Repair), or verify its files in Steam if you use Steam. If that fails, ask EA for help. ${ea}.<\/p><\/div>${halves()}`;
	if(state.issue==='ui')html+=`<p>If it is still broken, test a New Game with all mods and custom content moved out, and clear localthumbcache.package. If it works, use the guide below. If it stays broken, ${ea}.<\/p>${halves()}`;
	if(state.issue==='book')html+=`<p>Tell the creator whether a different book, Sim or desk worked. If you try Book Fix, check its current instructions first; it may help.<\/p>`;
	if(state.issue==='career')html+=`<p>Tell the creator the career pack name, your last job title and the branch you want. Include a screenshot of the available career options.<\/p>`;
	html+=support()+`<div class="actions"><button class="secondary" id="back">← Back to Test<\/button><button class="quiet" id="restart">Start Again<\/button><\/div>`;
	}
	}
	$('#content').innerHTML=html;
if ($('#general-fixes')) {
	$('#general-fixes').onclick = () => {
		save();
		state.issue = 'missing';
		state.checks = {};
		state.result = '';
		go(1);
	};
}
	if ($('#modlibrary-help-link')) {
  $('#modlibrary-help-link').onclick = (event) => {
    event.preventDefault();

    save();
    state.issue = 'missing';
    state.result = 'untested';
    state.step = 3;

    render();

    const section = $('#modlibrary-help');

    if (section) {
      section.open = true;
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
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
	for(const k of ['mod','game','details'])$('#f-'+k).oninput=()=>{save();$('#report').textContent=report();};
	$('#copy-report').onclick=()=>{save();copy(report());};
	$('#download').onclick=()=>{save();const url=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='midnitetech-support-summary.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#status').textContent='Summary downloaded. Attachments are added separately.';};
	}
	if($('#copy-command'))$('#copy-command').onclick=()=>copy('midnitetech.sim_report');
	}
	function support(){return `<h3 class="section-heading">Ask for Help<\/h3><p>For my mods, use ${link('https://midnitetechmods.com/contact','Contact Me')} or ${link('https://discord.com/invite/4JsntVJyg4','Discord')}. For another creator’s mod, use their support page.<\/p><div class="fields"><label class="field">Mod Name (optional)<input type="text" id="f-mod" value="${esc(state.mod)}"><\/label><label class="field">Game Version (optional)<input type="text" id="f-game" value="${esc(state.game)}"><small>Bottom left of the game’s main menu.<\/small><\/label><label class="field wide">What Did You Try, and What Happened?<textarea id="f-details" placeholder="What did you click? What happened? Which mods were left in Mods during your test?">${esc(state.details)}<\/textarea><\/label><\/div>
	${state.issue==='ui'?'<p>For broken menus or icons, include a screenshot and the names of your menu-changing mods. My ModLibrary log is not required for a menu-only issue.<\/p>':`<details id="modlibrary-help"><summary>Need Help With One of My Mods?<\/summary><p>With my current ModLibrary installed and Script Mods Allowed enabled, open the in-game cheat box: <b>Ctrl + Shift + C<\/b> on Windows; <b>Command + Shift + C<\/b> on Mac. Type this and press Enter:<\/p><div class="command"><code>midnitetech.sim_report<\/code><button class="quiet" id="copy-command">Copy Command<\/button><\/div><p>Follow the file location shown in game. Attach <code>midnitetech_log.html<\/code> to your support message, along with any Better Exception files, lastExceptions etc. For AnyShift or Custom Uniforms, also attach <code>midnitetech_settings.json<\/code> if available.<\/p><p>Command not working? Check you have the latest ModLibrary, that script mods are enabled, and that the .ts4script file is no more than one folder inside Mods. Restart after changes. ${library}. If you can’t create a log, copy or download this summary below and let me know.<\/p><p><b>support@midnitetechmods.com<\/b><\/p><\/details>`}
	<details><summary>Preview Your Support Summary<\/summary><pre class="report" id="report"><\/pre><\/details><div class="test-actions"><button class="primary" id="copy-report">Copy Summary<\/button><button class="secondary" id="download">Download Summary<\/button><\/div><p class="hint">Paste or attach this summary into your message. Attach screenshots and any requested error logs too. Keep this page open while testing; reloading starts over.<\/p>`;}
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
