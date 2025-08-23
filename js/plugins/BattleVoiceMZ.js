//=============================================================================
// Plugin for RPG Maker MZ
// BattleVoiceMZ.js
//=============================================================================

// [Update History]
// This plugin is MZ version of BattleVoice.js the KADOKAWA RMMV plugin.
// - BattleVoice.js
// 2015.Nov    Ver1.0.0 First Release
// 2016.Aug    Ver1.1.0 Strict Option Input
// 2019.Feb.27 Ver1.2.0 Random Play
// - BattkeVoiceMZ
// 2020.Jan    Ver1.0.0 First release: Add plugin commands
// 2020.Oct.06 Ver1.1.0 Add situations: on counter attack and on reflect magic
// 2020.Nov.09 Ver1.2.0 Add situations: on evade attack and on battle starts
// 2021.Feb.21 Ver1.3.0 Add situations: on receive recover magic from ally
// 2021.Sep.07 Ver1.4.0 Fix bug when one receive magic, sometime play > 1 times
//                      Add situation : when an actor use specified item
//                      Add situation : when one select escape
// 2021.Sep.11 Ver1.4.1 Fix bug : error when use item whose range is all allies
// 2021.Sep.12 Ver1.4.2 Fix bug
// 2022.Jan.05 Ver1.5.0 Add situation: damage value is too small or big
// 2022.Mar.11 Ver1.6.0 Enables to set Enemy's battle voice.(note only)
//                Add option : let the timing of play first voice be selectable
//                      Add situation : when an actor gain level
// 2022.Apr.08 Ver1.7.0 Add situation: on guard (TPB only)
//            Refine Plugin command: enables to assign voice also enemy's skill
//                      Add situation: when defeat an opponent
// 2022.Apr.10 Ver1.7.1 Fix bug: enemy's skill voice played as actor's one.
// 2022.Apr.13 Ver1.8.0  Add situations: battle starts with either 
//                preemptive or surprise.
//                       Add situation: when all actors dead
// 2022.Apr.17 Ver1.9.0  Add situation: when actor command window opens
//                       Add situation: when actor's states change
// 2022.Apr.18 Ver1.9.1  Add spec: when one's hp affected, not play state voice
// 2022.Apr.19 Ver1.10.0 When one's attack is miss, play target's evade voice.
//                   Add situations: when one use general item(forAlly, other)
// 2022.Apr.20 Ver1.11.0 Add plugin commands to set/reset enemy's voice.
//                       Add situation(for enemy): when all actors dead
//                       Enables to set plural item/skill IDs for one voice.
//          (ひとつのプラグインコマンドで複数のアイテムやスキルに同じボイスを
//          一括設定可に)
// 2022.Apr.27 Ver1.11.1 strict arguments type check where it uses eval().
// 2022.Apr.28 Ver1.11.2 Enables to play guard voice also turn-based battle.
// 2022.May.01 Ver1.11.3 Fix bug: Do play state change voice
//                                      (enbugged at Ver1.11.1)
// 2022.Aug.14 Ver1.11.4 Plays voice when one drain opponent's HP
// 2022.Aug.14 Ver1.11.5 Fix bug: At battle starts, noBattle member might bark.
//                       Playes voice when one drain opponent's MP
// 2022.Aug.15 Ver1.12.0 Plays voice when one perform HP/MP drain skill
// 2022.Aug.17 Ver1.13.0 Add situation: when one takes damage to protect ally
// 2022.Aug.22 Ver1.14.0 Enable to set voice when skill received from specified
//                       actor.
// 2022.Nov.09 Ver1.14.1 Add option to item voice whether to play whose target
//                       is the same as user.
// 2022.Nov.09 Ver1.15.0 Enables to change volume/pitch/pan for specified voice
// 2023.Jul.25 Ver1.16.0 Add several features:
//                - Add situation: at miss to attack' and 'at take critical'
//                - Add function: Assign unique volume/pitch/pan to each actor
// 2023.Jul.26 Ver1.16.1 Add situation: take attack bat the attack is miss
//
// 2024.Feb.11 Ver2.0.0 Add situation: on evade magical attack.
//  - When actor is affected any specified states, it doesn't play one's voice.
// 2024.Feb.12 Ver2.0.1 Fix bug: certain to play voice when someone is dead.
// 2024.Feb.14 Ver2.0.2 Fix bug: invoke error if one use item at old save data.
// 2024.May.22 Ver2.0.3 Fix bug: avoid error when actor is null.
// 2024.Oct.03 Ver2.1.0 Enables to select to do when plural actor bark at once
// 2024.Oct.05 Ver2.1.1 Fix bug: played at once when someone is dead
// 2024.Dec.11 Ver2.2.0 Add situation: When one recover by an opponent's attack

/*:
 * @target MZ
 * @plugindesc [Ver2.2.0]Play voice SE at various situations on battle
 * @author Sasuke KANNAZUKI
 * 
 * @param ON switch ID
 * @desc play se only when the switch is ON.
 * This setting interlocks with option Battle Voice.
 * @type switch
 * @default 1
 * 
 * @param actorCommonSetting
 * @text Actor Voice Common Setting
 * @desc Setting common volume, pitch, pan of actor voice.
 * @type text
 * @default
 *
 * @param volume
 * @parent actorCommonSetting
 * @desc volume of SEs. this setting is common among all actor voice SEs.
 * (Default:90)
 * @type number
 * @min 0
 * @max 100000
 * @default 90
 * 
 * @param pitch
 * @parent actorCommonSetting
 * @desc pitch of SEs. this setting is common among all actor voice SEs.
 * (Default:100)
 * @type number
 * @min 10
 * @max 100000
 * @default 100
 *
 * @param pan
 * @parent actorCommonSetting
 * @desc pan of SEs. this setting is common among all actor voice SEs.
 * 0:center, <0:left, >0:right (Default:0)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * @param enemyCommonSetting
 * @text Enemy Voice Common Setting
 * @desc Setting common volume, pitch, pan of enemy voices.
 * @type text
 * @default
 *
 * @param enemyVolume
 * @parent enemyCommonSetting
 * @desc volume of SEs. this setting is common among all enemy voice SEs.
 * (Default:90)
 * @type number
 * @min 0
 * @max 100000
 * @default 90
 * 
 * @param enemyPitch
 * @parent enemyCommonSetting
 * @desc pitch of SEs. this setting is common among all enemy voice SEs.
 * (Default:100)
 * @type number
 * @min 10
 * @max 100000
 * @default 100
 *
 * @param enemyPan
 * @parent enemyCommonSetting
 * @desc pan of SEs. this setting is common among all enemy voice SEs.
 * 0:center, <0:left, >0:right (Default:0)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * @param Battle Voice Name at Option
 * @desc display name at option
 * @type text
 * @default Battle Voice
 *
 * @param firstMsgTiming
 * @text First Voice Timing
 * @desc when it plays first voice?
 * @type select
 * @option Immidiate(0)
 * @value 0
 * @option first message window closed(1)
 * @value 1
 * @default 0
 *
 * @param advanced
 * @text Advanced Setting
 * @desc No need to change unless it has some problems.
 * @type string
 * @default 
 *
 * @param voiceAtAllDamage
 * @parent advanced
 * @text Multiple Damage Style
 * @desc Style when display multiple damages at once(by another plugin)
 * @type select
 * @option Not Change
 * @value normal
 * @option One of Them
 * @value alone
 * @option Make Wait
 * @value wait
 * @default normal
 *
 * @param waitForPlural
 * @parent voiceAtAllDamage
 * @text Plural Wait Count
 * @desc Frame count when you select "Make Wait" (1sec = 60frame)
 * @type number
 * @default 30
 *
 * @noteParam attackVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam guardVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam recoverVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam friendMagicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam magicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam skillVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam itemAllyVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam itemVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam damageVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam evadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam magicEvadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam substituteVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam defeatedVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam firstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam preemptiveFirstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam surpriseFirstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam victoryVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam counterVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam reflectVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam killVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam fromAllyVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam runawayVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam allDeadVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam levelUpVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam commandVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam attackVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam recoverVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam friendMagicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam magicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam skillVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam damageVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam evadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam magicEvadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam defeatedVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam counterVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam reflectVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 * 
 * @noteParam firstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 * 
 * @noteParam allDeadVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData eneiess
 * 
 * @command set
 * @text Change Actor Voice
 * @desc Change various occasional voice
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor to change voice
 * @type actor
 * @default 1
 *
 * @arg situation
 * @text Situation
 * @desc Which occasion to change voice
 * @type select
 * @option At normal attack
 * @value attack
 * @option At miss to attack
 * @value miss
 * @option At guard
 * @value guard
 * @option At recovery magic
 * @value recover
 * @option At magic to ally
 * @value friendMagic
 * @option At general magic
 * @value magic
 * @option At non-magical skill
 * @value skill
 * @option At use item to ally
 * @value itemAlly
 * @option At general item
 * @value item
 * @option On Damaged
 * @value damage
 * @option On Take Critical
 * @value fatalDamage
 * @option On Damaged to protect ally
 * @value substitute
 * @option On Take Attack But Miss
 * @value receiveMiss
 * @option On Evade Attack
 * @value evade
 * @option On Evade Magial Attack
 * @value magicEvade
 * @option On Dead
 * @value dead
 * @option At counter invokes
 * @value counter
 * @option At reflect magic
 * @value reflect
 * @option At defeat an enemy
 * @value kill
 * @option At received recover skill
 * @value fromAlly
 * @option On battle starts(Normal)
 * @value first
 * @option On battle starts(preemptive)
 * @value preemptiveFirst
 * @option On battle starts(surprise)
 * @value surpriseFirst
 * @option On Victory
 * @value victory
 * @option On Try to Escape
 * @value runaway
 * @option At all actors dead
 * @value allDead
 * @option On Level Up
 * @value levelUp
 * @option On Input Actor Command
 * @value command
 * @default attack
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, voices become set by plugin
 * If reset, following 2 parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text New Voice 1
 * @desc If you set more voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text New Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command allReset
 * @text All Reset Actor Voice
 * @desc Reset all voices defined on plugin.
 * It's not reset skill related voice setting.
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor that reset voice setting
 * @type actor
 * @default 1
 * 
 * @command setEnemy
 * @text Change Enemy Voice
 * @desc Change various occasional voice
 *
 * @arg enemyId
 * @text Enemy ID
 * @desc Enemy to change voice
 * @type enemy
 * @default 1
 *
 * @arg situation
 * @text Situation
 * @desc Which occasion to change voice
 * @type select
 * @option At normal attack
 * @value attack
 * @option At miss to attack
 * @value miss
 * @option At recovery magic
 * @value recover
 * @option At magic to ally
 * @value friendMagic
 * @option At general magic
 * @value magic
 * @option At non-magical skill
 * @value skill
 * @option On Damaged
 * @value damage
 * @option On Take Critical
 * @value fatalDamage
 * @option On Take Attack But Miss
 * @value receiveMiss
 * @option On Evade Attack
 * @value evade
 * @option On Dead
 * @value dead
 * @option At counter invokes
 * @value counter
 * @option At reflect magic
 * @value reflect
 * @option On battle starts
 * @value first
 * @option At all actors dead
 * @value allDead
 * @default attack
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, voices become set by plugin
 * If reset, following 2 parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text New Voice 1
 * @desc If you set more voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text New Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command allResetEnemy
 * @text All Reset Enemy Voice
 * @desc Set all voices defined on plugin.
 * It's not reset specified ID skill voice setting.
 *
 * @arg enemyId
 * @text Enemy ID
 * @desc Enemy that reset voice setting
 * @type enemy
 * @default 1
 *
 * @command skillSet
 * @text Set Skill Related Voice
 * @desc Set original voice for each skill.
 *
 * @arg actorOrEnemy
 * @text target battler
 * @desc actor or enemy?
 * @type select
 * @option Actor
 * @value actor
 * @option Enemy
 * @value enemy
 * @default actor
 *
 * @arg actorId
 * @parent actorOrEnemy
 * @text Actor ID
 * @desc The actor to set the skill voice.
 * @type actor
 * @default 1
 *
 * @arg enemyId
 * @parent actorOrEnemy
 * @text Enemy ID
 * @desc The enemy to set the skill voice.
 * @type enemy
 * @default 0
 *
 * @arg skillId
 * @text Skill ID
 * @desc The skill to set the origial voice.
 * @type skill
 * @default 1
 *
 * @arg skillId2
 * @parent skillId
 * @text More Skill IDs
 * @desc More skills to set the same origial voice.
 * @type skill[]
 * @default []
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, voices become normal setting.
 * If reset, following 2 parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text New Voice 1
 * @desc If you set plural voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text New Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command skillAllReset
 * @text Reset All Skill Voice
 * @desc All reset an actor's skill specified voice.
 * Voices that is defined plugins are not reset.
 *
 * @arg actorOrEnemy
 * @text target battler
 * @desc actor or enemy?
 * @type select
 * @option Actor
 * @value actor
 * @option Enemy
 * @value actor
 * @default actor
 *
 * @arg actorId
 * @parent actorOrEnemy
 * @text Actor ID
 * @desc Actor that reset skill voice setting
 * @type actor
 * @default 1
 *
 * @arg enemyId
 * @parent actorOrEnemy
 * @text Enemy ID
 * @desc Enemy that reset skill voice setting
 * @type enemy
 * @default 0
 *
 * @command itemSet
 * @text Set Item Voice
 * @desc Set Voice When One Use Specified Item.
 *
 * @arg actorId
 * @text Actor ID
 * @desc The actor to set the item voice.
 * @type actor
 * @default 1
 *
 * @arg targetId
 * @text Target ID
 * @desc Set specified target. Set 0 if the target is anyone, all actors or opponent(s).
 * @type actor
 * @min 0
 * @default 0
 *
 * @arg doesSkipSelf
 * @parent targetId
 * @text Skip if target is the user?
 * @type boolean
 * @on Yes, skip.
 * @off No, do play.
 * @default false
 *
 * @arg itemId
 * @text Item ID
 * @desc The item to set the origial voice.
 * @type item
 * @min 1
 * @default 1
 *
 * @arg itemId2
 * @parent itemId
 * @text More Item IDs
 * @desc More items to set the same origial voice.
 * @type item[]
 * @default []
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, voices become normal setting.
 * If reset, following 2 parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text New Voice 1
 * @desc If you set plural voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text New Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command itemAllReset
 * @text Reset All Item Voice
 * @desc All reset an actor's item specified voice.
 * Voices that is defined plugins are not reset.
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor that reset item voice setting
 * @type actor
 * @min 1
 * @default 1
 *
 * @command setByDamage
 * @text Set Voice Based on Damage
 * @desc Set special damage voice when setting is met.
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor to change voice
 * @type actor
 * @default 1
 *
 * @arg floorDamage
 * @text When Damage >= This
 * @desc When set 0, It'll play default damage voice.
 * @type number
 * @default 0
 *
 * @arg valueTypeFloor
 * @parent floorDamage
 * @text Value Type
 * @desc select the damage is normal value or ratio(%) of Max HP
 * @type select
 * @option Immediate Value
 * @value normal
 * @option Percentage
 * @value ratio
 * @default normal
 *
 * @arg voice1floor
 * @parent floorDamage
 * @text Voice 1
 * @desc If you set more voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2floor
 * @parent floorDamage
 * @text Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @arg ceilDamage
 * @text When Damage < This
 * @desc When set 0, It'll play default damage voice.
 * @type number
 * @default 0
 *
 * @arg valueTypeCeil
 * @parent ceilDamage
 * @text Value Type
 * @desc select the damage is normal value or ratio(%) of Max HP
 * @type select
 * @option Immediate Value
 * @value normal
 * @option Percentage
 * @value ratio
 * @default normal
 *
 * @arg voice1ceil
 * @parent ceilDamage
 * @text Voice 1
 * @desc If you set more voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2ceil
 * @parent ceilDamage
 * @text Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command resetByDamage
 * @text Reset Voices Based on Damage
 * @desc Reset all damage-related voices.
 * After then, it'll play normal damage voice.
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor to reset changed voices
 * @type actor
 * @default 1
 *
 * @command stateChange
 * @text Voice For States Change
 * @desc Plays when specified state adds or removes
 *
 * @arg actorId
 * @text Actor ID
 * @desc The actor to set the state change voice.
 * @type actor
 * @default 1
 *
 * @arg targetStates
 * @text Target States
 * @desc States to assign specified voice.
 * @type state[]
 * @default []
 *
 * @arg voiceAtStateAdded1
 * @text Voice At State Added 1
 * @desc If you set plural voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voiceAtStateAdded2
 * @parent voiceAtStateAdded1
 * @text Voice At State Added >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @arg voiceAtStateRemoved1
 * @text Voice At State Removed 1
 * @desc If you set plural voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voiceAtStateRemoved2
 * @parent voiceAtStateRemoved1
 * @text Voice At State Removed >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command resetStateChange
 * @text Reset State Voice
 * @desc Reset all state change voice of an actor
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor that reset all state related voices
 * @type actor
 * @default 1
 *  
 * @command allySet
 * @text Set Voice From Specified Ally
 * @desc Change voice "At received recover skill" from specified ally
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor that receive skill
 * @type actor
 * @default 1
 *
 * @arg subjectIds
 * @text Subject Actor IDs
 * @desc Actors that perform skill to ally
 * @type actor[]
 * @default []
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, following 2 parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text New Voice 1
 * @desc If you set more voices, write remainder next param.
 * If you set only one voice, set next param empty.
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text New Voice >=2
 * @desc By writing like atk1,atk2,atk3
 * You can set plural voices
 * @type string
 * @default 
 *
 * @command allyAllReset
 * @text Reset Voices From All Allies
 * @desc Reset all setting defined on plugin
 *
 * @arg actorId
 * @text Actor ID
 * @desc Actor that reset voice setting
 * @type actor
 * @default 1
 *
 * @command voiceInfo
 * @text Change Setting of Voices
 * @desc Change Setting(volume, pitch and pan) of Specified Voices
 *
 * @arg names
 * @text Voice Names
 * @desc Voice Names That Set Specified volume, pitch and/or pan.
 * @type file[]
 * @dir audio/se/
 * @default []
 *
 * @arg isSet
 * @text Set or Reset
 * @desc If reset, setting become set by plugin
 * If reset, following parameters are ignored.
 * @type select
 * @option Set
 * @value set
 * @option Reset
 * @value reset
 * @default set
 *
 * @arg isVolume
 * @text Change Volume?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg volume
 * @parent isVolume
 * @desc Set Volume(system default:90)
 * @type number
 * @max 100000
 * @min 0
 * @default 90
 *
 * @arg isPitch
 * @text Change Pitch?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg pitch
 * @parent isPitch
 * @desc Set Pitch(system default:100)
 * @type number
 * @max 10000
 * @min 1
 * @default 100
 *
 * @arg isPan
 * @text Change Pan?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg pan
 * @parent isPan
 * @desc Set Pan(-100(left) ～ 100(right)). 0:center
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @command voiceInfoReset
 * @text All Reset Voice Settings
 * @desc All voices settings become plugin default.
 *
 * @command actorVoiceInfo
 * @text Change Setting of Actor Voices
 * @desc Change Setting(volume, pitch and pan) of Specified Actor
 *
 * @arg actorId
 * @text Target Actor
 * @desc actor that sets specified volume, pitch and/or pan.
 * @type actor
 * @default 1
 *
 * @arg isVolume
 * @text Change Volume?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg volume
 * @parent isVolume
 * @desc Set Volume(system default:90)
 * @type number
 * @max 100000
 * @min 0
 * @default 90
 *
 * @arg isPitch
 * @text Change Pitch?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg pitch
 * @parent isPitch
 * @desc Set Pitch(system default:100)
 * @type number
 * @max 10000
 * @min 1
 * @default 100
 *
 * @arg isPan
 * @text Change Pan?
 * @desc if it sets "No", it becomes value set by this plugin.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @arg pan
 * @parent isPan
 * @desc Set Pan(-100(left) ～ 100(right)). 0:center
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @command actorVoiceInfoReset
 * @text All Reset Voice Settings
 * @desc All voices settings become plugin default.
 *
 * @arg actorId
 * @text Target Actor
 * @desc actor that resets volume, pitch and/or pan.
 * @type actor
 * @default 1
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin enables to play SE (assumed battle voice) at
 *  various situations.
 *
 * [Summary]
 * Player can change voice ON/OFF by Option Scene (except Title).
 * This setting interlocks switch ID set at plugin parameter.
 *
 * [note specification]
 * write down each actor's note at following format to set SE filename.
 * [[Voices when an actor perform something]]
 * <attackVoice:filename>  plays when actor does normal attack.
 * <attackMissVoice:filename>  plays when actor misses to attack.
 * <guardVoice:filename>  plays when actor selects guard. 
 * <recoverVoice:filename>   plays when actor uses HP recovering magic.
 * <friendMagicVoice:filename> plays when actor spells magic for friend
 *  except HP recovering. if this is not set but <magicVoice:filename> is set,
 *  it plays <magicVoice:filename> setting file.
 * <magicVoice:filename>   plays when actor spells magic(except for friend).
 * <skillVoice:filename>   plays when actor uses special skill except magic.
 *  *NOTE* Here 'magic' skill means its 'Skill Type' is included in 
 *    '[SV]Magic Skills' on 'System 2' tab.
 * <itemAllyVoice:filename>   plays when actor uses item to oneself or ally.
 *  if this is not set, play <itemVoice:filename> instead.
 * <itemVoice:filename>    plays when actor uses item (except for ally).
 * [[Voices when an actor affected from any battler]]
 * <damageVoice:filename>    plays when actor takes damage.
 * <receiveMissVoice:filename> plays when take attack but it is miss.
 * <fatalDamageVoice:filename> at one take critical damage.
 *  When it doesn't set, play (normal) damage voice.
 * <evadeVoice:filename>    plays when actor evades enemy attack.
 *  It'll not play when attacker's attack-miss voice is set.
 * <magicEvadeVoice:filename> plays when actor evades enemy's magical attack.
 *  *NOTE* 'magical attack' means the Hit Type of the skill is "Magical Attack"
 * <substituteVoice:filename> plays when actor take damage to protect an ally.
 * <defeatedVoice:filename>   plays when actor is dead.
 * <counterVoice:filename>   plays when counter attack invokes.
 * <reflectVoice:filename>   plays when actor reflects magic.
 * <killVoice:filename>     plays when actor defeat an enemy.
     It doesn't play when it playes the enemy's defeated voice.
 * <fromAllyVoice:filename> plays when actor received HP recover magic.
 *   It doesn't play when magic user is the same as receiver.
 *   It assumes the phrase 'Thank you' and so on.
 * [[Voices when battle exceeds]]
 * if plural actors attend the battle, randomly selected actor's SE is adopted.  * <firstVoice:filename>   plays when battle starts except surprised.
 * <preemptiveFirstVoice:filename> plays when preemptive battle starting.
 *   If it not sets, play <firstVoice:filename> instead.
 * <surpriseFirstVoice:filename>  plays when surprise battle starting.
 * <victoryVoice:filename>   plays when battle finishes.
 * <runawayVoice:filename>  plays when party try to escape from the battle
 * <allDeadVoice:filename> plays when party lose battle.
 *   This voice's speaker is the actor that dead last.
 * <levelUpVoice:filename> plays when an actor's level grows up 
 * [[misc. Voices]]
 * <commandVoice:filename> plays when starting actor command selection
 *
 * [Important Note] (since Ver2.0.0)
 * It doesn't play actor's voice when the actor is affected by the state
 * either whose Restriction isn't None(Ex.Sleep, Confusion) or
 * whose note contains <VoiceDisable> . (It assumes to use for Silence)
 *
 * [Advanced option 1]
 * If you want to play one of several voices randomly,
 * write filenames with colon as follows:
 * <attackVoice:atk1,atk2,atk3>
 * in this case, at attack, plays atk1 atk2, or atk3 randomly.
 *
 * If set no SE one of filenames, 
 * <attackVoice:atk1,atk2,$>
 * in this case, at attack, plays atk1 atk2, or doesn't play SE.
 *
 * You can set the same filename twice or more than.
 * <attackVoice:atk1,atk2,atk2,$>
 * in this case, 25% atk1, 50% atk2, 25% don't play.
 *
 * *NOTE* When set SEs at this notation, these files might be excluded at
 *  deployment with option 'Exclude unused files'.
 *  To prevent this, I recommend to make dummy event and set each SE to
 *  'Play SE' on the Contents.
 *
 * [Advanced option 2] (Since Ver1.6.0)
 * You can set any enemies battle voices by writing the same notation
 *  as actor's note to the object enemy's note.
 * [[Voices when an enemy perform something]]
 * <attackVoice:filename>  at performing normal attack.
 * <attackMissVoice:filename>  plays when enemy misses to attack.
 * <recoverVoice:filename>   at one uses HP recovering magic.
 * <friendMagicVoice:filename> at one uses magic for friend
 * <magicVoice:filename>   at one spells magic(except for friend).
 * <skillVoice:filename>   at one uses skill except magic.
 * [[Voices when an enemy affected from any battler]]
 * <damageVoice:filename>    at one take damage.
 * <fatalDamageVoice:filename> at one take critical damage.
 *  When it doesn't set, play (normal) damage voice.
 * <evadeVoice:filename>    at one evades opponent's attack
 *  It'll not play when attacker's attack-miss voice is set.
 * <defeatedVoice:filename>   at one is dead.
 * <counterVoice:filename>   at one's counter attack invokes.
 * <reflectVoice:filename>   at one reflects magic.
 * [[Voices when battle exceeds]]
 *  enemies' voices are higher priority than actors' ones.
 * <firstVoice:filename>   at starting battle.
 * <allDeadVoice:filename> at all actors dead.
 * 
 * [Advanced Option 3] (Since Ver1.16.0)
 * It enables specified actor assign different volume/pitch/pan.
 * Write target actor's note as following:
 * <voiceVolume:90>  Set volume for specified actor's voice.
 * <voicePitch:100>  Set pitch
 * <voicePan:100>    Set pan
 * You can also set those settings by pluguin command.
 *
 * [Advanced Option 4] (Since Ver2.1.0)
 * If you introduce any plugin that enables to display plural damage popup
 * at once, you can select how to do at option.
 * - normal - default(play all battlers' voice at once)
 * - alone - play voice of one of the target
 * - wait - forcedly make wait specified frame to play each voice.
 *   [NOTE]"wait" setting is invalid at some plugins that invalidate wait
 *
 * [Advanced Option 5] (Since Ver2.2.0)
 * You can set the voice when you introduce any plugin 
 * that enables to recover from opponent
 * (Ex: one recover HP when receive attack that specified skill element)
 * at following notation.
 * <recoverFromOpponentVoice:filename>
 *
 * [Plugin Commands]
 * By calling plugin commands, you can do as follows:
 * - Set/Reset voice on each situation
 * - Reset all situations' voice to default
 * Following commands are disable to set that note.
 * - Assign/Reset actor/enemy voice to each skill
 * - Reset all voices assigned to skills
 * - Assign/Reset actor voice when one use specified item
 * - Reset all voices assigned to items
 * - Set/Reset special damage voice when setting is met.
 *     (NOTE: When this plugin command sets more than once to the same actor,
 *      it discards old settings and only latest setting is valid,)
 * - Set/Reset actor's voice when one's states added/removed.
 *      this voice doesn't play when one's hp affecs(damage or recover).
 * - Reset all voices on one's state changes
 * - Set/Reset voices when skill receive from specified actor
 * - Reset all voices when one reveives skill from any ally
 * - Assign any voices different volume/pitch/pan
 * - Reset all voices setting volume/pitch/pan
 * - Assign specified actor different volume/pitch/pan
 * - Reset an actor's all settings of volume/pitch/pan
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @target MZ
 * @plugindesc [Ver2.2.0]アクターの戦闘時の行動にボイスSEを設定します。
 * @author 神無月サスケ
 * 
 * @param ON switch ID
 * @text ボイス演奏スイッチID
 * @desc このスイッチが ON の時のみ、ボイスSEを演奏します。
 * オプション「バトルボイス」と連動します。
 * @type switch
 * @default 1
 *
 * @param actorCommonSetting
 * @text アクターボイス共通設定
 * @desc 音量や位相などの共通設定を行います。
 * @type text
 * @default
 *
 * @param volume
 * @parent actorCommonSetting
 * @text 共通ボリューム
 * @desc ボイスSEのボリュームです。この設定がアクターの全てのボイスSEの
 * 共通となります。(既定値:90)
 * @type number
 * @min 0
 * @max 100000
 * @default 90
 *
 * @param pitch
 * @parent actorCommonSetting
 * @text 共通ピッチ
 * @desc ボイスSEのピッチです。この設定がアクターの全てのボイスSEの
 * 共通となります。(既定値:100)
 * @type number
 * @min 10
 * @max 100000
 * @default 100
 *
 * @param pan
 * @parent actorCommonSetting
 * @text 共通位相
 * @desc ボイスSEの位相。この設定がアクターの全てのボイスSE共通になります。
 * 0:中央, 負数:左寄り, 正数:右寄り (既定値:0)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param enemyCommonSetting
 * @text 敵キャラボイス共通設定
 * @desc 音量や位相などの共通設定を行います。
 * @type text
 * @default
 *
 * @param enemyVolume
 * @parent enemyCommonSetting
 * @text 共通ボリューム
 * @desc ボイスSEのボリュームです。この設定が敵キャラの全てのボイスSEの
 * 共通となります。(既定値:90)
 * @type number
 * @min 0
 * @max 100000
 * @default 90
 *
 * @param enemyPitch
 * @parent enemyCommonSetting
 * @text 共通ピッチ
 * @desc ボイスSEのピッチです。この設定が敵キャラの全てのボイスSEの
 * 共通となります。(既定値:100)
 * @type number
 * @min 10
 * @max 100000
 * @default 100
 *
 * @param enemyPan
 * @parent enemyCommonSetting
 * @text 共通位相
 * @desc ボイスSEの位相。この設定が敵キャラの全てのボイスSE共通になります。
 * 0:中央, 負数:左寄り, 正数:右寄り (既定値:0)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param Battle Voice Name at Option
 * @text バトルボイス表示名
 * @desc オプション画面での表示名です。
 * @type string
 * @default バトルボイス
 *
 * @param firstMsgTiming
 * @text 戦闘開始ボイスタイミング
 * @desc 戦闘開始のfirstVoiceをいつ演奏するか
 * @type select
 * @option 開始後すぐ(0)
 * @value 0
 * @option メッセージウィンドウ消去後(1)
 * @value 1
 * @default 0
 *
 * @param advanced
 * @text 高度な設定
 * @desc 通常は変更の必要はありません。
 * @type string
 * @default 
 *
 * @param voiceAtAllDamage
 * @parent advanced
 * @text 複数人ダメージ再生スタイル
 * @desc 別プラグインの導入で、複数人のダメージを一斉に再生する際の処理
 * @type select
 * @option 通常再生
 * @value normal
 * @option 一人のボイスのみ
 * @value alone
 * @option ウェイト発生
 * @value wait
 * @default normal
 *
 * @param waitForPlural
 * @parent voiceAtAllDamage
 * @text ウェイト数
 * @desc ウェイト発生の際のフレーム数(60フレーム＝1秒)
 * @type number
 * @default 30
 *
 * @noteParam attackVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam attackVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam guardVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam friendMagicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam magicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam skillVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam itemAllyVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam itemVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam damageVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam substituteVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam evadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam magicEvadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam defeatedVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam firstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam preemptiveFirstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam surpriseFirstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam victoryVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam counterVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam reflectVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam killVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam fromAllyVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 *
 * @noteParam runawayVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam allDeadVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam levelUpVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam commandVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData actors
 * 
 * @noteParam attackVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam recoverVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam friendMagicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam magicVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam skillVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam damageVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam evadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam magicEvadeVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam defeatedVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 * 
 * @noteParam counterVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam reflectVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam firstVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData enemies
 *
 * @noteParam allDeadVoice
 * @noteRequire 1
 * @noteDir audio/se/
 * @noteType file
 * @noteData eneiess
 * 
 * @command set
 * @text アクター再生音変更
 * @desc 戦闘時の特定の動作のボイスを変更
 *
 * @arg actorId
 * @text アクターID
 * @desc 音声を変更するアクター
 * @type actor
 * @default 1
 *
 * @arg situation
 * @text シチュエーション
 * @desc どのタイミングの音を変更するか
 * @type select
 * @option 通常攻撃時
 * @value attack
 * @option 通常攻撃ミス時
 * @value miss
 * @option ガード時
 * @value guard
 * @option 回復魔法使用時
 * @value recover
 * @option 味方対象魔法使用時
 * @value friendMagic
 * @option 通常魔法使用時
 * @value magic
 * @option 非魔法スキル使用時
 * @value skill
 * @option 味方対象アイテム使用時
 * @value itemAlly
 * @option 通常アイテム使用時
 * @value item
 * @option 被ダメージ時
 * @value damage
 * @option 被クリティカル時
 * @value fatalDamage
 * @option 仲間をかばった時
 * @value substitute
 * @option 受けた攻撃がミスの時
 * @value receiveMiss
 * @option 攻撃回避時
 * @value evade
 * @option 魔法攻撃回避時
 * @value magicEvade
 * @option 戦闘不能時
 * @value dead
 * @option カウンター発動時
 * @value counter
 * @option 魔法反射発動時
 * @value reflect
 * @option 敵を倒した時
 * @value kill
 * @option 回復魔法を受けた時
 * @value fromAlly
 * @option 戦闘開始時(通常)
 * @value first
 * @option 戦闘開始時(先手)
 * @value preemptiveFirst
 * @option 戦闘開始時(不意打ち)
 * @value surpriseFirst
 * @option 戦闘勝利時
 * @value victory
 * @option 逃げるのを試みる時
 * @value runaway
 * @option 全滅時
 * @value allDead
 * @option 戦闘後レベルアップ時
 * @value levelUp
 * @option アクターコマンド入力時
 * @value command
 * @default attack
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセット後はプラグインでの設定値に戻る。
 * リセットの際は以下の2つのパラメータは無視される
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command allReset
 * @text アクター音声全リセット
 * @desc プラグインのオプションに設定した値に戻します。
 * 特定スキル用の音声はリセットされません
 *
 * @arg actorId
 * @text アクターID
 * @desc 音声を全リセットするアクター
 * @type actor
 * @default 1
 *
 * @command setEnemy
 * @text 敵キャラ再生音変更
 * @desc 戦闘時の特定の動作のボイスを変更
 *
 * @arg enemyId
 * @text 敵キャラID
 * @desc 音声を変更する敵キャラ
 * @type enemy
 * @default 1
 *
 * @arg situation
 * @text シチュエーション
 * @desc どのタイミングの音を変更するか
 * @type select
 * @option 通常攻撃時
 * @value attack
 * @option 通常攻撃ミス時
 * @value miss
 * @option 回復魔法使用時
 * @value recover
 * @option 味方対象魔法使用時
 * @value friendMagic
 * @option 通常魔法使用時
 * @value magic
 * @option 非魔法スキル使用時
 * @value skill
 * @option 被ダメージ時
 * @value damage
 * @option 被クリティカル時
 * @value fatalDamage
 * @option 受けた攻撃がミスの時
 * @value receiveMiss
 * @option 攻撃回避時
 * @value evade
 * @option 魔法攻撃回避時
 * @value magicEvade
 * @option 戦闘不能時
 * @value dead
 * @option カウンター発動時
 * @value counter
 * @option 魔法反射発動時
 * @value reflect
 * @option 戦闘開始時
 * @value first
 * @option アクター全滅時
 * @value allDead
 * @default attack
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセット後はプラグインでの設定値に戻る。
 * リセットの際は以下の2つのパラメータは無視される
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command allResetEnemy
 * @text 敵キャラ音声全リセット
 * @desc プラグインのオプションに設定した値に戻します。
 * 特定スキル用の音声はリセットされません
 *
 * @arg enemyId
 * @text 敵キャラID
 * @desc 音声を全リセットする敵キャラ
 * @type actor
 * @default 1
 *
 * @command skillSet
 * @text スキル時音設定
 * @desc 特定スキル使用時の効果
 * スキルIDごとに異なる音声を登録できます。
 *
 * @arg actorOrEnemy
 * @text 対象バトラー
 * @desc アクターか敵キャラか
 * @type select
 * @option アクター
 * @value actor
 * @option 敵キャラ
 * @value enemy
 * @default actor
 *
 * @arg actorId
 * @parent actorOrEnemy
 * @text アクターID
 * @desc スキル時音声を変更するアクター
 * @type actor
 * @default 1
 *
 * @arg enemyId
 * @parent actorOrEnemy
 * @text 敵キャラID
 * @desc スキル時音声を変更する敵キャラ
 * @type enemy
 * @default 0
 *
 * @arg skillId
 * @text スキルID
 * @desc 特別な音声にするスキル
 * @type skill
 * @default 1
 *
 * @arg skillId2
 * @parent skillId
 * @text 追加スキルID
 * @desc 他にもこの音声にするスキル達
 * @type skill[]
 * @default []
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセット後は通常スキルなどの設定音に戻る。
 * リセットの際は以下の2つのパラメータは無視される
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに残りを書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command skillAllReset
 * @text スキル音声全リセット
 * @desc 全ての特定スキル用の音声をリセットします。
 * 通常の再生音はリセットされません。
 *
 * @arg actorOrEnemy
 * @text 対象バトラー
 * @desc アクターか敵キャラか
 * @type select
 * @option アクター
 * @value actor
 * @option 敵キャラ
 * @value enemy
 * @desc アクター？　敵キャラ？
 * @default actor
 *
 * @arg actorId
 * @parent actorOrEnemy
 * @text アクターID
 * @desc スキル音声を全リセットするアクター
 * @type actor
 * @default 1
 *
 * @arg enemyId
 * @parent actorOrEnemy
 * @text 敵キャラID
 * @desc スキル音声を全リセットする敵キャラ
 * @type enemy
 * @default 0
 *
 * @command itemSet
 * @text アイテム使用時音設定
 * @desc 特定のアイテムや対象(オプション)に音声を割り当てます。
 *
 * @arg actorId
 * @text アクターID
 * @desc アイテムを使用するアクター
 * @type actor
 * @default 1
 *
 * @arg targetId
 * @text ターゲットID
 * @desc アイテム対象のアクター。全員同じ時、味方全体対象の時、敵が対象の時は0(なし)にして下さい。
 * @type actor
 * @min 0
 * @default 0
 *
 * @arg doesSkipSelf
 * @parent targetId
 * @text 使用者対象なら演奏しない？
 * @type boolean
 * @on しない
 * @off する
 * @default false
 *
 * @arg itemId
 * @text アイテムID
 * @desc 音声を割り当てるアイテム
 * @type item
 * @min 1
 * @default 1
 *
 * @arg itemId2
 * @parent itemId
 * @text 追加アイテムID
 * @desc 同様の音声を割り当てる別のアイテム達
 * @type item[]
 * @default []
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセット後は通常スキルなどの設定音に戻る。
 * リセットの際は以下の2つのパラメータは無視される
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text 変更後の音声
 * @desc 複数ある時は残りは次のパラメータに残りを書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command itemAllReset
 * @text アイテム音声全リセット
 * @desc 全ての特定アイテム用の音声をリセットします。
 *
 * @arg actorId
 * @text アクターID
 * @desc アイテム使用音声を全リセットするアクター
 * @type actor
 * @min 1
 * @default 1
 *
 * @command setByDamage
 * @text 被ダメージ量による音声設定
 * @desc 特定の被ダメージ量の時に通常ダメージ時とは異なる音声を再生します。
 *
 * @arg actorId
 * @text アクターID
 * @desc この設定を適用するアクター
 * @type actor
 * @default 1
 *
 * @arg floorDamage
 * @text このダメージ以上の時
 * @desc 0 を指定するとセットされません。
 * @type number
 * @default 0
 *
 * @arg valueTypeFloor
 * @parent floorDamage
 * @text 数値タイプ
 * @desc 通常？　割合？　割合は、最大HPに対する割合％です。
 * @type select
 * @option 通常
 * @value normal
 * @option 割合％
 * @value ratio
 * @default normal
 *
 * @arg voice1floor
 * @parent floorDamage
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2floor
 * @parent floorDamage
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @arg ceilDamage
 * @text このダメージ未満の場合
 * @desc 0 を指定するとセットされません。
 * @type number
 * @default 0
 *
 * @arg valueTypeCeil
 * @parent ceilDamage
 * @text 数値タイプ
 * @desc 通常？　割合？　割合は、最大HPに対する割合％です。
 * @type select
 * @option 通常
 * @value normal
 * @option 割合％
 * @value ratio
 * @default normal
 *
 * @arg voice1ceil
 * @parent ceilDamage
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2ceil
 * @parent ceilDamage
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command resetByDamage
 * @text 被ダメージ音声リセット
 * @desc 設定を破棄し、通常のダメージ時ボイスに戻します。
 *
 * @arg actorId
 * @text アクターID
 * @desc 被ダメージ音声をリセットするアクター
 * @type actor
 * @default 1
 *
 * @command stateChange
 * @text ステート変化時音設定
 * @desc 特定のステートが付加/解除された時
 *
 * @arg actorId
 * @text アクターID
 * @desc 当該音声を変更するアクター
 * @type actor
 * @default 1
 *
 * @arg targetStates
 * @text ステートID(複数指定可)
 * @desc この音声に指定するステート。戦闘不能は指定不可
 * @type state[]
 * @default []
 *
 * @arg voiceAtStateAdded1
 * @text ステート付加時ボイス
 * @desc 複数ある時は残りは次のパラメータに残りを書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voiceAtStateAdded2
 * @parent voiceAtStateAdded1
 * @text ステート付加時2以降
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @arg voiceAtStateRemoved1
 * @text ステート解除時ボイス
 * @desc 複数ある時は残りは次のパラメータに残りを書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voiceAtStateRemoved2
 * @parent voiceAtStateRemoved1
 * @text ステート付加時2以降
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command resetStateChange
 * @text ステート変化時音リセット
 * @desc 特定のアクターのステート変化音をリセットします
 *
 * @arg actorId
 * @text アクターID
 * @desc ステート音声を全リセットするアクター
 * @type actor
 * @default 1
 *
 * @command allySet
 * @text 特定アクターからの声設定
 * @desc シチュエーション「回復魔法を受けた時」において、特定のアクターから受けた時のボイスを変更します。
 *
 * @arg actorId
 * @text アクターID
 * @desc 回復魔法を受ける側のアクター
 * @type actor
 * @default 1
 *
 * @arg subjectIds
 * @text 術者ID(複数選択可)
 * @desc 回復魔法をかける側のアクター
 * @type actor[]
 * @default []
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセット後は通常スキルなどの設定音に戻る。
 * リセットの際は以下の2つのパラメータは無視される
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg voice1
 * @text 変更後の声
 * @desc 複数ある時は残りは次のパラメータに残りを書いてください
 * ひとつだけの時は、次のパラメータは空にします
 * @type file
 * @dir audio/se/
 * @default 
 *
 * @arg voice2
 * @text 変更後の声(2つ目以降)
 * @desc atk1,atk2,atk3 のようにコンマで括って
 * 複数指定が可能
 * @type string
 * @default 
 *
 * @command allyAllReset
 * @text 特定アクターからの声全解除
 * @desc 設定をリセットし、通常のボイスを再生するようにします
 *
 * @arg actorId
 * @text アクターID
 * @desc 設定を全リセットするアクター
 * @type actor
 * @default 1
 *
 * @command voiceInfo
 * @text 特定ボイスの詳細変更
 * @desc 指定したボイスの、音量、ピッチ、位相を変更します
 *
 * @arg names
 * @text ボイス名
 * @desc 詳細を変更するボイスです(複数指定可)
 * @type file[]
 * @dir audio/se/
 * @default []
 *
 * @arg isSet
 * @text セットかリセットか
 * @desc リセットの場合、プラグインの設定に戻ります。
 * リセットの場合、以下の設定は全て無視されます。
 * @type select
 * @option セット
 * @value set
 * @option リセット
 * @value reset
 * @default set
 *
 * @arg isVolume
 * @text 音量変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default true
 *
 * @arg volume
 * @text 音量
 * @parent isVolume
 * @desc システムのデフォルトは90です。
 * @type number
 * @max 100000
 * @min 0
 * @default 90
 *
 * @arg isPitch
 * @text ピッチ変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default true
 *
 * @arg pitch
 * @parent isPitch
 * @text ピッチ
 * @desc システムのデフォルトは100です。
 * @type number
 * @max 10000
 * @min 1
 * @default 100
 *
 * @arg isPan
 * @text 位相変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default false
 *
 * @arg pan
 * @parent isPan
 * @text 位相
 * @desc -100(左) ～ 100(右)の範囲内で。 中央は0です。
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @command voiceInfoReset
 * @text ボイスの詳細全リセット
 * @desc ボイスの設定を全て破棄し、プラグインのデフォルト値に戻します。
 *
 * @command actorVoiceInfo
 * @text 特定アクターボイスの詳細変更
 * @desc 指定したアクターのボイスの音量、ピッチ、位相を変更します
 *
 * @arg actorId
 * @text 対象アクター
 * @desc ボイス詳細を変更するアクターです
 * @type actor
 * @default 1
 *
 * @arg isVolume
 * @text 音量変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default true
 *
 * @arg volume
 * @text 音量
 * @parent isVolume
 * @desc システムのデフォルトは90です。
 * @type number
 * @max 100000
 * @min 0
 * @default 90
 *
 * @arg isPitch
 * @text ピッチ変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default true
 *
 * @arg pitch
 * @parent isPitch
 * @text ピッチ
 * @desc システムのデフォルトは100です。
 * @type number
 * @max 10000
 * @min 1
 * @default 100
 *
 * @arg isPan
 * @text 位相変更？
 * @desc 変更しない場合、プラグインパラメータで指定された値になります。
 * @type boolean
 * @on 変更する
 * @off 変更しない
 * @default false
 *
 * @arg pan
 * @parent isPan
 * @text 位相
 * @desc -100(左) ～ 100(右)の範囲内で。 中央は0です。
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 * @command actorVoiceInfoReset
 * @text アクターボイス設定のリセット
 * @desc アクターボイスの設定をリセットしパラメータ値に戻します。
 *
 * @arg actorId
 * @text 対象アクター
 * @desc ボイス詳細をリセットするアクターです。
 * @type actor
 * @default 1
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * 
 * 戦闘中のシチュエーションに応じてにバトルボイスを演奏可能にします。
 *
 * ■概要
 * ゲーム中のオプション画面(タイトル画面以外)でON/OFFが可能です。
 * この設定は、このプラグインのパラメータで指定したスイッチと連動しています。
 *
 * ■メモ設定方法
 * それぞれのアクターのメモに以下の書式で書いてください。
 * filename はボイスSEのファイル名にしてください。
 * ◆アクター行動時
 * <attackVoice:filename>  通常攻撃の時に再生されるボイスです。
 * <attackMissVoice:filename>  通常攻撃がミスした時に再生されるボイスです。
 *  未設定の場合、攻撃を受ける側の攻撃回避ボイスが再生されます。
 * <guardVoice:filename>  防御の時に再生されるボイスです。
 * <recoverVoice:filename>   HP回復魔法を使用した時に再生されるボイスです。
 * ◇注意：ここでいう「魔法」の定義は、そのスキルのスキルタイプが、
 * 「システム2」タブの「[SV]魔法スキル」に含まれているものです。
 * <friendMagicVoice:filename>   HP回復以外の味方向け魔法を使用した時に
 *  再生されるボイスです。省略された場合で<magicVoice:filename>が
 *  設定されている場合は、そちらが再生されます。
 * <magicVoice:filename> 味方向け以外の魔法を使用した時に再生されるボイスです。
 * <skillVoice:filename>   上記以外のスキルを使用した時に再生されるボイスです。
 * <itemAllyVoice:filename>   仲間向けアイテム使用時に再生されるボイスです。
 *  未設定の場合、<itemVoice:filename>が再生されます。
 * <itemVoice:filename>   上記以外のアイテム使用時に再生されるボイスです。
 * ◆アクターが対象になった時
 * <damageVoice:filename>    ダメージを受けた時に再生されるボイスです。
 * <receiveMissVoice:filename> 攻撃を受けたがミスだった時のボイスです。
 *  未設定の場合、回避時のボイスが再生されます。
 * <fatalDamageVoice:filename> クリティカルを受けた時に再生されるボイスです。
 *  未設定の場合、通常のダメージボイスが再生されます。
 * <substituteVoice:filename>  味方をかばってダメージを受けた時のボイスです。
 * <evadeVoice:filename>    物理攻撃を回避した時に再生されるボイスです。
 *  攻撃側の通常攻撃ミス時のボイスが設定されている場合、再生されません。
 * <magicEvadeVoice:filename> 魔法攻撃を回避した時に再生されるボイスです。
 * 「魔法攻撃」の定義は、スキルの「命中タイプ」が「魔法攻撃」のものです。
 * <defeatedVoice:filename>   戦闘不能になった時に再生されるボイスです。
 * <counterVoice:filename>   カウンター攻撃発動時に再生されるボイスです。
 * <reflectVoice:filename>   魔法を反射する時に再生されるボイスです。
 * <killVoice:filename>     敵を倒したときに再生されるボイスです。
 *  該当する敵の戦闘不能時ボイスが再生されるときは、再生しません。
 * <fromAllyVoice:filename> HP回復魔法を受けた時に再生されるボイスです。
 *  自分自身に使った場合は再生されません
 *  「ありがとう」など感謝の言葉を想定しています。
 * ◆バトルの進捗に応じて
 * アクターが複数いる場合、生きているアクターの中からランダムで再生されます。
 * <firstVoice:filename>    戦闘開始時に再生されるボイスです。
 *  ただし、不意打ちの際は再生されません。
 * <preemptiveFirstVoice:filename> 先制での戦闘開始時に再生されます。
 *  未設定の場合、<firstVoice:filename> が再生されます。
 * <surpriseFirstVoice:filename> 不意打ちでの戦闘開始時に再生されます。
 * <victoryVoice:filename>   戦闘勝利時に再生されるボイスです。
 * <runawayVoice:filename> 逃走を試みる時に再生されるボイスです。
 * <allDeadVoice:filename> 全滅時に再生されるボイスです。
 *  最後に倒れたアクターに設定されたボイスを再生します。
 * <levelUpVoice:filename> 戦闘後レベルアップした時に再生されるボイスです。
 * ◆その他
 * <commandVoice:filename> アクターコマンド選択開始時に再生されます。
 *
 * ■注意 (Ver2.0.0～)
 * 行動制約が「なし」以外のステート（例：睡眠、混乱）にかかっているアクターは
 * ボイスを再生しません。
 * また、メモに <VoiceDisable> と書かれたステートにアクターがかかっている場合も
 * ボイスを再生しません（例：沈黙）。
 *
 * ■拡張機能１
 * 上記のメモのfilename を、コロンで複数指定すると、その中からランダムで
 * 再生されます。例えば、以下のように指定した場合、
 * <attackVoice:atk1,atk2,atk3>
 * atk1 atk2 atk3 のいずれかのボイスがランダムで再生されます。
 *
 * 無音を指定したい場合は、$ を入れてください。
 * <attackVoice:atk1,atk2,$>
 * この場合、atk1, atk2, 無音の中から選ばれます。
 * 
 * 同じファイル名を複数回指定可能です。
 * <attackVoice:atk1,atk2,atk2,$>
 * この場合、25%でatk1、50%でatk2、25%で演奏なしになります。
 *
 * 注意：この形式で設定を行った場合、デプロイメントの「不要ファイルの削除」で
 *  削除される可能性があります。例えばダミーイベントを作り、これらのSEを
 *  演奏するなどして、適宜対処してください。
 * 
 * ■拡張機能２ (Ver1.6.0～)
 * 特定のIDの敵キャラにもボイスを付けることが可能です。
 * 方法はアクター同様、該当する敵キャラのメモ欄に以下の書式で記述します。
 * ◆敵キャラ行動時
 * <attackVoice:filename>  通常攻撃の時
 * <attackMissVoice:filename>  通常攻撃がミスした時
 * <recoverVoice:filename>   HP回復魔法を使用した時
 * <friendMagicVoice:filename>   HP回復以外の味方向け魔法を使用した時
 * <magicVoice:filename> 味方向け以外の魔法を使用した時
 * <skillVoice:filename>   その他のスキルを使用した時
 * ◆敵キャラが対象になった時
 * <damageVoice:filename>    ダメージを受けた時
 * <receiveMissVoice:filename> 攻撃を受けたがミスだった時
 *  未設定の場合、回避時のボイスが再生されます。
 * <fatalDamageVoice:filename> クリティカルを受けた時
 *  未設定の場合、通常のダメージボイスが再生されます。
 * <evadeVoice:filename>    攻撃を回避した時
 *  攻撃側の通常攻撃ミス時のボイスが設定されている場合、再生されません。
 * <defeatedVoice:filename>   戦闘不能になった時
 * <counterVoice:filename>   カウンター攻撃発動時
 * <reflectVoice:filename>   魔法を反射した時
 * ◆バトルの進捗に応じて
 * アクターと敵キャラ双方に設定がある場合、敵キャラの方が優先されます。
 * <firstVoice:filename>   戦闘開始時
 * <allDeadVoice:filename> アクター全滅時に再生されるボイスです。
 * 
 * ■拡張機能３ (Ver1.16.0～)
 * ボイスの音量、ピッチ、位相は、パラメータで、全アクターで共通の設定をします。
 * 特定のアクターだけ変更したい場合、アクターのメモに以下のように記述します。
 * <voiceVolume:90>  そのアクターのみのボイスの音量を設定します。
 * <voicePitch:100>  同様にピッチを設定します。
 * <voicePan:100>    同様に位相を設定します。
 * これらの設定は、プラグインコマンドでも設定可能です。
 *
 * ■拡張機能４ 複数人が同時に発声する際の処理を選択可能 (Ver2.1.0～)
 * 他のプラグインの導入によって、複数の仲間が同じタイミングでダメージを
 * 表示する場合があります。
 * 通常では全員のボイスが同時に再生されていました。
 * この際の挙動を、プラグインパラメータ(高度な設定)にて設定可能です。
 * - 通常(normal) - これまで通り
 * - 一人のボイスのみ再生(alone) - 代表の一人のボイスを再生します
 * - 再生ウェイト発生(wait) - 指定されたフレームの間、各アクター毎にウェイトを
 *   発生させてボイスを再生します。
 *   ◆注意：一部のプラグインではウェイトが発生しません。
 *
 * ■拡張機能５　属性攻撃を受けて回復した時のボイス (Ver2.2.0～)
 * 他のプラグインの導入によって、属性攻撃で回復した際のボイスが設定可能です。
 * <recoverFromOpponentVoice:filename>
 *
 * ■プラグインコマンド
 * プラグインコマンドでは以下のことが可能です
 * ・各シチュエーションでのボイスの変更およびリセット
 * ・全シチュエーションのボイスの一括リセット
 * 以下は、プラグインコマンドでのみ指定が可能です。
 * ・スキル番号にボイスを割り当てる、またはそれを解除
 *   ・敵キャラのスキルも指定可能(Ver1.7.0～)
 * ・スキル番号に割り当てられた全ボイスを一括リセット
 * ・特定のアイテムにボイスを割り当て/解除。ターゲット指定も可能
 * ・アイテムに割り当てられた全ボイスを一括リセット
 * ・被ダメージが特定の値以上／未満の際のボイス設定／リセット
 *     注意：このプラグインコマンドを同アクターに複数回指定した場合、
 *     最新のものだけが反映されます。
 * ・特定のステート付与時／解除時のボイス設定／リセット (Ver1.9.0～)
 *     HPが増減するスキル(例:毒攻撃)の副作用の場合、再生されません。
 * ・全てのステート付与時／解除時のボイス一括リセット (Ver1.9.0～)
 * ・特定のアクターから回復魔法を受ける時のボイス設定／リセット (Ver1.14.0～)
 * ・回復魔法を受ける時のボイスの一括リセット
 * ・特定のボイスに通常とは異なる音量/ピッチ/位相を割り当てる (Ver1.15.0～)
 * ・特定のボイスに割り当てた音量/ピッチ/位相の一括リセット
 * ・特定のアクターの再生するボイスの音量/ピッチ/位相を設定 (Ver1.16.0～)
 * ・特定のアクターの音量/ピッチ/位相の一括リセット
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */
(() => {
  const pluginName = 'BattleVoiceMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const pitch = Number(parameters['pitch'] || 100);
  const volume = Number(parameters['volume'] || 90);
  const pan = Number(parameters['pan'] || 0);

  const enemyPitch = Number(parameters['enemyPitch'] || 100);
  const enemyVolume = Number(parameters['enemyVolume'] || 90);
  const enemyPan = Number(parameters['enemyPan'] || 0);

  const playSwitchId = Number(parameters['ON switch ID'] || 1);
  const strBattleVoice = parameters['Battle Voice Name at Option'] ||
    'Battle Voice';
  const delayMsgTiming = !!Number(parameters['firstMsgTiming'] || 0);
  const voiceAtAllDamage = parameters['voiceAtAllDamage'] || "normal";
  const waitForPlural = Number(parameters['waitForPlural'] || 30);

  //
  // process plugin commands
  //
  const join2voices = (voice1, voice2) => {
    if (voice1) {
      return voice2 ? voice1 + ',' + voice2 : voice1;
    } else {
      return null;
    }
  };

  PluginManager.registerCommand(pluginName, 'set', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      if (actor.battleVoices == null) {
        actor.battleVoices = {};
      }
      switch (args.isSet) {
      case 'set':
        const voice = join2voices(args.voice1, args.voice2);
        actor.battleVoices[args.situation] = voice;
        break;
      case 'reset':
        actor.battleVoices[args.situation] = null;
        break;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'allReset', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.battleVoices = null;
    }
  });

  PluginManager.registerCommand(pluginName, 'setEnemy', args => {
    if ($gameSystem.enemyVoices == null) {
      $gameSystem.enemyVoices = {};
    }
    switch (args.isSet) {
    case 'set':
      if ($gameSystem.enemyVoices[+args.enemyId] == null) {
        $gameSystem.enemyVoices[+args.enemyId] = {};
      }
      const battleVoices = $gameSystem.enemyVoices[+args.enemyId];
      const voice = join2voices(args.voice1, args.voice2);
      battleVoices[args.situation] = voice;
      break;
    case 'reset':
      let bv, bvs;
      if ((bv = $gameSystem.enemyVoices) && (bvs = bv[+args.enemyId])) {
        bvs[args.situation] = null;
      }
      break;
    }
  });

  PluginManager.registerCommand(pluginName, 'allResetEnemy', args => {
    if ($gameSystem.enemyVoices) {
      $gameSystem.enemyVoices[+args.enemyId] = null;
    }
  });

  const _setSkillVoices = (target, args) => {
    if (!args.skillId2) {
      args.skillId2 = "[]";
    }
    const skillIds = [+args.skillId, ...eval(args.skillId2).map(id => +id)];
    switch (args.isSet) {
    case 'set':
      const voice = join2voices(args.voice1, args.voice2);
      for (const skillId of skillIds){
        target[skillId] = voice;
      }
      break;
    case 'reset':
      for (const skillId of skillIds){
        target[skillId] = null;
      }
      break;
    }
  };

  PluginManager.registerCommand(pluginName, 'skillSet', args => {
    if (args.actorOrEnemy !== 'enemy') { // actor
      const actor = $gameActors.actor(+args.actorId);
      if (actor) {
        if (actor.skillVoices == null) {
          actor.skillVoices = {};
        }
        _setSkillVoices(actor.skillVoices, args);
      }
    } else { // enemy
      if ($gameSystem.enemySkillVoices == null) {
        $gameSystem.enemySkillVoices = {};
      }
      const enemyVoices = $gameSystem.enemySkillVoices;
      if (enemyVoices[+args.enemyId] == null) {
        enemyVoices[+args.enemyId] = {};
      }
      _setSkillVoices(enemyVoices[+args.enemyId], args);
    }
  });

  PluginManager.registerCommand(pluginName, 'skillAllReset', args => {
    if (args.actorOrEnemy !== 'enemy') { // actor
      const actor = $gameActors.actor(+args.actorId);
      if (actor) {
        actor.skillVoices = null;
      }
    } else { // enemy
      if ($gameSystem.enemySkillVoices != null) {
        $gameSystem.enemySkillVoices[+args.enemyId] = null;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'itemSet', args => {
    const actor = $gameActors.actor(+args.actorId);
    const targetId = +args.targetId;
    const doesSkipSelf = eval(args.doesSkipSelf || "false");
    if (!args.itemId2) {
      args.itemId2 = "[]";
    }
    const itemIds = [+args.itemId, ...eval(args.itemId2).map(id => +id)];
    if (actor) {
      if (actor.itemVoices == null) {
        actor.itemVoices = {};
      }
      if (actor.itemVoiceFlags == null) {
        actor.itemVoiceFlags = {};
      }
      const itemVoice = actor.itemVoices;
      switch (args.isSet) {
      case 'set':
        const voice = join2voices(args.voice1, args.voice2);
        for (const itemId of itemIds) {
          if (itemVoice[itemId] == null) {
            itemVoice[itemId] = {};
          }
          if (actor.itemVoiceFlags[itemId] == null) {
            actor.itemVoiceFlags[itemId] = {};
          }
          itemVoice[itemId][targetId] = voice;
          actor.itemVoiceFlags[itemId]["doesSkipSelf"] = doesSkipSelf;
        }
        break;
      case 'reset':
        for (const itemId of itemIds) {
          if (+args.targetId === 0) {
            itemVoice[itemId] = null;
          } else {
            itemVoice[itemId][targetId] = null;
            actor.itemVoiceFlags[itemId]["doesSkipSelf"] = null;
          }
        }
        break;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'itemAllReset', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.itemVoices = null;
      actor.itemVoiceFlags = null;
    }
  });

  Game_Actor.prototype.initVoiceDamageRange = function() {
    this.voiceDamageCeil = 0;
    this.voiceCeilRatio = false;
    this.voiceDamageFloor = 0;
    this.voiceFloorRatio = false;
  };

  const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
  Game_Actor.prototype.initMembers = function() {
    _Game_Actor_initMembers.call(this);
    this.initVoiceDamageRange();
  };

  PluginManager.registerCommand(pluginName, 'setByDamage', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.voiceDamageCeil = +args.ceilDamage;
      actor.voiceCeilRatio = args.valueTypeCeil === 'ratio';
      actor.voiceDamageFloor = +args.floorDamage;
      actor.voiceFloorRatio = args.valueTypeFloor === 'ratio';
      if (actor.battleVoices == null) {
        actor.battleVoices = {};
      }
      const voices = actor.battleVoices;
      if (actor.voiceDamageCeil) {
        voices.smallDamage = join2voices(args.voice1ceil, args.voice2ceil);
      }
      if (actor.voiceDamageFloor) {
        voices.bigDamage = join2voices(args.voice1floor, args.voice2floor);
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'resetByDamage', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.initVoiceDamageRange();
      const voices = actor.battleVoices;
      if (voices) {
        voices.smallDamage = null;
        voices.bigDamage = null;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'stateChange', args => {
    const voiceToAdd = join2voices(args.voiceAtStateAdded1,
      args.voiceAtStateAdded2
    );
    const voiceToRemove = join2voices(args.voiceAtStateRemoved1,
      args.voiceAtStateRemoved2
    );
    
    if (!args.targetStates) {
      args.targetStates = [];
    }
    const targetStates = eval(args.targetStates).map(id => +id);
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      if (actor.voiceStateAdd == null) {
        actor.voiceStateAdd = {};
        actor.voiceStateRemove = {};
      }
      for (const stateId of targetStates) {
        actor.voiceStateAdd[stateId] = voiceToAdd;
        actor.voiceStateRemove[stateId] = voiceToRemove;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'resetStateChange', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.voiceStateAdd = null;
      actor.voiceStateRemove = null;
    }
  });

  PluginManager.registerCommand(pluginName, 'allySet', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      if (actor.allyVoices == null) {
        actor.allyVoices = {};
      }
      if (!args.subjectIds) {
        args.subjectIds = [];
      }
      const subjectIds = eval(args.subjectIds).map(id => +id);
      switch (args.isSet) {
      case 'set':
        const voice = join2voices(args.voice1, args.voice2);
        for (subjectId of subjectIds) {
          actor.allyVoices[subjectId] = voice;
        }
        break;
      case 'reset':
        for (subjectId of subjectIds) {
          actor.allyVoices[subjectId] = null;
        }
        break;
      }
    }
  });

  PluginManager.registerCommand(pluginName, 'allyAllReset', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.allyVoices = null;
    }
  });

  PluginManager.registerCommand(pluginName, 'voiceInfo', args => {
    const voices = eval(args.names);
    if ($gameSystem.voiceInfo == null) {
      $gameSystem.voiceInfo = {};
    }
    switch (args.isSet) {
    case 'set':
      const isVolume = eval(args.isVolume);
      const volume = +args.volume;
      const isPitch = eval(args.isPitch);
      const pitch = +args.pitch;
      const isPan = eval(args.isPan);
      const pan = +args.pan;
      for (const voiceName of voices) {
        const key = $gameSystem.voiceInfo[voiceName] = {};
        key.isVolume = isVolume;
        key.volume = volume;
        key.isPitch = isPitch;
        key.pitch = pitch;
        key.isPan = isPan;
        key.pan = pan;
      }
      break;
    case 'reset':
      for (const voiceName of Object.keys(voices)) {
        $gameSystem.voiceInfo[voiceName] = null;
      };
      break;
    }
  });

  PluginManager.registerCommand(pluginName, 'voiceInfoReset', args => {
    $gameSystem.voiceInfo = null;
  });

  PluginManager.registerCommand(pluginName, 'actorVoiceInfo', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (!actor) {
      return;
    }
    if (actor.voiceSettings == null) {
      actor.voiceSettings = {};
    }
    const setting = actor.voiceSettings;
    setting.isVolume = eval(args.isVolume);
    setting.volume = +args.volume;
    setting.isPitch = eval(args.isPitch);
    setting.pitch = +args.pitch;
    setting.isPan = eval(args.isPan);
    setting.pan = +args.pan;
  });

  PluginManager.registerCommand(pluginName, 'actorVoiceInfoReset', args => {
    const actor = $gameActors.actor(+args.actorId);
    if (actor) {
      actor.voiceSettings = null;
    };
  });

  //
  // set play options (interlock with switch)
  //
  const doesDisplaySpecialOptions = () => {
    return !SceneManager.isPreviousScene(Scene_Title);
  };

  const _Window_Options_makeCommandList =
   Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function() {
    if (doesDisplaySpecialOptions()) {
      this.addCommand(strBattleVoice, 'battleVoice');
    }
    _Window_Options_makeCommandList.call(this);
  };

  const _Window_Options_getConfigValue =
   Window_Options.prototype.getConfigValue;
  Window_Options.prototype.getConfigValue = function(symbol) { 
    switch (symbol) {
    case 'battleVoice':
      return $gameSwitches.value(playSwitchId);
    default:
      return _Window_Options_getConfigValue.call(this, symbol);
    }
  };

  const _Window_Options_setConfigValue =
   Window_Options.prototype.setConfigValue;
  Window_Options.prototype.setConfigValue = function(symbol, volume) {
    switch (symbol) {
    case 'battleVoice':
      return $gameSwitches.setValue(playSwitchId, volume);
    default:
      return _Window_Options_setConfigValue.call(this, symbol, volume);
    }
  };

  const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
  Scene_Options.prototype.maxCommands = function() {
    const rowNum = _Scene_Options_maxCommands.call(this);
    return doesDisplaySpecialOptions() ? rowNum + 1 : rowNum;
  };

  //
  // play battler voice
  //

  const isVoiceMode = () => $gameSwitches.value(playSwitchId);

  const dyingVoices = ['dead', 'allDead'];

  const canBattlerBark = (battler, type) => {
    if (dyingVoices.includes(type)) {
      return true;
    }
    return !battler.states().some(s => s.restriction > 0 ||
      s.meta.VoiceDisable
    );
  };

  const canPlayBattlerVoice = (battler, type) => {
    return battler && isVoiceMode() && canBattlerBark(battler, type);
  };

  const split = name => {
    if (!name) {
      return name;
    }
    const names = name.split(',');
    return names[Math.randomInt(names.length)];
  };

  const parameterOfVoice = (name, judgeName, valueName) => {
    const voiceInfoHash = $gameSystem.voiceInfo;
    if (!voiceInfoHash) {
      return null;
    }
    const voiceInfo = voiceInfoHash[name];
    if (!voiceInfo || !voiceInfo[judgeName]) {
      return null;
    }
    return voiceInfo[valueName];
  };

  const paramOfBattlerVoice = (battler, judge, param , noteTagName) => {
    if (!battler) {
      return null;
    }
    if (battler.isActor()) {
      const voiceInfo = battler.voiceSettings;
      if (voiceInfo && voiceInfo[judge]) {
        return voiceInfo[param];
      }
      const noteTagValue = +battler.actor().meta[noteTagName];
      if (!isNaN(noteTagValue)) {
        return noteTagValue;
      }
    } else if (battler.isEnemy()) {
      const noteTagValue = +battler.enemy().meta[noteTagName];
      if (!isNaN(noteTagValue)) {
        return noteTagValue;
      }
    }
    return null;
  };

  const volumeOfVoice = (battler, name, defaultVolume) => {
    let volume;
    volume = parameterOfVoice(name, "isVolume", "volume");
    if (volume != null) {
      return volume;
    }
    volume = paramOfBattlerVoice(battler, "isVolume", "volume", "voiceVolume");
    if (volume != null) {
      return volume;
    }
    return defaultVolume;
  };

  const pitchOfVoice = (battler, name, defaultPitch) => {
    let pitch;
    pitch = parameterOfVoice(name, "isPitch", "pitch");
    if (pitch != null) {
      return pitch;
    }
    pitch = paramOfBattlerVoice(battler, "isPitch", "pitch", "voicePitch");
    if (pitch != null) {
      return pitch;
    }
    return defaultPitch;
  };

  const panOfVoice = (battler, name, defaultPan) => {
    let pan;
    pan = parameterOfVoice(name, "isPan", "pan");
    if (pan != null) {
      return pan;
    }
    pan = paramOfBattlerVoice(battler, "isPan", "pan", "voicePan");
    if (pan != null) {
      return pan;
    }
    return defaultPan;
  };

  const createAudioByFileName = (actor, name) => {
    const audio = {};
    audio.name = name;
    audio.volume = volumeOfVoice(actor, name, volume);
    audio.pitch = pitchOfVoice(actor, name, pitch);
    audio.pan = panOfVoice(actor, name, pan);
    return audio;
  };

  const createEnemyAudioByFileName = (enemy, name) => {
    const audio = {};
    audio.name = name;
    audio.volume = volumeOfVoice(enemy, name, enemyVolume);
    audio.pitch = pitchOfVoice(enemy, name, enemyPitch);
    audio.pan = panOfVoice(enemy, name, enemyPan);
    return audio;
  };

  const playActorVoice = (actor, type) => {
    if (!canPlayBattlerVoice(actor, type) || $gameTemp.voicePlayed) {
      return;
    }
    const setVoice = actor.battleVoices || {};
    const battlerMeta = actor.actor().meta;
    const name = _voiceFileName(setVoice, battlerMeta, type);
    if (name) {
      const audio = createAudioByFileName(actor, name);
      AudioManager.playSe(audio);
    }
    return name; // for check if voice played or not
  };

  const playEnemyVoice = (enemy, type) => {
    if (!canPlayBattlerVoice(enemy, type) || $gameTemp.voicePlayed) {
      return;
    }
    let ev;
    const voices = (ev = $gameSystem.enemyVoices) ?
      (ev[enemy.enemyId()] || {}) : {};
    const battlerMeta = enemy.enemy().meta;
    const name = _voiceFileName(voices, battlerMeta, type);
    if (name) {
      const audio = createEnemyAudioByFileName(enemy, name);
      AudioManager.playSe(audio);
    }
    return name; // for check if voice played or not
  };

  const playBattlerVoice = (battler, type) => {
    if (battler.isActor()) {
      return playActorVoice(battler, type);
    }
    if (battler.isEnemy()) {
      return playEnemyVoice(battler, type);
    }
  };

  const _voiceFileName = (setVoice, battlerMeta, type) => {
    const a = setVoice;
    const m = battlerMeta;
    let name = '';
    switch(type){
    case 'attack':
      name = split(a.attack || m.attackVoice);
      break;
    case 'miss':
      name = split(a.miss || m.attackMissVoice);
      break;
    case 'guard':
      name = split(a.guard || m.guardVoice);
      break;
    case 'recover':
      name = split(a.recover || m.recoverVoice);
      break;
    case 'friendmagic':
      name = split(a.friendMagic || m.friendMagicVoice || a.magic ||
        m.magicVoice
      );
      break;
    case 'magic':
      name = split(a.magic || m.magicVoice);
      break;
    case 'skill':
      name = split(a.skill || m.skillVoice);
      break;
    case 'itemAlly':
      name = split(a.itemAlly || m.itemAllyVoice || a.item || m.itemVoice);
      break;
    case 'item':
      name = split(a.item || m.itemVoice);
      break;
    case 'damage':
      name = split(a.damage || m.damageVoice);
      waitForVoice(name);
      break;
    case 'smallDamage':
      name = split(a.smallDamage || a.damage || m.damageVoice);
      waitForVoice(name);
      break;
    case 'bigDamage':
      name = split(a.bigDamage || a.damage || m.damageVoice);
      waitForVoice(name);
      break;
    case 'recoverFromOpponent':
      name = split(m.recoverFromOpponentVoice);
      waitForVoice(name);
      break;
    case 'fatalDamage':
      name = split(a.fatalDamage || m.fatalDamageVoice);
      waitForVoice(name);
      break;
    case 'substitute':
      name = split(a.substitute || m.substituteVoice);
      break;
    case 'receiveMiss':
      name = split(a.receiveMiss || m.receiveMissVoice);
      waitForVoice(name);
      break;
    case 'evade':
      name = split(a.evade || m.evadeVoice);
      waitForVoice(name);
      break;
    case 'magicEvade':
      name = split(a.magicEvade || m.magicEvadeVoice);
      waitForVoice(name);
      break;
    case 'dead':
      name = split(a.dead || m.defeatedVoice);
      waitForVoice(name);
      break;
    case 'counter':
      name = split(a.counter || m.counterVoice);
      waitForVoice(name);
      break;
    case 'reflect':
      name = split(a.reflect || m.reflectVoice);
      waitForVoice(name);
      break;
    case 'kill':
      name = split(a.kill || m.killVoice);
      break;
    case 'fromAlly':
      name = split(a.fromAlly || m.fromAllyVoice);
      break;
    case 'first':
      name = split(a.first || m.firstVoice);
      break;
    case 'preemptiveFirst':
      name = split(a.preemptiveFirst || m.preemptiveFirstVoice);
      break;
    case 'surpriseFirst':
      name = split(a.surpriseFirst || m.surpriseFirstVoice);
      break;
    case 'victory':
      name = split(a.victory || m.victoryVoice);
      break;
    case 'runaway':
      name = split(a.runaway || m.runawayVoice);
      break;
    case 'allDead':
      name = split(a.allDead || m.allDeadVoice);
      break;
    case 'levelUp':
      name = split(a.levelUp || m.levelUpVoice);
      break;
    case 'command':
      name = split(a.command || m.commandVoice);
      break;
    }
    if (name === '$') {
      name = '';
    }
    return name;
  };

  //
  // process for skill and item
  //
  const isSkillVoice = (battler, action) => {
    if (action.isSkill()) {
      if (battler.isActor() && battler.skillVoices) {
        return !!battler.skillVoices[action._item.itemId()];
      } else if (battler.isEnemy() && $gameSystem.enemySkillVoices) {
        const enemy = $gameSystem.enemySkillVoices[battler.enemyId()];
        return !!enemy && !!enemy[action._item.itemId()];
      }
    }
    return false;
  };

  const playSkillVoice = (battler, action) => {
    if (!canPlayBattlerVoice(battler, null)) {
      return;
    }
    let name = '';
    if (battler.isActor()) {
      name = split(battler.skillVoices[action._item.itemId()]);
    } else if (battler.isEnemy()){
      const enemy = $gameSystem.enemySkillVoices[battler.enemyId()];
      name = split(enemy[action._item.itemId()]);
    }
    if (name && name !== "$") {
      if (battler.isActor()) {
        AudioManager.playSe(createAudioByFileName(battler, name));
      } else if (battler.isEnemy()) {
        AudioManager.playSe(createEnemyAudioByFileName(battler, name));
      }
    }
  };

  const isItemVoice = (actor, action) => {
    if (!actor.itemVoices || !action.isItem()) {
      return false;
    }
    const itemVoice = actor.itemVoices[action._item.itemId()];
    if (!itemVoice) {
      return false;
    }
    if (action.isForFriend()) {
      const target = $gameParty.battleMembers()[action._targetIndex];
      const id = target ? target.actorId() : 0;
      return !!(itemVoice[id] || itemVoice[0]);
    } else if (action.isForOpponent()){
      return !!itemVoice[0];
    }
    return false;
  };

  const doesSkipSelfItem = (actor, itemId) => {
    return actor.itemVoiceFlags[itemId]["doesSkipSelf"];
  };

  const needsSkip = (actor, target, itemId) => {
    return doesSkipSelfItem(actor, itemId) && actor === target;
  };

  const playItemVoice = (actor, action) => {
    if (!canPlayBattlerVoice(actor, null)) {
      return;
    }
    const itemId = action._item.itemId();
    const itemVoice = actor.itemVoices[itemId];
    let name = "";
    if (action.isForFriend()) {
      const target = $gameParty.battleMembers()[action._targetIndex];
      const id = target ? target.actorId() : 0;
      if (!needsSkip(actor, target, itemId)) {
        name = split(itemVoice[id] || itemVoice[0]);
      }
    } else if (action.isForOpponent()) {
      name = split(itemVoice[0]);
    }
    if (name && name !=="$") {
      const audio = createAudioByFileName(actor, name);
      AudioManager.playSe(audio);
    }
  };

  //
  // process wait (if it displays all popup damages together)
  //
  const waitForVoice = name => {
    if (name && name !=="$") {
      switch (voiceAtAllDamage) {
      case 'normal':
        break;
      case 'alone':
        $gameTemp.voicePlayed = true;
        break;
      case 'wait':
        BattleManager._logWindow._waitCount = waitForPlural;
      }
    }
  };

  const shuffleTargetsIfNeeds = () => {
    if (voiceAtAllDamage === 'alone') {
      // Change the top of BattleManager._targets
      const targets = BattleManager._targets;
      const index = Math.randomInt(targets.length);
      const topElementArray = targets.splice(index, 1);
      targets.unshift(topElementArray[0]);
    }
  };

  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    $gameTemp.voicePlayed = false;
    _BattleManager_startAction.call(this);
    shuffleTargetsIfNeeds();
  };

  const _BattleManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function() {
    $gameTemp.voicePlayed = false;
    _BattleManager_endAction.call(this);
  };


  //
  // process states change
  //
  const _Window_BattleLog_displayChangedStates =
   Window_BattleLog.prototype.displayChangedStates;
  Window_BattleLog.prototype.displayChangedStates = function(target) {
    if (!target.result().hpAffected) {
      playStateChangeVoice(target);
    }
    _Window_BattleLog_displayChangedStates.call(this, target);
  };

  const playStateChangeVoice = target => {
    let stateId = 0;
    let name = '';
    if (stateId = addedStateVoiceId(target)) {
      name = split(target.voiceStateAdd[stateId]);
    } else if (stateId = removedStateVoiceId(target)) {
      name = split(target.voiceStateRemove[stateId]);
    }
    if (name && name !== "$") {
      if (target.isActor()) {
        AudioManager.playSe(createAudioByFileName(target, name));
      } else if (target.isEnemy()) {
        AudioManager.playSe(createEnemyAudioByFileName(target, name));
      }
    }
  };

  const addedStateVoiceId = target => {
    let maxStateId = 0;
    if (target.voiceStateAdd) {
      const result = target.result();
      const states = result.addedStateObjects();
      let maxPriority = -100;
      for (const state of states) {
        if (target.voiceStateAdd[state.id] && state.priority > maxPriority) {
          maxStateId = state.id;
          maxPriority  = state.priority;
        }
      }
    }
    return maxStateId;
  };

  const removedStateVoiceId = target => {
    let maxStateId = 0;
    if (target.voiceStateRemove) {
      const result = target.result();
      const states = result.removedStateObjects();
      let maxPriority = -100;
      for (const s of states) {
        if (target.voiceStateRemove[s.id] && s.priority > maxPriority) {
          maxStateId = s.id;
          maxPriority  = s.priority;
        }
      }
    }
    return maxStateId;
  };

  //
  // functions for call actor's active action voices.
  //
  const _Game_Battler_performAction = Game_Battler.prototype.performAction;
  Game_Battler.prototype.performAction = function(action) {
    _Game_Battler_performAction.call(this, action);
    if (isSkillVoice(this, action)) {
      playSkillVoice(this, action);
    } else if (isItemVoice(this, action)) {
       playItemVoice(this, action);
    } else if (action.isAttack()) {
      playBattlerVoice(this, 'attack');
    } else if (action.isGuard()) {
      playBattlerVoice(this, 'guard');
    } else if (action.isMagicSkill() && action.isHpRecover()) {
      playBattlerVoice(this, 'recover');
    } else if (action.isMagicSkill() && action.isForFriend()) {
      playBattlerVoice(this, 'friendmagic');
    } else if (action.isMagicSkill()) {
      playBattlerVoice(this, 'magic');
    } else if (action.isSkill()) {
      playBattlerVoice(this, 'skill');
    } else if (action.isItem() && action.isForFriend()) {
      playBattlerVoice(this, 'itemAlly');
    } else if (action.isItem()) {
      playBattlerVoice(this, 'item');
    }
  };

  //
  // Voices when battler take damage
  //

  const _Window_BattleLog_displayHpDamage =
   Window_BattleLog.prototype.displayHpDamage;
  Window_BattleLog.prototype.displayHpDamage = function(target) {
    // for memorize hp damage
    if (target.result().hpAffected) {
      if (target.result().hpDamage > 0 && !target.result().drain) {
        target._damageForVoice = target.result().hpDamage;
        target._isCritical = target.result().critical
      }
    }
    _Window_BattleLog_displayHpDamage.call(this, target);
    // play damage voice even if the skill is HP drain.
    if (target.result().hpDamage > 0 && target.result().drain) {
      this.push("performDamage", target);
    }
  };

  const _Game_Battler_performSubstitute =
   Game_Battler.prototype.performSubstitute;
  Game_Battler.prototype.performSubstitute = function(target) {
    _Game_Battler_performSubstitute.call(this, target);
    if (playBattlerVoice(this, 'substitute')) {
      this._substitute = target;
    }
  };

  const _Game_Battler_performDamage = Game_Battler.prototype.performDamage;
  Game_Battler.prototype.performDamage = function() {
    _Game_Battler_performDamage.call(this);
    // when one take damage to protect an ally, not play damage voice.
    if (this._substitute) {
      this._substitute = null;
      return;
    }
    // When selected actor is dead, play dead voice instead of damage voice.
    if (voiceAtAllDamage === "alone" && !this.isAlive()) {
      return;
    }
    const damage = this._damageForVoice;
    if (this._isCritical) {
      if (playBattlerVoice(this, 'fatalDamage')) {
        return;
      }
    }
    if (this.voiceDamageCeil) {
      const vdc = this.voiceDamageCeil;
      const ceilDamage = this.voiceCeilRatio ? this.mhp * vdc / 100 : vdc;
      if (damage < ceilDamage) {
        playBattlerVoice(this, 'smallDamage');
        return;
      }
    }
    if (this.voiceDamageFloor) {
      const vdf = this.voiceDamageFloor;
      const floorDamage = this.voiceFloorRatio ? this.mhp * vdf / 100 : vdf;
      if (damage >= floorDamage) {
        playBattlerVoice(this, 'bigDamage');
        return;
      }
    }
    playBattlerVoice(this, 'damage');
  };

  Window_BattleLog.prototype.playMpDamage = function(target) {
    playBattlerVoice(target, 'damage');
  };

  const _Window_BattleLog_displayMpDamage =
   Window_BattleLog.prototype.displayMpDamage;
  Window_BattleLog.prototype.displayMpDamage = function(target) {
    _Window_BattleLog_displayMpDamage.call(this, target);
    // play damage voice if the skill is MP drain.
    if (target.result().mpDamage > 0 && target.result().drain) {
      this.push("playMpDamage", target);
    }
  };

  //
  // Voice for drain one's HP/MP
  //
  Window_BattleLog.prototype.afterHpDrain = function(subject) {
    playBattlerVoice(subject, 'recover');
  };

  Window_BattleLog.prototype.afterMpDrain = function(subject) {
    playBattlerVoice(subject, 'recover');
  };

  const _Window_BattleLog_displayActionResults =
   Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    _Window_BattleLog_displayActionResults.call(this, subject, target);
    if (target.result().hpDamage > 0 && target.result().drain) {
      this.push("wait");
      this.push("afterHpDrain", subject);
    } else if (target.result().mpDamage > 0 && target.result().drain) {
      this.push("wait");
      this.push("afterMpDrain", subject);
    }  
  };

  //
  // Voices for actor's passive action
  //
  const _Game_Battler_performEvasion = Game_Battler.prototype.performEvasion;
  Game_Battler.prototype.performEvasion = function() {
    _Game_Battler_performEvasion.call(this);
    // when one take damage to protect an ally, not play damage voice.
    if (this._substitute) {
      this._substitute = null;
      return;
    }
    playBattlerVoice(this, 'evade');
  };

  const _Game_Battler_performMagicEvasion =
   Game_Battler.prototype.performMagicEvasion;
  Game_Battler.prototype.performMagicEvasion = function() {
    // when one take damage to protect an ally, not play damage voice.
    _Game_Battler_performMagicEvasion.call(this);
    if (this._substitute) {
      this._substitute = null;
      return;
    }
    playBattlerVoice(this, 'magicEvade');
  };


  const _Game_Battler_performMiss = Game_Battler.prototype.performMiss;
  Game_Battler.prototype.performMiss = function() {
    // when one take damage to protect an ally, not play damage voice.
    if (this._substitute) {
      this._substitute = null;
      return;
    }
    _Game_Battler_performMiss.call(this);
    if (playBattlerVoice(this, 'receiveMiss')) {
      //
    } else if (playBattlerVoice(BattleManager._subject, 'miss')) {
      //
    } else {
      playBattlerVoice(this, 'evade');
    }
  };


  const _Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
  Game_Battler.prototype.performCollapse = function() {
    _Game_Battler_performCollapse.call(this);
    if ($gameParty.inBattle()) {
      const played = playBattlerVoice(this, 'dead');
      if (!played && BattleManager._subject) {
        playBattlerVoice(BattleManager._subject, 'kill');
      };
    }
  };

  const _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
  BattleManager.invokeCounterAttack = function(subject, target) {1
    playBattlerVoice(target, 'counter');
    _BattleManager_invokeCounterAttack.call(this, subject, target);
  };

  const _BattleManager_invokeMagicReflection =
    BattleManager.invokeMagicReflection;
  BattleManager.invokeMagicReflection = function(subject, target) {
    playBattlerVoice(target, 'reflect');
    _BattleManager_invokeMagicReflection.call(this, subject, target);
  };

  //
  // Voices at battle starts
  //

  const playFirstVoice = () => {
    let typeAndCandidates = null;
    if (typeAndCandidates = enemyFirstVoice()) {
      //
    } else if (typeAndCandidates = preemptiveFirstVoice()) {
      //
    } else if (typeAndCandidates = surpriseFirstVoice()) {
      //
    } else if (typeAndCandidates = normalFirstVoice()) {
      //
    }
    if (typeAndCandidates) {
      const type = typeAndCandidates.type;
      const battlers = typeAndCandidates.battlers;
      const battler = battlers[Math.randomInt(battlers.length)];
      playBattlerVoice(battler, type);
    }
  };

  const enemyFirstVoice = () => {
    const candidates = $gameTroop.aliveMembers().filter(enemy => {
      return enemy.enemy().meta.firstVoice;
    });
    if (candidates.length > 0) {
      return {type:'first', battlers:candidates};
    }
    return null;
  };

  Game_Party.prototype.aliveBattleMembers = function() {
    return this.battleMembers().filter(member => member.isAlive());
  };

  const preemptiveFirstVoice = () => {
    if (BattleManager._preemptive) {
      const candidates = $gameParty.aliveBattleMembers().filter(actor => {
        return actor.actor().meta.preemptiveFirstVoice != null || 
          (actor.battleVoices && actor.battleVoices.preemptiveFirst);
      });
      if (candidates.length > 0) {
        return {type:'preemptiveFirst', battlers:candidates};
      }
    }
    return null;
  };

  const surpriseFirstVoice = () => {
    if (BattleManager._surprise) {
      const candidates = $gameParty.aliveBattleMembers().filter(actor => {
        return actor.actor().meta.surpriseFirstVoice != null || 
          (actor.battleVoices && actor.battleVoices.surpriseFirst);
      });
      if (candidates.length > 0) {
        return {type:'surpriseFirst', battlers:candidates};
      }
    }
    return null;
  };

  const normalFirstVoice = () => {
    if (!BattleManager._surprise) {
      const candidates = $gameParty.aliveBattleMembers().filter(actor => {
        return actor.actor().meta.firstVoice != null || 
          (actor.battleVoices && actor.battleVoices.first);
      });
      if (candidates.length > 0) {
        return {type:'first', battlers:candidates};
      }
    }
    return null;
  };

  //
  // Voices for battle sequence
  //
  const _Game_System_onBattleStart = Game_System.prototype.onBattleStart;
  Game_System.prototype.onBattleStart = function() {
    _Game_System_onBattleStart.call(this);
    if (!delayMsgTiming) {
      playFirstVoice();
    }
  };

  const _BattleManager_updateStart = BattleManager.updateStart;
  BattleManager.updateStart = function() {
    if (delayMsgTiming) {
      if ($gameTroop._turnCount === 0) {
        playFirstVoice();
      }
    }
    _BattleManager_updateStart.call(this);
  };

  const _BattleManager_processVictory = BattleManager.processVictory;
  BattleManager.processVictory = function() {
    const candidates = $gameParty.aliveMembers().filter(actor => {
      return actor.actor().meta.victoryVoice || 
        (actor.battleVoices && actor.battleVoices.victory);
    });
    if (candidates.length > 0) {
      const index = Math.randomInt(candidates.length);
      const actor = candidates[index];
      playActorVoice(actor, 'victory');
    }
    _BattleManager_processVictory.call(this);
  };

  const _Scene_Battle_commandEscape = Scene_Battle.prototype.commandEscape;
  Scene_Battle.prototype.commandEscape = function() {
    const candidates = $gameParty.aliveMembers().filter(actor => {
      return actor.actor().meta.runawayVoice || 
        (actor.battleVoices && actor.battleVoices.runaway);
    });
    if (candidates.length > 0) {
      const index = Math.randomInt(candidates.length);
      const actor = candidates[index];
      playActorVoice(actor, 'runaway');
    }
    _Scene_Battle_commandEscape.call(this);
  };

  const _BattleManager_processDefeat = BattleManager.processDefeat;
  BattleManager.processDefeat = function() {
    let enemyVoice;
    const candidates = $gameTroop.aliveMembers().filter(enemy => {
      return enemy.enemy().meta.allDeadVoice || ($gameSystem.enemyVoices &&
        (enemyVoice = $gameSystem.enemyVoices[enemy.enemyId()]) &&
        enemyVoice.allDead
      )}
    );
    if (candidates.length > 0) { // enemy
      const index = Math.randomInt(candidates.length);
      const enemy = candidates[index];
      playEnemyVoice(enemy, 'allDead');
    } else { // actor
      const lastTargetActor = $gameActors.actor($gameTemp.lastActionData(4));
      playActorVoice(lastTargetActor, 'allDead');
    }
    _BattleManager_processDefeat.call(this);
  };

  //
  // receive recovery skill from ally.
  //
  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    // to prevent multiple play when both hp and mp are recoverd.
    this.recoverPlayed = false;
  };

  const _Window_BattleLog_displayDamage =
   Window_BattleLog.prototype.displayDamage;
  Window_BattleLog.prototype.displayDamage = function(target) {
    $gameTemp.recoverPlayed = false;
    _Window_BattleLog_displayDamage.call(this, target);
  };

  const isAllyVoice = (target, subject) => {
    return !!(target.allyVoices && target.allyVoices[subject.actorId()]);
  };

  const playAllyVoice = (target, subject) => {
    if (!canPlayBattlerVoice(target, 'fromAlly')) {
      return;
    }
    const name = split(target.allyVoices[subject.actorId()]);
    if (name && name !== "$") {
      AudioManager.playSe(createAudioByFileName(target, name));
    }
  };

  const _Game_Battler_performRecovery = Game_Battler.prototype.performRecovery;
  Game_Battler.prototype.performRecovery = function() {
    const subject = BattleManager._subject;
    if (this === subject) {
      // not play voice if target is the same as magic user
    } else if (this.isActor() && subject.isActor()) {
      // when one recover hp, mp at once, play only hp recover voice.
      if (!$gameTemp.recoverPlayed) {
        let voice;
        if (isAllyVoice(this, subject)) {
          playAllyVoice(this, subject);
        } else {
          playActorVoice(this, 'fromAlly');
        }
        $gameTemp.recoverPlayed = true;
      }
    } else if (this.isActor() !== subject.isActor()) {
      // When one recover by an opponent's attack
      if (!$gameTemp.recoverPlayed) {
        playBattlerVoice(this, 'recoverFromOpponent');
        $gameTemp.recoverPlayed = true;
      }
    }
    _Game_Battler_performRecovery.call(this);
  };

  //
  // process level up voice
  //

  // !!overwrite!!
  Game_Actor.prototype.displayLevelUp = function(newSkills) {
    const text = '\\AVOICE[' + this.actorId() + ']' +
      TextManager.levelUp.format(this._name, TextManager.level, this._level);
    $gameMessage.newPage();
    $gameMessage.add(text);
    for (const skill of newSkills) {
      $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    }
  };

  const _Window_Message_processEscapeCharacter =
   Window_Message.prototype.processEscapeCharacter;
  Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    _Window_Message_processEscapeCharacter.call(this, code, textState);
    switch (code) {
    case 'AVOICE':
      const actorId = this.obtainEscapeParam(textState);
      playActorVoice($gameActors.actor(actorId), 'levelUp');
      break;
    }
  };

  //
  // Voice at actor command input
  //
  const _Scene_Battle_startActorCommandSelection =
   Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function() {
    playActorVoice(BattleManager.actor(), 'command');
    _Scene_Battle_startActorCommandSelection.call(this);
  };
})();
