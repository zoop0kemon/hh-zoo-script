// ==UserScript==
// @name            Zoo's HH Scripts
// @description     Some style and data recording scripts by zoopokemon
// @version         0.6.1
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.mangarpg.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @downloadURL     https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @grant           none
// @author          zoopokemon
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.6.1: Changed Villain Drops Recorder shard drop notation and handling
// 0.6.0: Migrated Improved Waifu and Compact Daily Missions into HH++, and added Villain Drops Recorder (off by default)
// 0.5.10: Fixing copy league buttons and adjusting Improved Waifu placement
// 0.5.9: Fixed error with Improved Waifu and animated girl
// 0.5.8: Fixed some style errors
// 0.5.7: Updated tooltips
// 0.5.6: Various bug fixes
// 0.5.5: Full support for mythic equips in Pachinko log and protection for Double Date Event
// 0.5.4: Added basic support for mythic equips in Pachinko Log
// 0.5.3: Split Market/Harem style tweaks
// 0.5.2: Fixed market style conflicts with HH++ update and better Improved Waifu loading
// 0.5.1: Uncovered Restock button
// 0.5.0: Added some temporary Market/Harem Style Tweaks
// 0.4.4: Fixed pachinko log
// 0.4.3: Better tracking of banned players.
// 0.4.2: League Data Collector will now note any banned players found in a league.
// 0.4.1: Mostly fixed title overflow for Daily Mission Restyle, and adjusted Copy Contest display and style.
// 0.4.0: Added Copy Contests. Copying flag info is now translated to English.
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

    const flag_fr=["Andorre", "Émirats Arabes Unis", "Antigua-et-Barbuda", "Albanie", "Arménie", "Antilles Néerlandaises", "Antarctique", "Argentine", "Samoa Américaines", "Autriche", "Australie", "Åland", "Azerbaïdjan", "Bosnie-Herzégovine", "Barbade", "Belgique", "Bulgarie", "Bahreïn", "Bénin", "Bermudes", "Brunei", "Bolivie", "Brésil", "Bhoutan", "Île Bouvet", "Biélorussie", "Îles Cocos", "Centrafrique", "Suisse", "Côte d'Ivoire", "Îles Cook", "Chili", "Cameroun", "Chine", "Colombie", "Serbie-et-Monténégro", "Cap-vert", "Île Christmas", "Chypre", "Tchèque", "Allemagne", "Danemark", "Dominique", "Dominicaine", "Algérie", "Équateur", "Estonie", "Égypte", "Sahara Occidental", "Érythrée", "Espagne", "Éthiopie", "Finlande", "Fidji", "Îles Malouines", "Micronésie", "Îles Féroé", "Royaume-Uni", "Grenade", "Géorgie", "Guyane", "Groenland", "Gambie", "Guinée", "Guinée Équatoriale", "Grèce", "Géorgie du Sud-et-les Îles Sandwich du Sud", "Guinée-Bissau", "Îles Heard-et-MacDonald", "Croatie", "Haïti", "Hongrie", "Indonésie", "Irlande", "Israël", "Île de Man", "Inde", "Territoire Britannique de l'Océan Indien", "Irak", "Islande", "Italie", "Jamaïque", "Jordanie", "Japon", "Kirghizistan", "Cambodge", "Comores", "Saint-Christophe-et-Niévès", "Corée du Nord", "Corée du Sud", "Koweït", "Îles Caïmans", "Laos", "Liban", "Sainte-Lucie", "Libéria", "Lituanie", "Lettonie", "Libye", "Maroc", "Moldavie", "Monténégro", "Saint-Martin (Antilles françaises)", "Marshall", "Macédoine", "Birmanie", "Mongolie", "Îles Mariannes du Nord", "Mauritanie", "Malte", "Maurice", "Mexique", "Malaisie", "Namibie", "Nouvelle-Calédonie", "Île Norfolk", "Nigéria", "Pays-Bas", "Norvège", "Népal", "Niué", "Nouvelle-Zélande", "Pérou", "Polynésie Française", "Papouasie-Nouvelle-Guinée", "Pologne", "Saint-Pierre-et-Miquelon", "Îles Pitcairn", "Porto Rico", "Palestine", "Palaos", "La Réunion", "Roumanie", "Serbie", "Russie", "Arabie Saoudite", "Salomon", "Soudan", "Suède", "Singapour", "Sainte-Hélène", "Slovénie", "Svalbard et Île Jan Mayen", "Slovaquie", "Saint-Marin", "Sénégal", "Somalie", "Soudan du Sud", "Sao Tomé-et-Principe", "Salvador", "Syrie", "Îles Turques-et-Caïques", "Tchad", "Terres Australes Françaises", "Thaïlande", "Tadjikistan", "Timor oriental", "Turkménistan", "Tunisie", "Turquie", "Trinité-et-Tobago", "Taïwan", "Tanzanie", "Ouganda", "Îles Mineures Éloignées des États-Unis", "États-Unis", "Ouzbékistan", "Vatican", "Saint-Vincent-et-les-Grenadines", "Îles Vierges Britanniques", "Îles Vierges des États-Unis", "Viet Nam", "Wallis-et-Futuna", "Mondial", "Yémen", "Afrique du Sud", "Zambie"]
    const flag_en=["Andorra", "United Arab Emirates", "Antigua and Barbuda", "Albania", "Armenia", "Netherlands Antilles", "Antarctica", "Argentina", "American Samoa", "Austria", "Australia", "Åland Islands", "Azerbaijan", "Bosnia and Herzegovina", "Barbados", "Belgium", "Bulgaria", "Bahrain", "Benin", "Bermuda", "Brunei Darussalam", "Bolivia", "Brazil", "Bhutan", "Bouvet Island", "Belarus", "Cocos (Keeling) Islands", "Central Africa", "Switzerland", "Ivory Coast", "Cook Islands", "Chile", "Cameroon", "China", "Colombia", "Serbia and Montenegro", "Cape Verde", "Christmas Island", "Cyprus", "Czech", "Germany", "Denmark", "Dominica", "Dominican", "Algeria", "Ecuador", "Estonia", "Egypt", "Western Sahara", "Eritrea", "Spain", "Ethiopia", "Finland", "Fiji", "Falkland Islands", "Micronesia", "Faroe Islands", "United Kingdom", "Grenada", "Georgia", "French Guiana", "Greenland", "Gambia", "Guinea", "Equatorial Guinea", "Greece", "South Georgia and the South Sandwich Islands", "Guinea-Bissau", "Heard Island and McDonald Islands", "Croatia", "Haiti", "Hungary", "Indonesia", "Ireland", "Israel", "Isle of Man", "India", "British Indian Ocean Territory", "Iraq", "Iceland", "Italy", "Jamaica", "Jordan", "Japan", "Kyrgyzstan", "Cambodia", "Comoros", "Saint Kitts and Nevis", "North Korea", "South Korea", "Kuwait", "Cayman Islands", "Lao", "Lebanon", "Saint Lucia", "Liberia", "Lithuania", "Latvia", "Libyan Arab Jamahiriya", "Morocco", "Republic of Moldova", "Montenegro", "Saint-Martin", "Marshall Islands", "FYROM", "Myanmar", "Mongolia", "Northern Mariana Islands", "Mauritania", "Malta", "Mauritius", "Mexico", "Malaysia", "Namibia", "New Caledonia", "Norfolk Island", "Nigeria", "Netherlands", "Norway", "Nepal", "Niue", "New Zealand", "Peru", "French Polynesia", "Papua New Guinea", "Poland", "Saint-Pierre and Miquelon", "Pitcairn", "Puerto Rico", "Occupied Palestinian Territory", "Palau", "Réunion", "Romania", "Serbia", "Russian Federation", "Saudi Arabia", "Solomon Islands", "Sudan", "Sweden", "Singapore", "Saint Helena", "Slovenia", "Svalbard and Jan Mayen", "Slovakia", "San Marino", "Senegal", "Somalia", "South Sudan", "Sao Tome and Principe", "El Salvador", "Syrian", "Turks and Caicos Islands", "Chad", "French Southern Territories", "Thailand", "Tajikistan", "Timor-Leste", "Turkmenistan", "Tunisia", "Turkey", "Trinidad and Tobago", "Taiwan", "Tanzania", "Uganda", "United States Minor Outlying Islands", "United States", "Uzbekistan", "Vatican City State", "Saint Vincent and the Grenadines", "British Virgin Islands", "U.S. Virgin Islands", "Vietnam", "Wallis and Futuna", "Worldwide", "Yemen", "South Africa", "Zambia"]

    const HC = 1;
    const CH = 2;
    const KH = 3;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();

    function lsGet(key, ls_name=LS_CONFIG_NAME) {
        return JSON.parse(localStorage.getItem(`${ls_name}${key}`))
    }
    function lsSet(key, value) {
        return localStorage.setItem(`${LS_CONFIG_NAME}${key}`, JSON.stringify(value))
    }
    function lsRm(key) {
        return localStorage.removeItem(`${LS_CONFIG_NAME}${key}`)
    }

    // Move old Waifu Info into HH++
    let waifu_info = lsGet('WaifuInfo')
    if (waifu_info) {
        console.log("Migrating Improved Waifu data into HH++")
        waifu_info.display = !!parseInt(waifu_info.display)
        waifu_info.girl_id = waifu_info.girl_id.toString()

        for (let girl in waifu_info.girls) {
            const girl_info = waifu_info.girls[girl]
            delete girl_info.unlocked
            if (girl_info.pose) {
                if (!Object.keys(girl_info.pose).length) {
                    delete girl_info.pose
                }
            }
            if (!Object.keys(girl_info).length) {
                delete waifu_info.girls[girl]
            }
        }

        HHPlusPlus.Helpers.lsSet('HHPlusPlusWaifuInfo', waifu_info)
        lsRm('WaifuInfo')
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
            const {girlsDataList, GT} = window
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
                desc: (this.desc && ref.desc) ? this.cleanData(ref.desc.replaceAll('\n','')) : '',
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
            const {girlsDataList} = window
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
            const {girlsDataList} = window
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
                const {girlsDataList} = window
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
                .girl-data-changes th, .girl-data-changes td {
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
            const oldLeagueData = lsGet('LeagueRecord')
            let leagueData = {date: new Date(), playerList: [], banned: []}

            if (oldLeagueData) {
                let banned = oldLeagueData.banned || []
                const leagueResults = lsGet('LeagueResults', 'HHPlusPlus')
                if (leagueResults) {
                    Object.entries(leagueResults).forEach(([id])=>{if(!oldLeagueData.playerList.some(e=>e.id==id)){banned.push(id)}});
                }
                oldLeagueData.playerList.forEach(({id})=>{if(!leagues_list.some(e=>e.id_player==id)){banned.push(id)}});
                leagueData.banned = [... new Set(banned)]
            }


            for (let i=0;i<leagues_list.length;i++) {
                const playerRow = $(leagues_list[i].html.replaceAll('\t','').replaceAll('\n',''))
                let flag = $(playerRow).find('.country').attr('hh_title')
                const translation = flag_fr.indexOf(flag)
                if (translation > -1) {
                    flag = flag_en[translation]
                }

                leagueData.playerList.push({
                    id: leagues_list[i].id_player,
                    name: $(playerRow).find('.nickname').text(),
                    level: leagues_list[i].level,
                    flag: flag,
                    points: $(playerRow[4]).text().match(/\d+/g).join('')
                })
            }
            leagueData.playerList.sort((a, b) => (parseInt(b.points) < parseInt(a.points)) ? -1 : 1);

            lsSet('LeagueRecord', leagueData)
        }

        copyData (week) {
            const leagueData = lsGet(`${week}LeagueRecord`)
            const simHist = lsGet(`${week}SimHistory`)
            const pointHist = lsGet(`LeaguePointHistory${week}`, 'HHPlusPlus')
            const extra = simHist ? true : false
            let prow = ''

            let text = leagueData ? `${new Date(leagueData.date).toUTCString()}${leagueData.banned.length>0 ? '\tBanned: ' : ''}${leagueData.banned.join(', ')}\n` : 'No Data Found';
            if (leagueData) {
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
                    lsRm('LeagueRecord')
                    lsSet('LeagueEnd', leagueEndTime)
                }

                this.recordData()

                $(".leagues_middle_header_script").append(`
                <div class="record_league">
                    <span id="last_week">
                        <img alt="Copy Last Week's League" tooltip hh_title="Copy Last Week's League" src="https://hh.hh-content.com/design/ic_books_gray.svg">
                    </span>
                </div>
                <div class="record_league">
                    <span id="this_week">
                        <img alt="Copy This Week's League" tooltip hh_title="Copy This Week's League" src="https://hh.hh-content.com/design/ic_books_gray.svg">
                    </span>
                </div>`)

                $('.record_league >span#last_week').click(() => {
                    this.copyData('Old')
                })
                $('.record_league >span#this_week').click(() => {
                    this.copyData('')
                })

                sheet.insertRule(`
                .record_league {
                    position: absolute;
                    cursor: pointer;
                }`);
                sheet.insertRule(`
                @media (min-width: 1026px) {
                    .record_league {
                        left: 360px;
                        top: 30px;
                    }
                }`);
                sheet.insertRule(`
                @media (max-width: 1025px) {
                    .record_league {
                        left: 510px;
                        top: 45px;
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

    class PachinkoLog extends HHModule {
        constructor () {
            const baseKey = 'PachinkoLog'
            const configSchema = {
                baseKey,
                default: true,
                label: `${gameConfig.pachinko} Log`
            }
            super({name: baseKey, configSchema})

            this.pool_updates = [{
                'name': 'Mythic Equips',
                'time': 1669279200000,
                'types': ['mythic1', 'mythic1ng', 'event1', 'event1ng']
            }]
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

        countSummary(pachinko_log, type_info, time_start, time_end) {
            let pachinko_type = type_info.match(/\D+/)[0]

            let summary = {time_start: time_start, time_end: time_end, total: 0}
            pachinko_log.forEach((roll) => {
                let drops = roll.split(',')
                if (pachinko_type != 'great' || ((Hero.infos.level<100 && drops[1]<100) || (Hero.infos.level>99 && drops[1]>99))) {
                    const time = parseInt(drops[0])
                    if (time > time_start && time < time_end) {
                        drops.slice(pachinko_type != 'great'? 1 : 2).forEach((item) => {
                            let type = this.reward_keys.type[item[0]]
                            if (type == 'equips') {
                                const e_rarity = item.match(/\D+/g)[1][0]
                                if (e_rarity != 'L') {
                                    item = e_rarity
                                } else {
                                    item = item.match(/\D+\d+/g)[1]
                                }
                                item = 'E'+item
                            }
                            if (type == 'girls') {item = 'g'}
                            summary[type]? summary[type].total++ : summary[type] = {total:1}
                            summary[type][item] = summary[type][item]+1 || 1
                            if (type != 'girls' && type !='gems') {
                                let rarity = `rarity-${type=='equips'? item[1] : item.slice(-1)}`
                                if (pachinko_type == 'great' && type == 'equips' && rarity!='rarity-L') {
                                    rarity = 'rarity-O'
                                }
                                summary[type][rarity] = summary[type][rarity]+1 || 1
                            }
                        })
                        summary.total += 1
                    }
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
            const no_girls_summary = no_girls || (games>1 && (type!='great' && type!='event')) || (games==1 && type=='great')
            const no_mythic_equip_summary = !((summary.time_start == this.pool_updates[0].time) && ((type == 'mythic' && games == 1) || (type == 'event')))

            function getPct(item) {
                let cat = reward_keys.type[item[0]]
                if (item.includes('rarity')) {
                    item = item.slice(1)
                }
                let isTotal = item.length == 1 && item != 'g'

                let count = summary[cat]? summary[cat][isTotal? 'total' : item] || 0 : 0
                let pct = (100*count/(summary.total * (cat!='gems'? type == 'great' || type == 'event' ? (cat=='girls'? 1 : games) : rewards : 1))).toFixed(2)

                return(`<span ${(item.includes('rarity') || isTotal)?`class="side-sum${isTotal? ' cat-sum': ''}" ` : ''}tooltip hh_title="${count}">${pct}%</span>`)
            }

            return (`
            <div class="pachinko-summary ${type} ${games}-game${no_girls? ' no-girls' : ''} ${type_info}">
                <div class="summary-header">
                    <span class="log-button reset-log" pachinko="${type_info}" start="${summary.time_start}" end="${summary.time_end}"">
                        <img alt="Reset ${gameConfig.pachinko} Log" tooltip hh_title="Reset ${gameConfig.pachinko} Log" src="https://${cdnHost}/caracs/no_class.png">
                    </span>
                    <h1>${capFirst(type)}-${games}-${games>1? 'Games' : 'Game'}${no_girls? ' - No-Girls' : ''}</h1>
                    <span class="sample-count orb_icon o_${type!='event'? type[0] : 'v'}${games}" tooltip hh_title="Sample Size">${summary.total}</span>
                    <span class="log-button record-log" pachinko="${type_info}" start="${summary.time_start}" end="${summary.time_end}">
                        <img alt="Copy ${gameConfig.pachinko} Log" tooltip hh_title="Copy ${gameConfig.pachinko} Log" src="https://${cdnHost}/design/ic_books_gray.svg">
                    </span>
                </div>
                <div class="summary-body ${type}">
                    <span>${rewards>1? rewards : ''} Random ${games>1? 'Rewards' : 'Reward'}${(type == 'great' && games == 10)? ' + 1 Legendary Equip' : ''}</span>
                    ${type == 'great'? '' :
                    `<span>+</span>
                    <span>${type == 'mythic'? games == '1'? '10': games == '3'? '10 Shards and<br>30' : '25 Shards and<br>60' : type == 'event'? '70' : ''}
                          ${type == 'epic'? games == '1'? `${isHH? '1 Frame and ' : ''}50`: `1 Girl${isHH? ', 10 Frames,' : ''} and<br> 200` : ''} Gems</span>`}
                    <div class="rewards-summary">
                        ${no_girls_summary && no_mythic_equip_summary ? '' :
                        `<div class="summary-div-special">
                            ${no_girls_summary ? '' :
                            `<ul class="summary-grid girls-summary">
                                <li>
                                    <img alt="${gameConfig.Girl}" tooltip hh_title="${gameConfig.Girl}" src="https://${cdnHost}/pictures/design/harem.svg">
                                    ${getPct('g')}
                                </li>
                            </ul>`}
                            ${no_mythic_equip_summary ? '' :
                            `<ul class="summary-grid mythic-equip-summary">
                                <li>
                                    <img alt="Mythic Equip" tooltip hh_title="Mythic Equip" src="https://${cdnHost}/design/mythic_equipment/mythic_equipment.png">
                                    ${getPct('EM')}
                                </li>
                            </ul>`}
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
                                    <img alt="${gameConfig.books.XP1}" tooltip hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" tooltip hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" tooltip hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" tooltip hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
                                    ${getPct('XP4L')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Xrarity-E')}
                            </div>
                            <ul class="summary-grid books-summary epic">
                                <li>
                                    <img alt="${gameConfig.books.XP1}" tooltip hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" tooltip hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" tooltip hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" tooltip hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
                                    ${getPct('XP4E')}
                                </li>
                            </ul>
                            ${Hero.infos.level>99? '' :
                            `<div class="side-sum-container">
                                ${getPct('Xrarity-R')}
                            </div>
                            <ul class="summary-grid books-summary rare">
                                <li>
                                    <img alt="${gameConfig.books.XP1}" tooltip hh_title="${gameConfig.books.XP1}" src="https://${cdnHost}/pictures/items/XP1.png">
                                    ${getPct('XP1R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP2}" tooltip hh_title="${gameConfig.books.XP2}" src="https://${cdnHost}/pictures/items/XP2.png">
                                    ${getPct('XP2R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP3}" tooltip hh_title="${gameConfig.books.XP3}" src="https://${cdnHost}/pictures/items/XP3.png">
                                    ${getPct('XP3R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.books.XP4}" tooltip hh_title="${gameConfig.books.XP4}" src="https://${cdnHost}/pictures/items/XP4.png">
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
                                    <img alt="${gameConfig.gifts.K1}" tooltip hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" tooltip hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" tooltip hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" tooltip hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
                                    ${getPct('K4L')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Krarity-E')}
                            </div>
                            <ul class="summary-grid books-summary epic">
                                <li>
                                    <img alt="${gameConfig.gifts.K1}" tooltip hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" tooltip hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" tooltip hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3E')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" tooltip hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
                                    ${getPct('K4E')}
                                </li>
                            </ul>
                            ${Hero.infos.level>99? '' :
                            `<div class="side-sum-container">
                                ${getPct('Krarity-R')}
                            </div>
                            <ul class="summary-grid books-summary rare">
                                <li>
                                    <img alt="${gameConfig.gifts.K1}" tooltip hh_title="${gameConfig.gifts.K1}" src="https://${cdnHost}/pictures/items/K1.png">
                                    ${getPct('K1R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K2}" tooltip hh_title="${gameConfig.gifts.K2}" src="https://${cdnHost}/pictures/items/K2.png">
                                    ${getPct('K2R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K3}" tooltip hh_title="${gameConfig.gifts.K3}" src="https://${cdnHost}/pictures/items/K3.png">
                                    ${getPct('K3R')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.gifts.K4}" tooltip hh_title="${gameConfig.gifts.K4}" src="https://${cdnHost}/pictures/items/K4.png">
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
                                    <img alt="${gameConfig.boosters.B1}" tooltip hh_title="${gameConfig.boosters.B1}" src="https://${cdnHost}/pictures/items/B1.png">
                                    ${getPct('B1L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B2}" tooltip hh_title="${gameConfig.boosters.B2}" src="https://${cdnHost}/pictures/items/B2.png">
                                    ${getPct('B2L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B3}" tooltip hh_title="${gameConfig.boosters.B3}" src="https://${cdnHost}/pictures/items/B3.png">
                                    ${getPct('B3L')}
                                </li>
                                <li>
                                    <img alt="${gameConfig.boosters.B4}" tooltip hh_title="${gameConfig.boosters.B4}" src="https://${cdnHost}/pictures/items/B4.png">
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
                                    <img alt="Super Sexy" tooltip hh_title="Super Sexy" src="https://${cdnHost}/pictures/misc/items_icons/16.svg">
                                    ${getPct('EL16')}
                                </li>
                                <li>
                                    <img alt="Hardcore" tooltip hh_title="Hardcore" src="https://${cdnHost}/pictures/misc/items_icons/1.png">
                                    ${getPct('EL1')}
                                </li>
                                <li>
                                    <img alt="Charming" tooltip hh_title="Charming" src="https://${cdnHost}/pictures/misc/items_icons/2.png">
                                    ${getPct('EL2')}
                                </li>
                                <li>
                                    <img alt="Expert" tooltip hh_title="Expert" src="https://${cdnHost}/pictures/misc/items_icons/3.png">
                                    ${getPct('EL3')}
                                </li>
                                <li>
                                    <img alt="Tough" tooltip hh_title="Tough" src="https://${cdnHost}/pictures/misc/items_icons/4.png">
                                    ${getPct('EL4')}
                                </li>
                                <li>
                                    <img alt="Lucky" tooltip hh_title="Lucky" src="https://${cdnHost}/pictures/misc/items_icons/5.png">
                                    ${getPct('EL5')}
                                </li>
                            </ul>`}
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Erarity-O')}
                            </div>
                            <ul class="summary-grid equips-summary epic">
                                <li>
                                    <img alt="Equip" tooltip hh_title="Epic Equip" src="https://${cdnHost}/pictures/items/EH1.png">
                                    ${getPct('EE')}
                                </li>
                            </ul>
                            ${(games == '1' && Hero.infos.level>99)? '' :
                            `<ul class="summary-grid equips-summary rare">
                                <li>
                                    <img alt="Equip" tooltip hh_title="Rare Equip" src="https://${cdnHost}/pictures/items/EH1.png">
                                    ${getPct('ER')}
                                </li>
                            </ul>`}`}
                        </div>`}
                    </div>
                    ${type == 'great'? '' :
                    `<span></span>
                    <ul class="summary-grid gems-summary">
                        <li>
                            <img alt="${gameConfig.dom} Gems" tooltip hh_title="${gameConfig.dom} Gems" src="https://${cdnHost}/pictures/design/gems/darkness.png">
                            ${getPct('GDo')}
                        </li>
                        <li>
                            <img alt="Submissive Gems" tooltip hh_title="Submissive Gems" src="https://${cdnHost}/pictures/design/gems/light.png">
                            ${getPct('GSu')}
                        </li>
                        <li>
                            <img alt="Voyeur Gems" tooltip hh_title="Voyeur Gems" src="https://${cdnHost}/pictures/design/gems/psychic.png">
                            ${getPct('GVo')}
                        </li>
                        <li>
                            <img alt="Eccentric Gems" tooltip hh_title="Eccentric Gems" src="https://${cdnHost}/pictures/design/gems/fire.png">
                            ${getPct('GEc')}
                        </li>
                        <li>
                            <img alt="Exhibitionist Gems" tooltip hh_title="Exhibitionist Gems" src="https://${cdnHost}/pictures/design/gems/nature.png">
                            ${getPct('GEx')}
                        </li>
                        <li>
                            <img alt="Physical Gems" tooltip hh_title="Physical Gems" src="https://${cdnHost}/pictures/design/gems/stone.png">
                            ${getPct('GPh')}
                        </li>
                        <li>
                            <img alt="Playful Gems" tooltip hh_title="Playful Gems" src="https://${cdnHost}/pictures/design/gems/sun.png">
                            ${getPct('GPl')}
                        </li>
                        <li>
                            <img alt="Sensual Gems" tooltip hh_title="Sensual Gems" src="https://${cdnHost}/pictures/design/gems/water.png">
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
            // if (types.includes('epic1')) {types.push('event1')}

            let summaries = ``
            if (types.length) {
                types.forEach((t) => {
                    const p_log = pachinko_log[t]
                    const min_time = parseInt(p_log[0].split(',')[0])
                    const max_time = parseInt(p_log.at(-1).split(',')[0])

                    let titles = []
                    let times = [0]
                    this.pool_updates.forEach((pool_update) => {
                        if (pool_update.types.includes(t)) {
                            if (min_time < pool_update.time) {
                                titles.push(`Before ${pool_update.name}`)
                                times.push(pool_update.time)
                            } else {
                                times.splice(-1, 1, pool_update.time)
                            }
                        }
                    })
                    if (max_time > times.at(-1)) {
                        titles.push('Current Pool')
                        times.push(10000000000000) // arbitrarily large number
                    }

                    for (let i=0;i<titles.length;i++) {
                        summaries += `<h1>${(titles.length > 1 || titles[0] != 'Current Pool') ? titles[i] : ''}</h1>
                                      ${this.buildSummary(t, this.countSummary(pachinko_log[t], t, times[i], times[i+1]))}`
                    }
                })
            } else {
                summaries = `<h1>No Data Recorded</h1>`
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
            function copyLog(pachinko, pachinko_log, time_start, time_end) {
                const type = pachinko.match(/\D+/)[0]
                const girlDict = HHPlusPlus.Helpers.getGirlDictionary()
                let log = ''

                pachinko_log.forEach((roll) => {
                    let drops = roll.split(',').filter(e => e[0]!='F') //no need to print frames
                    let offset = type != 'great'? 1 : 2

                    const time = parseInt(drops[0])
                    if (time > time_start && time < time_end) {
                        drops.slice(offset).forEach((item, index) => {
                            const cat = reward_keys.type[item[0]]
                            let drop = item

                            if (cat == 'books' || cat == 'gifts' || cat == 'boosters') {
                                const rarity = reward_keys.rarity[item.slice(-1)]
                                const name = gameConfig[cat][item.slice(0,-1)]
                                drop = `${type=='great'? `${rarity} ` : ''}${name}`
                            } else if (cat == 'girls') {
                                const girl_ids = item.match(/\d+/g)
                                let girl_names = []
                                girl_ids.forEach((girl_id) => {
                                    girl_names.push(girlDict.get(girl_id).name)
                                })
                                drop = girl_names.join(', ')
                            } else if (cat == 'gems') {
                                drop = reward_keys.gems[item]
                            } else if (cat == 'frames') {
                                let frames = item.match(/\d+/g)[0]
                                drop = frames==1? 'Frame' : `${frames} Frames`
                            }
                            drops[index+offset] = drop
                        })

                        log += `${drops.join('\t')}\n`
                    }
                })

                copyText(log)
            }

            $('.log-button.record-log').each(function (index) {
                const pachinko = $(this).attr('pachinko')
                const time_start = parseInt($(this).attr('start'))
                const time_end = parseInt($(this).attr('end'))
                $(this).click(() => {
                    const pachinko_log = lsGet('PachinkoLog') || {}
                    copyLog(pachinko, pachinko_log[pachinko], time_start, time_end)
                })
            })

            $('.log-button.reset-log').each(function (index) {
                const pachinko = $(this).attr('pachinko')
                const time_start = parseInt($(this).attr('start'))
                const time_end = parseInt($(this).attr('end'))
                $(this).click(() => {
                    let pachinko_log = lsGet('PachinkoLog') || {}
                    copyLog(pachinko, pachinko_log[pachinko], time_start, time_end)

                    const summary = $(this).closest(`.pachinko-summary.${pachinko}`)
                    summary.prev().remove()
                    summary.remove()
                    if ($('.pachinko-log-panel').eq(0).children().length == 0) {
                        $('.pachinko-log-panel').append(`<h1>No Data Recorded</h1>`)
                    }

                    let new_log = []
                    pachinko_log[pachinko].forEach((roll) => {
                        let drops = roll.split(',')
                        const time = parseInt(drops[0])

                        if (!(time > time_start && time < time_end)) {
                            new_log.push(roll)
                        }
                    })
                    if (new_log.length == 0) {
                        delete pachinko_log[pachinko]
                    } else {
                        pachinko_log[pachinko] = new_log
                    }
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
                .summary-div, .summary-div-special {
                    display: flex;
                    flex-wrap: nowrap;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }`);
                sheet.insertRule(`
                .summary-div-special {
                    gap: 10px;
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
                .summary-grid.girls-summary, .summary-grid.mythic-equip-summary {
                    grid-template-columns: min-content;
                }`);
                sheet.insertRule(`
                .summary-grid.gems-summary {
                    grid-gap: 0px;
                    align-self: start;
                }`);

                const elm_abrv = {
                    'darkness': 'Do',
                    'light': 'Su',
                    'psychic': 'Vo',
                    'fire': 'Ec',
                    'nature': 'Ex',
                    'stone': 'Ph',
                    'sun': 'Pl',
                    'water': 'Se'
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
                        let girl_ids = []
                        rewards.shards.forEach((shards) => {
                            girl_ids.push(shards.id_girl)
                        })
                        roll.push(`g${girl_ids.join('-')}`)
                    }
                    rewards.rewards.forEach((reward) => {
                        if (reward.type.includes('item') || reward.type == 'armor') {
                            const items = reward.value.item
                            const rarity = items.rarity[0].toUpperCase()

                            if (reward.type.includes('item')) {
                                const item = items.identifier
                                const count = reward.value.quantity

                                for (let i=0;i<count;i++) {
                                    roll.push(item+rarity)
                                }
                            } else {
                                const item = reward.value.skin.identifier

                                let equip = `${item}${rarity}`
                                if (rarity == 'M') {
                                    const c_resonance = reward.value.resonance_bonuses.class
                                    const t_resonance = reward.value.resonance_bonuses.theme
                                    equip = `${equip}${c_resonance.identifier}${c_resonance.resonance[0].toUpperCase()}${elm_abrv[t_resonance.identifier]}${t_resonance.resonance[0].toUpperCase()}`
                                } else {
                                    equip = `${equip}${items.name_add}`
                                }
                                roll.push(equip)
                            }
                        } else if (reward.type == 'frames') {
                            roll.push(`F${$(reward.value).text()}`)
                        } else if (reward.type == 'gems'){
                            const gem = $(reward.value).attr('src').match(/(?<=gems\/)(.+)(?=\.png)/g)[0]
                            roll.push(`G${elm_abrv[gem]}`)
                        }
                    })

                    if (response.no_more_girls) {
                        no_girls[type] = true
                    }

                    pachinko_log[plist].push(roll.join(','))
                    lsSet('PachinkoLog', pachinko_log)
                })
            })

            this.hasRun = true
        }
    }

    class CopyContests extends HHModule {
        constructor () {
            const baseKey = 'CopyContests'
            const configSchema = {
                baseKey,
                default: true,
                label: `Copy Contests`,
                subSettings: [{
                    key: 'active',
                    label: `Also copy active Contests`,
                    default: false
                }]
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('activities')
        }

        run ({active}) {
            if (this.hasRun || !this.shouldRun()) {return}

            HHPlusPlus.Helpers.defer(() => {
                $(".ranking.over_panel .closed").each(function (index) {
                    $(this).attr('tooltip','')
                    $(this).attr('hh_title','Copy Contest')
                    $(this).append('<img src="https://hh.hh-content.com/design/ic_books_gray.svg">')

                    $(this).click(() => {
                        const contest_num = $(".ranking.over_panel").eq(index).attr('id_contest')
                        const table = $(".leadTable")[index];
                        const contest_id = parseInt($(`.contest[id_contest="${contest_num}"] .contest_header`).eq(0).css('background-image').match(/\d+/g).at(-1))
                        let contest_data = '';

                        for(let i=0;i<table.childElementCount;i++){
                            const row = table.children[i]
                            let flag = row.children[1].children[0].getAttribute("hh_title")
                            const translation = flag_fr.indexOf(flag)
                            if (translation > -1) {
                                flag = flag_en[translation]
                            }

                            if (contest_id < 16) {
                                contest_data += `${contest_id}\t${i+1}\t`
                            }
                            contest_data+=flag+"\t";
                            contest_data+=row.getAttribute("sorting_id")+"\t";
                            contest_data+=row.children[1].innerText.slice(1).replace(/\n|\t/g,'')+"\t";
                            contest_data+=row.children[2].innerText.match(/\d+/g).join('')+"\n";
                        }
                        copyText(contest_data)
                    })
                })

                sheet.insertRule(`
                #contests>div>div.right_part .closed>img {
                    width: 20px;
                    height: 28px;
                    margin-top: 0px;
                    margin-left: 10px;
                }`)
                sheet.insertRule(`
                .ranking .closed {
                    cursor: pointer;
                }`)
                if (active) {
                    sheet.insertRule(`
                    #contests>div>div.right_part>.ranking:not(.ended)>.closed {
                        display: unset!important;
                        font-size: 0!important;
                        position: absolute!important;
                        right: 1rem!important;
                        left: unset!important;
                        top: 5.75rem!important;
                    }`)
                }
            })

            this.hasRun = true
        }
    }

    class MarketTweaks extends HHModule {
        constructor () {
            const baseKey = 'MarketTweaks'
            const configSchema = {
                baseKey,
                default: true,
                label: `Compact Market`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('shop')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                const config = lsGet('Config', 'HHPlusPlus') || {'st_expandedMarketInventory': false}
                if (config.st_expandedMarketInventory) {
                    console.log("Zoo's Scripts (Compact Market) WARNING: Disable this or Style Tweaks' \"Expanded Market inventory\" module")
                }

                const fill_slots_market = () => {
                    $('.player-inventory-content, .my-inventory-container .booster').each(function () {
                        const slots= $(this).find('.slot-container').length
                        const slots_empty = $(this).find('.slot-container.empty').length
                        const slots_filled = slots - slots_empty
                        const empty_pad = Math.max(16, Math.ceil(slots_filled/4)*4) - slots_filled

                        if (empty_pad != slots_empty) {
                            $(this).find('.slot-container.empty').remove()
                            $(this).append('<div class="slot-container empty"><div class="slot empty"></div></div>'.repeat(empty_pad))
                        }
                    })
                }

                fill_slots_market()
                const observer = new MutationObserver(() => {
                    fill_slots_market()
                })
                observer.observe($('.player-inventory-content')[0], {childList: true})
                observer.observe($('.player-inventory-content')[1], {childList: true})
                observer.observe($('.my-inventory-container .booster')[0], {childList: true})

                sheet.insertRule(`
                .right-container .player-inventory-content {
                    width: 27rem!important;
                    height: 24.5rem!important;
                    align-content: flex-start;
                }`)
                sheet.insertRule(`
                .right-container .player-inventory-content.armor {
                    height: 24rem!important;
                }`)
                sheet.insertRule(`
                .player-inventory-content .nicescroll-rails {
                    right: 15px!important;
                }`)
                sheet.insertRule(`
                .merchant-inventory-container {
                    margin-top: 6rem;
                }`)
                sheet.insertRule(`
                .left-container .bottom-container {
                    position: absolute;
                    top: 7rem;
                }`)
                sheet.insertRule(`
                .right-container .bottom-container {
                    position: absolute;
                    top: -4rem;
                    left: 36.75rem;
                    width: auto!important;
                }`)

                sheet.insertRule(`
                .my-inventory {
                    width: 29rem!important;
                }`)
                sheet.insertRule(`
                .equiped-items {
                    width: 14rem!important;
                }`)
                sheet.insertRule(`
                .market-girl-container, .hero-img, .equiped-booster-text {
                    display: none;
                }`)
                sheet.insertRule(`
                .armor-container, .booster-container {
                    width: 12rem!important;
                }`)
                sheet.insertRule(`
                .booster-container .booster {
                    flex-direction: column;
                    margin-right: unset!important;
                    margin-left: 1.5rem!important;
                    margin-top: 1rem!important;
                    width: 10rem!important;
                    height: 12rem;
                }`)
                sheet.insertRule(`
                .booster-container .booster .slot {
                    margin-bottom: unset!important;
                }`)
                sheet.insertRule(`
                .my-inventory .bottom-container {
                    position: absolute;;
                    z-index: 100;
                    flex-direction: column-reverse;
                    justify-content: flex-end!important;
                    left: 46.25rem!important;
                    bottom: 5.25rem!important;
                    height: 4.5rem;
                    width: 7.5rem;
                }`)
                sheet.insertRule(`
                .blue_text_button[disabled][rel="levelup"] {
                    display: none;
                }`)
                sheet.insertRule(`
                .my-hero-switch-content .my-inventory-container, .my-hero-switch-content .my-inventory-container .armor, .my-hero-switch-content .my-inventory-container .booster {
                    align-content: flex-start;
                    width: 24rem!important;
                    justify-content: unset!important;
                    margin-left: 1.5rem;
                }`)
                sheet.insertRule(`
                .my-hero-switch-content .my-inventory-container .armor {
                    margin-left: 3.5rem!important;
                }`)
                sheet.insertRule(`
                .my-hero-switch-content .my-inventory-container, .my-hero-switch-content .my-inventory-container .booster {
                    height: 22rem!important;
                }`)
                sheet.insertRule(`
                .my-hero-switch-content .my-inventory-container .armor {
                    height: 21.5rem!important;
                }`)
                sheet.insertRule(`
                .armor-container .armor {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 12rem;
                    width: 10rem;
                    margin-left: 1.5rem;
                    margin-top: 1rem;
                }`)
                sheet.insertRule(`
                .armor-container .armor .slot-container {
                    position: unset!important;
                    width: 60px!important;
                    height: 60px!important;
                }`)
                sheet.insertRule(`
                .armor-container .armor .slot {
                    width: 60px!important;
                    height: 60px!important;
                }`)
                sheet.insertRule(`
                .equiped-items .slot.potential::after, .equiped-items .slot.selected::after, .equiped-items .slot.using::after {
                    width: 66px!important;
                    height: 66px!important;
                    top: -4px!important;
                    left: -4px!important;
                }`)
                sheet.insertRule(`
                 #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .nicescroll-rails {
                    right: 22.5rem!important;
                }`)
                sheet.insertRule(`
                #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .nicescroll-rails {
                    right: 21rem!important;
                }`)
                sheet.insertRule(`
                #shops .left-container .top-container {
                    width: 17.5rem!important;
                }`)

                sheet.insertRule(`
                .my-inventory-container .inventoryInfo {
                    right: 18px !important;
                }`)

                //css rules for HH++ equip filter
                sheet.insertRule(`
                 .equip_filter_box {
                   width: 5rem!important;
                }`)
                sheet.insertRule(`
                .grid-selector {
                    margin-bottom: 4px!important;
                    flex-direction: column;
                }`)
                sheet.insertRule(`
                 .grid-selector .clear-selector img, .grid-selector .selector-options div, .grid-selector .selector-options img {
                    height: 24px!important;
                    width: 24px!important;
                }`)
                sheet.insertRule(`
                #my-hero-equipement-tab-container label.equip_filter {
                    top: 6rem!important;
                    left: 17.5rem!important;
                    z-index: 4;
                }`)
                sheet.insertRule(`
                #my-hero-equipement-tab-container .equip_filter_box.form-wrapper {
                    top: 5.25rem!important;
                    left: 13rem!important;
                }`)
                sheet.insertRule(`
                #equipement-tab-container .right-container label.equip_filter {
                    top: 6.5rem!important;
                    right: 27.5rem!important;
                    z-index: 4;
                }`)
                sheet.insertRule(`
                #equipement-tab-container .equip_filter_box.form-wrapper {
                    top: 5rem!important;
                    left: 30rem!important;
                }`)
            })

            this.hasRun = true
        }
    }

    class HaremTweaks extends HHModule {
        constructor () {
            const baseKey = 'HaremTweaks'
            const configSchema = {
                baseKey,
                default: true,
                label: `Harem Style Tweaks`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('harem') && !currentPage.includes('hero') || currentPage.includes('girl')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                if (currentPage.includes('harem') && !currentPage.includes('hero')) {
                    sheet.insertRule(`
                    #harem_left div.girls_list.grid_view div[girl]>.left>.icon span {
                        margin-right: -24px;
                    }`)
                    sheet.insertRule(`
                    #harem_left div.girls_list.grid_view div[girl].opened>.right>.g_infos>.lvl {
                        top: -3px!important;
                    }`)
                } else if (currentPage.includes('girl')) {/*
                    $('.total-from-items span').each(function () {
                        $(this).text(parseInt($(this).text()).toLocaleString())
                    })
                    const total_observer = new MutationObserver(() => {
                        $('.total-from-items span').each(function () {
                            $(this).text(parseInt($(this).text()).toLocaleString())
                        })
                    })
                    total_observer.observe($('.total-from-items')[0], {subtree: true, characterData: true})*/

                    const fill_slots_girl = () => {
                        $(".inventory").each(function () {
                            const empty_fill = 20 - $(this).find('.inventory-slot').length
                            if (empty_fill > 0) {
                                $(this).append('<div class="inventory-slot empty-slot"><div class="slot"></div></div>'.repeat(empty_fill))
                            }
                        })
                    }

                    fill_slots_girl()
                    const slot_observer = new MutationObserver(() => {
                        if ($('.inventory-slot').length < 40) {
                            fill_slots_girl()
                        }
                    })
                    slot_observer.observe($('.inventory')[0], {childList: true})

                    sheet.insertRule(`
                    div#tabs_switcher {
                        padding: 0.25rem;
                    }`)
                    sheet.insertRule(`
                    .girl-leveler-panel .girl-leveler-container .inventory-section .switch-tab-content .total-from-items {
                        margin-top: 0.5rem;
                    }`)
                    sheet.insertRule(`
                    .girl-leveler-panel .girl-leveler-container .inventory-section .switch-tab-content .total-from-items p {
                        margin-top: 0.25rem;
                        margin-bottom: 0.25rem;
                    }`)
                    sheet.insertRule(`
                    .switch-tab-content .inventory {
                        grid-auto-flow: column;
                        grid-template-rows: auto auto auto auto;
                        height: 22.5rem;
                        gap: 0.5rem 1.5rem;
                        padding-top: 0.5rem;
                        justify-content: start;
                    }`)
                }
            })

            this.hasRun = true
        }
    }

    class VillainDrops extends HHModule {
        constructor () {
            const baseKey = 'VillainDrops'
            const configSchema = {
                baseKey,
                default: false,
                label: `Villain Drops Recorder`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('/troll-battle.html') || currentPage.includes('/troll-pre-battle.html')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                const {opponent_fighter} = window
                let villain_level = parseInt(opponent_fighter.player ? opponent_fighter.player.level : $('.new-battle-opponent .hero-level-indicator').text())
                const first_gems = ['fire', 'darkness', 'psychic', 'nature']

                HHPlusPlus.Helpers.onAjaxResponse(/action=do_battles_trolls/, (response, opt) => {
                    const searchParams = new URLSearchParams(opt.data)
                    const number_of_battles = parseInt(searchParams.get('number_of_battles'))
                    const isMulti = number_of_battles > 1
                    const id_opponent = searchParams.get('id_opponent')
                    let drop_lists = lsGet('VillainDrops') || {}
                    if (!drop_lists.hasOwnProperty(id_opponent)) {
                        drop_lists[id_opponent] = []
                    }
                    let rewards_left = number_of_battles

                    if ('rewards' in response.rewards.data) {
                        response.rewards.data.rewards.forEach((reward) => {
                            const type = reward.type
                            const count = parseInt(type == 'item' ? reward.value.quantity : reward.value.match(/[\d.,]+/g).at(-1).replace(/,/g, ''))
                            let drop_count = isMulti ? count : 1
                            let reward_key = ''

                            if (type == 'item') {
                                const item = reward.value.item
                                reward_key = `${item.identifier}${item.rarity[0].toUpperCase()}`
                            } else if (type == 'gems') {
                                const gem_count = id_opponent < 5 ? 15 : id_opponent < 13 ? 20 : 25
                                const gem_type = reward.value.match(/(?<=gems\/).*?(?=\.png)/g)[0]
                                if (isMulti) {drop_count = count/gem_count}
                                reward_key = `G${gem_count == 15 ? first_gems.includes(gem_type) ? 1 : 2 : ''}`
                            } else if (type == 'soft_currency') {
                                if (isMulti) {
                                    const club_info = lsGet('ClubStatus', 'HHPlusPlus') || {'upgrades': {'soft_currency_gain': {'bonus': 0}}}
                                    const sc_bonus = 1 + club_info.upgrades.soft_currency_gain.bonus
                                    //console.log(response)
                                    const {Hero} = window
                                    const sc_count = parseInt(response.rewards.heroChangesUpdate.currency.soft_currency) - parseInt(Hero.currencies.soft_currency)
                                    //console.log(response.rewards.heroChangesUpdate.soft_currency)
                                    //console.log(Hero.currencies.soft_currency)
                                    //console.log(sc_count)
                                    const sc_per = (villain_level*100 + 500) * sc_bonus
                                    //console.log(sc_per)
                                    drop_count = Math.round(sc_count/sc_per) // round to be safe
                                }
                                reward_key = 'Y'
                            } else if (type == 'orbs') {
                                if (reward.value.includes('o_m1')) {
                                    reward_key = 'M'
                                } else {
                                    reward_key = 'O'
                                }
                            } else if (type == 'ticket') {
                                reward_key = 'T'
                            } else if (type == 'progressions') {
                                if (reward.value.includes('type_progression_sm')) {
                                    reward_key = 'K'
                                } else {
                                    console.log(reward)
                                }
                            } else {
                                console.log(count)
                                console.log(reward)
                            }

                            rewards_left -= drop_count
                            const reward_keys = Array(drop_count).fill(reward_key)
                            drop_lists[id_opponent] = drop_lists[id_opponent].concat(reward_keys)
                        })
                    }
                    if ('shards' in response.rewards.data) {
                        let reward_keys = []
                        const girls = response.rewards.data.shards.length

                        if (girls == 1) {
                            const reward = response.rewards.data.shards[0]
                            const girl_num = reward.id_girl
                            const shards = reward.value-reward.previous_value

                            if (rewards_left == 1) { // best case: one girl and one drop
                                reward_keys.push(`S${girl_num}-${shards}`)
                            } else { // shard amount for each drop could be unkown
                                let shard_counts = Array(rewards_left)

                                if (shards - 1 <= rewards_left) {
                                    shard_counts.fill(1)
                                    shard_counts[0] += shards - rewards_left
                                } else if (reward.rarity == 'mythic') {
                                    shard_counts.fill(1)
                                    for (let i=0;i<(shards-rewards_left);i++) {
                                        shard_counts[i] += 1
                                    }
                                } else { // shard counts can't be determined per drop
                                    shard_counts.fill(0)
                                    shard_counts[rewards_left-1] = shards
                                }

                                shard_counts.forEach((count) => {
                                    reward_keys.push(`S${girl_num}-${count!=0 ? count : '?'}`)
                                })
                            }
                        } else {
                            // This is going to be messy
                            if (girls == rewards_left) { // best case: one drop for each girl
                                response.rewards.data.shards.forEach((reward) => {
                                    const girl_num = reward.id_girl
                                    const shards = reward.value-reward.previous_value

                                    reward_keys.push(`S${girl_num}-${shards}`)
                                })
                            } else { // worst case: shard drops > # of girls, can't determine how many drops for each girl or shards for each drop
                                let total_shards = 0

                                for (let i=0;rewards_left-girls;i++) {
                                    reward_keys.push('S?-?')
                                }

                                response.rewards.data.shards.forEach((reward) => {
                                    const girl_num = reward.id_girl
                                    const shards = reward.value-reward.previous_value

                                    reward_keys.push(`S${girl_num}-${shards}`)
                                })
                            }
                        }

                        drop_lists[id_opponent] = drop_lists[id_opponent].concat(reward_keys)
                    }

                    lsSet('VillainDrops', drop_lists)
                })

                if (currentPage.includes('/troll-pre-battle.html')) {
                    const searchParams = new URLSearchParams(location.search)
                    const id_opponent = searchParams.get('id_opponent')
                    let drop_lists = lsGet('VillainDrops') || {}

                    if (drop_lists.hasOwnProperty(id_opponent)) {
                        const drop_list = drop_lists[id_opponent]
                        $('.opponent_rewards>span').wrap('<div class="gridWrapper"></div>')
                            .before(`<span class="copy"><img tooltip hh_title="Copy Drop Log (${drop_list.length})" src="https://hh.hh-content.com/design/ic_books_gray.svg"></span>`)
                            .after(`<span class="reset"><img tooltip hh_title="Reset Drop Log" src="https://hh.hh-content.com/caracs/no_class.png"></span>`)
                        $('.opponent_rewards .copy').click(() => {
                            copyText(drop_list.join('\n'))
                        })
                        $('.opponent_rewards .reset').click(() => {
                            copyText(drop_list.join('\n'))
                            delete drop_lists[id_opponent]
                            lsSet('VillainDrops', drop_lists)
                            $('.opponent_rewards .copy, .opponent_rewards .reset').remove()
                            $('.gridWrapper>span').unwrap()
                        })
                    }

                    sheet.insertRule(`
                    .opponent_rewards .gridWrapper {
                        grid-template-columns: 1fr 1fr 1fr!important;
                    }`)
                    sheet.insertRule(`
                    .opponent_rewards .copy>img {
                        width: 20px;
                        height: 28px;
                    }`)
                    sheet.insertRule(`
                    .opponent_rewards .reset>img {
                        width: 28px;
                        height: 28px;
                    }`)
                }
            })

            this.hasRun = true
        }
    }

    const allModules = [
        new GirlDataRecord(),
        new LeagueDataCollector(),
        new PachinkoLog(),
        new CopyContests(),
        new MarketTweaks(),
        new HaremTweaks(),
        new VillainDrops()
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
