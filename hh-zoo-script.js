// ==UserScript==
// @name            Zoo's HH Scripts
// @description     Some data recording scripts and style tweaks by zoopokemon
// @version         0.9.8
// @match           https://*.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://*.gayharem.com/*
// @match           https://*.comixharem.com/*
// @match           https://*.hornyheroes.com/*
// @match           https://*.pornstarharem.com/*
// @match           https://*.transpornstarharem.com/*
// @match           https://*.gaypornstarharem.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @downloadURL     https://raw.githubusercontent.com/zoop0kemon/hh-zoo-script/main/hh-zoo-script.js
// @grant           none
// @author          zoopokemon
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.9.8: Fixing tracking of girl base stats (now only trackable in the harem page)
// 0.9.7: Updating harem page url
// 0.9.6: Adding role tracking to Girl Data Record
// 0.9.5: Fixing style issues from bundler change
// 0.9.4: Fixing script for revert to game bundler change
// 0.9.3: Updating script for game bundler change
// 0.9.2: Updating Girl Data Record after 28/02 game update
// 0.9.1: Fixing bug with Girl Data Record printing birthdates with incorrect months
// 0.9.0: Rewriting Girl Data Record after harem update
// 0.8.0: Adding module to log labyrinth info to the console
// 0.7.4: Updating url to league page after 17/01 game update
// 0.7.3: Changing LR leaderboards copy format, fixing some bugs, and adding support for TPSH and GPSH
// 0.7.2: Fixing Copy Contests module
// 0.7.1: Fixing compact market style tweak
// 0.7.0: Adding module for tracking Champion drops, and a module to copy LR leaderboards
// 0.6.10: Added data protection for League Data Collector, better handling of trait info for Girl Data Record, and fixing Harem Style Tweaks
// 0.6.9: Fixing update for League Data Collector
// 0.6.8: Pre-empting update for League Data Collector and Girl Data Record
// 0.6.7: Updating pachinko log for equipment pachinko rebalance
// 0.6.6: Updating market tweaks for new 9 booster slots
// 0.6.5: Fixing bugs with Villain Drops Recorder
// 0.6.4: Updating market tweaks for new HH++ equip filters
// 0.6.3: Pre-empting update for Pachinko Log, Villain Drops Recorder, and Harem Style Tweaks
// 0.6.2: Pachinko log updated for equipment pachinko
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
        console.log('WARNING: No jQuery found. Probably an error page. Ending the script here')
        return
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
    const isTPSH = [
        'www.transpornstarharem.com',
        'nutaku.transpornstarharem.com'
    ].includes(location.host)
    const isGPSH = [
        'www.gaypornstarharem.com',
        'nutaku.gaypornstarharem.com'
    ].includes(location.host)
    const isHH = !(isGH || isCxH || isHoH || isPSH || isTPSH || isGPSH)

    const CDNs = {
        'nutaku.haremheroes.com': 'hh.hh-content.com',
        'www.hentaiheroes.com': 'hh2.hh-content.com',
        'www.comixharem.com': 'ch.hh-content.com',
        'nutaku.comixharem.com': 'ch.hh-content.com',
        'www.gayharem.com': 'gh1.hh-content.com',
        'nutaku.gayharem.com': 'gh.hh-content.com',
        'www.hornyheroes.com': 'sh.hh-content.com',
        'www.pornstarharem.com': 'th.hh-content.com',
        'nutaku.pornstarharem.com': 'th.hh-content.com',
        'www.transpornstarharem.com': 'images.hh-content.com/startrans',
        'nutaku.transpornstarharem.com': 'images.hh-content.com/startrans',
        'www.gaypornstarharem.com': 'images.hh-content.com/stargay',
        'nutaku.gaypornstarharem.com': 'images.hh-content.com/stargay'
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
                K3: 'Flowers',
                K4: 'Butt plug'
            },
            boosters: {
                B1: 'Potion',
                B2: 'Excitant',
                B3: 'Suspect pills',
                B4: 'Growing device'
            }
        },
        TPSH: {
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
                K3: 'Flowers',
                K4: 'Butt plug'
            },
            boosters: {
                B1: 'Potion',
                B2: 'Excitant',
                B3: 'Suspicious pills',
                B4: 'Growing device'
            }
        },
        GPSH: {
            girl: 'guy',
            Girl: 'Guy',
            career: 'Career',
            pachinko: 'Night-club',
            dom: 'Dom',
            books: {
                XP1: 'Adult comics',
                XP2: 'Sex for dummies',
                XP3: 'Sex encyclopedia',
                XP4: 'Audiobook sex lessons'
            },
            gifts: {
                K1: 'Drink',
                K2: 'Underpants',
                K3: 'Flowers',
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
    const gameConfig = isGH ? gameConfigs.GH : isCxH ? gameConfigs.CxH : isPSH ? gameConfigs.PSH : isTPSH ? gameConfigs.TPSH : isGPSH ? gameConfigs.GPSH : gameConfigs.HH

    const flag_fr = ["Andorre", "Émirats Arabes Unis", "Antigua-et-Barbuda", "Albanie", "Arménie", "Antilles Néerlandaises", "Antarctique", "Argentine", "Samoa Américaines", "Autriche", "Australie", "Åland", "Azerbaïdjan", "Bosnie-Herzégovine", "Barbade", "Belgique", "Bulgarie", "Bahreïn", "Bénin", "Bermudes", "Brunei", "Bolivie", "Brésil", "Bhoutan", "Île Bouvet", "Biélorussie", "Îles Cocos", "Centrafrique", "Suisse", "Côte d'Ivoire", "Îles Cook", "Chili", "Cameroun", "Chine", "Colombie", "Serbie-et-Monténégro", "Cap-vert", "Île Christmas", "Chypre", "Tchèque", "Allemagne", "Danemark", "Dominique", "Dominicaine", "Algérie", "Équateur", "Estonie", "Égypte", "Sahara Occidental", "Érythrée", "Espagne", "Éthiopie", "Finlande", "Fidji", "Îles Malouines", "Micronésie", "Îles Féroé", "Royaume-Uni", "Grenade", "Géorgie", "Guyane", "Groenland", "Gambie", "Guinée", "Guinée Équatoriale", "Grèce", "Géorgie du Sud-et-les Îles Sandwich du Sud", "Guinée-Bissau", "Îles Heard-et-MacDonald", "Croatie", "Haïti", "Hongrie", "Indonésie", "Irlande", "Israël", "Île de Man", "Inde", "Territoire Britannique de l'Océan Indien", "Irak", "Islande", "Italie", "Jamaïque", "Jordanie", "Japon", "Kirghizistan", "Cambodge", "Comores", "Saint-Christophe-et-Niévès", "Corée du Nord", "Corée du Sud", "Koweït", "Îles Caïmans", "Laos", "Liban", "Sainte-Lucie", "Libéria", "Lituanie", "Lettonie", "Libye", "Maroc", "Moldavie", "Monténégro", "Saint-Martin (Antilles françaises)", "Marshall", "Macédoine", "Birmanie", "Mongolie", "Îles Mariannes du Nord", "Mauritanie", "Malte", "Maurice", "Mexique", "Malaisie", "Namibie", "Nouvelle-Calédonie", "Île Norfolk", "Nigéria", "Pays-Bas", "Norvège", "Népal", "Niué", "Nouvelle-Zélande", "Pérou", "Polynésie Française", "Papouasie-Nouvelle-Guinée", "Pologne", "Saint-Pierre-et-Miquelon", "Îles Pitcairn", "Porto Rico", "Palestine", "Palaos", "La Réunion", "Roumanie", "Serbie", "Russie", "Arabie Saoudite", "Salomon", "Soudan", "Suède", "Singapour", "Sainte-Hélène", "Slovénie", "Svalbard et Île Jan Mayen", "Slovaquie", "Saint-Marin", "Sénégal", "Somalie", "Soudan du Sud", "Sao Tomé-et-Principe", "Salvador", "Syrie", "Îles Turques-et-Caïques", "Tchad", "Terres Australes Françaises", "Thaïlande", "Tadjikistan", "Timor oriental", "Turkménistan", "Tunisie", "Turquie", "Trinité-et-Tobago", "Taïwan", "Tanzanie", "Ouganda", "Îles Mineures Éloignées des États-Unis", "États-Unis", "Ouzbékistan", "Vatican", "Saint-Vincent-et-les-Grenadines", "Îles Vierges Britanniques", "Îles Vierges des États-Unis", "Viet Nam", "Wallis-et-Futuna", "Mondial", "Yémen", "Afrique du Sud", "Zambie"]
    const flag_en = ["Andorra", "United Arab Emirates", "Antigua and Barbuda", "Albania", "Armenia", "Netherlands Antilles", "Antarctica", "Argentina", "American Samoa", "Austria", "Australia", "Åland Islands", "Azerbaijan", "Bosnia and Herzegovina", "Barbados", "Belgium", "Bulgaria", "Bahrain", "Benin", "Bermuda", "Brunei Darussalam", "Bolivia", "Brazil", "Bhutan", "Bouvet Island", "Belarus", "Cocos (Keeling) Islands", "Central Africa", "Switzerland", "Ivory Coast", "Cook Islands", "Chile", "Cameroon", "China", "Colombia", "Serbia and Montenegro", "Cape Verde", "Christmas Island", "Cyprus", "Czech", "Germany", "Denmark", "Dominica", "Dominican", "Algeria", "Ecuador", "Estonia", "Egypt", "Western Sahara", "Eritrea", "Spain", "Ethiopia", "Finland", "Fiji", "Falkland Islands", "Micronesia", "Faroe Islands", "United Kingdom", "Grenada", "Georgia", "French Guiana", "Greenland", "Gambia", "Guinea", "Equatorial Guinea", "Greece", "South Georgia and the South Sandwich Islands", "Guinea-Bissau", "Heard Island and McDonald Islands", "Croatia", "Haiti", "Hungary", "Indonesia", "Ireland", "Israel", "Isle of Man", "India", "British Indian Ocean Territory", "Iraq", "Iceland", "Italy", "Jamaica", "Jordan", "Japan", "Kyrgyzstan", "Cambodia", "Comoros", "Saint Kitts and Nevis", "North Korea", "South Korea", "Kuwait", "Cayman Islands", "Lao", "Lebanon", "Saint Lucia", "Liberia", "Lithuania", "Latvia", "Libyan Arab Jamahiriya", "Morocco", "Republic of Moldova", "Montenegro", "Saint-Martin", "Marshall Islands", "FYROM", "Myanmar", "Mongolia", "Northern Mariana Islands", "Mauritania", "Malta", "Mauritius", "Mexico", "Malaysia", "Namibia", "New Caledonia", "Norfolk Island", "Nigeria", "Netherlands", "Norway", "Nepal", "Niue", "New Zealand", "Peru", "French Polynesia", "Papua New Guinea", "Poland", "Saint-Pierre and Miquelon", "Pitcairn", "Puerto Rico", "Occupied Palestinian Territory", "Palau", "Réunion", "Romania", "Serbia", "Russian Federation", "Saudi Arabia", "Solomon Islands", "Sudan", "Sweden", "Singapore", "Saint Helena", "Slovenia", "Svalbard and Jan Mayen", "Slovakia", "San Marino", "Senegal", "Somalia", "South Sudan", "Sao Tome and Principe", "El Salvador", "Syrian", "Turks and Caicos Islands", "Chad", "French Southern Territories", "Thailand", "Tajikistan", "Timor-Leste", "Turkmenistan", "Tunisia", "Turkey", "Trinidad and Tobago", "Taiwan", "Tanzania", "Uganda", "United States Minor Outlying Islands", "United States", "Uzbekistan", "Vatican City State", "Saint Vincent and the Grenadines", "British Virgin Islands", "U.S. Virgin Islands", "Vietnam", "Wallis and Futuna", "Worldwide", "Yemen", "South Africa", "Zambia"]

    // Define CSS
    const sheet = (() => {
        const style = document.createElement('style')
        style.setAttribute('class', 'zoo-script-style')
        document.head.appendChild(style)
        style.sheet.insertRules = (rules) => {
            rules.replace(/ {4}/g, '').split(/(?<=})\n/g).map(rule => rule.replace(/\n/g, '')).forEach(rule => {
                try {
                    style.sheet.insertRule(rule)
                } catch {
                    console.log(`Error adding style rules:\n${rule}`)
                }
            })
        }
        return style.sheet
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

    function copyText (text) {
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
    function nthNumber (number) {
        if (number > 3 && number < 21) {return 'th'}
        switch (number % 10) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            default:
                return 'th'
        }
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
                }, {
                    key: 'cxh',
                    label: 'Format data for CxH sheet',
                    default: false
                }, {
                    key: 'wiki',
                    label: 'Format data for Wiki',
                    default: false
                }]
            }
            super({name: baseKey, configSchema})

            this.girlData = lsGet('GirlData') || {}
            this.girlRefData = lsGet('GirlRefData') || {}
            this.newGirls = lsGet('NewGirls') || []
            this.dataChanges = lsGet('DataChanges') || []

            this.fields = {
                name: 'Name',
                full_name: 'Full Name',
                element: 'Element',
                class: 'Class',
                rarity: 'Rarity',
                stars: 'Max Stars',
                trait: 'Trait',
                role: 'Role',
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
                ref_id: 'Ref ID',
                salaries: 'Salary Info',
                hc: 'Base HC',
                ch: 'Base CH',
                kh: 'Base KH',
            }
            this.trait_map = {
                'fire': 'Eye Color',
                'nature': 'Hair Color',
                'stone': 'Zodiac',
                'sun': 'Position',
                'water': 'Position',
                'darkness': 'Eye Color',
                'light': 'Hair Color',
                'psychic': 'Zodiac'
            }
        }

        shouldRun () {
            return currentPage.includes('edit-team') || currentPage.includes('waifu.html') || currentPage.includes('activities') || ((currentPage.includes('characters') || currentPage.includes('harem')) && !currentPage.includes('hero'))
        }

        cleanData (string) {
            if (typeof string !== 'string') {
                return null
            }
            return string.replaceAll('\r', '').replaceAll('\n', '').trim()
        }

        updateGirlData (girl) {
            const {id_girl, name, element, class: girl_class, rarity, nb_grades: stars, id_role: role, figure: pose, hair_color1, hair_color2, eye_color1, eye_color2, zodiac, id_girl_ref: ref_id, carac1, carac2, carac3, salaries, reference, caracs} = girl
            const {full_name, anniversary, location, career, hobby_food, hobby_hobby, hobby_fetish, desc} = reference || {}

            const girl_data = {
                name: this.cleanData(name),
                element,
                class: girl_class,
                rarity: capFirst(rarity),
                stars,
                role,
                pose,
                ref_id,
                salaries,
                hc: caracs ? null : carac1,
                ch: caracs ? null : carac2,
                kh: caracs ? null : carac3
            }
            const ref_data = {
                full_name: this.cleanData(full_name),
                desc: this.desc ? this.cleanData(desc) : null,
                location: this.cleanData(location),
                career: this.cleanData(career),
                birthday: anniversary?.replace(/^\d{4}-/, ''),
                zodiac,
                hair: [hair_color1, hair_color2].filter(color => !!color).join(','),
                eyes: [eye_color1, eye_color2].filter(color => !!color).join(','),
                food: this.cleanData(hobby_food),
                hobby: this.cleanData(hobby_hobby),
                fetish: this.cleanData(hobby_fetish)
            }

            const old_girl_data = this.girlData[id_girl]
            const old_ref_data = this.girlRefData[ref_id]
            const old_formated = this.formatGirlData(id_girl, old_girl_data || {}, old_ref_data || {})
            const new_formated = this.formatGirlData(id_girl, girl_data, ref_data)
            const pre_harem_update = old_girl_data && old_girl_data.full_name != null
            let changed = false

            if (old_girl_data && !pre_harem_update) {
                for (const [key, new_value] of Object.entries(girl_data)) {
                    const old_value = old_girl_data[key]
                    if (new_value == null) {
                        // remove undfined/null values to merge
                        delete girl_data[key]
                    } else if (old_value != new_value) {
                        if (old_value || key === 'role') {
                            const date = Date.now()
                            this.dataChanges.push({
                                id: id_girl,
                                field: key,
                                old: old_formated[key],
                                new: new_formated[key],
                                date
                            })
                            // secondary changes
                            if (key === 'element' || key === 'stars') {
                                this.dataChanges.push({
                                    id: id_girl,
                                    field: 'trait',
                                    old: old_formated.trait,
                                    new: new_formated.trait,
                                    date
                                })
                            }
                            if (key === 'element' || key === 'class') {
                                this.dataChanges.push({
                                    id: id_girl,
                                    field: 'style',
                                    old: old_formated.style,
                                    new: new_formated.style,
                                    date
                                })
                            }
                        }
                        changed = true
                    }
                }
            } else {
                if (!pre_harem_update) {
                    this.newGirls.push(id_girl)
                    lsSet('NewGirls', this.newGirls)
                }
                changed = true
            }
            if (old_ref_data) {
                for (const [key, new_value] of Object.entries(ref_data)) {
                    const old_value = old_ref_data[key]
                    if (new_value == null) {
                        // remove undefined/null values to merge
                        delete ref_data[key]
                    } else if (old_value != new_value) {
                        if (old_value || (old_ref_data.full_name && old_ref_data.location == null)) {
                            const date = Date.now()
                            Object.entries(this.girlData).filter(([girl_id, girl]) => girl.ref_id == ref_id).forEach(([ref_id_girl]) => {
                                this.dataChanges.push({
                                    id: ref_id_girl,
                                    field: key,
                                    old: old_formated[key],
                                    new: new_formated[key],
                                    date
                                })
                            })
                        }
                        changed = true
                    }
                }
            }

            this.girlData[id_girl] = Object.assign({}, pre_harem_update ? {} : old_girl_data, girl_data)
            this.girlRefData[ref_id] = Object.assign({}, old_ref_data || {}, ref_data)
            if (changed) {
                lsSet('GirlData', this.girlData)
                lsSet('GirlRefData', this.girlRefData)
                lsSet('DataChanges', this.dataChanges)
            }
            return changed
        }

        formatGirlData (girl_id, new_girl_data=null, new_ref_data=null) {
            const {GT} = window
            const girl = new_girl_data || this.girlData[girl_id]
            const {ref_id, class: girl_class, element, pose, stars, role} = girl
            const ref_data = new_ref_data || this.girlRefData[ref_id]
            const {hair, eyes, birthday} = ref_data || {}
            const girl_data = Object.assign({}, girl, ref_data, {style: GT.design[`girl_style_${element}_${girl_class}`], trait: stars < 3 ? 'None' : this.trait_map[element]})

            girl_data.element = GT.design[`${element}_flavor_element`]
            girl_data.class = GT.caracs[girl_class]
            girl_data.pose = GT.figures[pose] === 'Doggie style' ? 'Doggie Style' : GT.figures[pose]
            if (role) {
                girl_data.role = GT.design[`girl_role_${role}_name`]
            }
            girl_data.hair = hair?.split(',').map(color => GT.colors[color]).join(' and ')
            girl_data.eyes = eyes?.split(',').map(color => GT.colors[color]).join(' and ')
            if (birthday) {
                const birthday_info = birthday.split('-').map(n => parseInt(n))
                birthday_info[0] -= 1
                const birth_date = new Date(1990, ...birthday_info)
                const day = parseInt(birthday.split('-')[1])
                girl_data.birthday = `${birth_date.toLocaleString('en', {month: 'long'})} ${day}${nthNumber(day)}`
            }
            Object.keys(girl_data).forEach((key) => {
                if (girl_data[key] == null) {
                    girl_data[key] = ''
                }
            })

            return girl_data
        }

        printGirlData (girl_id) {
            const girl_data = this.formatGirlData(girl_id)
            const {ref_id, name, full_name, element, class: girl_class, rarity, stars, trait, role, pose, hair, eyes, zodiac, birthday, location, career, food, hobby, fetish, style, desc, salaries, hc, ch, kh} = girl_data
            const salary_info = salaries?.split('|').map((income) => {
                const income_info = income.split(',').map(n => parseInt(n))
                const pay = income_info[0].toLocaleString('en')
                const time = income_info[1].toLocaleString('en')
                const rate = Math.ceil(income_info[0] / (income_info[1] / 60)).toLocaleString('en')
                return {pay, time, rate}
            }) || []

            if (!this.wiki) {
                const data_list = [name, girl_id, full_name, element, girl_class, rarity, stars, trait, role, pose, hair, eyes, zodiac, birthday, location, career, food, hobby, fetish, style]
                if (this.cxh) {
                    data_list.push(desc)
                }
                data_list.push(ref_id, '')
                if (this.cxh) {
                    const incomes = [0, 1, 2, 3, 4, 5, 6].map(star => star>stars ? '' : (salary_info[star]?.pay || ''))
                    const rates = [0, 1, 2, 3, 4, 5, 6].map(star => star>stars ? '' : (salary_info[star]?.time || ''))
                    data_list.push('', ...incomes, ...rates)
                }
                data_list.push(...[hc, ch, kh].map(stat => (stat/10).toFixed(1)))
                data_list.forEach((info, i) => {
                    if (typeof info === 'string' && info.includes('"')) {
                        data_list[i] = `"${info.replaceAll('"', '""')}"`
                    }
                })

                return data_list.join('\t')
            } else {
                const wiki_name = name.replaceAll("’", "'")

                if (!isGH) {
                    return [
                        '[TEMPLATE]HH:Template_Haremette',
                        '| New girl warning = no',
                        `| Nickname = ${wiki_name}`,
                        `| Name = ${full_name}`,
                        `| Specialty = ${girl_class}`,
                        `| Rarity = ${rarity}`,
                        `| Max stars = ${stars}`,
                        `| Favorite position = ${pose}`,
                        `| Element = ${element}`,
                        `| Derived haremette = `,
                        `| Hair color = ${hair}`,
                        `| Eye color = ${eyes}`,
                        `| Zodiac Sign = ${zodiac}`,
                        `| Birthday = ${birthday}`,
                        `| Location = ${location}`,
                        `| Career = ${career}`,
                        `| Favorite Food = ${food}`,
                        `| Hobby = ${hobby}`,
                        `| Fetish = ${fetish}`,
                        `| Style = ${style}`,
                        `| About her = ${desc}`,
                        '| How to obtain = ',
                        '| Still obtainable = no',
                        ...[0, 1, 2, 3, 4, 5, 6].map(star => `| Picture with ${star} Star = `),
                        ...[0, 1, 2, 3, 4, 5, 6].map(star => {
                            const income = salary_info[star] || {}
                            return [`| Income with ${star} Star = ${income.pay || 'X'}$ every ${income.time || 'Y'}min`,
                                    `| Income with ${star} Star per hour = ${income.rate || ''}`]
                        }).flat(),
                        ...[0, 1, 2, 3, 4, 5, 6, 'MAX'].map(star => {
                            const grade = star === 'MAX' ? stars : star
                            const level = star === 'MAX' ? 500 : 1
                            const battle_stats = star === 'MAX' ? 'MAX' : `Star ${star} Level 1`
                            const stats = [hc, ch, kh].map(stat => grade>stars ? '' : (level * stat/10 * (1 + 0.3*grade)).toLocaleString('en'))
                            return [`| Battle-stats ${battle_stats} Hardcore = ${stats[0]}`,
                                    `| Battle-stats ${battle_stats} Charm = ${stats[1]}`,
                                    `| Battle-stats ${battle_stats} Know-how = ${stats[2]}`]
                        }).flat(),
                        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => [`| Trivia ${n} Description = `, `| Trivia ${n} Image = `]).flat(),
                        '[/TEMPLATE]'
                    ].join('\n')
                } else {
                    const stats = [hc, ch, kh].map(stat => (stat/10).toLocaleString('en'))

                    return [
                        '[TEMPLATE]GH:Template_Guy',
                        `  | Name = ${wiki_name}`,
                        ...[0, 1, 2, 3, 4, 5, 6].map(star => `  | ${star} Star = `),
                        `  | Specialty = ${girl_class}`,
                        `  | Element = ${element}`,
                        `  | Favorite position = ${pose}`,
                        `  | Rarity = ${rarity}`,
                        '  | Obtainable = ',
                        '  | Obtain World = ',
                        '  | Obtain Detail = ',
                        '  | Event Month = ',
                        '  | Parody = ',
                        `  | Star 0 Hardcore = ${stats[0]}`,
                        `  | Star 0 Charm = ${stats[1]}`,
                        `  | Star 0 Know-how = ${stats[2]}`,
                        ...[0, 1, 2, 3, 4, 5, 6].map(star => {
                            const income = salary_info[star]
                            return [`  | Income ${star} Star = ${income ? `$${income.pay}/${income.time}min` : ''}`,
                                    `  | Income ${star} Star hour = ${income ? `$${income.rate}/hr` : ''}`]
                        }).flat(),
                        '  | Trivia = ',
                        '  | Parody Image = ',
                        `  | Real Name = ${full_name}`,
                        `  | Hair = ${hair}`,
                        `  | Eyes = ${eyes}`,
                        `  | Birthday = ${birthday}`,
                        `  | Location = ${location}`,
                        `  | Occupation = ${career}`,
                        `  | Food = ${food}`,
                        `  | Hobby = ${hobby}`,
                        `  | Fetish = ${fetish}`,
                        `  | Bio = ${desc}`,
                        '[/TEMPLATE]'
                    ].join('\n')
                }
            }
        }

        buildDisplay () {
            // can't identify removed girls anymore

            return (`
               <div class="summary-girl">
                  <h1>${gameConfig.Girl} Data Record:</h1>
                  <div><span class="total-girls-count">${Object.keys(this.girlData).length}</span> Total <span class="clubGirl_mix_icn"></span> recorded</div>
                  <div><span class="new-girls-count">${this.newGirls.length}</span> New <span class="clubGirl_mix_icn"></span> recorded</div>
                  <ul class="data-grid data-buttons">
                     <li><div class="copy-all-girls"><span>Copy All ${gameConfig.Girl}s</span></div></li>
                     <li><div class="copy-new-girls"><span>Copy New ${gameConfig.Girl}s</span></div></li>
                     <li><div class="clear-new-girls"><span>Clear New ${gameConfig.Girl}s</span></div></li>
                  </ul>
                  <ul class="data-grid new-girls">
                     ${this.newGirls.map(girl_id => `<li>${this.girlData[girl_id] ? this.girlData[girl_id].name : `[REMOVED ID:${girl_id}]`}</li>`).join('')}
                  </ul>
               </div>
               <div class="summary-changes">
                  <h1>${gameConfig.Girl} Data Changes - <span class="data-changes-count">${this.dataChanges.length}</span></h1>
                  <ul class="data-grid changes-buttons">
                     <li><div class="copy-all-changes"><span>Copy All Changes</span></div></li>
                     <li><div class="clear-all-changes"><span>Clear All Changes</span></div></li>
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
                        ${this.dataChanges.map((change) => {
                            const girl_name = this.girlData[change.id].name
                            const field_name = this.fields[change.field]
                            const date = new Date(change.date)
                            const formated_date = [date.getUTCMonth()+1, date.getUTCDate(), date.getUTCFullYear()].join('/')

                            return `<tr><td>${[girl_name, field_name, change.old, change.new, formated_date].join('</td><td>')}</td><tr>`
                        }).join('')}
                     </tbody>
                  </table>
               </div>
            `)
        }

        initButtons () {
            $('.data-grid.data-buttons .copy-all-girls').click(() => {
                const output = Object.keys(this.girlData).map(girl_id => this.printGirlData(girl_id)).join('\n')
                copyText(output)
            })

            $('.data-grid.data-buttons .copy-new-girls').click(() => {
                const output = this.newGirls.map(girl_id => this.printGirlData(girl_id)).join('\n')
                copyText(output)
            })

            $('.data-grid.data-buttons .clear-new-girls').click(() => {
                $('.summary-girl .new-girls-count').html('0')
                $('.data-grid.new-girls > li').remove()
                this.$newGirlNotif.hide()

                this.newGirls = []
                lsSet('NewGirls', this.newGirls)
            })

            $('.data-grid.new-girls li').each((i, el) => {
                $(el).click(() => {
                    const girl_id = this.newGirls[i]
                    copyText(this.printGirlData(girl_id))
                })
            })

            $('.data-grid.changes-buttons .copy-all-changes').click(() => {
                const output = this.dataChanges.map((change) => {
                    const girl_name = this.girlData[change.id].name
                    const field_name = this.fields[change.field]
                    const date = new Date(change.date)
                    const date_formated = [date.getUTCMonth()+1, date.getUTCDate(), date.getUTCFullYear()].join('/')

                    return [girl_name, field_name, change.old, change.new, date_formated].join('\t')
                }).join('\n')

                copyText(output)
            })

            $('.data-grid.changes-buttons .clear-all-changes').click(() => {
                $('.summary-changes .data-changes-count').html('0')
                $('.girl-data-changes > tbody > tr').remove()
                this.$changesNotif.hide()

                this.dataChanges = []
                lsSet('DataChanges', this.dataChanges)
            })
        }

        run ({desc, cxh, wiki}) {
            if (this.hasRun || !this.shouldRun()) {return}
            this.desc = desc
            this.cxh = cxh
            this.wiki = wiki
            if (!this.desc) {
                Object.keys(this.girlRefData).forEach(key => {
                    this.girlRefData[key].desc = null
                })
                lsSet('GirlRefData', this.girlRefData)
            }

            $(document).ready(() => {
                if (currentPage.includes('activities')) {
                    const {pop_hero_girls} = window
                    if (!pop_hero_girls) { return }
                    Object.values(pop_hero_girls).forEach((girl) => {
                        this.updateGirlData(girl)
                    })
                }
                if (currentPage.includes('edit-team')) {
                    const {availableGirls} = window
                    Object.values(availableGirls).forEach((girl) => {
                        this.updateGirlData(girl)
                    })
                }
                if (currentPage.includes('waifu.html')) {
                    const {girls_data_list} = window
                    Object.values(girls_data_list).forEach((girl) => {
                        this.updateGirlData(girl)
                    })
                }
                if ((currentPage.includes('characters') || currentPage.includes('harem')) && !currentPage.includes('hero')) {
                    const checked_girls = []

                    HHPlusPlus.Helpers.onAjaxResponse(/action=get_girls_list/i, ({girls_list}) => {
                        let changed = false
                        Object.values(girls_list).forEach((girl) => {
                            const {id_girl} = girl
                            if (!checked_girls.includes(id_girl)) {
                                checked_girls.push(id_girl)
                                const this_changed = this.updateGirlData(girl)
                                changed = changed || this_changed
                            }
                        })
                        if (changed) {
                            $('.girl-data-panel').html(this.buildDisplay())
                            this.initButtons()
                            if (this.newGirls.length) {this.$newGirlNotif.show()}
                            if (this.dataChanges.length) {this.$changesNotif.show()}
                        }
                    })

                    HHPlusPlus.Helpers.onAjaxResponse(/action=get_girl&/i, ({girl: {girl}}) => {
                        const changed = this.updateGirlData(girl)
                        if (changed) {
                            $('.girl-data-panel').html(this.buildDisplay())
                            this.initButtons()
                            if (this.newGirls.length) {this.$newGirlNotif.show()}
                            if (this.dataChanges.length) {this.$changesNotif.show()}
                        }
                    })

                    const $button = $('<div class="girl-data-panel-toggle harem"></div>')
                    this.$newGirlNotif = $('<span class="new-girl-notif"></span>')
                    this.$changesNotif = $('<span class="button-notification-icon button-notification-action"></span>')
                    const $panel = $(`<div class="girl-data-panel">${this.buildDisplay()}</div>`).hide()
                    const $overlayBG = $('<div class="girl-data-overlay-bg"></div>').hide()

                    if (!this.newGirls.length) {this.$newGirlNotif.hide()}
                    if (!this.dataChanges.length) {this.$changesNotif.hide()}
                    $button.append(this.$newGirlNotif).append(this.$changesNotif)
                    HHPlusPlus.Helpers.doWhenSelectorAvailable('#harem_left .buttons_container', () => {
                        $('#harem_left').append($button).append($panel).append($overlayBG)

                        $button.click(() => {
                            $panel.toggle()
                            $overlayBG.toggle()
                        })

                        $overlayBG.click(() => {
                            $panel.toggle()
                            $overlayBG.toggle()
                        })

                        this.initButtons()
                    })

                    sheet.insertRules(`
                    .girl-data-panel-toggle {
                        display: block;
                        position: absolute;
                        height: 32px;
                        width: 32px;
                        background-size: contain;
                        bottom: 15px;
                        right: 6px;
                        cursor: pointer;
                    }
                    .girl-data-panel-toggle:hover {
                        filter: drop-shadow(0px 0px 1px white);
                    }
                    .girl-data-panel-toggle.harem {
                        background-image: url(https://${cdnHost}/pictures/design/harem.svg);
                    }

                    .girl-data-panel {
                        display: grid;
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
                    }
                    .girl-data-overlay-bg {
                        display: block;
                        width: 100vw;
                        height: 100%;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        z-index: 19;
                    }

                    .new-girl-notif {
                        display: block;
                        width: 14px;
                        height: 28px;
                        background-image: url(https://${cdnHost}/ic_new.png);
                        background-size: 18px;
                        background-position: center;
                        background-repeat: no-repeat;
                        margin: 0;
                        padding: 0;
                        animation: new_notif_anim 7s infinite;
                        position: relative;
                        right: 15px;
                        bottom: 10px;
                    }

                    .girl-data-panel h1{
                        font-size: 20px;
                    }
                    .summary-changes h1 {
                        display: inline-block;
                    }
                    .girl-data-panel .data-grid {
                        display: grid;
                        grid-gap: 6px;
                        list-style: none;
                        padding-left: 0px;
                        margin-block-end: 0px;
                    }
                    .girl-data-panel .data-grid li {
                        display: inline-block;
                        background: #cccccc42;
                        border-radius: 5px;
                        line-height: 15px;
                        margin-left: 10px;
                        cursor: pointer;
                    }
                    .girl-data-panel .data-grid li>div {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .summary-girl .data-grid.data-buttons {
                        grid-template-columns: 1fr 1fr 1fr;
                        text-align: center;
                        font-size: 10px;
                    }

                    .summary-girl .data-grid.new-girls {
                        overflow-y: scroll;
                        max-height: 245px;
                        margin-top: 10px;
                    }
                    .summary-girl .data-grid.new-girls li{
                        margin-left: 0px;
                        margin-right: 4px;
                        padding: 2px;
                    }

                    .summary-changes .data-grid {
                        font-size: 10px;
                        float: right;
                        position: relative;
                        grid-template-columns: 1fr 1fr;
                        margin-block-start: 0px;
                        text-align: center;
                        right: 35px;
                    }
                    .summary-changes .data-grid span {
                        width: 50px;
                    }
                    .girl-data-changes {
                        border-collapse: separate;
                        border-spacing: 2px 2px;
                        font-size: 12px;
                        width: 100%;
                    }
                    .girl-data-changes th, .girl-data-changes td {
                        padding: 0px 5px;
                        vertical-align: middle;
                        background: #cccccc42;
                    }
                    .girl-data-changes thead tr {
                        display: block;
                        font-size: 16px;
                    }
                    .girl-data-changes tbody {
                        display: block;
                        max-height: 305px;
                        overflow-y: scroll;
                        user-select: text;
                    }

                    .girl-data-changes tr > *:nth-child(1) {
                        width: 100px;
                    }
                    .girl-data-changes tr > *:nth-child(2),
                    .girl-data-changes tr > *:nth-child(5) {
                        width: 70px;
                    }
                    .girl-data-changes tr > *:nth-child(3),
                    .girl-data-changes tr > *:nth-child(4) {
                        width: 210px;
                    }
                    .girl-data-changes tbody tr > *:nth-child(5) {
                        text-align: right;
                    }`)
                }
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
            return currentPage.includes('leagues.html')
        }

        recordData () {
            const {opponents_list} = window
            if (opponents_list && opponents_list.length) {
                const oldLeagueData = lsGet('LeagueRecord')
                const leagueData = {date: new Date(), playerList: [], banned: []}

                if (oldLeagueData) {
                    const {banned} = oldLeagueData
                    oldLeagueData.playerList.forEach(({id}) => {
                        if (!opponents_list.some(({player}) => player.id_fighter == id)) {
                            banned.push(id)
                        }
                    })
                    leagueData.banned = [...new Set(banned)]
                }

                const places = {}
                opponents_list.forEach(({country_text, player, player_league_points, place}) => {
                    let flag = country_text
                    const translation = flag_fr.indexOf(flag)
                    if (translation > -1) {
                        flag = flag_en[translation]
                    }

                    leagueData.playerList.push({
                        id: player.id_fighter,
                        name: player.nickname,
                        level: player.level,
                        flag: flag,
                        points: player_league_points
                    })
                    places[player.id_fighter] = parseInt(place)
                })
                leagueData.playerList.sort((a, b) => places[a.id] - places[b.id])

                lsSet('LeagueRecord', leagueData)
            }
        }

        copyData (week) {
            const leagueData = lsGet(`${week}LeagueRecord`)
            const simHist = lsGet(`${week}SimHistory`)
            const pointHist = lsGet(`LeagueResults${week}`, 'HHPlusPlus')
            const extra = simHist ? true : false
            let prow = ''

            let text = leagueData ? `${new Date(leagueData.date).toUTCString()}${leagueData.banned.length>0 ? '\tBanned: ' : ''}${leagueData.banned.join(', ')}\n` : 'No Data Found';
            if (leagueData) {
                const {Hero: {infos: {id: hero_id}}} = window.shared ? window.shared : window
                leagueData.playerList.forEach((player) => {
                    const isSelf = player.id == hero_id
                    let row = Object.values(player).join('\t')

                    if (extra) {
                        const id = player.id
                        if (!isSelf) {
                            const points = pointHist[id].points
                            const padded_points = points.concat(Array(3).fill('')).slice(0, 3)
                            row += `\t${points.length > 0 ? padded_points.join('\t') : '\t\t'}\t`
                        } else {
                            row += '\tX\tX\tX\t'
                        }

                        const player_simHist = simHist[id] || {}
                        for (let i=0;i<29;i++) {
                            if (!isSelf) {
                                row += `${player_simHist[i] || ''}\t`
                            } else {
                                row += `${simHist['me'][i]}\t`
                            }
                        }
                        row += !isSelf ? player_simHist.hitTime ? Math.min.apply(null, player_simHist.hitTime) : '' : 'NA'
                    }

                    if (extra && isSelf) {
                        prow = row
                    } else {
                        text += `${row}\n`
                    }
                })
            }
            if (extra) {text = `${prow}\t${text}`}
            copyText(text)
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                const {server_now_ts, season_end_at} = window
                const leagueEndTime = server_now_ts + season_end_at
                const storedEndTime = lsGet('LeagueEnd')

                if (!storedEndTime) {
                    lsSet('LeagueEnd', leagueEndTime)
                } else if (leagueEndTime > storedEndTime) {
                    lsSet('OldLeagueRecord', lsGet('LeagueRecord'))
                    lsRm('LeagueRecord')
                    lsSet('LeagueEnd', leagueEndTime)
                }

                this.recordData()

                HHPlusPlus.Helpers.doWhenSelectorAvailable('.league_end_in', () => {
                    $(".league_end_in").before(`
                    <div class="record_league">
                        <span id="last_week">
                            <img alt="Copy Last Week's League" tooltip hh_title="Copy Last Week's League" src="https://${cdnHost}/design/ic_books_gray.svg">
                        </span>
                    </div>`).after(`
                    <div class="record_league">
                        <span id="this_week">
                            <img alt="Copy This Week's League" tooltip hh_title="Copy This Week's League" src="https://${cdnHost}/design/ic_books_gray.svg">
                        </span>
                    </div>`)

                    $('.record_league >span#last_week').click(() => {
                        this.copyData('Old')
                    })
                    $('.record_league >span#this_week').click(() => {
                        this.copyData('')
                    })
                })

                sheet.insertRules(`
                .record_league {
                    cursor: pointer;
                }
                .record_league >span#last_week {
                    opacity: 0.75;
                }
                #league #leagues .league_content .league_buttons .challenge_points {
                    margin-right: 1.5rem;
                }`)
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
            },{
                'name': 'Equipment Pachinko Rebalance',
                'time': 1689751960000,
                'types': ['equipment1']
            }]
            this.reward_keys = {
                type: {
                    X: "books",
                    K: "gifts",
                    B: "boosters",
                    E: "equips",
                    g: "girls",
                    G: "gems",
                    F: "frames",
                    e: "girlEquips"
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
            const {Hero: {infos: {level}}} = window.shared ? window.shared : window
            let pachinko_type = type_info.match(/\D+/)[0]

            let summary = {time_start: time_start, time_end: time_end, total: 0}
            pachinko_log.forEach((roll) => {
                let drops = roll.split(',')
                if (pachinko_type != 'great' || ((level<100 && drops[1]<100) || (level>99 && drops[1]>99))) {
                    const time = parseInt(drops[0])
                    if (time > time_start && time < time_end) {
                        drops.slice(pachinko_type != 'great'? 1 : 2).forEach((item) => {
                            let type = this.reward_keys.type[item[0]]
                            if (['equips', 'girlEquips'].includes(type)) {
                                const e_rarity = item.match(/\D+/g)[1][0]
                                if (e_rarity != 'L' || type === 'girlEquips') {
                                    item = e_rarity
                                } else {
                                    item = item.match(/\D+\d+/g)[1]
                                }
                                item = `${type == 'equips'? 'E' : 'e'}${item}`
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
            const {Hero: {infos: {level}}} = window.shared ? window.shared : window
            const type = type_info.match(/\D+/)[0]
            const games = type!='event' ? type_info.match(/\d+/)[0] : 4
            const no_girls = type_info.slice(-2) == 'ng' ? true : false
            const rewards = games>1 ? !(type=='equipment' && games<10) && (type!='event' && (!no_girls || type=='great')) ? games-1 : games : 1
            const reward_keys = this.reward_keys
            const no_girls_summary = no_girls || (games>1 && (type!='great' && type!='event')) || (games==1 && type=='great') || (type=='equipment')
            const no_mythic_equip_summary = !((summary.time_start == this.pool_updates[0].time) && ((type == 'mythic' && games == 1) || (type == 'event')))
            const girl_equip_image = summary.time_end == this.pool_updates[1].time ? `https://${cdnHost}/design/girl_armor/girl_armor.png` : 'images/pictures/design/pachinko/ic_girl_armor_tooltip_icon.png'

            function getPct(item) {
                const cat = reward_keys.type[item[0]]
                if (item.includes('rarity')) {
                    item = item.slice(1)
                }
                const isTotal = item.length == 1 && item != 'g'

                const count = summary[cat]? summary[cat][isTotal? 'total' : item] || 0 : 0
                const pct = (100*count/(summary.total * (cat!='gems'? ['great', 'event', 'equipment'].includes(type) ? (cat=='girls'? 1 : games) : rewards : 1))).toFixed(2)

                return(`<span ${(item.includes('rarity') || isTotal)?`class="side-sum${isTotal? ' cat-sum': ''}" ` : ''}tooltip hh_title="${count}">${pct}%</span>`)
            }

            return (`
            <div class="pachinko-summary ${type} ${games}-game${no_girls? ' no-girls' : ''} ${type_info}">
                <div class="summary-header">
                    <span class="log-button reset-log" pachinko="${type_info}" start="${summary.time_start}" end="${summary.time_end}"">
                        <img alt="Reset ${gameConfig.pachinko} Log" tooltip hh_title="Reset ${gameConfig.pachinko} Log" src="https://${cdnHost}/caracs/no_class.png">
                    </span>
                    <h1>${capFirst(type)}-${games}-${games>1? 'Games' : 'Game'}${no_girls? ' - No-Girls' : ''}</h1>
                    <span class="sample-count orb_icon o_${!['event', 'equipment'].includes(type)? type[0] : type=='event'? 'v' : 'eq'}${games}" tooltip hh_title="Sample Size">${summary.total}</span>
                    <span class="log-button record-log" pachinko="${type_info}" start="${summary.time_start}" end="${summary.time_end}">
                        <img alt="Copy ${gameConfig.pachinko} Log" tooltip hh_title="Copy ${gameConfig.pachinko} Log" src="https://${cdnHost}/design/ic_books_gray.svg">
                    </span>
                </div>
                <div class="summary-body ${type}">
                    <span>${rewards>1? rewards : ''} Random ${games>1? 'Rewards' : 'Reward'}${(['great', 'equipment'].includes(type) && games == 10)? ` + 1 Legendary ${type=='equipment'? 'Girl ' : ''}Equip` : ''}</span>
                    ${['great', 'equipment'].includes(type)? '' :
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
                        ${['event', 'equipment'].includes(type)? '' :
                        `<div class="summary-div">
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                                ${getPct('X')}
                            </div>`}
                            ${(type=='great' && level<100)? '' :
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
                            ${level>99? '' :
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
                        ${['mythic', 'equipment'].includes(type)? '' :
                        `<div class="summary-div">
                            ${type != 'great'? '' :
                            `<div class="side-sum-container">
                               ${getPct('K')}
                            </div>`}
                            ${(type=='great' && level<100)? '' :
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
                            ${level>99? '' :
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
                        ${['event', 'great', 'equipment'].includes(type) || (type == 'epic' && games == '1')? '' :
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
                        ${type == 'mythic' || (type =='epic' && games == '1') || (type == 'equipment' && summary.time_end!=this.pool_updates[1].time)? '' :
                        `<div class="summary-div">
                            ${!((type == 'great' && (level>=100 && games == '1' || games == '10')) || (type == 'equipment'))? '' :
                            `<div class="side-sum-container">
                                ${getPct('E')}
                            </div>`}
                            ${(level<100 && type == 'great' && games == '1')? '' :
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
                            ${(games == '1' && level>99)? '' :
                            `<ul class="summary-grid equips-summary rare">
                                <li>
                                    <img alt="Equip" tooltip hh_title="Rare Equip" src="https://${cdnHost}/pictures/items/EH1.png">
                                    ${getPct('ER')}
                                </li>
                            </ul>`}`}
                            ${type != 'equipment'? '' :
                            `<div class="side-sum-container">
                                ${getPct('Erarity-M')}
                            </div>
                            <ul class="summary-grid equips-summary mythic">
                                <li>
                                    <img alt="Mythic Equip" tooltip hh_title="Mythic Equip" src="https://${cdnHost}/design/mythic_equipment/mythic_equipment.png">
                                    ${getPct('EM')}
                                </li>
                            </ul>`}
                        </div>`}
                        ${type != 'equipment'? '' : `
                        <div class="summary-div">
                            <div class="side-sum-container">
                                ${getPct('e')}
                            </div>
                            <ul class="summary-grid girl-equips-summary common">
                                <li>
                                    <img alt="Common Girl Equip" tooltip hh_title="Common Girl Equip" src="${girl_equip_image}">
                                    ${getPct('eC')}
                                </li>
                            </ul>
                            <ul class="summary-grid girl-equips-summary rare">
                                <li>
                                    <img alt="Rare Girl Equip" tooltip hh_title="Rare Girl Equip" src="${girl_equip_image}">
                                    ${getPct('eR')}
                                </li>
                            </ul>
                            <ul class="summary-grid girl-equips-summary epic">
                                <li>
                                    <img alt="Epic Girl Equip" tooltip hh_title="Epic Girl Equip" src="${girl_equip_image}">
                                    ${getPct('eE')}
                                </li>
                            </ul>
                            ${games==1 && summary.time_end!=this.pool_updates[1].time ? '' : `
                            <ul class="summary-grid girl-equips-summary legendary">
                                <li>
                                    <img alt="Legendary Girl Equip" tooltip hh_title="Legendary Girl Equip" src="${girl_equip_image}">
                                    ${getPct('eL')}
                                </li>
                            </ul>
                            <ul class="summary-grid girl-equips-summary mythic">
                                <li>
                                    <img alt="Mythic Girl Equip" tooltip hh_title="Mythic Girl Equip" src="${girl_equip_image}">
                                    ${getPct('eM')}
                                </li>
                            </ul>`}
                        </div>`}
                    </div>
                    ${['great', 'equipment'].includes(type)? '' :
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
            const $button = $('<div class="blue_circular_btn pachinko-log-btn"><span class="info_icn"></span></div>')
            const $panel = $(`<div class="pachinko-log-panel hh-scroll">${this.buildSummaries()}</div>`)
            const $overlayBG = $('<div class="pachinko-log-overlay-bg"></div>')
            $('#playzone-replace-info').append($button).append($panel).append($overlayBG)

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

            const reward_keys = this.reward_keys
            const copyLog = async (pachinko, pachinko_log, time_start, time_end) => {
                const type = pachinko.match(/\D+/)[0]
                const girlDict = await HHPlusPlus.Helpers.getGirlDictionary()
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
                const {pachinkoDef} = window
                let no_girls = {}
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

                sheet.insertRules(`
                #pachinko_whole .playing-zone .wrapper {
                    overflow: visible;
                }
                #pachinko_whole .pachinko-log-btn {
                   position: absolute;
                   top: 2px;
                   right: 44px;
                   width: 35px;
                   height: 35px;
                }

                .pachinko-log-overlay-bg {
                    display: none;
                    width: 150%;
                    height: 120%;
                    position: absolute;
                    top: -10%;
                    left: -25%;
                    z-index: 51;
                }
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
                }
                .pachinko-log-overlay-bg.visible {
                    display: block;
                }
                .pachinko-log-panel.visible {
                    display: grid;
                }

                .summary-header {
                    display: grid;
                    grid-template-columns: 32px 1fr 50px 32px;
                    grid-gap: 10px;
                    align-content: center;
                    justify-items: center;
                }
                .pachinko-log-panel h1 {
                    text-align: center;
                    font-size: 1.4em;
                }
                .pachinko-summary.event h1 {
                    color: #62d8ff;
                }
                .pachinko-summary.epic h1 {
                    color: #ffa23e;
                }
                .pachinko-summary.mythic h1 {
                    color: #ffb80a;
                }
                .pachinko-summary.great h1 {
                    color: #0bff08;
                }
                .pachinko-summary.equipment h1 {
                    color: #e02dc8;
                }
                .summary-header img {
                    width: 32px;
                    height: 32px;
                }
                .summary-header .sample-count {
                    background-position: center;
                    text-align: center;
                    text-shadow: 2px 2px 2px black;
                    padding-top: 10px;
                }

                .summary-body {
                    display: grid;
                    grid-template-columns: 1fr 1em 1fr;
                    text-align: center;
                    align-items: center;
                }
                .summary-body.great {
                    grid-template-columns: 1fr;
                }
                .summary-body.equipment {
                    grid-template-columns: 1fr;
                }
                .summary-div, .summary-div-special {
                    display: flex;
                    flex-wrap: nowrap;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                }
                .summary-div-special {
                    gap: 10px;
                }
                .side-sum-container {
                    width: 1.5em;
                    overflow: visible;
                    display: flex;
                    justify-content: center;
                }
                .rewards-summary .side-sum {
                    -webkit-transform: rotate(-90deg);
                    -moz-transform: rotate(-90deg);
                    -ms-transform: rotate(-90deg);
                    -o-transform: rotate(-90deg);
                    font-size: 14px;
                    display: inline-block;
                }
                .side-sum.cat-sum {
                    font-size: 16px;
                }

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
                }
                .summary-grid img {
                    width: 40px;
                    height: 40px;
                }
                .summary-grid.mythic img {
                    background: transparent radial-gradient(closest-side at 50% 50%,#f5a866 0,#ec0039 51%,#9e0e27 100%) 0 0 no-repeat padding-box;
                }
                .summary-grid.legendary img {
                    background-image: url(https://${cdnHost}/legendary.png);
                    background-size: contain;
                    background-color: #9150bf;
                }
                .summary-grid.epic img {
                    background: #ffb244;
                }
                .summary-grid.rare img {
                    background: #23b56b;
                }
                .summary-grid.common img {
                    background: #8d8e9f;
                }

                .equips-summary.legendary {
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
                }
                .epic .equips-summary.legendary {
                    width: 164px;
                }
                .event .equips-summary.legendary {
                    width: 168px;
                }
                .summary-grid.girls-summary, .summary-grid.mythic-equip-summary {
                    grid-template-columns: min-content;
                }
                .summary-grid.gems-summary {
                    grid-gap: 0px;
                    align-self: start;
                }`)

                // record pachinko drops
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
                    const plist = `${type}${games}${(no_girls[type] && !(type == 'great' && games == 1) && (type !== 'equipment'))? 'ng': ''}`
                    let pachinko_log = lsGet('PachinkoLog') || {}
                    if(!pachinko_log[plist]) {pachinko_log[plist] = [];}
                    let roll = [new Date().getTime()]
                    if (type == 'great') {
                        const {Hero: {infos: {level}}} = window.shared ? window.shared : window
                        roll.push(level)
                    }

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
                            const gem = reward.gem_type? reward.gem_type : $(reward.value).attr('src').match(/(?<=gems\/)(.+)(?=\.png)/g)[0]
                            roll.push(`G${elm_abrv[gem]}`)
                        } else if (reward.type == 'girl_armor') {
                            const equip_info = reward.value
                            const rarity = equip_info.rarity[0].toUpperCase()
                            const identifier = equip_info.skin.identifier

                            let equip = `e${identifier}${rarity}`
                            if (equip_info.resonance_bonuses.class) {
                                equip += equip_info.resonance_bonuses.class.identifier
                            }
                            if (equip_info.resonance_bonuses.element) {
                                equip += elm_abrv[equip_info.resonance_bonuses.element.identifier]
                            }
                            if (equip_info.resonance_bonuses.figure) {
                                equip += equip_info.resonance_bonuses.figure.identifier
                            }
                            roll.push(equip)
                        }
                    })

                    if (response.no_more_girls) {
                        no_girls[type] = true
                    }

                    pachinko_log[plist].push(roll.join(','))
                    lsSet('PachinkoLog', pachinko_log)
                    this.attachLog()
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
                    label: `Include active Contests`,
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

            $(document).ready(() => {
                HHPlusPlus.Helpers.doWhenSelectorAvailable('#contests .right_part', () => {
                    const {contests} = window
                    const types = ['finished']
                    if (active) {
                        types.push('active')
                    }

                    const $contests = $(`.ranking.over_panel${active ? '' : '.ended'} .closed`)
                    $contests.attr('tooltip', '')
                    $contests.attr('hh_title', 'Copy Contest')
                    $contests.append(`<img src="https://${cdnHost}/design/ic_books_gray.svg">`)

                    types.forEach((type) => {
                        contests[type].forEach((contest) => {
                            const {id_contest, category_type, id_contest_type, participants} = contest
                            const output = Object.values(participants).sort((a,b) => a.rank-b.rank).map((participant) => {
                                const {rank, country_text, id_member, nickname, contest_points} = participant
                                const translation = flag_fr.indexOf(country_text)
                                const flag = translation > -1 ? flag_en[translation] : country_text
                                return `${category_type === 'daily' ? `${id_contest_type}\t${rank}\t` : ''}${[flag, id_member, nickname, contest_points].join('\t')}`
                            }).join('\n')

                            $(`.ranking.over_panel[id_contest=${id_contest}] .closed`).click(() => {
                                copyText(output)
                            })
                        })
                    })
                })

                sheet.insertRules(`
                #contests>div>div.right_part .closed>img {
                    width: 20px;
                    height: 28px;
                    margin-top: 0px;
                    margin-left: 10px;
                }
                .ranking .closed {
                    cursor: pointer;
                }
                #contests>div>div.right_part>.ranking:not(.ended)>.closed {
                    display: unset!important;
                    font-size: 0!important;
                    position: absolute!important;
                    right: 1rem!important;
                    left: unset!important;
                    top: 5.75rem!important;
                }`)
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

                const fill_slots_market = (el) => {
                    const slots = $(el).find('.slot-container').length
                    const slots_empty = $(el).find('.slot-container.empty').length
                    const slots_filled = slots - slots_empty
                    const empty_pad = Math.max(16, Math.ceil(slots_filled/4)*4) - slots_filled

                    if (slots && empty_pad != slots_empty) {
                        $(el).find('.slot-container.empty').remove()
                        $(el).append('<div class="slot-container empty"><div class="slot empty"></div></div>'.repeat(empty_pad))
                    }
                }

                $('.player-inventory-content, .my-inventory-container .booster').each((i, el) => {
                    const observer = new MutationObserver(() => {
                        fill_slots_market(el)
                    })
                    fill_slots_market(el)
                    observer.observe($(el)[0], {childList: true})
                })

                sheet.insertRules(`
                .right-container .player-inventory-content {
                    width: 26rem!important;
                    height: 24.5rem!important;
                    align-content: flex-start;
                }
                .right-container .player-inventory-content.armor {
                    height: 23.5rem!important;
                }
                .merchant-inventory-container {
                    margin-top: 6rem;
                }
                .left-container .bottom-container {
                    position: absolute;
                    top: 7rem;
                }
                .right-container .bottom-container {
                    position: absolute;
                    top: -4rem;
                    left: 40rem;
                    width: auto!important;
                }
                .left-container .top-container {
                    width: 17.5rem!important;
                }

                .market-girl-container, .hero-img, .equiped-booster-text {
                    display: none;
                }
                .tab-booster .my-inventory {
                    width: 27rem!important;
                }
                .tab-armor .my-inventory {
                    width: 29rem!important;
                }
                .tab-booster .equiped-items {
                    width: 16rem!important;
                }
                .tab-armor .equiped-items {
                    width: 14rem!important;
                }
                .armor-container {
                    width: 12rem!important;
                }
                .booster-container {
                    width: 14rem!important;
                }
                .booster-container .booster {
                    margin-right: unset!important;
                    margin-left: 1rem!important;
                    margin-top: 1rem!important;
                    width: 12rem!important;
                    height: 12rem;
                }
                .booster-container .booster .slot {
                    margin-bottom: unset!important;
                }

                .my-inventory .bottom-container {
                    position: absolute;
                    z-index: 100;
                    flex-direction: column-reverse;
                    justify-content: flex-end!important;
                    left: 46.25rem!important;
                    bottom: 5.25rem!important;
                    height: 4.5rem;
                    width: 7.5rem;
                }
                .tab-booster .my-inventory .bottom-container {
                    left: 45.25rem!important;
                }
                .blue_text_button[disabled][rel="levelup"] {
                    display: none;
                }

                .my-hero-switch-content .my-inventory-container, .my-hero-switch-content .my-inventory-container .armor, .my-hero-switch-content .my-inventory-container .booster {
                    align-content: flex-start;
                    width: 24rem!important;
                    justify-content: unset!important;
                    margin-left: 1.5rem;
                    max-width: unset!important;
                }
                #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-boosters-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .booster .slot-container:nth-child(4n), #shops .shop-container .content-container #my-hero-tab-container .my-hero-switch-content #my-hero-equipement-tab-container .my-inventory-equipement-container .my-inventory .my-inventory-container .armor .slot-container:nth-child(4n), #shops .shop-container .content-container #equipement-tab-container .my-inventory-container .armor .slot-container:nth-child(4n), #shops .shop-container .content-container #boosters-tab-container .my-inventory-container .booster .slot-container:nth-child(4n), #shops .shop-container .content-container #books-tab-container .my-inventory-container .potion .slot-container:nth-child(4n), #shops .shop-container .content-container #gifts-tab-container .my-inventory-container .gift .slot-container:nth-child(4n) {
                    margin-right: 0.5rem;
                }
                .my-hero-switch-content .my-inventory-container .armor {
                    margin-left: 3.5rem!important;
                }
                .my-hero-switch-content .my-inventory-container, .my-hero-switch-content .my-inventory-container .booster {
                    height: 22rem!important;
                }
                .my-hero-switch-content .my-inventory-container .armor {
                    height: 21.5rem!important;
                }

                .armor-container .armor {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 12rem;
                    width: 10rem;
                    margin-left: 1.5rem;
                    margin-top: 1rem;
                }
                .armor-container .armor .slot-container {
                    position: unset!important;
                    width: 60px!important;
                    height: 60px!important;
                }
                .armor-container .armor .slot {
                    width: 60px!important;
                    height: 60px!important;
                }
                .equiped-items .slot.potential::after, .equiped-items .slot.selected::after, .equiped-items .slot.using::after {
                    width: 66px!important;
                    height: 66px!important;
                    top: -4px!important;
                    left: -4px!important;
                }`)

                //css rules for HH++ equip filter and market info
                sheet.insertRules(`
                #my-hero-equipement-tab-container label.equip_filter {
                    left: 17.5rem!important;
                    z-index: 4;
                }
                #my-hero-equipement-tab-container .equip_filter_box {
                    left: 13rem!important;
                }
                #my-hero-equipement-tab-container .equip_filter_box.resonance {
                    left: 6rem!important;
                }

                .my-inventory-container .inventoryInfo {
                    right: 18px !important;
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
            return (currentPage.includes('characters') || currentPage.includes('harem')) && !currentPage.includes('hero') || currentPage.includes('/girl/')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                if ((currentPage.includes('characters') || currentPage.includes('harem')) && !currentPage.includes('hero')) {
                    sheet.insertRules(`
                    #harem_whole #harem_left div.girls_list.grid_view div[girl]>.left>.icon span {
                        margin-right: -30px;
                    }
                    #harem_whole #harem_left div.girls_list.grid_view div[girl].opened>.right>.g_infos>.lvl {
                        top: -3px!important;
                    }`)
                } else if (currentPage.includes('girl')) {
                    ['experience', 'affection'].forEach((resource) => {
                        const $inventory = $(`#${resource} .inventory`)

                        const slot_observer = new MutationObserver(() => {
                            const slots = $(`#${resource} .inventory-slot`).length
                            if (slots && slots < 20) {
                                const empty_fill = 20 - slots
                                if (empty_fill) {
                                    $inventory.append('<div class="inventory-slot empty-slot"><div class="slot"></div></div>'.repeat(empty_fill))
                                }
                            }
                        })
                        slot_observer.observe($inventory[0], {childList: true})
                    })

                    sheet.insertRules(`
                    [page="girl"] .girl-leveler-panel .girl-leveler-container .switch-tab-content .total-from-items {
                        margin-top: 0.5rem;
                    }
                    [page="girl"] .girl-leveler-panel .girl-leveler-container .switch-tab-content .total-from-items p {
                        margin-top: 0.25rem;
                        margin-bottom: 0.25rem;
                    }
                    #experience .inventory, #affection .inventory {
                        grid-auto-flow: column;
                        grid-template-rows: auto auto auto auto;
                        height: 21.5rem;
                        gap: 0.25rem 1rem;
                        padding-top: 0.5rem;
                        justify-content: start;
                    }
                    #equipment .inventory {
                        height: 21.5rem;
                        gap: 0.25rem 1rem;
                        padding-top: 0.5rem;
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
                const villain_level = parseInt(opponent_fighter.player ? opponent_fighter.player.level : $('.new-battle-opponent .hero-level-indicator').text())
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
                            let temp_count = reward.value
                            if (typeof temp_count === 'string') {
                                temp_count = temp_count.replace(/,/g, '')
                            }
                            const count = parseInt(type == 'item' ? reward.value.quantity : temp_count)
                            let drop_count = isMulti ? count : 1
                            let reward_key = '?'

                            if (type == 'item') {
                                const item = reward.value.item
                                reward_key = `${item.identifier}${item.rarity[0].toUpperCase()}`
                            } else if (type == 'gems') {
                                const gem_count = id_opponent < 5 ? 15 : id_opponent < 13 ? 20 : 25
                                const gem_type = reward.gem_type? reward.gem_type : reward.value.match(/(?<=gems\/).*?(?=\.png)/g)[0]
                                if (isMulti) {drop_count = count/gem_count}
                                reward_key = `G${gem_count == 15 ? first_gems.includes(gem_type) ? 1 : 2 : ''}`
                            } else if (type == 'soft_currency') {
                                if (isMulti) {
                                    const club_info = lsGet('ClubStatus', 'HHPlusPlus') || {'upgrades': {'soft_currency_gain': {'bonus': 0}}}
                                    const sc_bonus = 1 + club_info.upgrades.soft_currency_gain.bonus
                                    const {Hero} = window.shared ? window.shared : window
                                    const sc_count = parseInt(response.rewards.heroChangesUpdate.currency.soft_currency) - parseInt(Hero.currencies.soft_currency)
                                    const sc_per = (villain_level*100 + 500) * sc_bonus
                                    drop_count = Math.round(sc_count/sc_per) // round to be safe
                                }
                                reward_key = 'Y'
                            } else if (type == 'orbs') {
                                if (reward.orbs_type? reward.orbs_type == 'o_m1' : reward.value.includes('o_m1')) {
                                    reward_key = 'M'
                                } else {
                                    reward_key = 'O'
                                }
                            } else if (type == 'ticket') {
                                reward_key = 'T'
                            } else if (type == 'progressions') {
                                if (reward.progression_type? reward.progression_type=="progression_sm" : reward.value.includes('type_progression_sm')) {
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

                                for (let i=0;i<(rewards_left-girls);i++) {
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
                        const attach_log = () => {
                            $('.opponent_rewards>span').wrap('<div class="gridWrapper"></div>')
                                .before(`<span class="copy"><img tooltip hh_title="Copy Drop Log (${drop_list.length})" src="https://${cdnHost}/design/ic_books_gray.svg"></span>`)
                                .after(`<span class="reset"><img tooltip hh_title="Reset Drop Log" src="https://${cdnHost}/caracs/no_class.png"></span>`)
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

                        if ($('.opponent_rewards>span').length) {
                            attach_log()
                        } else {
                            const observer = new MutationObserver(() => {
                                if ($('.opponent_rewards>span').length) {
                                    observer.disconnect()
                                    attach_log()
                                }
                            })
                            observer.observe(document.documentElement, {childList: true, subtree: true})
                        }
                    }

                    sheet.insertRules(`
                    .opponent_rewards .gridWrapper {
                        grid-template-columns: 1fr 1fr 1fr!important;
                    }
                    .opponent_rewards .copy>img {
                        width: 20px;
                        height: 28px;
                    }
                    .opponent_rewards .reset>img {
                        width: 28px;
                        height: 28px;
                    }`)
                }
            })

            this.hasRun = true
        }
    }

    class ChampDrops extends HHModule {
        constructor () {
            const baseKey = 'ChampDrops'
            const configSchema = {
                baseKey,
                default: true,
                label: `Champion Drops Recorder`
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('champions/') || currentPage.includes('champions-map')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                if (currentPage.includes('champions/')) {
                    HHPlusPlus.Helpers.onAjaxResponse(/battle_type=champion/, (response, opt) => {
                        const searchParams = new URLSearchParams(opt.data)
                        const battles = parseInt(searchParams.get('battles_amount'))
                        const champ_id = parseInt(searchParams.get('defender_id'))
                        const champ_drops = lsGet('ChampDrops') || {}
                        if (Object.keys(champ_drops).length === 0) {
                            const zeroes = Array(7).fill(0)
                            champ_drops.loss = {total_drops: [...zeroes]};
                            ['common', 'rare', 'epic', 'legendary', 'mythic'].forEach((rarity) => {
                                champ_drops.loss[`scrolls_${rarity}`] = {drops: [...zeroes], amount: [...zeroes]}
                            })
                            champ_drops.winShard = {
                                total_drops: [...zeroes],
                                shards: {
                                    drops: [...zeroes],
                                    ids: {1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
                                }
                            }
                        }

                        if (response.final.winner.type === 'champion') { // loss: ymen or bulb
                            if ('rewards' in response.end.rewards.data) {
                                champ_drops.loss.total_drops[0] += battles
                                champ_drops.loss.total_drops[champ_id] += battles
                                response.end.rewards.data.rewards.forEach((reward) => {
                                    if (reward.type in champ_drops.loss) {
                                        champ_drops.loss[reward.type].drops[0] += 1
                                        champ_drops.loss[reward.type].drops[champ_id] += 1
                                        champ_drops.loss[reward.type].amount[0] += parseInt(reward.value)
                                        champ_drops.loss[reward.type].amount[champ_id] += parseInt(reward.value)
                                    }
                                })
                            }
                        } else {
                            // win and stage 1-4 with event girl: L. equip or 35 shards
                            const {championData} = window
                            const {champion: {stage}} = championData
                            if (((stage.current + 1) != stage.max) && ('girl_shards' in championData.reward.stage)) {
                                champ_drops.winShard.total_drops[0] += 1
                                champ_drops.winShard.total_drops[champ_id] += 1
                                if ('shards' in response.end.rewards.data) {
                                    response.end.rewards.data.shards.forEach((reward) => {
                                        champ_drops.winShard.shards.drops[0] += 1
                                        champ_drops.winShard.shards.drops[champ_id] += 1
                                        champ_drops.winShard.shards.ids[champ_id].push(parseInt(reward.id_girl))
                                    })
                                }
                            }
                        }

                        lsSet('ChampDrops', champ_drops)
                    })
                } else if (currentPage.includes('champions-map')) {
                    const champ_drops = lsGet('ChampDrops')
                    if (champ_drops) {
                        const buildSummary = (key) => {
                            const headers = {
                                loss: 'Loss - Any Tier',
                                winShard: 'Shard Win - Tiers 1-4',
                            }
                            const rewards_info = {
                                scrolls_mythic: {
                                    text: 'Mythic Bulb',
                                    src: '/girl_skills/mythic_resource.png'
                                },
                                scrolls_legendary: {
                                    text: 'Legendary Bulb',
                                    src: '/girl_skills/legendary_resource.png'
                                },
                                scrolls_epic: {
                                    text: 'Epic Bulb',
                                    src: '/girl_skills/epic_resource.png'
                                },
                                scrolls_rare: {
                                    text: 'Rare Bulb',
                                    src: '/girl_skills/rare_resource.png'
                                },
                                scrolls_common: {
                                    text: 'Common Bulb',
                                    src: '/girl_skills/common_resource.png'
                                },
                                loss: {
                                    text: 'Ymen',
                                    src: 'pictures/design/ic_topbar_soft_currency.png'
                                },
                                shards: {
                                    text: 'Shards',
                                    src: 'shards.png'
                                },
                                winShard: {
                                    text: 'Other',
                                    src: 'design/mythic_equipment/mythic_equipment.png'
                                }
                            }

                            const pool_drops = champ_drops[key]
                            const rewards = [key].concat(Object.keys(pool_drops).slice(1)).reverse()

                            const buildColumn = (index) => {
                                const total = pool_drops.total_drops[index]
                                let other = 0
                                const column = `<ul${index != 0 ? '' : ' class="total_column"'}>
                                    <li class="column_header">
                                        <span>${index != 0 ? `Champ ${index}` : 'Total'}</span>
                                        <span class="sample-count ticket_icn">${total}</span>
                                    </li>
                                    ${rewards.map((reward) => {
                                        const drops = reward!=key ? pool_drops[reward].drops[index] : pool_drops.total_drops[index]-other
                                        other += drops
                                        return `<li${reward!=key && pool_drops[reward].amount ? ` class="two_data">
                                            <span>${pool_drops[reward].amount[index]}</span>` : '>'}
                                            <span tooltip="" hh_title="${drops} <span class='ticket_icn'></span>">${(100 * (drops/total)).toFixed(2)}%</span>
                                        </li>`
                                    }).join('')}
                                </ul>`

                                return column;
                            }

                            const summary = `
                            <div class="champ-summary ${key}">
                                <div class="summary-header">
                                    <h1>${headers[key]}</h1>
                                </div>
                                <div class="summary-body">
                                    <ul>
                                        <li class="column_header"><span></span></li>
                                        ${rewards.map((reward) => {
                                            const info = rewards_info[reward]
                                            return `<li><img alt="${info.text}" tooltip="" hh_title="${info.text}" src="https://${cdnHost}/${info.src}"></li>`
                                        }).join('')}
                                    </ul>
                                    ${[...Array(7).keys()].map((index) => buildColumn(index)).join('')}
                                </div>
                            </div>`

                            return summary
                        }

                        const $button = $('<div class="blue_circular_btn champ-log-btn"><span class="info_icn"></span></div>')
                        const $panel = $(`<div class="champ-log-panel">${Object.keys(champ_drops).map((key) => buildSummary(key)).join('')}</div>`)
                        const $overlayBG = $('<div class="champ-log-overlay-bg"></div>')

                        const $champ_drops = $('<div class="champ-drops"></div>').append($button).append($panel).append($overlayBG)
                        $('.page-champions_map section').append($champ_drops)

                        $button.click(() => {
                            $panel.toggleClass('visible')
                            $overlayBG.toggleClass('visible')
                        })

                        $overlayBG.click(() => {
                            $panel.removeClass('visible')
                            $overlayBG.removeClass('visible')
                        })

                        sheet.insertRules(`
                        .champ-log-btn {
                           position: absolute;
                           right: 2rem;
                           width: 35px;
                           height: 35px;
                        }
                        .champ-log-overlay-bg {
                            display: none;
                            width: 100%;
                            height: 110%;
                            position: absolute;
                            top: -5%;
                            z-index: 50;
                        }
                        .champ-log-panel {
                            display: none;
                            background-color: #080808f5;
                            color: #fff;
                            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
                            font-weight: 400;
                            position: absolute;
                            top: 40px;
                            right: 20px;
                            width: 32rem;
                            z-index: 51;
                            border-radius: 5px;
                            border-width: 5px;
                            border-style: solid;
                            border-color: #cccccc42;
                            padding: 4px;
                            grid-gap: 10px;
                            grid-template-columns: auto;
                            max-height: 470px;
                            overflow-y: auto;
                        }

                        .champ-log-overlay-bg.visible {
                            display: block;
                        }
                        .champ-log-panel.visible {
                            display: grid;
                        }

                        .champ-log-panel h1 {
                            text-align: center;
                            font-size: 1.4em;
                        }
                        .summary-header img {
                            width: 2rem;
                            height: 2rem;
                        }
                        .champ-summary .sample-count {
                            width: 2.5rem;
                            background-position: center;
                            text-align: center;
                            text-shadow: 2px 2px 2px black;
                            padding-top: 10px;
                        }
                        .summary-body {
                            display: grid;
                            grid-template-columns: 2rem repeat(7, 1fr);
                            column-gap: 0.5rem;
                            text-align: center;
                            align-items: center;
                        }
                        .summary-body ul {
                            margin: 0px;
                            padding: 0px;
                            list-style: none;
                            font-size: 14px;
                        }
                        .summary-body li {
                            display: grid;
                            height: 2rem;
                            align-items: center;
                            font-size: 12px;
                        }
                        .summary-body li.two_data {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            column-gap: 0.25rem;
                        }
                        .summary-body ul img {
                            width: 2rem;
                            height: 2rem;
                        }
                        .summary-body li.column_header {
                            display: grid;
                            grid-auto-rows: auto;
                            height: 3rem;
                            justify-content: center;
                            justify-items: center;
                            font-size: 14px;
                        }
                        .summary-body ul.total_column {
                            border-right: 4px solid;
                            border-color: rgba(204, 204, 204, 0.26);
                            padding-right: 6px;
                        }`)
                    }
                }
            })

            this.hasRun = true
        }
    }

    class CopyLeaderboard extends HHModule {
        constructor () {
            const baseKey = 'CopyLeaderboard'
            const configSchema = {
                baseKey,
                default: true,
                label: `Copy LR Leaderboards`
            }
            super({name: baseKey, configSchema})

            this.output = ''
        }

        shouldRun () {
            return currentPage.includes('seasonal')
        }

        run () {
            if (this.hasRun || !this.shouldRun()) {return}

            const attachCopy = (selector, time) => {
                setTimeout(() => {
                    const $copy = $('<div class="copy-data" tooltip hh_title="Copy Leaderboard"></div>')
                    const $timer = $(`${selector} [rel=expires]`)

                    $timer.addClass('copy-time').attr('tooltip', '').attr('hh_title', 'Copy Time')
                    $timer.click(() => copyText(time))
                    $(`${selector} .ranking-timer.timer`).append($copy)
                    $copy.click(() => copyText(this.output))
                }, 500)
            }

            HHPlusPlus.Helpers.onAjaxResponse(/action=leaderboard/, (response, opt) => {
                const {leaderboard, hero_data} = response
                const {event_functionalities: {id_seasonal_event_type}} = window
                const time = Date.now()
                const searchParams = new URLSearchParams(opt.data)
                const feature = searchParams.get('feature')

                if (feature === 'seasonal_event_top') {
                    this.output = leaderboard.map((row) => {
                        return [row.potions, row.rank, row.id_member, row.nickname].join('\t')
                    }).join('\n')
                    if (hero_data.rank > 1000) {
                        const {Hero} = window.shared ? window.shared : window
                        this.output += `\n${[hero_data.potions, hero_data.rank, Hero.infos.id, Hero.infos.name].join('\t')}`
                    }

                    attachCopy('#top_ranking_tab_container', time)
                } else if (feature === 'seasonal_event_percent') {
                    if (id_seasonal_event_type == 2) {
                        this.output = [...leaderboard.map((bracket) => {
                            return [bracket.min_potions, bracket.percentile].join('\t')
                        }), [hero_data.potions, hero_data.rank/100].join('\t')].join('\n')
                    } else {
                        this.output = [hero_data.potions, `${hero_data.rank/100}%`, ...leaderboard.map((bracket) => {return bracket.min_potions})].join('\t')
                    }

                    attachCopy('#event_ranking_tab_container', time)
                }
            })

            sheet.insertRules(`
            .copy-data {
                width: 26px;
                height: 26px;
                margin-top: 0px;
                margin-left: 10px;
                cursor: pointer;
                background-image: url(https://${cdnHost}/design/ic_books_gray.svg);
            }
            .copy-time {
                cursor: pointer;
            }`)

            this.hasRun = true
        }
    }

    class labyrinthData extends HHModule {
        constructor () {
            const baseKey = 'LabyrinthData'
            const configSchema = {
                baseKey,
                default: true,
                label: `Console Log Labyrinth Data`,
                subSettings: [{
                    key: 'grid',
                    label: `Log grid layout info`,
                    default: false

                }, {
                    key: 'pre_battle',
                    label: `Log pre-battle data`,
                    default: false
                }, {
                    key: 'battle',
                    label: `Log battle data`,
                    default: true
                }, {
                    key: 'relic',
                    label: 'Log relic choice info',
                    default: true
                }]
            }
            super({name: baseKey, configSchema})
        }

        shouldRun () {
            return currentPage.includes('labyrinth')
        }

        run ({grid, pre_battle, battle, relic}) {
            if (this.hasRun || !this.shouldRun()) {return}

            $(document).ready(() => {
                if (currentPage.includes('labyrinth-battle') && battle) {
                    const {hero_fighter_v4, opponent_fighter_v4} = window
                    console.log(hero_fighter_v4)
                    console.log(opponent_fighter_v4)
                    HHPlusPlus.Helpers.onAjaxResponse(/action=do_battles_labyrinth/i, (response) => {
                        console.log(response)
                    })
                } else if (currentPage.includes('labyrinth-pre-battle') && pre_battle) {
                    const {hero_fighter, opponent_fighter} = window
                    console.log(hero_fighter)
                    console.log(opponent_fighter)
                } else if (currentPage.includes('labyrinth.html')) {
                    if (grid) {
                        const {labyrinth_grid} = window
                        Object.values(labyrinth_grid.floors).forEach((floor) => {
                            if (!Object.values(floor.rows[2].hexes).some(hex => hex.type === 'hero')) {
                                const HEX_KEYS = {
                                    'treasure': 'T',
                                    'shrine': 'R',
                                    'opponent_super_easy': 'S',
                                    'opponent_easy': 'E',
                                    'opponent_medium': 'M',
                                    'opponent_hard': 'H',
                                    'opponent_boss': 'B'
                                }

                                const grid = []
                                Object.values(floor.rows).forEach((row, r) => {
                                    if (r != 0 && r != 10) {
                                        const hexes = Object.values(row.hexes)
                                        const temp = Array(3).fill('')
                                        const hex_map = hexes.length === 3 ? [2, 1, 0] : [2, 0]

                                        hexes.forEach((hex, h) => {
                                            temp[hex_map[h]] = HEX_KEYS[hex.type]
                                        })
                                        grid.push(temp.join('\t'))
                                    }
                                })
                                console.log(grid.join('\n'))
                            }
                        })
                    }

                    if (relic) {
                        const RELIC_KEYS = {
                            "girl_impactful": 'IM',
                            "girl_egoist": 'EG',
                            "girl_harmony": 'SH',
                            "girl_defender": 'DH',
                            "girl_critical": 'CT',
                            "girl_dodge": 'DM',
                            "girl_leech": 'ER',
                            "girl_double_attack": 'DA',
                            "girl_first_in_line": 'FL',
                            "girl_backline": 'BB',
                            "team_impactful": 'IM',
                            "team_egoist": 'EG',
                            "team_harmony": 'SH',
                            "team_defender": 'DH',
                            "team_critical": 'CT',
                            "team_critical_expectation": 'CX',
                            "team_defender_frontline": 'FD',
                            "team_harmony_middle": 'HM',
                            "team_impactful_back": 'AB',
                            "team_impactful_dominatrix": 'DO',
                            "team_impactful_submissive": 'SU',
                            "team_impactful_voyeur": 'VO',
                            "team_impactful_eccentric": 'EC',
                            "team_impactful_exhibitionist": 'EX',
                            "team_impactful_physical": 'PH',
                            "team_impactful_playful": 'PL',
                            "team_impactful_sensual": 'SE',
                            "team_hex": 'CU',
                            "team_executioner": 'FM',
                            "team_healthy": 'VM',
                            "team_berserk": 'BK',
                            "team_protective": 'PB',
                            "team_elimination": 'DM',
                            "team_shield": 'PA',
                            "team_rejuvenation": 'RJ'
                        }
                        const relics = []
                        HHPlusPlus.Helpers.onAjaxResponse(/action=labyrinth_get_member_relics/i, (response) => {
                            if (response.unclaimed_relics) {
                                relics.push(...response.unclaimed_relics)
                            }
                        })
                        HHPlusPlus.Helpers.onAjaxResponse(/action=labyrinth_pick_unclaimed_relic/i, (response, opt) => {
                            const searchParams = new URLSearchParams(opt.data)
                            const picked_relic = parseInt(searchParams.get('id_relic_unclaimed'))
                            const index = relics.findIndex(({id_member_relic_unclaimed}) => id_member_relic_unclaimed === picked_relic) + 1

                            const relic_keys = []
                            relics.forEach((relic) => {
                                const girl = relic.girl ? relic.girl.id_girl : ''
                                const relic_key = RELIC_KEYS[relic.identifier]
                                const rarity = relic.rarity[0]
                                relic_keys.push(`${girl}${relic_key}${rarity}`)
                            })
                            relic_keys.push(index)
                            console.log(relic_keys.join('\t'))
                        })
                    }
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
        new VillainDrops(),
        new ChampDrops(),
        new CopyLeaderboard(),
        new labyrinthData()
    ]

    setTimeout(() => {
        if (window.HHPlusPlus) {
            const runScript = () => {
                const {hhPlusPlusConfig} = window

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

            if (window.hhPlusPlusConfig) {
                runScript()
            } else {
                $(document).on('hh++-bdsm:loaded', runScript)
            }
        } else if (!(['/integrations/', '/index.php'].some(path => path === location.pathname) && location.hostname.includes('nutaku'))) {
            console.log('WARNING: HH++ BDSM not found. Ending the script here')
        }
    }, 1)
})()
