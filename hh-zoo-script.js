// ==UserScript==
// @name            Zoo's HH Scripts
// @description     Some style and data recording scripts by zoopokemon
// @version         0.1.3
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @downloadURL     https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @grant           none
// @author          zoopokemon
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.1.3: sorted league data
// 0.1.2: fixed copy to clipboard not working on Nutaku, added more info to "Copy This Week's League"
// 0.1.1: League Data Collector style and error message fix
// 0.1.0: Added League Data Collector
// 0.0.1: Inital version

(() => {
    const {$, localStorage, location} = window
    const LS_CONFIG_NAME = 'HHZoo'
    const currentPage = location.pathname

    if (!$) {
        console.log('WARNING: No jQuery found. Probably an error page. Ending the script here');
        return;
    }

    // Game detection
    const isGH = [
        'www.gayharem.com',
        'nutaku.gayharem.com'
    ].includes(location.host)
    const isCxH = [
        'www.comixharem.com',
        'nutaku.comixharem.com'
    ].includes(location.host)
    const isHH = !(isGH || isCxH)

    const CDNs = {
        'nutaku.haremheroes.com': 'hh.hh-content.com',
        'www.hentaiheroes.com': 'hh2.hh-content.com',
        'www.comixharem.com': 'ch.hh-content.com',
        'nutaku.comixharem.com': 'ch.hh-content.com',
        'www.gayharem.com': 'gh1.hh-content.com',
        'nutaku.gayharem.com': 'gh.hh-content.com'
    }
    const cdnHost = CDNs[location.host] || 'hh.hh-content.com'

    const gameConfigs = {
        HH: {
            girl: 'girl',
            Girl: 'Girl',
            career: 'Career'
        },
        GH: {
            girl: 'guy',
            Girl: 'Guy',
            career: 'Career'
        },
        CxH: {
            girl: 'girl',
            Girl: 'Girl',
            career: 'Super Power'
        }
    }
    const gameConfig = isGH ? gameConfigs.GH : isCxH ? gameConfigs.CxH : gameConfigs.HH

    const HC = 1;
    const CH = 2;
    const KH = 3;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();

    function lsGet(key) {
        return JSON.parse(localStorage.getItem(`${LS_CONFIG_NAME}${key}`))
    }
    function lsSet(key, value) {
        return localStorage.setItem(`${LS_CONFIG_NAME}${key}`, JSON.stringify(value))
    }
    function lsRm(key) {
        return localStorage.removeItem(`${LS_CONFIG_NAME}${key}`)
    }

    function copyText(text) {
        navigator.clipboard.writeText(text).catch(e => {
            console.log("c")
            let textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            setTimeout(function() {
                textArea.value = text;
            }, 0);
            setTimeout(function() {
                document.body.appendChild(textArea);
            }, 0);
            setTimeout(function() {
                textArea.focus();
                textArea.select();
                try{
                    document.execCommand('copy');
                }catch(err){
                    console.log('Unable to copy');
                    console.log(text);
                }
                document.body.removeChild(textArea);
            }, 0);
        })
    }

    class STModule {
        constructor ({name, configSchema}) {
            this.group = 'zoo'
            this.name = name
            this.configSchema = configSchema
            this.hasRun = false

            this.insertedRuleIndexes = []
            this.sheet = sheet
        }

        run () {
            if (!this.shouldRun() || this.hasRun) {
                return
            }

            this.injectCss()

            this.hasRun = true
        }

        insertRule (rule) {
            this.insertedRuleIndexes.push(this.sheet.insertRule(rule))
        }

        tearDown () {
            this.insertedRuleIndexes.sort((a, b) => b-a).forEach(index => {
                this.sheet.deleteRule(index)
            })

            this.insertedRuleIndexes = []
            this.hasRun = false
        }
    }

    class HHModule {
        constructor ({group, configSchema}) {
            this.group = 'zoo'
            this.configSchema = configSchema
            this.hasRun = false
        }
    }

    class DailyMissionsRestyle extends STModule {
        constructor () {
            const baseKey = 'dailyMissions'
            const configSchema = {
                baseKey,
                default: true,
                label: 'Daily Missions restyle'
            }
            super({name: baseKey, configSchema})
        }

        shouldRun() {return currentPage.includes('activities')}

        injectCss() {
            this.insertRule(`
                #missions>div #missions_counter .missions-counter-rewards {
                    display: none;
                }
            `)
            //mission wrap
            this.insertRule(`
                #missions>div .missions_wrap {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-gap: 5px;
                    align-content: start;
                }
            `)
            //mission object
            this.insertRule(`
                #missions>div .missions_wrap .mission_object {
                    height: 104px;
                    margin-bottom: 0px;
                }
            `)
            //mission image
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_image {
                    margin-top: 15px;
                    margin-left: 2px;
                    margin-right: 0px;
                    width: 80px;
                    height: 80px;
                    border: 2px solid #fff;
                }
            `)
            //mission details
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details {
                    width: 150px;
                    padding: 4px 6px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details h1 {
                    position: absolute;
                    top: -4px;
                    left: 4px;
                    width: 100%;
                    text-align: center;
                    font-size: 13px!important;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_details p {
                    font-size: 9px;
                    margin-top: 12px;
                    line-height: 10px;
                }
            `)
            //mission reward
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_reward {
                    width: auto;
                    height: 50%;
                    padding-left: 0px;
                    padding-top: 15px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_reward .reward_wrap .slot {
                    margin-right: 4px;
                }
            `)
            //mission button
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button {
                    font-size: 12px;
                    height: 42%;
                    position: absolute;
                    right: 3px;
                    bottom: 4px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .duration {
                    top: 2px;
                    left: 0px;
                    overflow-x: hidden;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=mission_start] {
                    height: 60%;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button button {
                    margin-top: 0px;
                    position: initial;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar {
                    top: 2px;
                    left: 2px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar .backbar {
                    top: 10px;
                    width: 90px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar .text {
                    top: 0px;
                    width: 100%;
                    letter-spacing: 0px;
                    font-size: 0px;
                    text-align: center;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button .hh_bar .text>span {
                    font-size: 11px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish] {
                    position: relative;
                    display: block;
                    padding: 4px 0px;
                    width: 90px;
                    height: 20px;
                    top: 22px;
                    left: 2px;
                    line-height: 12px;
                    font-size: 9px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish]>span[cur]::before {
                    width: 12px;
                    height: 12px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=finish]>span {
                    line-height: inherit;
                    margin-top: -2px;
                    font-size: 10px;
                }
            `)
            this.insertRule(`
                #missions>div .missions_wrap .mission_object .mission_button>button[rel=claim] {
                    width: 86px;
                    height: 36px;
                    margin-top: 6px;
                    padding: 8px 5px;
                    line-height: 10px;
                }
            `)
        }
    }

    class GirlDataRecord extends HHModule {
        constructor () {
            const baseKey = 'girlDataRecord'
            const configSchema = {
                baseKey,
                default: false,
                label: `${gameConfig.Girl} Data Record`,
                subSettings: [{
                    key: 'desc',
                    label: `Record ${gameConfig.Girl} Description`,
                    default: false
                }]
            }
            super({name: baseKey, configSchema})

            this.newGirlNotif = $('<span class="new-girl-notif"></span>')
            this.changesNotif = $('<span class="button-notification-icon button-notification-action"></span>')

            this.fields = {
                name: 'Name',
                full_name: 'Full Name',
                element: 'Element',
                class: 'Class',
                rarity: 'Rarity',
                stars: 'Max Stars',
                pose: 'Favorite Position',
                hair: 'Hair Color',
                eyes: 'Eye Color',
                zodiac: 'Zodiac',
                birthday: 'Birthday',
                location: 'Location',
                career: gameConfig.career,
                food: 'Favorite Food',
                hobby: 'Hobby',
                fetish: 'Fetish',
                style: 'Style',
                desc: 'Description',
                ref_id: 'Ref ID'
            }
        }

        shouldRun () {
            return currentPage.includes('harem') && !currentPage.includes('hero')
        }

        capFirst (string) {
            return string.charAt(0).toUpperCase()+string.slice(1);
        }

        cleanData (string) {
            if (string == null) {
                return ''
            }
            return string.replace(/^ +/,'').replace(/ +$/,'')
        }

        getGirlInfo (id) {
            const girl = girlsDataList[id]
            const ref = girl.ref
            const element = girl.element
            const girl_class = all_possible_girls[id].class
            const pose = GT.figures[all_possible_girls[id].figure];

            let girlInfo = {
                name: girl.name,
                full_name: this.cleanData(ref.full_name),
                element: GT.design[element+'_flavor_element'],
                class: GT.caracs[girl_class],
                rarity: this.capFirst(girl.rarity),
                stars: (girl.graded2.match(/\<\/g\>/g) || []).length,
                pose: pose == "Doggie style" ? "Doggie Style" : pose,
                hair: ref.hair.replaceAll(/<(.*?)>/g,''),
                eyes: ref.eyes.replaceAll(/<(.*?)>/g,''),
                zodiac: ref.zodiac,
                birthday: ref.anniv.replace('  ',' '),
                location: this.cleanData(ref.location),
                career: this.cleanData(ref.career),
                food: ref.hobbies.food,
                hobby: ref.hobbies.hobby,
                fetish: ref.hobbies.fetish,
                style: GT.design['girl_style_'+element+'_'+girl_class],
                desc: this.desc ? this.cleanData(ref.desc.replaceAll('\n','')) : '',
                ref_id: ref.id_girl_ref
            }

            return girlInfo
        }

        printGirl (id, girl) {
            let copyText = ''
            for (const [key, value] of Object.entries(girl)) {
                if (this.desc || key!='desc') {
                    copyText += `${value}${key != 'ref_id' ? '\t' : '\n'}`;
                    if (key == 'name') {
                        copyText += `${id}\t`
                    }
                }
            }
            return copyText
        }

        buildNewGirlList (newGirls){
            let list = ''
            for (let i=0;i<newGirls.length;i++){
                list += `<li>${girlsDataList[newGirls[i]].name}</li>`
            }

            return list
        }

        buildChangesTable (dataChanges) {
            let tableBody = ''
            for (let i=0;i<dataChanges.length;i++) {
                let change = dataChanges[i]
                let date = new Date(change.date)
                tableBody += `
                <tr>
                   <td>${girlsDataList[change.id].name}</td>
                   <td>${this.fields[change.field]}</td>
                   <td>${change.old}</td>
                   <td>${change.new}</td>
                   <td>${date.getUTCMonth()+1}/${date.getUTCDate()}/${date.getUTCFullYear()}</td>
                </tr>
                `
            }

            return tableBody
        }

        buildDisplay (girlData,newGirls,dataChanges) {
            return (`
               <div class="summary-girl">
                  <h1>${gameConfig.Girl} Data Record:</h1>
                  <div>${Object.keys(girlData).length} Total <span class="clubGirl_mix_icn"></span> recorded</div>
                  <div>${newGirls.length} New <span class="clubGirl_mix_icn"></span> recorded</div>
                  <ul class="data-grid data-buttons">
                     <li><div><span>Copy All ${gameConfig.Girl}s</span></div></li>
                     <li><div><span>Copy New ${gameConfig.Girl}s</span></div></li>
                     <li><div><span>Clear New ${gameConfig.Girl}s</span></div></li>
                  </ul>
                  <ul class="data-grid new-girls">
                     ${this.buildNewGirlList(newGirls)}
                  </ul>
               </div>
               <div class="summary-changes">
                  <h1>${gameConfig.Girl} Data Changes - ${dataChanges.length}</h1>
                  <ul class="data-grid changes-buttons">
                     <li><div><span>Copy All Changes</span></div></li>
                     <li><div><span>Clear All Changes</span></div></li>
                  </ul>
                  <table class="girl-data-changes">
                     <thead>
                        <tr>
                           <th>${gameConfig.Girl}</th>
                           <th>Field</th>
                           <th>Old</th>
                           <th>New</th>
                           <th>Noticed</th>
                        </tr>
                     </thead>
                     <tbody>
                        ${this.buildChangesTable(dataChanges)}
                     </tbody>
                  </table>
               </div>
            `)
        }

        run ({desc}) {
            if (this.hasRun || !this.shouldRun()) {return}
            this.desc = desc

            $(document).ready(() => {
                const girlIDs = Object.keys(girlsDataList)
                let girlData = lsGet('GirlData') || {}
                let newGirls = lsGet('NewGirls') || []
                let dataChanges = lsGet('DataChanges') || []

                for (let i=0;i<girlIDs.length;i++) {
                    const id = girlIDs[i]
                    if (girlData[id]) {
                        const oldData = girlData[id]
                        const newData = this.getGirlInfo(id)
                        let changes = 0;

                        for (const [key, value] of Object.entries(newData)) {
                            if (value!=oldData[key]) {
                                if (!(key=='desc' && (value=='' || oldData[key]==''))) {
                                    dataChanges.push({
                                        id: id,
                                        field: key,
                                        old: oldData[key],
                                        new: value,
                                        date: Date.now()
                                    })
                                }
                                changes++
                            }
                        }

                        if (changes>0) {
                            girlData[id] = newData
                        }
                    } else {
                        newGirls.push(id)
                        girlData[id] = this.getGirlInfo(id)
                    }
                }

                lsSet('GirlData',girlData)
                lsSet('NewGirls',newGirls)
                lsSet('DataChanges',dataChanges)

                const $button = $('<div class="girl-data-panel-toggle harem"></div>')
                $button.append(this.newGirlNotif).append(this.changesNotif)
                const $panel = $(`<div class="girl-data-panel">${this.buildDisplay(girlData,newGirls,dataChanges)}</div>`)
                const $overlayBG = $('<div class="girl-data-overlay-bg"></div>')
                $('#harem_left').append($button).append($panel).append($overlayBG)

                if (newGirls.length==0){
                    this.newGirlNotif.addClass('hide')
                }
                if (dataChanges.length==0){
                    this.changesNotif.addClass('hide')
                }

                $button.click(() => {
                    if ($panel.hasClass('visible')) {
                        $panel.removeClass('visible')
                        $overlayBG.removeClass('visible')
                    } else {
                        $panel.addClass('visible')
                        $overlayBG.addClass('visible')
                    }
                })

                $overlayBG.click(() => {
                    $panel.removeClass('visible')
                    $overlayBG.removeClass('visible')
                })

                //copy all girls
                $('.data-grid.data-buttons > li>div').eq(0).click(() => {
                    let text = ''
                    girlIDs.forEach(element => {
                        text += this.printGirl(element, girlData[element])
                    })
                    CopyText(text)
                })

                //copy new girls
                $('.data-grid.data-buttons > li>div').eq(1).click(() => {
                    let text = ''
                    newGirls.forEach(element => {
                        text += this.printGirl(element, girlData[element])
                    })
                    copyText(text)
                })

                //clear new girls
                $('.data-grid.data-buttons > li>div').eq(2).click(() => {
                    let counter=$('.summary-girl div')[1]
                    let girlList = $('.data-grid.new-girls')[0]

                    this.newGirlNotif.addClass('hide')
                    counter.innerHTML=`0${/ New(.+)/.exec(counter.innerHTML)[0]}`
                    while (girlList.firstChild) {
                        girlList.removeChild(girlList.firstChild);
                    }

                    newGirls = []
                    lsSet('NewGirls',newGirls)
                })

                //copy each girl
                $('.data-grid.new-girls li').each(function (index) {
                    $(this).click(() => {
                        let text = ''
                        const girl = girlData[newGirls[index]]
                        for (const [key, value] of Object.entries(girl)) {
                            if (desc || key!='desc') {
                                text += `${value}${key != 'ref_id' ? '\t' : '\n'}`;
                                if (key == 'name') {
                                    text += `${newGirls[index]}\t`
                                }
                            }
                        }
                        copyText(text)
                    })
                })

                //copy all changes
                $('.data-grid.changes-buttons > li>div').eq(0).click(() => {
                    let text = ''
                    for (let i=0;i<dataChanges.length;i++) {
                        const change = dataChanges[i]
                        let date = new Date(change.date)
                        text += `${girlsDataList[change.id].name}\t${this.fields[change.field]}\t${change.old}\t${change.new}\t${date.getUTCMonth()+1}/${date.getUTCDate()}/${date.getUTCFullYear()}\n`
                    }
                    copyText(text)
                })

                //clear all changes
                $('.data-grid.changes-buttons > li>div').eq(1).click(() => {
                    let counter = $('.summary-changes h1')[0]
                    let changeList = $('.girl-data-changes > tbody')[0]

                    this.changesNotif.addClass('hide')
                    counter.innerHTML=`${/(.+) - /.exec(counter.innerHTML)[0]}0`
                    while (changeList.firstChild) {
                        changeList.removeChild(changeList.firstChild);
                    }

                    dataChanges = []
                    lsSet('DataChanges',dataChanges)
                })

                sheet.insertRule(`
                .girl-data-panel-toggle {
                    display: block;
                    position: absolute;
                    height: 32px;
                    width: 32px;
                    background-size: contain;
                    bottom: 15px;
                    right: 6px;
                    cursor: pointer;
                }`);
                sheet.insertRule(`
                .girl-data-panel-toggle:hover {
                    filter: drop-shadow(0px 0px 1px white);
                }`);
                sheet.insertRule(`
                .girl-data-panel {
                    display: none;
                    background-color: #080808f5;
                    color: #fff;
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
                    font-weight: 400;
                    position: absolute;
                    bottom: 50px;
                    left: 10px;
                    z-index: 20;
                    border-radius: 5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #cccccc42;
                    padding: 8px;
                    grid-gap: 10px;
                    grid-template-columns: 200px 700px;
                    max-height: 400px;
                }`);
                sheet.insertRule(`
                .girl-data-panel.visible {
                    display: grid;
                }`);
                sheet.insertRule(`
                .girl-data-overlay-bg {
                    display: none;
                    width: 100vw;
                    height: 100%;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    z-index: 19;
                }`);
                sheet.insertRule(`
                .girl-data-overlay-bg.visible {
                    display: block;
                }`);
                sheet.insertRule(`
                .girl-data-panel-toggle.harem {
                    background-image: url(https://hh2.hh-content.com/pictures/design/harem.svg);
                }`);
                sheet.insertRule(`
                .new-girl-notif {
                    display: block;
                    width: 14px;
                    height: 28px;
                    background-image: url(https://hh2.hh-content.com/ic_new.png);
                    background-size: 18px;
                    background-position: center;
                    background-repeat: no-repeat;
                    margin: 0;
                    padding: 0;
                    animation: new_notif_anim 7s infinite;
                    position: relative;
                    right: 15px;
                    bottom: 10px;
                }`);
                sheet.insertRule(`
                .girl-data-panel-toggle .hide {
                    display: none;
                }`);
                sheet.insertRule(`
                .girl-data-panel h1{
                    font-size: 20px;
                }`);
                sheet.insertRule(`
                .summary-changes h1 {
                    display: inline-block;
                }`);
                sheet.insertRule(`
                .girl-data-panel .data-grid {
                    display: grid;
                    grid-gap: 6px;
                    list-style: none;
                    padding-left: 0px;
                    margin-block-end: 0px;
                }`);
                sheet.insertRule(`
                .girl-data-panel .data-grid li {
                    display: inline-block;
                    background: #cccccc42;
                    border-radius: 5px;
                    line-height: 15px;
                    margin-left: 10px;
                    cursor: pointer;
                }`);
                sheet.insertRule(`
                .girl-data-panel .data-grid li>div {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }`);
                sheet.insertRule(`
                .summary-girl .data-grid.data-buttons {
                    grid-template-columns: 1fr 1fr 1fr;
                    text-align: center;
                    font-size: 10px;
                }`);
                sheet.insertRule(`
                .summary-girl .data-grid.new-girls {
                    overflow-y: scroll;
                    max-height: 245px;
                    margin-top: 10px;
                }`);
                sheet.insertRule(`
                .summary-girl .data-grid.new-girls li{
                    margin-left: 0px;
                    margin-right: 4px;
                    padding: 2px;
                }`);
                sheet.insertRule(`
                .summary-changes .data-grid {
                    font-size: 10px;
                    float: right;
                    position: relative;
                    grid-template-columns: 1fr 1fr;
                    margin-block-start: 0px;
                    text-align: center;
                    right: 35px;
                }`);
                sheet.insertRule(`
                .summary-changes .data-grid span {
                    width: 50px;
                }`);
                sheet.insertRule(`
                .girl-data-changes {
                    border-collapse: separate;
                    border-spacing: 2px 2px;
                    font-size: 12px;
                    width: 100%;
                }`);
                sheet.insertRule(`
                .girl-data-changes th, td {
                    padding: 0px 5px;
                    vertical-align: middle;
                    background: #cccccc42;
                }`);
                sheet.insertRule(`
                .girl-data-changes thead tr {
                    display: block;
                    font-size: 16px;
                }`);
                sheet.insertRule(`
                .girl-data-changes tbody {
                    display: block;
                    max-height: 305px;
                    overflow-y: scroll;
                }`);
                sheet.insertRule(`
                .girl-data-changes tr > *:nth-child(1) {
                    width: 100px;
                }`);
                sheet.insertRule(`
                .girl-data-changes tr > *:nth-child(2),
                .girl-data-changes tr > *:nth-child(5) {
                    width: 70px;
                }`);
                sheet.insertRule(`
                .girl-data-changes tr > *:nth-child(3),
                .girl-data-changes tr > *:nth-child(4) {
                    width: 210px;
                }`);
                sheet.insertRule(`
                .girl-data-changes tbody tr > *:nth-child(5) {
                    text-align: right;
                }`);
            })

            this.hasRun = true
        }
    }

    class LeagueDataCollector extends HHModule {
        constructor () {
            const baseKey = 'leagueDataCollector'
            const configSchema = {
                baseKey,
                default: true,
                label: `League Data Collector`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('tower-of-fame')
        }

        recordData () {
            let leagueData = {date: new Date(), playerList: []}
            const leadTable = document.getElementsByClassName("leadTable")[0];

            for (let i=0;i<leadTable.childElementCount;i++) {
                leagueData.playerList.push({
                    id: leagues_list[i].id_player,
                    name: leadTable.children[i].children[1].children[2].textContent,
                    level: leadTable.children[i].children[2].innerText.trim(),
                    flag: leadTable.children[i].children[1].children[1].getAttribute("hh_title"),
                    points: leadTable.children[i].children[4].innerText.trim().replace(/,/g, '')
                })
            }

            // make sure data is sorted
            leagueData.playerList.sort((a, b) => (parseInt(b.points) < parseInt(a.points)) ? -1 : 1);

            lsSet('LeagueRecord',leagueData)
        }

        copyData (week) {
            const leagueData = lsGet(week)
            let text = 'No Data Found';
            if (week == 'LeagueRecord') { // copy for this week
                text = `${new Date(leagueData.date).toUTCString()}\n`
                leagueData.playerList.forEach((player) => {
                    text += `${Object.values(player).join('\t')}\n`
                })
            }
            if (week == 'OldLeagueRecord' && leagueData != null) { //copy for last week
                text = `${new Date(leagueData.date).toUTCString()}\n`
                leagueData.playerList.forEach((player) => {
                    text += `${Object.values(player).join('\t')}\n`
                })
            }
            copyText(text)
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).on('league:rollover', () => {
                lsSet('OldLeagueRecord',lsGet('LeagueRecord'))
            })

            $(document).ready(() => {
                this.recordData()

                $(".league_end_in").append(`
                <div class="record_league">
                    <span id="last_week">
                        <img alt="Copy Last Week's League" hh_title="Copy Last Week's League" src="https://hh.hh-content.com/design/ic_books_gray.svg">
                    </span>
                </div>
                <div class="record_league">
                    <span id="this_week">
                        <img alt="Copy This Week's League" hh_title="Copy This Week's League" src="https://hh.hh-content.com/design/ic_books_gray.svg">
                    </span>
                </div>`)

                $('.record_league >span#last_week').click(() => {
                    this.copyData('OldLeagueRecord')
                })
                $('.record_league >span#this_week').click(() => {
                    this.copyData('LeagueRecord')
                })

                sheet.insertRule(`
                .individualDisplaySwitch {
                    left: 55px!important;
                }`);
                sheet.insertRule(`
                .record_league {
                    position: absolute;
                    left: 140px;
                    top: -37px;
                    cursor: pointer;
                }`);
                sheet.insertRule(`
                .record_league >span#last_week {
                    opacity: 0.75;
                }`);
                sheet.insertRule(`
                .record_league >span#this_week {
                    position: inherit;
                    left: 35px;
                }`);
            })

            this.hasRun = true
        }
    }

    const allModules = [
        new DailyMissionsRestyle(),
        new GirlDataRecord(),
        new LeagueDataCollector()
    ]

    setTimeout(() => {
        if (window.hhPlusPlusConfig) {
            hhPlusPlusConfig.registerGroup({
                key: 'zoo',
                name: 'Zoo\'s Scripts'
            })
            allModules.forEach(module => {
                hhPlusPlusConfig.registerModule(module)
            })
            hhPlusPlusConfig.loadConfig()
            hhPlusPlusConfig.runModules()
        }
    }, 1)
})()
