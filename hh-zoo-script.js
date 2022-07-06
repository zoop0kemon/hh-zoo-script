// ==UserScript==
// @name            Zoo's HH Scripts
// @description     Some style and data recording scripts by zoopokemon
// @version         0.3.10
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @downloadURL     https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @grant           none
// @author          zoopokemon
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.3.10: Changed pachinko log rest icon, and fixed great game girl chance display
// 0.3.9: Fixed Girl Data Record, due to missing global unable to record pose info
// 0.3.8: Fixed League Data Collector bug when some opponents are hidden. Fixed Girl Data Record bug when new girl was removed from harem page. Some fixes to better support other languages.
// 0.3.7: League Data Collector support for mobile
// 0.3.6: Fixed Pachinko Log for Firefox and added sample size display
// 0.3.5: Redid league rollover
// 0.3.4: Fixed Improved Waifu girl name styling and other bug fixes
// 0.3.3: Added Pachinko Log support for Event Pachinko (don't play Event Pachinko)
// 0.3.2: Finished Pachinko Log UI
// 0.3.1: Bug fixes and support for PsH
// 0.3.0: Added early Pachinko Log, UI will be added soon™
// 0.2.3: Fixed some styling due to update
// 0.2.2: Improved individual Waifu selection
// 0.2.1: Fixed some Improved Waifu bugs
// 0.2.0: Added Improved Waifu
// 0.1.3: Sorted league data
// 0.1.2: Fixed copy to clipboard not working on Nutaku, added more info to "Copy This Week's League"
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
    const isHoH = [
        'www.hornyheroes.com'
    ].includes(location.host)
    const isPSH = [
        'www.pornstarharem.com',
        'nutaku.pornstarharem.com'
    ].includes(location.host)
    const isHH = !(isGH || isCxH || isHoH || isPSH)

    const CDNs = {
        'nutaku.haremheroes.com': 'hh.hh-content.com',
        'www.hentaiheroes.com': 'hh2.hh-content.com',
        'www.comixharem.com': 'ch.hh-content.com',
        'nutaku.comixharem.com': 'ch.hh-content.com',
        'www.gayharem.com': 'gh1.hh-content.com',
        'nutaku.gayharem.com': 'gh.hh-content.com',
        'www.hornyheroes.com': 'sh.hh-content.com',
        'www.pornstarharem.com': 'th.hh-content.com',
        'nutaku.pornstarharem.com': 'th.hh-content.com'
    }
    const cdnHost = CDNs[location.host] || 'hh.hh-content.com'

    const gameConfigs = {
        HH: {
            girl: 'girl',
            Girl: 'Girl',
            career: 'Career',
            waifu: 'Waifu',
            pachinko: 'Pachinko',
            dom: 'Dominatrix',
            books: {
                XP1: 'Magazine',
                XP2: 'Book',
                XP3: 'Encyclopedia',
                XP4: 'Spell Book'
            },
            gifts: {
                K1: 'Flowers',
                K2: 'Chocolates',
                K3: 'Bracelet',
                K4: 'Lingerie'
            },
            boosters: {
                B1: 'Ginseng Root',
                B2: 'Jujbues',
                B3: 'Chlorella',
                B4: 'Cordyceps'
            }
        },
        GH: {
            girl: 'guy',
            Girl: 'Guy',
            career: 'Career',
            waifu: 'Boyfriend',
            pachinko: 'Pachinko',
            dom: 'Dom',
            books: {
                XP1: 'Magazine',
                XP2: 'Book',
                XP3: 'Encyclopedia',
                XP4: 'Spell Book'
            },
            gifts: {
                K1: 'Lollipop',
                K2: 'Chocolates',
                K3: 'Bracelet',
                K4: 'Underpants'
            },
            boosters: {
                B1: 'Ginseng Root',
                B2: 'Jujbues',
                B3: 'Chlorella',
                B4: 'Cordyceps'
            }
        },
        CxH: {
            girl: 'girl',
            Girl: 'Girl',
            career: 'Super Power',
            waifu: 'Waifu',
            pachinko: 'Night-club',
            dom: 'Dominatrix',
            books: {
                XP1: 'Audio lesson',
                XP2: 'Personal dev book',
                XP3: 'Sport session',
                XP4: 'Super Kamasutra'
            },
            gifts: {
                K1: 'Jewels for Costume',
                K2: 'Seamless Super Lingerie',
                K3: 'Super Flowers',
                K4: 'Super Gadget'
            },
            boosters: {
                B1: 'Minute Man\'s potion',
                B2: 'Slow-mo Force sample',
                B3: 'Sly Mans Anti-sleep pills',
                B4: 'Super Juice injector'
            }
        },
        PSH: {
            girl: 'girl',
            Girl: 'Girl',
            career: 'Career',
            waifu: 'Waifu',
            pachinko: 'Night-club',
            dom: 'Dominatrix',
            books: {
                XP1: 'Adult comics',
                XP2: 'Sex for dummies',
                XP3: 'Sex encyclopedia',
                XP4: 'Audiobook sex lessons'
            },
            gifts: {
                K1: 'Drink',
                K2: 'Lingerie',
                K3: 'Bracelet',
                K4: 'Butt plug'
            },
            boosters: {
                B1: 'Potion',
                B2: 'Excitant',
                B3: 'Suspect pills',
                B4: 'Growing device'
            }
        }
    }
    const gameConfig = isGH ? gameConfigs.GH : isCxH ? gameConfigs.CxH : isPSH ? gameConfigs.PSH : gameConfigs.HH

    const HC = 1;
    const CH = 2;
    const KH = 3;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();

    function lsGet(key,config=LS_CONFIG_NAME) {
        return JSON.parse(localStorage.getItem(`${config}${key}`))
    }
    function lsSet(key, value) {
        return localStorage.setItem(`${LS_CONFIG_NAME}${key}`, JSON.stringify(value))
    }
    function lsRm(key) {
        return localStorage.removeItem(`${LS_CONFIG_NAME}${key}`)
    }

    function copyText(text) {
        navigator.clipboard.writeText(text).catch(e => {
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
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try{
                document.execCommand('copy');
            }catch(err){
                console.log('Unable to copy');
                console.log(text);
            }
            document.body.removeChild(textArea);
        })
    }
    function capFirst (string) {
        return string.charAt(0).toUpperCase()+string.slice(1);
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
                    grid-gap: 4px;
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
                label: `${gameConfig.Girl} Data Record (WARNING: Local Storage Intensive)`,
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
            //const girl_class = all_possible_girls[id].class
            //const pose = GT.figures[all_possible_girls[id].figure];
            const pose = GT.figures[girl.figure] || '';

            let girlInfo = {
                name: girl.name,
                full_name: this.cleanData(ref.full_name),
                element: GT.design[element+'_flavor_element'],
                class: GT.caracs[girl.class],
                rarity: capFirst(girl.rarity),
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
                style: GT.design['girl_style_'+element+'_'+girl.class],
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

        buildNewGirlList (newGirls) {
            let list = ''
            for (let i=0;i<newGirls.length;i++){
                if (girlsDataList[newGirls[i]]) {
                    list += `<li>${girlsDataList[newGirls[i]].name}</li>`
                } else {
                    list += `<li>[REMOVED ID:${newGirls[i]}]</li>`
                }
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
                                if (!((key=='desc' || key=='pose') && (value=='' || oldData[key]==''))) {//change back once pose is back
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
                    copyText(text)
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

            for (let i=0;i<leagues_list.length;i++) {
                const playerRow = $(leagues_list[i].html.replaceAll('\t','').replaceAll('\n',''))

                leagueData.playerList.push({
                    id: leagues_list[i].id_player,
                    name: $(playerRow).find('.nickname').text(),
                    level: leagues_list[i].level,
                    flag: $(playerRow).find('.country').attr('hh_title'),
                    points: $(playerRow[4]).text().match(/\d+/g).join('')
                })
            }

            // make sure data is sorted
            leagueData.playerList.sort((a, b) => (parseInt(b.points) < parseInt(a.points)) ? -1 : 1);

            lsSet('LeagueRecord',leagueData)
        }

        copyData (week) {
            const leagueData = lsGet(`${week}LeagueRecord`)
            const simHist = lsGet(`${week}SimHistory`)
            const pointHist = lsGet(`LeaguePointHistory${week}`,'HHPlusPlus')
            const extra = simHist ? true : false
            let text = leagueData ? `${new Date(leagueData.date).toUTCString()}\n` : 'No Data Found';
            let prow = '';
            if (leagueData) { // copy for this week
                leagueData.playerList.forEach((player) => {
                    let row = Object.values(player).join('\t')
                    if (extra) {
                        const id = player.id
                        row += `\t${pointHist[id] ? pointHist[id].points.join('\t') : id != Hero.infos.id ? '\t\t' : 'X\tX\tX'}\t`

                        for(let i=0;i<29;i++){
                            try {
                                row += `${simHist[id][i] || ''}\t`
                            } catch (e) {
                                row += `${id != Hero.infos.id ? '' : simHist['me'][i]}\t`
                            }
                        }
                        row += id != Hero.infos.id ? simHist[id].hitTime ? Math.min.apply(null,simHist[id].hitTime) : '' : 'NA'
                    }

                    if (extra && (player.id == Hero.infos.id)) {
                        prow = row;
                    } else {
                        text += `${row}\n`;
                    }
                })
            }
            if (extra) {text = `${prow}\t${text}`}
            copyText(text)
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                const leagueEndTime = server_now_ts + season_end_at
                const storedEndTime = lsGet('LeagueEnd')

                if (!storedEndTime) {
                    lsSet('LeagueEnd', leagueEndTime)
                } else if (leagueEndTime > storedEndTime) {
                    lsSet('OldLeagueRecord',lsGet('LeagueRecord'))
                    lsSet('LeagueEnd', leagueEndTime)
                }

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
                    this.copyData('Old')
                })
                $('.record_league >span#this_week').click(() => {
                    this.copyData('')
                })

                sheet.insertRule(`
                @media (min-width: 1026px) {
                    .individualDisplaySwitch {
                        left: 55px!important;
                    }
                }`);
                sheet.insertRule(`
                .record_league {
                    position: absolute;
                    cursor: pointer;
                }`);
                sheet.insertRule(`
                @media (min-width: 1026px) {
                    .record_league {
                        left: 140px;
                        top: -37px;
                    }
                }`);
                sheet.insertRule(`
                @media (max-width: 1025px) {
                    .record_league {
                        left: 530px;
                        top: 6px;
                    }
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

    class ImprovedWaifu extends HHModule {
        constructor () {
            const baseKey = 'improvedWaifu'
            const configSchema = {
                baseKey,
                default: true,
                label: `Improved ${gameConfig.waifu} (Visit Harem Page first)`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('home') || (currentPage.includes('harem') && !currentPage.includes('hero')) || currentPage.includes('waifu.html')
        }

        getIds (waifuInfo, mode, favsOnly=false) {
            if (mode == 'Favorite') {
                let ids = Object.entries(waifuInfo.girls).filter(([key,value])=>value.fav).map(([key])=>(key))
                if (ids.length!=0||favsOnly) {
                    return ids
                }
            }
            return Object.keys(waifuInfo.girls)
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                if (currentPage.includes('home')) {
                    let waifuInfo = lsGet('WaifuInfo') || {girls:{}}
                    let cycle = waifuInfo.cycle || false
                    let mode = waifuInfo.mode || 'All'
                    let ids = this.getIds(waifuInfo, mode)
                    let girl_id = waifuInfo.girl_id || waifu.id_girl;
                    if (cycle) {
                        let temp_id = girl_id
                        if (ids.length == 1) {
                            temp_id = ids[0]
                        } else {
                            while (temp_id == girl_id) {
                                temp_id = ids[Math.floor(Math.random()*ids.length)]
                            }
                        }
                        girl_id = temp_id
                    }
                    if (waifuInfo.individual) {
                        girl_id = waifu.id_girl.toString()
                        waifuInfo.individual = false
                    }
                    waifuInfo.girl_id = girl_id
                    lsSet('WaifuInfo', waifuInfo)
                    const girlDict = HHPlusPlus.Helpers.getGirlDictionary()
                    let dictGirl = girlDict.get(girl_id)
                    if (!dictGirl) {console.log("Missing max grade info"); return}
                    let girlInfo = waifuInfo.girls[girl_id]
                    if (!girlInfo) {console.log("Missing unlocked grade info"); return}
                    let unlocked_grade = girlInfo.unlocked
                    let max_grade = dictGirl.grade || unlocked_grade
                    let selected_grade = girlInfo.grade === undefined ? Math.min(waifu.selected_grade, max_grade, unlocked_grade) : girlInfo.grade
                    let fav = girlInfo.fav || false

                    // replace animated girl
                    let waifu_animated = $('.waifu-container>canvas')
                    if (waifu_animated.length > 0) {
                        waifu_animated.eq(0).replaceWith(`<img src="https://${cdnHost}/pictures/girls/${girl_id}/ava${selected_grade}.png" class="avatar ">`)
                    }
                    // if hidden, put girl and re setup hide button
                    let display = waifuInfo.display || waifu.display
                    let $eye = $(".eye")
                    if (waifu.display == 0) {
                        $('.waifu-container').eq(0).append(`<img src="https://${cdnHost}/pictures/girls/${girl_id}/ava${selected_grade}.png" class="avatar ">`)
                        if (display == 1) {
                            $eye[0].children[0].src = `https://${cdnHost}/quest/ic_eyeclosed.svg`
                        }
                    }

                    let waifu_image = $('.waifu-container>img').eq(0)
                    if (selected_grade != waifu.selected_grade || girl_id != waifu.girl_id) {
                        waifu_image.attr('src',`https://${cdnHost}/pictures/girls/${girl_id}/ava${selected_grade}.png`)
                    }

                    $('.waifu-buttons-container a').remove()
                    let waifu_buttons = $('.waifu-buttons-container').eq(0)

                    // pose switch
                    let gradeSwitch = `<div class="diamond-bar"><div class="girls-name"><a href="/waifu.html">${dictGirl.name}</a><a href="/waifu.html"><img src="https://${cdnHost}/design/menu/edit.svg"></a></div>`
                    for (let i=0;i<7;i++) {
                        gradeSwitch += `<div class="diamond${i==selected_grade? ' selected': ''} ${i<=unlocked_grade ? 'un' : ''}locked${i>max_grade? ' hide' : ''}"></div>`
                    }
                    gradeSwitch += '</div>'
                    waifu_buttons.append(gradeSwitch)

                    let $edit_pose = $(`<div class="round_blue_button edit-pose" hh_title="Edit Pose"><img src="https://${cdnHost}/design/menu/edit.svg"></div>`)
                    let $reset_pose = $(`<div class="round_blue_button reset-pose hide" hh_title="Reset Pose"><img src="https://${cdnHost}/clubs/ic_xCross.png"></div>`)
                    let $save_pose = $(`<div class="round_blue_button save-pose hide" hh_title="Save Pose"><img src="https://${cdnHost}/clubs/ic_Tick.png"></div>`)
                    let $waifu_edit = $('<div class="waifu-edit"></div>').append($edit_pose, $reset_pose, $save_pose)
                    waifu_buttons.append($waifu_edit)

                    let $fav_girl = $(`<div class="round_blue_button fav-girl" hh_title="${fav? 'Unf' : 'F'}avorite ${gameConfig.Girl}"><img src="https://${cdnHost}/design/ic_star_${fav? 'orange' : 'white'}.svg"></div>`)
                    let $waifu_mode = $(`<div class="round_blue_button waifu-mode" hh_title="Mode: ${mode} ${gameConfig.Girl}s"><img src="https://${cdnHost}/pictures/design/${mode=='All'? 'harem.svg' : 'clubs/ic_Girls_S.png'}"></div>`)
                    let $random_waifu = $(`<div class="round_blue_button random-waifu" hh_title="Randomize ${gameConfig.waifu}"><img src="https://${cdnHost}/pictures/design/girls.svg"></div>`)
                    let $cycle_waifu = $(`<div class="round_blue_button cycle-waifu" hh_title="${cycle? 'Pause Cycle' : `Cycle ${gameConfig.waifu}`}" style="font-size:${cycle? '24px' : '0px'}">||<img src="https://${cdnHost}/design/menu/forward.svg" style="display: ${cycle? 'none' : 'inherit'}"></div>`)
                    let $waifu_right = $('<div class="waifu-right"></div>').append($fav_girl, $waifu_mode, $random_waifu, $cycle_waifu)
                    waifu_buttons.append($waifu_right)

                    if (display == 0) {
                        waifu_image.toggleClass('hide')
                        $('.diamond-bar').eq(0).toggleClass('hide')
                        $('.waifu-edit').eq(0).toggleClass('hide')
                        $('.waifu-right').eq(0).toggleClass('hide')
                        $eye[0].children[0].src = `https://${cdnHost}/quest/ic_eyeopen.svg`
                    }

                    // buttons
                    $eye.prop("onclick", null).off("click");
                    $eye.click(function() {
                        waifu_image.toggleClass('hide')
                        $('.diamond-bar').eq(0).toggleClass('hide')
                        $('.waifu-edit').eq(0).toggleClass('hide')
                        $('.waifu-right').eq(0).toggleClass('hide')
                        if (display == 0) {
                            this.children[0].src = `https://${cdnHost}/quest/ic_eyeclosed.svg`
                            display='1'
                        } else {
                            this.children[0].src = `https://${cdnHost}/quest/ic_eyeopen.svg`
                            display='0'
                        }
                        waifuInfo.display = display
                        lsSet('WaifuInfo',waifuInfo)
                    })

                    // waifu-edit
                    const size = {width: waifu_image.width()/2, height: waifu_image.height()/2}
                    let editing = false, panning = false;
                    let scale, x, y
                    try {scale = girlInfo.pose[selected_grade].scale || 1} catch {scale = 1}
                    try {x = girlInfo.pose[selected_grade].x || 0} catch {x = 0}
                    try {y = girlInfo.pose[selected_grade].y || 0} catch {y = 0}
                    let cord = {
                        x: x,
                        y: y,
                    }
                    let start = {x:0, y:0};
                    $edit_pose.click(function () {
                        $(".waifu-edit div").toggleClass("hide")
                        editing = true
                    })

                    $save_pose.click(function () {
                        $(".waifu-edit div").toggleClass("hide")
                        editing = false
                        if (cord.x != 0 || cord.y != 0 || scale != 1) {
                            if (!girlInfo.pose) {girlInfo.pose = {}}
                            let temp = {}
                            if (cord.x != 1) {temp.x = Math.round(cord.x)}
                            if (cord.y != 1) {temp.y = Math.round(cord.y)}
                            if (scale != 1) {temp.scale = +scale.toFixed(2)}
                            girlInfo.pose[selected_grade] = temp
                        } else if (girlInfo.pose) {
                            delete girlInfo.pose[selected_grade]
                        }
                        lsSet('WaifuInfo',waifuInfo)
                    })

                    $reset_pose.click(function () {
                        waifu_image.css('transform','')
                        cord = {x:0, y:0}
                        start = {x:0, y:0}
                        scale = 1;
                    })

                    function setTransform() {
                        waifu_image.css('transform',`translate(${Math.round(cord.x)}px, ${Math.round(cord.y)}px) scale(${scale})`);
                    }
                    setTransform();

                    waifu_image.mousedown(function (e) {
                        if (!editing) {return;}
                        e.preventDefault();
                        start = {x: e.clientX-cord.x, y: e.clientY-cord.y}
                        panning = true;
                    })
                    waifu_image.mouseup(function (e) {
                        if (!editing) {return}
                        e.preventDefault();
                        panning = false;
                    })
                    waifu_image.mouseleave(function (e) {
                        if (!editing) {return}
                        panning = false;
                    })
                    waifu_image.mousemove(function (e) {
                        if(!panning||!editing) {return}
                        cord = {x: e.clientX - start.x, y: e.clientY-start.y}
                        setTransform();
                    })
                    waifu_image.bind('mousewheel', function (e) {
                        if (!editing) {return}
                        e.preventDefault();
                        const offset = waifu_image.offset(), old_scale = scale
                        const point = {x: e.clientX-offset.left, y: e.clientY-offset.top}
                        if(e.originalEvent.deltaY < 0) {
                            scale += 0.1;
                        } else {
                            scale = Math.max(scale-0.05, 0.1);
                        }
                        // translation needs improvment
                        cord = {x: cord.x-(scale/old_scale-1)*(point.x-size.width*old_scale),
                                y: cord.y-(scale/old_scale-1)*(point.y-size.height*old_scale)}
                        setTransform();
                    })

                    $('.diamond').each(function (index) {
                        $(this).click(() => {
                            if (selected_grade!=index && $(this).hasClass('unlocked')) {
                                if (editing) {
                                    $(".waifu-edit div").toggleClass("hide")
                                    editing = false
                                }
                                $('.diamond.unlocked').eq(selected_grade).removeClass('selected')
                                $(this).addClass('selected')
                                selected_grade = index
                                waifu_image.attr('src',`https://${cdnHost}/pictures/girls/${girl_id}/ava${index}.png`)
                                start = {x:0, y:0}
                                try {scale = girlInfo.pose[selected_grade].scale || 1} catch {scale = 1}
                                try {x = girlInfo.pose[selected_grade].x || 0} catch {x = 0}
                                try {y = girlInfo.pose[selected_grade].y || 0} catch {y = 0}
                                cord = {x: x, y: y}
                                setTransform();
                                girlInfo.grade = selected_grade
                                lsSet('WaifuInfo',waifuInfo)
                            }
                        })
                    })

                    // waifu-right
                    $fav_girl.click(() => {
                        if (fav) {
                            $fav_girl.attr('hh_title',`Favorite ${gameConfig.Girl}`)
                            $fav_girl.children(0).attr('src',`https://${cdnHost}/design/ic_star_white.svg`)
                            delete girlInfo.fav
                        } else {
                            $fav_girl.attr('hh_title',`Unfavorite ${gameConfig.Girl}`)
                            $fav_girl.children(0).attr('src',`https://${cdnHost}/design/ic_star_orange.svg`)
                            girlInfo.fav = true
                        }
                        fav = !fav
                        lsSet('WaifuInfo',waifuInfo)
                    })

                    $waifu_mode.click(() => {
                        if (mode == 'All') {
                            $waifu_mode.attr('hh_title',`Mode: Favorite ${gameConfig.Girl}s`)
                            $waifu_mode.children(0).attr('src',`https://${cdnHost}/pictures/design/clubs/ic_Girls_S.png`)
                            mode = 'Favorite'
                        } else {
                            $waifu_mode.attr('hh_title',`Mode: All ${gameConfig.Girl}s`)
                            $waifu_mode.children(0).attr('src',`https://${cdnHost}/pictures/design/harem.svg`)
                            mode = 'All'
                        }
                        waifuInfo.mode = mode
                        lsSet('WaifuInfo',waifuInfo)
                    })

                    $cycle_waifu.click(() => {
                        $cycle_waifu.attr('hh_title',cycle? `Cycle ${gameConfig.waifu}` : 'Pause Cycle')
                        $cycle_waifu.css('font-size',cycle? '0px' : '24px')
                        $('.cycle-waifu img').css('display',cycle? 'inherit' : 'none')
                        cycle = !cycle
                        waifuInfo.cycle = cycle
                        lsSet('WaifuInfo',waifuInfo)
                    })

                    $random_waifu.click(() => {
                        ids = this.getIds(waifuInfo, mode)
                        let temp_id = girl_id
                        if (ids.length == 1) {
                            temp_id = ids[0]
                        } else {
                            while (temp_id == girl_id) {
                                temp_id = ids[Math.floor(Math.random()*ids.length)]
                            }
                        }
                        girl_id = temp_id
                        dictGirl = girlDict.get(girl_id)
                        if (!dictGirl) {console.log("Missing max grade info"); return}
                        girlInfo = waifuInfo.girls[girl_id]
                        if (!girlInfo) {console.log("Missing unlocked grade info"); return}
                        unlocked_grade = girlInfo.unlocked
                        max_grade = dictGirl.grade || unlocked_grade
                        selected_grade = girlInfo.grade === undefined ? Math.min(max_grade, unlocked_grade) : girlInfo.grade
                        fav = girlInfo.fav || false
                        start = {x:0, y:0}
                        try {scale = girlInfo.pose[selected_grade].scale || 1} catch {scale = 1}
                        try {x = girlInfo.pose[selected_grade].x || 0} catch {x = 0}
                        try {y = girlInfo.pose[selected_grade].y || 0} catch {y = 0}
                        cord = {x: x, y: y}

                        waifu_image.attr('src',`https://${cdnHost}/pictures/girls/${girl_id}/ava${selected_grade}.png`)
                        setTransform();
                        $('.girls-name a').eq(0).text(dictGirl.name)
                        $('.diamond').each(function (index) {
                            index == selected_grade ? $(this).addClass('selected') : $(this).removeClass('selected')
                            if (index <= unlocked_grade) {
                                $(this).addClass ('unlocked')
                                $(this).removeClass ('locked')
                            } else {
                                $(this).addClass ('locked')
                                $(this).removeClass ('unlocked')
                            }
                            index > max_grade ? $(this).addClass ('hide') : $(this).removeClass ('hide')
                        })
                        if (editing) {
                            $(".waifu-edit div").toggleClass("hide")
                            editing = false
                        }
                        if (fav) {
                            $fav_girl.attr('hh_title',`Unfavorite ${gameConfig.Girl}`)
                            $fav_girl.children(0).attr('src',`https://${cdnHost}/design/ic_star_orange.svg`)
                        } else {
                            $fav_girl.attr('hh_title',`Favorite ${gameConfig.Girl}`)
                            $fav_girl.children(0).attr('src',`https://${cdnHost}/design/ic_star_white.svg`)
                        }

                        waifuInfo.girl_id = girl_id
                        lsSet('WaifuInfo', waifuInfo)
                    })

                    $('.promo_discount').remove()
                    $('#blog_button').remove()

                    sheet.insertRule(`
                    .hide {
                        display: none!important;
                    }`);
                    sheet.insertRule(`
                    .waifu-container {
                        z-index: 1;
                        margin-top: 0px;
                        left: 15px;
                    }`)
                    sheet.insertRule(`
                    .waifu-buttons-container {
                        z-index: 2;
                        width: 70px;
                    }`);
                    sheet.insertRule(`
                    .info-container {
                        z-index: 1;
                    }`)
                    sheet.insertRule(`
                    .waifu-buttons-container .diamond-bar {
                        right: 110px;
                        width: 240px;
                        display: flex;
                        justify-content: center;
                    }`);
                    sheet.insertRule(`
                    .waifu-buttons-container .girls-name {
                        position: absolute;
                        bottom: 26px;
                        line-height: 18px;
                        text-align: center;
                        text-shadow: 2px 2px 5px black;
                    }`);
                    sheet.insertRule(`
                    .girls-name a {
                        color: white;
                        text-decoration: none;
                    }`);
                    sheet.insertRule(`
                    .girls-name img {
                        width: 16px;
                        height: 16px;
                        margin-left: 5px;
                        margin-bottom: 2px;
                        filter: drop-shadow(2px 2px 3px black);
                    }`);
                    sheet.insertRule(`
                    .waifu-buttons-container .round_blue_button {
                        width: 32px;
                        height: 32px;
                    }`);
                    sheet.insertRule(`
                    .waifu-buttons-container .round_blue_button img {
                        width: 20px;
                        height: 20px;
                    }`);
                    sheet.insertRule(`
                    .waifu-edit {
                        position: absolute;
                        bottom: 36px;
                        display: grid;
                        gap: 5px;
                    }`);
                    sheet.insertRule(`
                    .round_blue_button.save-pose img {
                        height: 15px;
                    }`);
                    sheet.insertRule(`
                    .waifu-right {
                        position: absolute;
                        left: 38px;
                        bottom: 0px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-gap: 5px;
                    }`);
                } else if (currentPage.includes('waifu.html')) {
                    let waifuInfo = lsGet('WaifuInfo')
                    if (!waifuInfo) {return}
                    let favs = this.getIds(waifuInfo, 'Favorite', true)

                    $('.harem-girl-container').each(function() {
                        let id = $(this).attr('id_girl')
                        let fav = favs.includes(id)
                        $(this).children().last().replaceWith(`<div class="fav-girl" fav=${fav}><img src="https://${cdnHost}/design/ic_star_${fav? 'orange' : 'white'}.svg"></div>`)
                        let $fav_button = $(this).children().last()
                        $fav_button.click(() => {
                            let fav = $fav_button.attr('fav') === 'true'
                            $fav_button.children().attr('src',`https://${cdnHost}/design/ic_star_${fav? 'orange' : 'white'}.svg`)
                            $fav_button.attr('fav', !fav)
                            fav? waifuInfo.girls[id].fav = true : delete waifuInfo.girls[id].fav
                            lsSet('WaifuInfo', waifuInfo)
                        })
                    })

                    HHPlusPlus.Helpers.onAjaxResponse(/action=waifu_select/i, (response, opt) => {
                        const searchParams = new URLSearchParams(opt.data)
                        const id_girl = searchParams.get('id_girl')

                        waifuInfo.individual = true
                        lsSet('WaifuInfo', waifuInfo)
                    })

                    sheet.insertRule(`
                    .fav-girl img {
                        width: 20px;
                        height: 20px;
                    }`);
                    sheet.insertRule(`
                    .fav-girl {
                        margin-top: 9px;
                    }`);
                } else {
                    // harem data collection
                    let waifuInfo = lsGet('WaifuInfo') || {girls:{}}
                    Object.entries(girlsDataList).forEach(([girlId, girl]) => {
                        if (girl.own) {
                            let unlocked_grade = (girl.graded2.match(/\<g \>/g) || []).length;
                            if (waifuInfo.girls[girlId]) {
                                waifuInfo.girls[girlId].unlocked = unlocked_grade
                            } else {
                                waifuInfo.girls[girlId] = {unlocked: unlocked_grade}
                            }
                        }
                    })
                    lsSet('WaifuInfo', waifuInfo)
                }
            })

            this.hasRun = true
        }
    }

    class PachinkoLog extends HHModule {
        constructor () {
            const baseKey = 'PachinkoLog'
            const configSchema = {
                baseKey,
                default: true,
                label: `${gameConfig.pachinko} Log`
            }
            super({name: baseKey, configSchema})

            this.reward_keys = {
                type: {
                    X: "books",
                    K: "gifts",
                    B: "boosters",
                    E: "equips",
                    g: "girls",
                    G: "gems",
                    F: "frames"
                },
                rarity: {
                    C: "Common",
                    R: "Rare",
                    E: "Epic",
                    L: "Legendary",
                    M: "Mythic"
                },
                gems: {
                    GDo: gameConfig.dom,
                    GSu: "Submissive",
                    GVo: "Voyeur",
                    GEc: "Eccentric",
                    GEx: "Exhibitionist",
                    GPh: "Physical",
                    GPl: "Playful",
                    GSe: "Sensual"
                }
            }
        }

        shouldRun () {
            return currentPage.includes('pachinko')
        }

        countSummary(pachinko_log, type_info) {
            let pachinko_type = type_info.match(/\D+/)[0]

            let summary = {total: pachinko_log.length}
            pachinko_log.forEach((roll) => {
                let drops = roll.split(',')
                if (pachinko_type != 'great' || ((Hero.infos.level<100 && drops[1]<100) || (Hero.infos.level>99 && drops[1]>99))) {
                    drops.slice(pachinko_type != 'great'? 1 : 2).forEach((item) => {
                        let type = this.reward_keys.type[item[0]]
                        if (type == 'equips') {
                            item = item.match(/\D+\d+/g)[1]
                            if (item[0] != 'L') {
                                item = item[0]
                            }
                            item = 'E'+item
                        }
                        if (type == 'girls') {item = 'g'}
                        summary[type]? summary[type].total++ : summary[type] = {total:1}
                        summary[type][item] = summary[type][item]+1 || 1
                        if (type != 'girls' && type !='gems') {
                            let rarity = `rarity-${type=='equips'? item[1] : item.slice(-1)}`
                            if (type == 'equips' && rarity!='rarity-L') {
                                rarity = 'rarity-O'
                            }
                            summary[type][rarity] = summary[type][rarity]+1 || 1
                        }
                    })
                }
            })
            return summary
        }

        buildSummary(type_info, summary) {
            let type = type_info.match(/\D+/)[0]
            let games = type!='event'? type_info.match(/\d+/)[0] : 4
            let no_girls = type_info.slice(-2) == 'ng' ? true : false
            let rewards = games>1? (type!='event'&&(!no_girls || type=='great'))? games-1 : games : 1
            let reward_keys = this.reward_keys

            function getPct(item) {
                let cat = reward_keys.type[item[0]]
                if (item.includes('rarity')) {
                    item = item.slice(1)
                }
                let isTotal = item.length == 1 && item != 'g'

                let count = summary[cat]? summary[cat][isTotal? 'total' : item] || 0 : 0
                let pct = (100*count/(summary.total * (cat!='gems'? type == 'great'? (cat=='girls'? 1 : games) : rewards : 1))).toFixed(2)

                return(`<span ${(item.includes('rarity') || isTotal)?`class="side-sum${isTotal? ' cat-sum': ''}" ` : ''}hh_title="${count}">${pct}%<span>`)
            }

            return (`
            <div class="pachinko-summary ${type} ${games}-game${no_girls? ' no-girls' : ''} ${type_info}">
                <div class="summary-header">
                    <span class="log-button reset-log" pachinko="${type_info}">
                        <img alt="Reset ${gameConfig.pachinko} Log" hh_title="Reset ${gameConfig.pachinko} Log" src="https://${cdnHost}/caracs/no_class.png">
                    </span>
                    <h1>${capFirst(type)}-${games}-${games>1? 'Games' : 'Game'}${no_girls? ' - No-Girls' : ''}</h1>
                    <span class="sample-count orb_icon o_${type!='event'? type[0] : 'v'}${games}" hh_title="Sample Size">${summary.total}</span>
                    <span class="log-button record-log" pachinko="${type_info}">
                        <img alt="Copy ${gameConfig.pachinko} Log" hh_title="Copy ${gameConfig.pachinko} Log" src="https://${cdnHost}/design/ic_books_gray.svg">
                    </span>
                </div>
                <div class="summary-body ${type}">
                    <span>${rewards>1? rewards : ''} Random ${games>1? 'Rewards' : 'Reward'}${(type == 'great' && games == 10)? ' + 1 Legendary Equip' : ''}</span>
                    ${type == 'great'? '' :
                    `<span>+</span>
                    <span>${type == 'mythic'? games == '1'? '10': games == '3'? '10 Shards and<br>30' : '25 Shards and<br>60' : type == 'event'? '70' : ''}
                          ${type == 'epic'? games == '1'? `${isHH? '1 Frame and ' : ''}50`: `1 Girl${isHH? ', 10 Frames,' : ''} and<br> 200` : ''} Gems</span>`}
                    <div class="rewards-summary">
                        ${no_girls || (games>1 && (type!='great' && type!='event')) || (games==1 && type=='great') ? '' :
                        `<div class="summary-div">
                            <ul class="summary-grid girls-summary">
                                <li>
                                    <img alt="${gameConfig.Girl}" hh_title="${gameConfig.Girl}" src="https://${cdnHost}/pictures/design/harem.svg">
                                    ${getPct('g')}
                                </li>
                            </ul>
                        </div>`}
                        ${type == 'event'? '' :
                        `<div class="summary-div">
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('X')}
                            </div>`}
                            ${(type=='great' && Hero.infos.level<100)? '' :
                            `<div class="side-sum-container">
                                ${getPct('Xrarity-L')}
                            </div>
                            <ul class="summary-grid books-summary legendary">
                                <li>
                                    <img alt="${gameConfig.books.XP1}" hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
                                    ${getPct('XP4L')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Xrarity-E')}
                            </div>
                            <ul class="summary-grid books-summary epic">
                                <li>
                                    <img alt="${gameConfig.books.XP1}" hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
                                    ${getPct('XP4E')}
                                </li>
                            </ul>
                            ${Hero.infos.level>99? '' :
                            `<div class="side-sum-container">
                                ${getPct('Xrarity-R')}
                            </div>
                            <ul class="summary-grid books-summary rare">
                                <li>
                                    <img alt="${gameConfig.books.XP1}" hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
                                    ${getPct('XP4R')}
                                </li>
                            </ul>`}`}
                        </div>`}
                        ${type == 'mythic'? '' :
                        `<div class="summary-div">
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                               ${getPct('K')}
                            </div>`}
                            ${(type=='great' && Hero.infos.level<100)? '' :
                            `<div class="side-sum-container">
                               ${getPct('Krarity-L')}
                            </div>
                            <ul class="summary-grid gifts-summary legendary">
                                <li>
                                    <img alt="${gameConfig.gifts.K1}" hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
                                    ${getPct('K4L')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Krarity-E')}
                            </div>
                            <ul class="summary-grid books-summary epic">
                                <li>
                                    <img alt="${gameConfig.gifts.K1}" hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
                                    ${getPct('K4E')}
                                </li>
                            </ul>
                            ${Hero.infos.level>99? '' :
                            `<div class="side-sum-container">
                                ${getPct('Krarity-R')}
                            </div>
                            <ul class="summary-grid books-summary rare">
                                <li>
                                    <img alt="${gameConfig.gifts.K1}" hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
                                    ${getPct('K4R')}
                                </li>
                            </ul>`}`}
                        </div>`}
                        ${type == 'event' || type == 'great' || (type == 'epic' && games == '1')? '' :
                        `<div class="summary-div">
                            <div class="side-sum-container">
                                ${getPct('Brarity-L')}
                            </div>
                            <ul class="summary-grid boosters-summary legendary">
                                <li>
                                    <img alt="${gameConfig.boosters.B1}" hh_title="${gameConfig.boosters.B1}" src="https://${cdnHost}/pictures/items/B1.png">
                                    ${getPct('B1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B2}" hh_title="${gameConfig.boosters.B2}" src="https://${cdnHost}/pictures/items/B2.png">
                                    ${getPct('B2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B3}" hh_title="${gameConfig.boosters.B3}" src="https://${cdnHost}/pictures/items/B3.png">
                                    ${getPct('B3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B4}" hh_title="${gameConfig.boosters.B4}" src="https://${cdnHost}/pictures/items/B4.png">
                                    ${getPct('B4L')}
                                </li>
                            </ul>
                        </div>`}
                        ${type == 'mythic' || (type =='epic' && games == '1')? '' :
                        `<div class="summary-div">
                            ${(type != 'great' || (Hero.infos.level<100 && games == '1'))? '' :
                            `<div class="side-sum-container">
                                ${getPct('E')}
                            </div>`}
                            ${(Hero.infos.level<100 && type == 'great' && games == '1')? '' :
                            `<div class="side-sum-container">
                                ${getPct('Erarity-L')}
                            </div>
                            <ul class="summary-grid equips-summary legendary">
                                <li>
                                    <img alt="Super Sexy" hh_title="Super Sexy" src="https://${cdnHost}/pictures/misc/items_icons/16.svg">
                                    ${getPct('EL16')}
                                </li>
                                <li>
                                    <img alt="Hardcore" hh_title="Hardcore" src="https://${cdnHost}/pictures/misc/items_icons/1.png">
                                    ${getPct('EL1')}
                                </li>
                                <li>
                                    <img alt="Charming" hh_title="Charming" src="https://${cdnHost}/pictures/misc/items_icons/2.png">
                                    ${getPct('EL2')}
                                </li>
                                <li>
                                    <img alt="Expert" hh_title="Expert" src="https://${cdnHost}/pictures/misc/items_icons/3.png">
                                    ${getPct('EL3')}
                                </li>
                                <li>
                                    <img alt="Tough" hh_title="Tough" src="https://${cdnHost}/pictures/misc/items_icons/4.png">
                                    ${getPct('EL4')}
                                </li>
                                <li>
                                    <img alt="Lucky" hh_title="Lucky" src="https://${cdnHost}/pictures/misc/items_icons/5.png">
                                    ${getPct('EL5')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Erarity-O')}
                            </div>
                            <ul class="summary-grid equips-summary epic">
                                <li>
                                    <img alt="Equip" hh_title="Epic Equip" src="https://${cdnHost}/pictures/items/EH1.png">
                                    ${getPct('EE')}
                                </li>
                            </ul>
                            ${(games == '1' && Hero.infos.level>99)? '' :
                            `<ul class="summary-grid equips-summary rare">
                                <li>
                                    <img alt="Equip" hh_title="Rare Equip" src="https://${cdnHost}/pictures/items/EH1.png">
                                    ${getPct('ER')}
                                </li>
                            </ul>`}`}
                        </div>`}
                    </div>
                    ${type == 'great'? '' :
                    `<span></span>
                    <ul class="summary-grid gems-summary">
                        <li>
                            <img alt="${gameConfig.dom} Gems" hh_title="${gameConfig.dom} Gems" src="https://${cdnHost}/pictures/design/gems/darkness.png">
                            ${getPct('GDo')}
                        </li>
                        <li>
                            <img alt="Submissive Gems" hh_title="Submissive Gems" src="https://${cdnHost}/pictures/design/gems/light.png">
                            ${getPct('GSu')}
                        </li>
                        <li>
                            <img alt="Voyeur Gems" hh_title="Voyeur Gems" src="https://${cdnHost}/pictures/design/gems/psychic.png">
                            ${getPct('GVo')}
                        </li>
                        <li>
                            <img alt="Eccentric Gems" hh_title="Eccentric Gems" src="https://${cdnHost}/pictures/design/gems/fire.png">
                            ${getPct('GEc')}
                        </li>
                        <li>
                            <img alt="Exhibitionist Gems" hh_title="Exhibitionist Gems" src="https://${cdnHost}/pictures/design/gems/nature.png">
                            ${getPct('GEx')}
                        </li>
                        <li>
                            <img alt="Physical Gems" hh_title="Physical Gems" src="https://${cdnHost}/pictures/design/gems/stone.png">
                            ${getPct('GPh')}
                        </li>
                        <li>
                            <img alt="Playful Gems" hh_title="Playful Gems" src="https://${cdnHost}/pictures/design/gems/sun.png">
                            ${getPct('GPl')}
                        </li>
                        <li>
                            <img alt="Sensual Gems" hh_title="Sensual Gems" src="https://${cdnHost}/pictures/design/gems/water.png">
                            ${getPct('GSe')}
                        </li>
                    </ul>`}
                </div>
            </div>
            `)
        }

        buildSummaries() {
            const type = $('.playing-zone').eq(0).attr('type-panel')
            const pachinko_log = lsGet('PachinkoLog') || {}
            let types = Object.keys(pachinko_log).filter(t => t.includes(type)).sort().sort((a,b) => a.match(/\d+/)[0]-b.match(/\d+/)[0])

            let summaries = ``
            if (types.length) {
                types.forEach((t) => {
                    summaries += this.buildSummary(t,this.countSummary(pachinko_log[t],t))
                })
            }else {
                summaries = `<h1>No Data Recorded<\h1>`
            }

            return summaries
        }

        attachLog () {
            $('.nicescroll-rails.nicescroll-rails-vr').removeClass('hide')
            const $button = $('<div class="blue_circular_btn pachinko-log-btn"><span class="info_icn"></span></div>')
            const $panel = $(`<div class="pachinko-log-panel">${this.buildSummaries()}</div>`)
            const $overlayBG = $('<div class="pachinko-log-overlay-bg"></div>')
            $('#playzone-replace-info').append($button).append($panel).append($overlayBG)

            $button.click(() => {
                $('.nicescroll-rails.nicescroll-rails-vr').toggleClass('hide')
                if ($panel.hasClass('visible')) {
                    $panel.removeClass('visible')
                    $overlayBG.removeClass('visible')
                } else {
                    $panel.addClass('visible')
                    $overlayBG.addClass('visible')
                }
            })

            $overlayBG.click(() => {
                $('.nicescroll-rails.nicescroll-rails-vr').toggleClass('hide')
                $panel.removeClass('visible')
                $overlayBG.removeClass('visible')
            })

            const reward_keys = this.reward_keys
            function copyLog(pachinko,pachinko_log) {
                const type = pachinko.match(/\D+/)[0]
                let log = ''

                pachinko_log.forEach((roll) => {
                    let drops = roll.split(',').filter(e => e[0]!='F') //no need to print frames
                    let offset = type != 'great'? 1 : 2
                    drops.slice(offset).forEach((item, index) => {
                        const cat = reward_keys.type[item[0]]
                        let drop = item
                        if (cat == 'books' || cat == 'gifts' || cat == 'boosters') {
                            const rarity = reward_keys.rarity[item.slice(-1)]
                            const name = gameConfig[cat][item.slice(0,-1)]
                            drop = `${type=='great'? `${rarity} ` : ''}${name}`
                        }else if (cat == 'girls') {
                            const girlDict = HHPlusPlus.Helpers.getGirlDictionary()
                            drop = girlDict.get(item.match(/\d+/g)[0]).name
                        }else if (cat == 'gems') {
                            drop = reward_keys.gems[item]
                        }else if (cat == 'frames') {
                            let frames = item.match(/\d+/g)[0]
                            drop = frames==1? 'Frame' : `${frames} Frames`
                        }
                        drops[index+offset] = drop
                    })

                    log += `${drops.join('\t')}\n`
                })

                copyText(log)
            }

            $('.log-button.record-log').each(function (index) {
                let pachinko = $(this).attr('pachinko')
                $(this).click(() => {
                    const pachinko_log = lsGet('PachinkoLog') || {}
                    copyLog(pachinko,pachinko_log[pachinko])
                })
            })

            $('.log-button.reset-log').each(function (index) {
                let pachinko = $(this).attr('pachinko')
                $(this).click(() => {
                    let pachinko_log = lsGet('PachinkoLog') || {}
                    copyLog(pachinko,pachinko_log[pachinko])
                    delete pachinko_log[pachinko]
                    $(`.pachinko-summary.${pachinko}`).remove()
                    lsSet('PachinkoLog', pachinko_log)
                })
            })
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                let no_girls = {};
                pachinkoDef.forEach((pachinko) => {
                    no_girls[pachinko.type] = pachinko.content.rewards.girl_shards? false : true
                });

                if ($('.playing-zone').length) {
                    this.attachLog()
                    new MutationObserver(() => this.attachLog()).observe($('.playing-zone')[0], {attributes: true})
                } else {
                    const observer = new MutationObserver(() => {
                        if ($('.playing-zone').length) {
                            this.attachLog()
                            new MutationObserver(() => this.attachLog()).observe($('.playing-zone')[0], {attributes: true})
                            observer.disconnect()
                        }
                    })
                    observer.observe($('#pachinko_whole')[0], {childList: true})
                }

                sheet.insertRule(`
                .nicescroll-rails.nicescroll-rails-vr.hide {
                    display: none!important;
                }`)
                sheet.insertRule(`
                .pachinko-log-btn {
                   position: absolute;
                   top: 2px;
                   right: 44px;
                   width: 35px;
                   height: 35px;
                }`)
                sheet.insertRule(`
                .playing-zone .wrapper {
                    overflow: visible;
                }`);
                sheet.insertRule(`
                .pachinko-log-overlay-bg {
                    display: none;
                    width: 150%;
                    height: 120%;
                    position: absolute;
                    top: -10%;
                    left: -25%;
                    z-index: 51;
                }`);
                sheet.insertRule(`
                .pachinko-log-panel {
                    display: none;
                    background-color: #080808f5;
                    color: #fff;
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
                    font-weight: 400;
                    position: absolute;
                    top: 40px;
                    left: -40px;
                    width: 450px;
                    z-index: 52;
                    border-radius: 5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #cccccc42;
                    padding: 4px;
                    grid-gap: 10px;
                    grid-template-columns: auto;
                    max-height: 470px;
                    overflow-y: auto;
                }`);
                sheet.insertRule(`
                .pachinko-log-overlay-bg.visible {
                    display: block;
                }`);
                sheet.insertRule(`
                .pachinko-log-panel.visible {
                    display: grid;
                }`);
                sheet.insertRule(`
                .summary-header {
                    display: grid;
                    grid-template-columns: 32px 1fr 50px 32px;
                    grid-gap: 10px;
                    align-content: center;
                    justify-items: center;
                }`);
                sheet.insertRule(`
                .pachinko-log-panel h1 {
                    text-align: center;
                    font-size: 1.4em;
                }`);
                sheet.insertRule(`
                .pachinko-summary.event h1 {
                    color: #62d8ff;
                }`);
                sheet.insertRule(`
                .pachinko-summary.epic h1 {
                    color: #ffa23e;
                }`);
                sheet.insertRule(`
                .pachinko-summary.mythic h1 {
                    color: #ffb80a;
                }`);
                sheet.insertRule(`
                .pachinko-summary.great h1 {
                    color: #0bff08;
                }`);
                sheet.insertRule(`
                .summary-header img {
                    width: 32px;
                    height: 32px;
                }`);
                sheet.insertRule(`
                .summary-header .sample-count {
                    background-position: center;
                    text-align: center;
                    text-shadow: 2px 2px 2px black;
                    padding-top: 10px;
                }`);
                sheet.insertRule(`
                .summary-body {
                    display: grid;
                    grid-template-columns: 1fr 1em 1fr;
                    text-align: center;
                    align-items: center;
                }`);
                sheet.insertRule(`
                .summary-body.great {
                    grid-template-columns: 1fr;
                }`);
                sheet.insertRule(`
                .summary-div {
                    display: flex;
                    flex-wrap: nowrap;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }`);
                sheet.insertRule(`
                .side-sum-container {
                    width: 1.5em;
                    overflow: visible;
                    display: flex;
                    justify-content: center;
                }`);
                sheet.insertRule(`
                .rewards-summary .side-sum {
                    -webkit-transform: rotate(-90deg);
                    -moz-transform: rotate(-90deg);
                    -ms-transform: rotate(-90deg);
                    -o-transform: rotate(-90deg);
                    font-size: 14px;
                    display: inline-block;
                }`);
                sheet.insertRule(`
                .side-sum.cat-sum {
                    font-size: 16px;
                }`);
                sheet.insertRule(`
                .summary-grid {
                    display: grid;
                    list-style: none;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    grid-gap: 0px;
                    padding: 0px;
                    margin: 0px;
                    flex-wrap: nowrap;
                    font-size: 12px;
                    flex-basis: 0;
                    gap: 2px;
                }`);
                sheet.insertRule(`
                .summary-grid img {
                    width: 40px;
                    height: 40px;
                }`);
                sheet.insertRule(`
                .summary-grid.legendary img {
                    background-image: url(https://sh.hh-content.com/legendary.png);
                    background-size: contain;
                    background-color: #9150bf;
                }`);
                sheet.insertRule(`
                .summary-grid.epic img {
                    background: #ffb244;
                }`);
                sheet.insertRule(`
                .summary-grid.rare img {
                    background: #23b56b;
                }`);
                sheet.insertRule(`
                .equips-summary.legendary {
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
                }`);
                sheet.insertRule(`
                .epic .equips-summary.legendary {
                    width: 164px;
                }`);
                sheet.insertRule(`
                .event .equips-summary.legendary {
                    width: 168px;
                }`);
                sheet.insertRule(`
                .summary-grid.girls-summary {
                    grid-template-columns:
                    min-content;
                }`);
                sheet.insertRule(`
                .summary-grid.gems-summary {
                    grid-gap: 0px;
                    align-self: start;
                }`);

                const gems_abrv = {
                    'darkness': 'GDo',
                    'light': 'GSu',
                    'psychic': 'GVo',
                    'fire': 'GEc',
                    'nature': 'GEx',
                    'stone': 'GPh',
                    'sun': 'GPl',
                    'water': 'GSe'
                }
                HHPlusPlus.Helpers.onAjaxResponse(/class=Pachinko&action=play/i, (response, opt) => {
                    const searchParams = new URLSearchParams(opt.data)
                    const pachinko = pachinkoDef.find(o => o.id == searchParams.get('what').slice(-1))
                    const type = pachinko.type
                    const games = searchParams.get('how_many')
                    const rewards = response.rewards.data
                    const plist = `${type}${games}${(no_girls[type] && !(type == 'great' && games == 1))? 'ng': ''}`
                    let pachinko_log = lsGet('PachinkoLog') || {}
                    if(!pachinko_log[plist]) {pachinko_log[plist] = [];}
                    let roll = [new Date().getTime()]
                    if (type == 'great') {roll.push(Hero.infos.level)}

                    if (rewards.shards) {
                        rewards.shards.forEach((shards) => {
                            roll.push('g'+shards.id_girl)
                        })
                    }
                    rewards.rewards.forEach((reward) => {
                        if (reward.type.includes('item') || reward.type == 'armor') {
                            const items = $(reward.value.replace(/^\n/,''))
                            const item = items.find('img:not(.stats_icon)')[0].src.match(/items\/(.+)\.png/)[1]
                            const rarity = items.attr('rarity')[0].toUpperCase()

                            if (reward.type.includes('item')) {
                                const count = Math.max(1,items.find('.value_reward')[0].innerText)
                                for (let i=0;i<count;i++) {
                                    roll.push(item+rarity)
                                }
                            } else {
                                roll.push(item+rarity+JSON.parse(items.attr('data-d')).name_add)
                            }
                        } else if (reward.type == 'frames') {
                            roll.push(`F${$(reward.value).text()}`)
                        } else if (reward.type == 'gems'){
                            const gem = $(reward.value).attr('src').match(/(?<=gems\/)(.+)(?=\.png)/g)[0]
                            roll.push(gems_abrv[gem])
                        }
                    })

                    if (response.no_more_girls) {
                        console.log('no more girls')
                        no_girls[type] = true
                    }

                    pachinko_log[plist].push(roll.join(','))
                    lsSet('PachinkoLog', pachinko_log)
                })
            })

            this.hasRun = true
        }
    }

    const allModules = [
        new DailyMissionsRestyle(),
        new GirlDataRecord(),
        new LeagueDataCollector(),
        new ImprovedWaifu(),
        new PachinkoLog()
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
