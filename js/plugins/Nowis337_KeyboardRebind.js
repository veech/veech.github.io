//==================================
/*:
 * @target MZ
 * @plugindesc v1.2 Keyboard Rebind Options
 * @author Nowis-337
 * @url https://nowis-337.itch.io/
 * 
 * @help Nowis337_KeyboardRebind.js
 * 
 * - This plugin adds the option to rebind keyboard keys.
 * - Features:
 *    * Movement presets: Arrow Keys, WASD, ZQSD, Customise your own!
 *    * Rebind to most keys on the keyboard (except for F1 - F12).
 *    * Make your own custom keynames to use (eg via scriptcalls).
 *    * Probably not compatible with other plugins that assign common events
 *      to certain keys.
 *    * Limitions: Cannot set more than one keys to the same function like default RPG Maker.
 * 
 *  Parameters:
 * - Using Default Options Menu - disable if you are using plugins that modify
 *   the options menu. It just relates to functions to remember where your
 *   cursor in the options window was when exiting the controller rebind
 *   menu.
 *   You can call the menu with:
 * 
 *      SceneManager.push(Scene_KeyboardRebind);
 * 
 * - Window Width - adjusts the width of the window.
 * 
 * - Enable Movement Presets - enables the option to pick movement key presets
 *       as the first element in the menu.
 * 
 * - Movement Preset List
 *      - Movement Preset Name - the name of the preset.
 *      - Preset - Put in your directional keys here. These are set as
 *                      'Critical' as default so they cannot be overridden.
 * 
 * - Keybind List
 *      - Keybind Name - the name of the keybind displayed in the menu.
 *      - Key Preset - sets the keyname associated with RPG Maker default.
 *                   - set to "Custom" to set your own keyname (see below).
 *      - Custom Keyname - set a custom keyname for the keybind.
 *                       - can be used with script calls.
 *      - Default Input (Special) - sets the default key from the dropdown list.
 *                        Select 'Other' to type your own (see below).
 *      - Default Input - type in the key here. The above option needs to be set as "Other"
 *      - Critical - flags the keybind to be critical. The key assigned
 *                   to a critical keybind cannot be assigned to a different
 *                   keybind.
 *                 - I set this on the "Ok" button so you cannot assign this
 *                   button to another keybind and thus erasing the "Ok"
 *                   keybind and get stuck in the menu.
 * 
 * 
 * - Text - customise menu names and messages.
 * 
 * ============================================================================
 * Free to use in non-commercial and commercial projects!
 * Please credit Nowis-337
 * ============================================================================
 * 5/12/2022 - Fixed dispay error of movement presets when cancelling out of the menu and re-entering
 * 30/9/2022 - Fixed error from copy and pasting from my other plugin.
 * 5/9/2022 - Finished plugin!
 * 
 * @param defaultOptions
 * @desc Using Default Options Menu.
 * @text Default Options Menu
 * @type boolean
 * @default true
 * 
 * @param windowWidth
 * @text Window Width
 * @desc Width of of the rebind menu.
 * @type number
 * @default 500
 * 
 * @param usingMovementPresets
 * @desc Enable option to set movement presets.
 * @text Enable Movement Presets
 * @type boolean
 * @default true
 * 
 * @param MovementKeyBindList
 * @text Movement Keys Preset List
 * @desc The first preset will be the default.
 * @type struct<MovementPresets>[]
 * @default ["{\"movementPresetName\":\"Arrow Keys\",\"movementPresetStruct\":\"[\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Up\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Up\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Down\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Down\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Left\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Left\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Right\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Right\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\"}","{\"movementPresetName\":\"WASD\",\"movementPresetStruct\":\"[\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Up\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"W\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Down\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"S\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Left\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"A\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Right\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"D\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\"}","{\"movementPresetName\":\"ZQSD\",\"movementPresetStruct\":\"[\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Up\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"Z\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Down\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"S\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Left\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"Q\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"keyPreset\\\\\\\":\\\\\\\"Right\\\\\\\",\\\\\\\"defaultother\\\\\\\":\\\\\\\"Other\\\\\\\",\\\\\\\"default\\\\\\\":\\\\\\\"D\\\\\\\",\\\\\\\"critical\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\"}"]
 * 
 * 
 * @param KeybindList
 * @text Keybind List
 * @type struct<KeyBind>[]
 * @default ["{\"keyName\":\"Select\",\"keyPreset\":\"Ok\",\"inputKey\":\"\",\"defaultother\":\"Other\",\"default\":\"Z\",\"critical\":\"true\"}","{\"keyName\":\"Cancel/Menu\",\"keyPreset\":\"Escape\",\"inputKey\":\"\",\"defaultother\":\"Other\",\"default\":\"X\",\"critical\":\"false\"}","{\"keyName\":\"Sprint\",\"keyPreset\":\"Sprint\",\"inputKey\":\"\",\"defaultother\":\"Shift\",\"default\":\"\",\"critical\":\"false\"}"]
 *
 * 
 * 
 * 
 * 
 * @param Text
 * @param OptionLabel
 * @parent Text
 * @text Option Label
 * @desc Name that appears in the options menu and the title of the menu.
 * @type text
 * @default Keyboard Config
 * 
 * @param MovementLabel
 * @parent Text
 * @text Movement Preset Label
 * @desc Label for Movement Presets.
 * @type text
 * @default  Movement Preset
 * 
 * 
 * @param SelectButton
 * @parent Text
 * @text Select Button
 * @desc Instructions that appear at the bottom by default.
 * @default Select key to rebind.
 * 
 * @param PendingInput
 * @parent Text
 * @text Pending Input
 * @default Press new key to rebind.
 * 
 * @param ButtonUnavailable
 * @parent Text
 * @text Button Unavailable
 * @desc Warning that appear when trying to assign a critical keybind button to another keybind.
 * @default This key is already in use. Please pick another key.
 * 
 * @param ButtonInvalid
 * @parent Text
 * @text Button Invalid
 * @desc Warning that appear when key pressed is invalid.
 * @default This key is invalid. Please pick another key.
 * 
 * 
 * @param UnassignedButton
 * @parent Text
 * @text Unassigned Button
 * @desc Warning that appear when there are unassigned keybinds.
 * @default Please assign a key to all keybinds.
 * 
 * 
 */
/*~struct~MovementPresets:
 * @param movementPresetName
 * @text Movement Preset Name
 * @desc Name of Movement Preset
 * @type text
 * 
 * @param movementPresetStruct
 * @text Preset
 * @type struct<MovementKeyBind>[]
 * 

*/
 /*~struct~KeyBind:
 * @param keyName
 * @text Keybind Name
 * @desc Name of the Keybind.
 * @type text
 * 
 * @param keyPreset
 * @text Key Preset
 * @desc Preset default keybind options. Select 'Custom' to customise your own.
 * @type select
 * @option Ok
 * @option Escape
 * @option Cancel
 * @option Menu
 * @option Sprint
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @option Custom
 * 
 * 
 * @param inputKey
 * @text Custom Keyname
 * @desc Custom keyname for a custom keybind. Requires "Custom" under Key Preset.
 * @type text
 * 
 * 
 * @param defaultother
 * @text Default Input (Special Keys)
 * @desc Bind to default special key. Select 'Other' for other keyboard inputs below.
 * @type select
 * @option Other
 * @option Space
 * @option Enter
 * @option Backspace
 * @option Shift
 * @option Ctrl
 * @option Alt
 * @option Esc
 * @option Tab
 * @option Del
 * @option Ins
 * @option Home
 * @option End
 * @option PgUp
 * @option PgDn
 * @option Capslock
 * @option NumLock
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @option Num0
 * @option Num1
 * @option Num2
 * @option Num3
 * @option Num4
 * @option Num5
 * @option Num6
 * @option Num7
 * @option Num8
 * @option Num9
 * @option NumPeriod
 * @option NumDivide
 * 
 * 
 * 
 * @param default
 * @text Default Input
 * @desc Bind to default keyboard input. Select 'Other' above to use this.
 * @type text
*
 * 
 * @param critical
 * @text Critical
 * @desc Is this keybind critical?
 * @type boolean
 * @default false
 * 
 */

 /*~struct~MovementKeyBind:
 * @param keyPreset
 * @text Key Preset
 * @desc Preset default keybind options. Select 'Custom' to customise your own.
 * @type select
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * 
 * 
 * @param defaultother
 * @text Default Input (Special Keys)
 * @desc Bind to default special key. Select 'Other' for other keyboard inputs below.
 * @type select
 * @option Other
 * @option Space
 * @option Enter
 * @option Backspace
 * @option Shift
 * @option Ctrl
 * @option Alt
 * @option Esc
 * @option Tab
 * @option Del
 * @option Ins
 * @option Home
 * @option End
 * @option PgUp
 * @option PgDn
 * @option Capslock
 * @option NumLock
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @option Num0
 * @option Num1
 * @option Num2
 * @option Num3
 * @option Num4
 * @option Num5
 * @option Num6
 * @option Num7
 * @option Num8
 * @option Num9
 * @option NumPeriod
 * @option NumDivide

 * 
 * @param default
 * @text Default Input
 * @desc Bind to default keyboard input. Select 'Other' above to use this.
 * @type text
*
 * 
 * @param critical
 * @text Critical
 * @desc Is this keybind critical?
 * @type boolean
 * @default true
 * 
 */

var Nowis337_KeyboardRebind = {
    usingDefaultOption: Boolean(JSON.parse(PluginManager.parameters("Nowis337_KeyboardRebind")["defaultOptions"])),
    windowWidth: Number(PluginManager.parameters("Nowis337_KeyboardRebind")["windowWidth"]),
    usingMovementPreset: Boolean(JSON.parse(PluginManager.parameters("Nowis337_KeyboardRebind")["usingMovementPresets"])),

    _movementPresets: [],
    _movementPresetIndex: 0,
    savedCurrentKeyboardInput: null,
    pendingCurrentKeyboardInput: null,

    buffervalue: 10,
    textTitle: PluginManager.parameters("Nowis337_KeyboardRebind")["OptionLabel"],
    textMovement: PluginManager.parameters("Nowis337_KeyboardRebind")["MovementLabel"],
    text1: PluginManager.parameters("Nowis337_KeyboardRebind")["SelectButton"],
    text2: PluginManager.parameters("Nowis337_KeyboardRebind")["PendingInput"],
    text3: PluginManager.parameters("Nowis337_KeyboardRebind")["ButtonUnavailable"],
    text4: PluginManager.parameters("Nowis337_KeyboardRebind")["UnassignedButton"],
    text5: PluginManager.parameters("Nowis337_KeyboardRebind")["ButtonInvalid"]


};
Nowis337_KeyboardRebind.addGamePadDelay = function(){
    //if(Nowis337_ControllerRebind.gamepadRepeatFix){
    //    Input._gamePadDelay = 15;
    //};
  
};

Nowis337_KeyboardRebind.createMovementPresets = function(){
    let parse1 = JSON.parse(PluginManager.parameters("Nowis337_KeyboardRebind")["MovementKeyBindList"]);
    let parse2 = [];
    parse1.forEach(struct => parse2.push(JSON.parse(struct)));
    parse2.forEach(object => object.movementPresetStruct = JSON.parse(object.movementPresetStruct));
    parse2.forEach(myFunction1);

    function myFunction1(object){
        let array = []
        object.movementPresetStruct.forEach(struct => array.push(JSON.parse(struct)));
        object.movementPresetStruct = array;
    };
    this._movementPresets = parse2;
};

Nowis337_KeyboardRebind.currentMovementPresetData = function(){
    this.createMovementPresets();
    const index = this._movementPresetIndex;
    let group = this._movementPresets[index].movementPresetStruct;
    let array = [];
    group.forEach(processingFunction);

    function processingFunction(struct){
        let object = {};
        switch(struct["keyPreset"]){
            case "Up": object.inputKey = "up"; break;
            case "Down": object.inputKey = "down"; break;
            case "Left": object.inputKey = "left"; break;
            case "Right": object.inputKey = "right"; break;
            default: object.inputKey = null;
        };
        let keycode;
        if(struct["defaultother"] !== "Other"){
            keycode = Nowis337_KeyboardRebind.findKeyCode(struct["defaultother"]);
        } else {
            let keycodeinput = struct["default"].toUpperCase();
            keycode = Nowis337_KeyboardRebind.findKeyCode(keycodeinput);
        };
        object.default = keycode;
        object.critical = JSON.parse(struct["critical"]);
        array.push(object);

    };
    return array;

};




Nowis337_KeyboardRebind.createData = function(){
    
    let rawData = JSON.parse(PluginManager.parameters("Nowis337_KeyboardRebind")["KeybindList"]);
    let array = [];
    rawData.forEach(processData);

    function processData(struct0){
        let struct = JSON.parse(struct0);
   
        let object = {};
        object.keyName = struct["keyName"];
        if(struct["keyPreset"] == "Custom"){
            object.inputKey = struct["inputKey"];
        } else {
            switch(struct["keyPreset"]){
                case "Ok": object.inputKey = "ok"; break;
                case "Cancel": object.inputKey = "cancel"; break;
                case "Menu": object.inputKey = "menu"; break;
                case "Escape": object.inputKey = "escape"; break;
                case "Sprint": object.inputKey = "shift"; break;
                default: object.inputKey = null;
            };
        };
        let keycode;
        if(struct["defaultother"] !== "Other"){
            keycode = Nowis337_KeyboardRebind.findKeyCode(struct["defaultother"]);
        } else {
            let keycodeinput = struct["default"].toUpperCase();
            keycode = Nowis337_KeyboardRebind.findKeyCode(keycodeinput);

        };
        object.default = keycode;
        object.critical = JSON.parse(struct["critical"]);
        object.specialfunction = "";
        array.push(object);
    };
    this.finalData = array;
    if(Nowis337_KeyboardRebind.usingMovementPreset){
        this.finalData.unshift({specialfunction:"movementpreset"});
    };
    
};
Nowis337_KeyboardRebind.findKeyCode = function(inputkeyname){
    let object = Nowis337_KeyboardRebind.keyLookUp.find(object => object.name == inputkeyname);
    if(object){
        return object.code;
    } else {
        return undefined;
    };
};



Nowis337_KeyboardRebind.criticalKeySymbols = function(){

 let data = this.finalData;
 let array = [];
 data.forEach(myFunction);

 function myFunction(object){
     if(object.critical) array.push(object.inputKey);
 };

 if(this.usingMovementPreset){
     let data2 = this.currentMovementPresetData();
     data2.forEach(myFunction2);
     function myFunction2(object){
         if(object.critical) array.push(object.inputKey);
     };
 };
 return array;

};

Nowis337_KeyboardRebind.findKeyDisplay = function(keycode){
    let number = 1*keycode;
    let object = Nowis337_KeyboardRebind.keyLookUp.find(object => object.code == number);
    if(object){
        return object.name;
    } else {
        return "-"
    };

};

Nowis337_KeyboardRebind.currentBindedKey = function(keysymbol){
    let arrayofallkeys = Object.keys(Input.keyMapper);
    let currentkeycode = arrayofallkeys.find(myFunction);

    function myFunction(value){
        return Input.keyMapper[value] === keysymbol;
    };
    return currentkeycode;
    
};


Nowis337_KeyboardRebind.saveCurrentKeyboardInput = function(){
    this.savedCurrentKeyboardInput = JSON.parse(JSON.stringify(Input.keyMapper));
};

Nowis337_KeyboardRebind.updatePendingKeyboardInput = function(){
    this.pendingCurrentKeyboardInput = JSON.parse(JSON.stringify(Input.keyMapper));
};

Nowis337_KeyboardRebind.restorePendingKeyboardInput = function(){
    Input.keyMapper = JSON.parse(JSON.stringify(this.pendingCurrentKeyboardInput));
};

Nowis337_KeyboardRebind.restoreSavedKeyboardInput = function(){
    Input.keyMapper = JSON.parse(JSON.stringify(this.savedCurrentKeyboardInput));
};

Nowis337_KeyboardRebind.prepareKeys = function(){
    
};

Nowis337_KeyboardRebind.clearKeys = function(){
    this.keyLookUp.forEach(clearFunction);

    function clearFunction(object){
        Input.keyMapper[object.code] = "";
    };
    
};

Nowis337_KeyboardRebind.applyDefaultKeys = function(){
    this.clearKeys();
    if(this.usingMovementPreset){
        this._movementPresetIndex = 0;
        let data1 = this.currentMovementPresetData();
        data1.forEach(object => Input.keyMapper[object.default] = object.inputKey);
    };

    let data2 = this.finalData;
    data2.forEach(applyDefaultFunction);

    function applyDefaultFunction(object){
        if(object.specialfunction !== "") return;
        if(object.default )
        Input.keyMapper[object.default] = object.inputKey;
    };

};

Nowis337_KeyboardRebind.checkKeyUnassigned = function(){
    if(this.usingMovementPreset){
        let data1 = this.currentMovementPresetData();
        if(data1.some(object => this.currentBindedKey(object.inputKey))){

        } else {
            return true;
        };

    };

        let data = Nowis337_KeyboardRebind.finalData;
    return data.some(notAssigned);

    function notAssigned(object){
        if(!object.inputKey) return false;
        let inputkeyname = object.inputKey;
        let result = Nowis337_KeyboardRebind.currentBindedKey(inputkeyname);
        if(!result) return true;
        return false;


    };
};


Nowis337_KeyboardRebind.listenFunction = function(event){
    if(SceneManager._scene._inputBuffer > 0) return;
    SceneManager._scene._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    SceneManager._scene.processInput(event.keyCode);
};

Nowis337_KeyboardRebind.addListenEvent = function(){
    document.addEventListener("keydown", Nowis337_KeyboardRebind.listenFunction);

};

Nowis337_KeyboardRebind.removeListenEvent = function(){
    document.removeEventListener("keydown", Nowis337_KeyboardRebind.listenFunction);
}

//========== Scene_KeyboardRebind =================
function Scene_KeyboardRebind() {
    this.initialize(...arguments);
}

Scene_KeyboardRebind.prototype = Object.create(Scene_MenuBase.prototype);
Scene_KeyboardRebind.prototype.constructor = Scene_KeyboardRebind;

Scene_KeyboardRebind.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    Nowis337_KeyboardRebind.saveCurrentKeyboardInput();
    Nowis337_KeyboardRebind._oldMovementPresetIndex = Nowis337_KeyboardRebind._movementPresetIndex;
    this._inputBuffer = 0;
    this._listeningMode = false;
    this._currentPendingKey = "";
    this._criticalKeySymbols = Nowis337_KeyboardRebind.criticalKeySymbols(); // array of symbols
   
};

Scene_KeyboardRebind.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createKeyList();
    this.createConfirmWindow();
    this.createHeader();
    this.createMovementList();
    this.createRebindPopup();
};

Scene_KeyboardRebind.prototype.update = function() {
    if(this._inputBuffer > 0){
        this._inputBuffer--;
    };
    Scene_MenuBase.prototype.update.call(this);
    //if(this._listeningMode) this.listenForKeyInput();


};


Scene_KeyboardRebind.prototype.createKeyList = function(){
    let datalength = Nowis337_KeyboardRebind.finalData.length;
    const ww = Nowis337_KeyboardRebind.windowWidth;
    const wh = this.calcWindowHeight(datalength, true);
    const wx = (Graphics.boxWidth - ww)/2;
    const wy = (Graphics.boxHeight - this.calcWindowHeight(1,false) - this.calcWindowHeight(1,false) - this.calcWindowHeight(3,true) - wh)/2 + this.calcWindowHeight(1,false) + 50;
    const rect = new Rectangle(wx, wy, ww, wh);
    this._keyList = new Window_KeyList2(rect);
    this._keyList.setHandler("ok", this.keyConfirmOk.bind(this));
    this._keyList.setHandler("cancel", this.keyConfirmCancel.bind(this));
    this.addWindow(this._keyList);
    this._keyList.refresh();
    this._keyList.activate();
    this._keyList.select(0);
   
};

Scene_KeyboardRebind.prototype.createConfirmWindow = function(){
    const ww = this._keyList.width - 200;
    const wh = this.calcWindowHeight(3, true);
    const wx = 100 + this._keyList.x;
    const wy = this._keyList.y + this._keyList.height - 180;
    const rect = new Rectangle(wx, wy, ww, wh);
    this._rebindConfirmWindow = new Window_KeyRebindConfirm2(rect);
    this._rebindConfirmWindow.setHandler("ok", this.rebindConfirmOk.bind(this));
    this._rebindConfirmWindow.setHandler("cancel", this.rebindConfirmCancel.bind(this));
    this.addWindow(this._rebindConfirmWindow);
    this._rebindConfirmWindow.deselect();
    this._rebindConfirmWindow.deactivate();
    this._keyList._rebindConfirmWindow = this._rebindConfirmWindow;
    this._rebindConfirmWindow._keyList = this._keyList;

    this._rebindConfirmWindow.hide();
};

Scene_KeyboardRebind.prototype.createHeader = function(){
    // const text = Nowis337_KeyboardRebind.textTitle;
    // const ww = this._keyList.width;
    // const wh = this.calcWindowHeight(1, false);
    // const wx = this._keyList.x;
    // const wy = this._keyList.y - wh;
    // const rect = new Rectangle(wx, wy, ww, wh);
    // this._headerWindow = new Window_Base(rect);
    // this.addWindow(this._headerWindow);
    // const textrect = this._headerWindow.baseTextRect();
    // this._headerWindow.contents.clear();
    // this._headerWindow.drawText(text, textrect.x, textrect.y, textrect.width, "center");
};


Scene_KeyboardRebind.prototype.createMovementList = function(){
    let datalength = Nowis337_KeyboardRebind._movementPresets.length;
    const ww = 230;
    const wh = this.calcWindowHeight(datalength, true);
    const wx = this._keyList.x + this._keyList.width - 350;
    const wy = this._keyList.y + 20;
    const rect = new Rectangle(wx, wy, ww, wh);
    this._movementList = new Window_MovementList(rect);
    this._movementList.setHandler("ok", this.movementListOk.bind(this));
    this._movementList.setHandler("cancel", this.movementListCancel.bind(this));
    this._movementList.openness = 0;
    this.addWindow(this._movementList);
    this._movementList.refresh();
    this._movementList.deactivate();
    this._movementList.select(-1);
   
};


Scene_KeyboardRebind.prototype.createRebindPopup = function(){
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, false);
    const wx = (Graphics.boxWidth - ww)/2;
    const wy = Graphics.boxHeight - wh;
    const rect = new Rectangle(wx, wy, ww, wh);
    this._rebindPopUp = new Window_Base(rect);
    this.updateText(Nowis337_KeyboardRebind.text1);
    //this._rebindPopUp.openness = 0;
    this.addWindow(this._rebindPopUp);

};



Scene_KeyboardRebind.prototype.rebindConfirmOk = function(){
    if(this._inputBuffer > 0) return;
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    Nowis337_KeyboardRebind.addGamePadDelay();


    if(this._rebindConfirmWindow.currentSymbol() == "rebinddefault"){
        Nowis337_KeyboardRebind.clearKeys();
        Input.gamepadMapper = Nowis337_KeyboardRebind.applyDefaultKeys();
        this._keyList.refresh();
        SoundManager.playSave();
        Input.clear();
        this._rebindConfirmWindow.show();
        this._rebindConfirmWindow.activate();

    };

    if(this._rebindConfirmWindow.currentSymbol() == "rebindconfirm"){
        if(Nowis337_KeyboardRebind.checkKeyUnassigned()){
            SoundManager.playBuzzer();
            this.updateText(Nowis337_KeyboardRebind.text4);
            Input.clear();
            this._rebindConfirmWindow.show();
            this._rebindConfirmWindow.activate();

        } else {
            SoundManager.playSave();
            this.popScene();
        };

    };

    if(this._rebindConfirmWindow.currentSymbol() == "rebindcancel"){
        SoundManager.playCancel();
        Nowis337_KeyboardRebind.restoreSavedKeyboardInput();
        Nowis337_KeyboardRebind._movementPresetIndex = Nowis337_KeyboardRebind._oldMovementPresetIndex;
        //console.log(Nowis337_KeyboardRebind._oldMovementPresetIndex);   
        this.popScene();
    };

}

Scene_KeyboardRebind.prototype.rebindConfirmCancel = function(){
    if(this._inputBuffer > 0) return;
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    Nowis337_KeyboardRebind.addGamePadDelay();


    if(this._rebindConfirmWindow.index() !== 2){
        this._rebindConfirmWindow.smoothSelect(2);
        this._rebindConfirmWindow.show();
        this._rebindConfirmWindow.activate();
        Input.clear();

    } else {
        Nowis337_KeyboardRebind.restoreSavedKeyboardInput();
        Nowis337_KeyboardRebind._movementPresetIndex = Nowis337_KeyboardRebind._oldMovementPresetIndex;
        this.popScene();
    }
};

Scene_KeyboardRebind.prototype.keyConfirmOk = function(){
    if(this._inputBuffer > 0) return;
    SoundManager.playOk();
    Nowis337_KeyboardRebind.addGamePadDelay();
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;

    if(this._keyList._data[this._keyList.index()].specialfunction == "movementpreset"){
        this._keyList.deactivate();
        this._movementList.open();
        this._movementList.activate();
        this._keyList.hide();
        this._movementList.select(0);

    } else {
        this._keyList.deactivate();
        this._currentPendingKey = this._keyList._data[this._keyList.index()].inputKey;
        Nowis337_KeyboardRebind.updatePendingKeyboardInput();
        //this._listeningMode = true;
        Nowis337_KeyboardRebind.addListenEvent();
        this.updateText(Nowis337_KeyboardRebind.text2);
        Input.clear();
    
    };


    

};

Scene_KeyboardRebind.prototype.keyConfirmCancel = function(){
    if(this._inputBuffer > 0) return;
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    Nowis337_KeyboardRebind.addGamePadDelay();

    this._keyList.deselect();
    this._keyList.deactivate();
    this._rebindConfirmWindow.activate();
    this._rebindConfirmWindow.show();
    this._keyList.hide();
    this._rebindConfirmWindow.select(2);
    Input.clear();

};

Scene_KeyboardRebind.prototype.movementListOk = function(){
    if(this._inputBuffer > 0) return;
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    Nowis337_KeyboardRebind.addGamePadDelay();

    SoundManager.playSave();
    let listindex = this._movementList.index();
    const thisscene = this;
    var flagtorebindok = false;
    let previousokkeycode = Nowis337_KeyboardRebind.currentBindedKey("ok");
    Nowis337_KeyboardRebind.updatePendingKeyboardInput();
    //==========================================//
    Nowis337_KeyboardRebind._movementPresetIndex = listindex;
    let newdata = Nowis337_KeyboardRebind.currentMovementPresetData();
    newdata.forEach(myFunction1);

    function myFunction1(object){
        let newkeycode = object.default;
        let inputKey = object.inputKey;
        thisscene.erasePreviousKey(inputKey);
        Input.keyMapper[newkeycode] = inputKey;
        if(newkeycode == previousokkeycode) flagtorebindok = true;
    }

    if(flagtorebindok){
        //rebind ok to enter
        Input.keyMapper["13"] = "ok";
    };
    this._movementList.deselect();
    this._movementList.deactivate();
    this._movementList.close();
    this._keyList.refresh();
    this._keyList.activate();
    this._keyList.show();
    Input.clear();

};

Scene_KeyboardRebind.prototype.movementListCancel = function(){
    if(this._inputBuffer > 0) return;
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    Nowis337_KeyboardRebind.addGamePadDelay();

    SoundManager.playCancel();
    this._movementList.deselect();
    this._movementList.deactivate();
    this._movementList.close();
    this._keyList.activate();
    this._keyList.show();
    Input.clear();

};







Scene_KeyboardRebind.prototype.listenForKeyInput = function(){
//defunct
};

Scene_KeyboardRebind.prototype.keyListeningFunction = function(event){
    //this.processInput(event.keyCode);

};

Scene_KeyboardRebind.prototype.isNewKeyCritical = function (keycode){
    // console.log(keycode);
    // console.log(this._currentPendingKey);
    // console.log(this._criticalKeySymbols);
    if(Nowis337_KeyboardRebind.pendingCurrentKeyboardInput[keycode] === this._currentPendingKey) return false;
    if(this._criticalKeySymbols.includes(Nowis337_KeyboardRebind.pendingCurrentKeyboardInput[keycode])){
        return true;
    };
    return false;
   
};

Scene_KeyboardRebind.prototype.processInput = function(keycode){
if(this.notValidInput(keycode)){
    this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
    SoundManager.playBuzzer();
    this.updateText(Nowis337_KeyboardRebind.text5);
    Input.clear();
    return;
};

if(this.isNewKeyCritical(keycode)){
        this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
        SoundManager.playBuzzer();
        this.updateText(Nowis337_KeyboardRebind.text3);
        Input.clear();
        //this._keyList.activate();

} else {
        SoundManager.playOk();
        Nowis337_KeyboardRebind.removeListenEvent();
        let alreadyboundedkey = Nowis337_KeyboardRebind.currentBindedKey(this._currentPendingKey);
        if(alreadyboundedkey !== keycode){
            // erase previous
            this.erasePreviousKey(this._currentPendingKey);
            // apply new button
            Input.keyMapper[keycode] = this._currentPendingKey;
        };
        //this._rebindPopUp.deactivate();
        //this._listeningMode = false;
        this._inputBuffer = Nowis337_KeyboardRebind.buffervalue;
        this._keyList.refresh();
        this._keyList.activate();
        Input.clear();
        this.updateText(Nowis337_KeyboardRebind.text1);



    };
    
};

Scene_KeyboardRebind.prototype.erasePreviousKey = function(keysymbol){
    
    let arrayofallkeys = Object.keys(Nowis337_KeyboardRebind.pendingCurrentKeyboardInput);
    let currentkeycode = arrayofallkeys.find(myFunction);

    function myFunction(value){
        return Nowis337_KeyboardRebind.pendingCurrentKeyboardInput[value] === keysymbol;
    };
    Input.keyMapper[currentkeycode] = "";
    
};

Scene_KeyboardRebind.prototype.updateText = function(text){
    
    const textrect = this._rebindPopUp.baseTextRect();
    this._rebindPopUp.contents.clear();
    this._rebindPopUp.drawText(text, textrect.x, textrect.y, textrect.width, "center");
    
};

Scene_KeyboardRebind.prototype.notValidInput = function(keycode){
    if(Nowis337_KeyboardRebind.keyLookUp.some(object => object.code == keycode)) return false;
    return true;
};

//=================== Window_KeyList2 =============================
function Window_KeyList2() {
    this.initialize(...arguments);
    this._rebindConfirmWindow = null;
}

Window_KeyList2.prototype = Object.create(Window_Selectable.prototype);
Window_KeyList2.prototype.constructor = Window_KeyList2;

Window_KeyList2.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
};

Window_KeyList2.prototype.maxItems = function() {
    return Nowis337_KeyboardRebind.finalData.length;
    
};

Window_KeyList2.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    let data = this._data;
    let name;
    let label;

    if(data[index].specialfunction == "movementpreset" && Nowis337_KeyboardRebind.usingMovementPreset){
        name = Nowis337_KeyboardRebind.textMovement;
        label = Nowis337_KeyboardRebind._movementPresets[Nowis337_KeyboardRebind._movementPresetIndex].movementPresetName;

    } else {
        name = this._data[index].keyName;
        let currentbindedkey = Nowis337_KeyboardRebind.currentBindedKey(data[index].inputKey);
        label = Nowis337_KeyboardRebind.findKeyDisplay(currentbindedkey);
    };
    
    
    this.drawText(name + ":  ", rect.x - rect.width, rect.y, rect.width, "right");
    this.drawText(label, rect.x, rect.y, rect.width, "center");
};

Window_KeyList2.prototype.refresh = function() {
    this.updateData();
    this.paint();
};

Window_KeyList2.prototype.updateData = function() {
    this._data = Nowis337_KeyboardRebind.finalData;
};

Window_KeyList2.prototype.itemWidth = function() {
    return Math.floor(this.innerWidth / 2);
};

Window_KeyList2.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = (col+1) * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};


Window_KeyList2.prototype.cursorDown = function(wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if(index < maxItems-1){
        this.smoothSelect((index + maxCols) % maxItems);
    } else {
        this.deselect();
        this.deactivate();
        this._rebindConfirmWindow.activate();
        this._rebindConfirmWindow.show();
        this._rebindConfirmWindow.select(-1);
    };
};

Window_KeyList2.prototype.cursorUp = function(wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index > 0) {
        this.smoothSelect((index - maxCols + maxItems) % maxItems);
    } else {
        this.deselect();
        this.deactivate();
        this._rebindConfirmWindow.select(this._rebindConfirmWindow.maxItems()); //Why does it do this???
        this._rebindConfirmWindow.show();
        this._rebindConfirmWindow.activate();
    };
};

Window_KeyRebindConfirm2.prototype.playOkSound = function() {
    //SoundManager.playOk();
};

//=================== Window_KeyRebindConfirm2 =============================
function Window_KeyRebindConfirm2() {
    this.initialize(...arguments);
}

Window_KeyRebindConfirm2.prototype = Object.create(Window_Command.prototype);
Window_KeyRebindConfirm2.prototype.constructor = Window_KeyRebindConfirm2;

Window_KeyRebindConfirm2.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._keyList = null;
};

Window_KeyRebindConfirm2.prototype.makeCommandList = function() {
    this.addCommand("Restore Defaults", "rebinddefault");
    this.addCommand("Confirm Changes", "rebindconfirm");
    this.addCommand("Discard Changes", "rebindcancel");
};

Window_KeyRebindConfirm2.prototype.maxItems = function() {
    return 3;
};

Window_KeyRebindConfirm2.prototype.cursorDown = function(wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if(index < maxItems-1){
        this.smoothSelect((index + maxCols) % maxItems);
    } else {
        this.deselect();
        this.deactivate();
        this._keyList.activate();
        this._keyList.smoothSelect(0);
    };

};

Window_KeyRebindConfirm2.prototype.cursorUp = function(wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index > 0) {
        this.smoothSelect((index - maxCols + maxItems) % maxItems);
    } else {
        this.deselect();
        this.deactivate();
        this._keyList.activate();
        this._keyList.smoothSelect(this._keyList.maxItems()-1);
    };
};

Window_KeyRebindConfirm2.prototype.playOkSound = function() {
    //SoundManager.playOk();
};

//=================== Window_MovementList =============================
function Window_MovementList() {
    this.initialize(...arguments);
}

Window_MovementList.prototype = Object.create(Window_Selectable.prototype);
Window_MovementList.prototype.constructor = Window_MovementList;

Window_MovementList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
};

Window_MovementList.prototype.maxItems = function() {
    return Nowis337_KeyboardRebind._movementPresets.length;
    
};

Window_MovementList.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    this.drawText(this._data[index].movementPresetName, rect.x, rect.y, rect.width, "center");
};

Window_MovementList.prototype.refresh = function() {
    this.updateData();
    this.paint();
};

Window_MovementList.prototype.updateData = function() {
    this._data = Nowis337_KeyboardRebind._movementPresets;
};

Window_MovementList.prototype.itemWidth = function() {
    return Math.floor(this.innerWidth);
};

Window_MovementList.prototype.playOkSound = function() {
    //SoundManager.playOk();
};



// Saving and Loading Data
//===============================

// ConfigManager
//====================================================

const Nowis337_KeyboardRebind_ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    let config1 = Nowis337_KeyboardRebind_ConfigManager_makeData.call(this);
    config1.savedKeyboardMapper = Input.keyMapper;
    config1.savedMovementPresetIndex = Nowis337_KeyboardRebind._movementPresetIndex;
    return config1;
};

const Nowis337_KeyboardRebind_ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Nowis337_KeyboardRebind_ConfigManager_applyData.call(this, config);
    if("savedKeyboardMapper" in config){
        this.savedKeyboardMapper = config.savedKeyboardMapper;
        Input.keyMapper = config.savedKeyboardMapper;
    };
    if("savedMovementPresetIndex" in config){
        Nowis337_KeyboardRebind._movementPresetIndex = config.savedMovementPresetIndex;
    };
};

const Nowis337_KeyboardRebind_ConfigManager_load = ConfigManager.load;
ConfigManager.load = function() {

    Nowis337_KeyboardRebind.createData();
    Nowis337_KeyboardRebind.applyDefaultKeys();
    //Nowis337_KeyboardRebind._movementPresetIndex = 0;
    Nowis337_KeyboardRebind_ConfigManager_load.call(this);
};

// Scene_Options
//=====================================================

const Nowis337_KeyboardRebind_Scene_Options_prototype_maxCommands = Scene_Options.prototype.maxCommands
Scene_Options.prototype.maxCommands = function() {
    return Nowis337_KeyboardRebind_Scene_Options_prototype_maxCommands.call(this);

};


// Window_Options

// const Nowis337_KeyboardRebind_Window_Option_prototype_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(Nowis337_KeyboardRebind.textTitle, "keyboardRebind");
    this.addCommand(TextManager.alwaysDash, "alwaysDash");
    this.addCommand(TextManager.touchUI, "touchUI");
    // Nowis337_KeyboardRebind_Window_Option_prototype_addGeneralOptions.call(this);
};

const Nowis337_KeyboardRebind_Window_Option_prototype_changeValue = Window_Options.prototype.changeValue;
Window_Options.prototype.changeValue = function(symbol, value) {
    Nowis337_KeyboardRebind_Window_Option_prototype_changeValue.call(this, symbol, value);
    if(symbol == "keyboardRebind"){
        //SoundManager.playOk();
        Input.clear();
        if(Nowis337_KeyboardRebind.usingDefaultOption){
            Nowis337_KeyboardRebind._lastIndex = this.index();
        };
        
        SceneManager.push(Scene_KeyboardRebind);
    };

};

const Nowis337_KeyboardRebind_Window_Options_prototype_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    if(symbol == "keyboardRebind") return "";
    return Nowis337_KeyboardRebind_Window_Options_prototype_statusText.call(this, index);

};

const Nowis337_KeyboardRebind_Window_Options_prototype_initialize = Window_Options.prototype.initialize;
Window_Options.prototype.initialize = function(rect) {
    Nowis337_KeyboardRebind_Window_Options_prototype_initialize.call(this,rect);

};


const Nowis337_KeyboardRebind_Scene_Options_prototype_popScene = Scene_Options.prototype.popScene;
Scene_Options.prototype.popScene = function() {
    if(Nowis337_KeyboardRebind.usingDefaultOption){
        Nowis337_KeyboardRebind._lastIndex = -1;
    };
    Nowis337_KeyboardRebind_Scene_Options_prototype_popScene.call(this);
 
    
};

const Nowis_337_KeyboardRebind_Scene_Options_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
    Nowis_337_KeyboardRebind_Scene_Options_createOptionsWindow.call(this);
    if(Nowis337_KeyboardRebind.usingDefaultOption){
        if(Nowis337_KeyboardRebind._lastIndex!== undefined && Nowis337_KeyboardRebind._lastIndex > -1){
            this._optionsWindow.select(Nowis337_KeyboardRebind._lastIndex);
            Nowis337_KeyboardRebind._lastIndex = -1;
        };
        
    };
};


// APPENDIX
//================================

Nowis337_KeyboardRebind.keyLookUp = 
[

{name:"Space", code: 32},
{name:"Enter", code: 13},
{name:"Backspace", code: 8},
{name:"Shift", code: 16},
{name:"Ctrl", code: 17},
{name:"Alt", code: 18},
{name:"Esc", code: 27},
{name:"Tab", code: 9},
{name:"Del", code: 46},
{name:"Ins", code: 45},
{name:"Home", code: 36},
{name:"End", code: 35},
{name:"PgUp", code: 33},
{name:"PgDn", code: 34},
{name:"Capslock", code: 20},
{name:"NumLock", code: 144},
{name:"Up", code: 38},
{name:"Down", code: 40},
{name:"Left", code: 37},
{name:"Right", code: 39},
{name:"Num1", code: 97},
{name:"Num2", code: 98},
{name:"Num3", code: 99},
{name:"Num4", code: 100},
{name:"Num5", code: 101},
{name:"Num6", code: 102},
{name:"Num7", code: 103},
{name:"Num8", code: 104},
{name:"Num9", code: 105},
{name:"Num0", code: 96},
{name:"NumPeriod", code: 110},
{name:"NumDivide", code: 111},

{name:"`", code: 192},
{name:"1", code: 49},
{name:"2", code: 50},
{name:"3", code: 51},
{name:"4", code: 52},
{name:"5", code: 53},
{name:"6", code: 54},
{name:"7", code: 55},
{name:"8", code: 56},
{name:"9", code: 57},
{name:"0", code: 48},
{name:"-", code: 189},
{name:"=", code: 187},
{name:"*", code: 106},
{name:"-", code: 109},
{name:"+", code: 107},

{name:"Q", code: 81},
{name:"W", code: 87},
{name:"E", code: 69},
{name:"R", code: 82},
{name:"T", code: 84},
{name:"Y", code: 89},
{name:"U", code: 85},
{name:"I", code: 73},
{name:"O", code: 79},
{name:"P", code: 80},
{name:"[", code: 219},
{name:"]", code: 221},
{name:"\\", code: 220},
{name:"A", code: 65},
{name:"S", code: 83},
{name:"D", code: 68},
{name:"F", code: 70},
{name:"G", code: 71},
{name:"H", code: 72},
{name:"J", code: 74},
{name:"K", code: 75},
{name:"L", code: 76},
{name:";", code: 186},
{name:"'", code: 222},
{name:"Z", code: 90},
{name:"X", code: 88},
{name:"C", code: 67},
{name:"V", code: 86},
{name:"B", code: 66},
{name:"N", code: 78},
{name:"M", code: 77},
{name:",", code: 188},
{name:".", code: 190},
{name:"/", code: 191}

];

























