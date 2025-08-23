/*:
 * @target MZ
 * @plugindesc creature capture, battle and storage system
 * @author Wyatt Grant
 * @help This plugin enables the creature capture and battle system
 * 
 * Commands:
 * 
 * Capture - capture an enemy
 * swapGender switch to male/female
 * openStorageScene - opens party storage scene
 * AutoMessage - messages that automatically continue and do not block battle UI.
 * 
 * 
 * 
 * @param storageStartPointInActorData
 * @desc The end of the actors that represent base monsters.(more will be created via cloning during capture)
 * @default 256
 * 
 * @param trainerStartPointInEnemyData
 * @desc The end of the actors that represent wild monsters. (after this point should be trainers)
 * @default 256
 * 
 * @command openStorageScene
 * @text Open Storage Scene
 * @desc Opens the storage scene.
 * 
 * @param Initial Gender
 * @desc The gender your Player is. 'male' or 'female'.
 * @default male
 *
 * @param Char Name
 * @desc The file your character is contained in. Should be in folder: img/characters
 * @default Actor1
 * 
 * @command swapGender
 * @text Swap Gender
 * @desc swap the gender of the overworld sprite. male or female.
 * @arg gender
 * @text
 * @desc male or female
 * 
 * @command Capture
 * @text Capture
 * @desc Capture current enemy
 * 
 * @command AutoMessage
 * @text AutoMessage
 * @desc show message that auto dismisses
 * @arg msg
 * @desc 
 * @type text
 * @default
 * 
 */

(($_$) => {
	var p = PluginManager.parameters("CreatureCaptureAndBattle");
	const storageStartPointInActorData = parseInt(p["storageStartPointInActorData"]);
	var selectedPartyMember;
	var gender = String(p["Initial Gender"]).trim().toLowerCase() === "male";
	var charName = String(p["Char Name"]);
	var maleCharIndex = 0;
	var maleDCharIndex = 1
	var femaleCharIndex = 2
	var femaleDCharIndex = 3
	var idleTimer = 0;
	const trainerStartPointInEnemyData = parseInt(p["trainerStartPointInEnemyData"]);

	PluginManager.registerCommand("CreatureCaptureAndBattle", "swapGender", args => {
		if (args.gender.trim().toLowerCase() === "male") gender = true;
		if (args.gender.trim().toLowerCase() === "female") gender = false;
	});

	PluginManager.registerCommand('CreatureCaptureAndBattle', 'openStorageScene', function () {
		SceneManager.push(Scene_PartyStorage);
	});

	PluginManager.registerCommand('CreatureCaptureAndBattle', 'Capture', () => {
		const enemyInfo = JSON.parse($gameTroop.members()[0].enemy().note);
		const id = enemyInfo.class;
		const lvl = parseInt(enemyInfo.level);
		const newId = $dataActors.length;
		$dataActors[newId] = JSON.parse(JSON.stringify($dataActors[id]));
		$dataActors[newId].id = newId;
		if ($gameParty.allMembers().length < 6) {
			$gameParty.addActor(newId);
			$gameMessage.add("Added to party");
		} else {
			$gameMessage.add("Sent to storage");
		}
		$gameActors.actor(newId).changeLevel(lvl, false);
		$gameActors.actor(newId).setHp($gameActors.actor(newId).mhp);
		$gameActors.actor(newId).setMp($gameActors.actor(newId).mmp);
	});

	PluginManager.registerCommand('CreatureCaptureAndBattle', 'AutoMessage', args => {
		var messageWindow = new Window_AutoMessage();
		SceneManager._scene.addChild(messageWindow);
		messageWindow.startMessage(args.msg);
	});

	
	Game_Player.prototype.setCharacterIndex = function () {
		if (!$gamePlayer.isMoving()) {
			idleTimer++;
		} else {
			idleTimer = 0;
		}

		if (gender) {
			return ($gamePlayer.isDashing() && idleTimer < 3) ? maleDCharIndex : maleCharIndex;
		} else {
			return ($gamePlayer.isDashing() && idleTimer < 3) ? femaleDCharIndex : femaleCharIndex;
		}
	};

	var _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
	Game_Player.prototype.updateDashing = function () {
		_Game_Player_updateDashing.call(this);
		$gamePlayer.refresh();
	};

	var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
	Sprite_Character.prototype.updateBitmap = function () {
		if (this._character === $gamePlayer) {
			if (this.isImageChanged()) {
				this._tilesetId = $gameMap.tilesetId();
				this._tileId = this._character.tileId();
				this._characterName = charName;
				this._characterIndex = $gamePlayer.setCharacterIndex();
				if (this._tileId > 0) {
					this.setTileBitmap();
				} else {
					this.setCharacterBitmap();
				}
			}
		} else {
			_Sprite_Character_updateBitmap.call(this);
		}
	};

	var _Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
	Sprite_Character.prototype.characterBlockX = function () {
		if (this._character === $gamePlayer) {
			if (this._isBigCharacter) {
				return 0;
			} else {
				var index = this._character.setCharacterIndex();
				return index % 4 * 3;
			}
		} else {
			return _Sprite_Character_characterBlockX.call(this);
		}
	};

	var _Sprite_Character_characterBlockY = Sprite_Character.prototype.characterBlockY;
	Sprite_Character.prototype.characterBlockY = function () {
		if (this._character === $gamePlayer) {
			if (this._isBigCharacter) {
				return 0;
			} else {
				var index = this._character.setCharacterIndex();
				return Math.floor(index / 4) * 4;
			}
		} else {
			return _Sprite_Character_characterBlockY.call(this);
		}
	};

	Window_BattleActor.prototype.lineHeight = function () {
		return 45;
	};

	Window_BattleActor.prototype.drawAllItems = function () {
		return 'void';
	};

	'use strict';

	Window_Message.prototype.lineHeight = function () {
		return 24;
	};

	var _Window_Base_ResetFontSettings = Window_Base.prototype.resetFontSettings;
	Window_Base.prototype.resetFontSettings = function () {
		_Window_Base_ResetFontSettings.call(this);
		this.contents.outlineWidth = 0;

	};

	Bitmap.prototype._drawTextOutline = function () {
		return;
	};

	Object.defineProperty(Bitmap.prototype, 'smooth', {
		get: function () {
			return false; 
		},
		set: function (value) {
			if (this._smooth !== value) {
				this._smooth = value;
				this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
			}
		},
		configurable: true
	});

	Bitmap.prototype._drawTextBody = function (text, tx, ty, maxWidth) {
		this.currentText = text;
		var context = this._context;
		context.imageSmoothingEnabled = false;

		context.fillStyle = this.textColor;
		for (var i = 0; i < 3; i++)
			context.fillText(text, tx, ty + 2, maxWidth);

		if (this.width > 0 && this.height > 0) {
			var imageData = context.getImageData(0, 0, this.width, this.height);
			var data = imageData.data;

			for (var i = 0; i < data.length; i += 4) {
				if (data[i + 3] < 180) { 
					data[i + 3] = 0;    
				} else {
					data[i + 3] = 255;
				}

				data[i] = data[i];     
				data[i + 1] = data[i + 1]; 
				data[i + 2] = data[i + 2]; 
			}

			context.putImageData(imageData, 0, 0);
		}
	};

	Scene_Message.prototype.messageWindowRect = function () {
		const ww = 460;
		const wh = 74;
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_Message.prototype.updatePlacement = function () {
		const goldWindow = this._goldWindow;
		this._positionType = $gameMessage.positionType();
		this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
		if (goldWindow) {
			goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
		}
	};

	Window_Base.prototype.updateOpen = function () {
		if (this._opening) {
			this.openness = 255;
			if (this.isOpen()) {
				this._opening = false;
			}
		}
	};

	Window_Base.prototype.updateClose = function () {
		if (this._closing) {
			this.openness = 0;
			if (this.isClosed()) {
				this._closing = false;
			}
		}
	};

	Window.prototype._refreshPauseSign = function () {
		const sx = 144;
		const sy = 96;
		const p = 24;
		this._pauseSignSprite.bitmap = this._windowskin;
		this._pauseSignSprite.anchor.x = 0.5;
		this._pauseSignSprite.anchor.y = 1;
		this._pauseSignSprite.move(this._width - 14, this._height - 4);
		this._pauseSignSprite.setFrame(sx, sy, p, p);
		this._pauseSignSprite.alpha = 0;
	};

	Window.prototype._refreshArrows = function () {
		const w = this._width;
		const h = this._height;
		const p = 24;
		const q = p / 2;
		const sx = 96 + p;
		const sy = 0 + p;
		this._downArrowSprite.bitmap = this._windowskin;
		this._downArrowSprite.anchor.x = 0.5;
		this._downArrowSprite.anchor.y = 0.5;
		this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
		this._downArrowSprite.move(w / 2, h - q - 2);
		this._upArrowSprite.bitmap = this._windowskin;
		this._upArrowSprite.anchor.x = 0.5;
		this._upArrowSprite.anchor.y = 0.5;
		this._upArrowSprite.setFrame(sx + q, sy, p, q);
		this._upArrowSprite.move(w / 2, q + 2);
	};

	Window_Selectable.prototype.refreshCursor = function () {
		if (this._cursorAll) {
			this.refreshCursorForAll();
		} else if (this.index() >= 0) {
			const rect = this.itemRect(this.index());
			this.setCursorRect(rect.x + 10, rect.y, rect.width - 20, rect.height);
		} else {
			this.setCursorRect(0, 0, 0, 0);
		}
	};

	ColorManager.itemBackColor1 = function () {
		return "rgba(32, 32, 32, 0)";
	};

	ColorManager.itemBackColor2 = function () {
		return "rgba(0, 0, 0, 0)";
	};

	Window.prototype._makeCursorAlpha = function () {
		return this.contentsOpacity / 255;
	}

	Window_Help.prototype.refresh = function () {
		const rect = this.baseTextRect();
		this.contents.clear();
		this.drawText(this._text, rect.x, rect.y, rect.width, "center");
	};

	var idleTimer = 0;

	var _createHalfBodySprites = Sprite_Character.prototype.createHalfBodySprites;
	Sprite_Character.prototype.createHalfBodySprites = function () {
		_createHalfBodySprites.call(this);

		if (!$gamePlayer.isMoving()) {
			idleTimer++;
		} else {
			idleTimer = 0;
		}

		this._lowerBody.opacity = $gamePlayer.isDashing() && idleTimer < 3 ? 255 : 0;
	};

	Game_Map.prototype.bushDepth = function () {
		return 12;
	};

	$_$['DataManager.onLoad'] = DataManager.onLoad;
	DataManager.onLoad = function (object) {
		$_$['DataManager.onLoad'].apply(this, arguments);
		if (this.isMapObject(object)) {
			if ($dataMap) {
				const width = $dataMap.width;
				const height = $dataMap.height;
				let totallength = width * height;
				for (let i = 0; i <= totallength; i++) {
					const x = i % width;
					const y = Math.floor(i / width);
					const id = $dataMap.events.length;
					const region = $gameMap.regionId(x, y);
					if (region >= 1 && region <= 10) {
						$dataMap.events.push({
							id: id,
							name: "Animation Event",
							note: "",
							pages: [{
								conditions: {},
								directionFix: true,
								image: {
									characterIndex: 0,
									characterName: '',
									direction: 2,
									pattern: 1,
									tileId: 0
								},
								list: [
									{ code: 111, indent: 0, parameters: [12, "$gameMap.event(this.eventId()).x == $gamePlayer.x && $gameMap.event(this.eventId()).y == $gamePlayer.y && $gamePlayer.isMoving()"] },
									{ code: 212, indent: 1, parameters: [0, 121, true] },
									{ code: 0, indent: 1, parameters: [] },
									{ code: 412, indent: 0, parameters: [] },
									{ code: 0, indent: 0, parameters: [] },
								],
								moveFrequency: 0,
								moveRoute: [{ list: [{ code: 0, parameters: [] }], repeat: false, skippable: true, wait: false }],
								moveSpeed: 0,
								moveType: 0,
								priorityType: 0,
								stepAnime: false,
								trigger: 4,
								through: true,
							}],
							meta: {},
							x: x,
							y: y
						});
					}
					if (region >= 32 && region <= 34) {
						$dataMap.events.push({
							id: id,
							name: "Down Ridge Event",
							note: "",
							pages: [{
								conditions: {},
								directionFix: true,
								image: {
									characterIndex: 0,
									characterName: '',
									direction: 2,
									pattern: 1,
									tileId: 0
								},
								list: [
									{ code: 111, indent: 0, parameters: [12, "$gameMap.event(this.eventId()).x == $gamePlayer.x && $gameMap.event(this.eventId()).y == $gamePlayer.y && $gamePlayer.isMoving()"] },
									{ "code": 250, "indent": 1, "parameters": [{ "name": "Jump1", "volume": 90, "pitch": 100, "pan": 0 }] },
									{ "code": 205, "indent": 1, "parameters": [-1, { "list": [{ "code": 14, "parameters": [region == 32 ? -1 : (region == 34 ? 1 : 0), region == 33 ? 1 : 0], "indent": null }, { "code": 0 }], "repeat": false, "skippable": false, "wait": true }] },
									{ "code": 505, "indent": 1, "parameters": [{ "code": 14, "parameters": [0, 1], "indent": null }] },
									{ "code": 0, "indent": 1, "parameters": [] },
									{ code: 0, indent: 0, parameters: [] },
								],
								moveFrequency: 0,
								moveRoute: [{ list: [{ code: 0, parameters: [] }], repeat: false, skippable: true, wait: false }],
								moveSpeed: 0,
								moveType: 0,
								priorityType: 0,
								stepAnime: false,
								trigger: 4,
								through: true,
							}],
							meta: {},
							x: x,
							y: y
						});
					}
				};
			};
		};
	};

	Sprite_Button.prototype.updateOpacity = function () {
		this.opacity = 255;
	};

	const _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function () {
		_Scene_Menu_create.call(this);
		this._statusWindow.hide();
	};

	const _Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;
	Scene_Menu.prototype.commandPersonal = function () {
		_Scene_Menu_commandPersonal.call(this);
		this._statusWindow.show();
		this._goldWindow.hide();
	};
	const _Scene_Menu_commandFormation = Scene_Menu.prototype.commandFormation;
	Scene_Menu.prototype.commandFormation = function () {
		_Scene_Menu_commandFormation.call(this);
		this._statusWindow.show();
		this._goldWindow.hide();
	};
	const _Scene_Menu_onPersonalCancel = Scene_Menu.prototype.onPersonalCancel;
	Scene_Menu.prototype.onPersonalCancel = function () {
		_Scene_Menu_onPersonalCancel.call(this);
		this._statusWindow.hide();
		this._goldWindow.show();
	};
	const _Scene_Menu_onFormationCancel = Scene_Menu.prototype.onFormationCancel;
	Scene_Menu.prototype.onFormationCancel = function () {
		if (this._statusWindow.pendingIndex() == -1) {
			this._statusWindow.hide();
			this._goldWindow.show();
		}

		_Scene_Menu_onFormationCancel.call(this);
	};

	Scene_MenuBase.prototype.commandWindowHeight = function () {
		return this.calcWindowHeight(2, true);
	};

	Scene_MenuBase.prototype.commandWindowWidth = function () {
		return 444;
	};

	Scene_MenuBase.prototype.goldWindowHeight = function () {
		return this.calcWindowHeight(1, true);
	};

	Scene_Menu.prototype.goldWindowRect = function () {
		const ww = this.mainCommandWidth();
		const wh = this.calcWindowHeight(1, true);
		const wx = 0;
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_Gold.prototype.refresh = function () {
		const rect = this.itemLineRect(0);
		const x = rect.x;
		const y = rect.y;
		const width = rect.width;
		this.contents.clear();
		this.drawCurrencyValue(this.value(), this.currencyUnit(), x - 6, y, width);
	};

	Scene_Menu.prototype.commandWindowRect = function () {
		const ww = this.commandWindowWidth();
		const wh = this.commandWindowHeight();
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight / 2 - wh / 2;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Menu.prototype.statusWindowRect = function () {
		const ww = this.commandWindowWidth() + 8;
		const wh = 354;
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight / 2 - wh / 2;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_ItemBase.prototype.actorWindowRect = function () {
		const rect = Scene_Menu.prototype.statusWindowRect();
		rect.y = this.mainAreaBottom() - rect.height;
		return rect;
	};

	Scene_ItemBase.prototype.showActorWindow = function() {

		this._actorWindow.y = 0
    this._actorWindow.show();
    this._actorWindow.activate();
};

	Window_MenuCommand.prototype.maxCols = function () {
		return 3;
	};

	Window_MenuCommand.prototype.numVisibleRows = function () {
		return 2;
	};

	Window_ItemList.prototype.drawItemNumber = function (item, x, y, width) {
		if (this.needsNumber()) {
			this.drawText("x", x, y, width - this.textWidth("00"), "right");
			this.drawText($gameParty.numItems(item), x, y, width, "right");
		}
	};

	Window_ChoiceList.prototype.drawItem = function (index) {
		const rect = this.itemLineRect(index);
		this.drawText(this.commandName(index), rect.x + 10, rect.y, rect.width + 20);
	};
	Window_ChoiceList.prototype.windowWidth = function () {
		const width = this.maxChoiceWidth() + this.colSpacing() + this.padding * 2 + 20;
		return Math.min(width, Graphics.boxWidth);
	};
	Window_ChoiceList.prototype.windowY = function () {
		const messageY = this._messageWindow.y;
		if (messageY >= Graphics.boxHeight / 2) {
			return messageY - this.windowHeight() - 4;
		} else {
			return messageY + this._messageWindow.height + 4;
		}
	};

	Scene_MenuBase.prototype.initialize = function () {
		Scene_Base.prototype.initialize.call(this);
		this._handleKeyPress = (event) => {
			if (SceneManager._scene instanceof Scene_Skill) {
				const key = Input.keyMapper[event.keyCode];
				if (key === 'left') {
					this.previousActor(); 
					this._skillTypeWindow.deactivate();
					this._itemWindow.activate();
					this._itemWindow.forceSelect(0);
				} else if (key === 'right') {
					this.nextActor(); 
					this._skillTypeWindow.deactivate();
					this._itemWindow.activate();
					this._itemWindow.forceSelect(0);
				}
			}
		};
	};

	Scene_MenuBase.prototype.createPageButtons = function () {
		this._pageupButton = new Sprite_Button("pageup");
		this._pageupButton.x = 4;
		this._pageupButton.y = this.buttonY();
		const pageupRight = this._pageupButton.x + this._pageupButton.width;
		this._pagedownButton = new Sprite_Button("pagedown");
		this._pagedownButton.x = pageupRight + 4;
		this._pagedownButton.y = this.buttonY();
		this.addWindow(this._pageupButton);
		this.addWindow(this._pagedownButton);
		this._pageupButton.setClickHandler(this.previousActor.bind(this));
		this._pagedownButton.setClickHandler(this.nextActor.bind(this));

		document.addEventListener('keydown', this._handleKeyPress);
	};

	Scene_MenuBase.prototype.terminate = function () {
		document.removeEventListener('keydown', this._handleKeyPress);
	};

	Scene_MenuBase.prototype.helpWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = this.calcWindowHeight(1, false);
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight - wh;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_MenuCommand.prototype.makeCommandList = function () {
		const enabled = this.areMainCommandsEnabled();
		this.addCommand(TextManager.item, "item", enabled);
		this.addCommand(TextManager.skill, "skill", enabled);
		this.addCommand(TextManager.formation, "formation", enabled);
		this.addCommand(TextManager.options, "options", true);
		this.addCommand(TextManager.save, "save", true);
		this.addCommand(TextManager.gameEnd, "gameEnd", true);
	};

	Window_ItemCategory.prototype.makeCommandList = function () {
		this.addCommand(TextManager.item, "item");
		this.addCommand(TextManager.keyItem, "keyItem");
	};

	Window_ItemCategory.prototype.maxCols = function () {
		return 2;
	};

	Scene_Item.prototype.categoryWindowRect = function () {
		const wx = 0;
		const wy = 0;
		const ww = Graphics.boxWidth - 60;
		const wh = this.calcWindowHeight(1, true);
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Item.prototype.itemWindowRect = function () {
		const wx = 0;
		const wy = this._categoryWindow.y + this._categoryWindow.height + 4;
		const ww = Graphics.boxWidth;
		const wh = 216;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_ItemList.prototype.drawItem = function (index) {
		const item = this.itemAt(index);
		if (item) {
			const numberWidth = this.numberWidth();
			const rect = this.itemLineRect(index);

			this.changePaintOpacity(1);
			this.drawItemName(item, rect.x + 8, rect.y, rect.width - numberWidth);
			this.drawItemNumber(item, rect.x - 6, rect.y, rect.width);
		}
	};

	Sprite_Gauge.prototype.bitmapWidth = function () {
		if (SceneManager._scene instanceof Scene_Battle) {
			return 150;
		}

		if (SceneManager._scene.constructor.name == "Scene_PartyStorage") {
			return 160;
		}

		return 200
	};

	Sprite_Gauge.prototype.bitmapHeight = function () {
		return 64;
	};

	Sprite_Gauge.prototype.labelOutlineWidth = function () {
		return 0;
	};

	Sprite_Gauge.prototype.valueFontSize = function () {
		return $gameSystem.mainFontSize();
	};

	Sprite_Gauge.prototype.labelFontSize = function () {
		return $gameSystem.mainFontSize();
	};

	Sprite_Gauge.prototype.valueOutlineColor = function () {
		return "rgba(0, 0, 0, 0)";
	};

	Sprite_Gauge.prototype.valueOutlineWidth = function () {
		return 0;
	};

	Window_StatusBase.prototype.placeBasicGauges = function (actor, x, y) {
		this.placeGauge(actor, "hp", x, y + 2);
		this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight() - 2);
	};

	Window_StatusBase.prototype.placeGauge = function (actor, type, x, y) {
		const key = "actor%1-gauge-%2".format(actor.actorId(), type);
		const sprite = this.createInnerSprite(key, Sprite_Gauge);
		sprite.setup(actor, type);
		sprite.move(x, y);
		sprite.show();
	};

	Sprite_Gauge.prototype.gaugeHeight = function () {
		return 10;
	};

	Sprite_Gauge.prototype.drawValue = function () {
		const currentValue = this.currentValue();
		const currentMaxValue = this.currentMaxValue();
		const width = this.bitmapWidth();
		const height = this.textHeight();
		this.setupValueFont();
		this.bitmap.paintOpacity = this.labelOpacity();
		this.bitmap.drawText(currentValue + " / " + currentMaxValue, 0, 0, width, height, "right");
	};

	Sprite_Gauge.prototype.drawGaugeRect = function (x, y, width, height) {
		const rate = this.gaugeRate();
		const fillW = Math.floor((width - 4) * rate);
		const fillH = height - 4;
		const color0 = this.gaugeBackColor();
		const color1 = this.gaugeColor1();
		const color2 = this.gaugeColor2();
		this.bitmap.fillRect(x, y + 2, width - 2, height - 2, color0);
		this.bitmap.fillRect(x, y, 2, height - 2, color0);
		this.bitmap.fillRect(x + width - 2, y + 6, 2, height - 6, color0);
		this.bitmap.fillRect(x + 2, y + 2, fillW, fillH, color2);
		this.bitmap.fillRect(x + 2, y + 2, fillW, 2, color1);
	};

	ColorManager.hpGaugeColor1 = function () {
		return this.textColor(3);
	};

	ColorManager.hpGaugeColor2 = function () {
		return this.textColor(11);
	};

	Window_Options.prototype.drawItem = function (index) {
		const title = this.commandName(index);
		const status = this.statusText(index);
		const rect = this.itemLineRect(index);
		const statusWidth = this.statusWidth();
		const titleWidth = rect.width - statusWidth;
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(title, rect.x + 10, rect.y, titleWidth, "left");
		this.drawText(status, rect.x + titleWidth - 6, rect.y, statusWidth, "right");
	};

	Scene_Skill.prototype.statusParamsHeight = function () {
		return this.calcWindowHeight(6, false);
	};

	Scene_Skill.prototype.create = function () {
		Scene_ItemBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createSkillTypeWindow();
		this._skillTypeWindow.y = Graphics.boxHeight + 20;
		this.createStatusWindow();
		this.createItemWindow();
		this.createActorWindow();

		this._skillTypeWindow.deactivate();
		this._itemWindow.activate();
		this._itemWindow.forceSelect(0);
	};

	Scene_Skill.prototype.onItemCancel = function () {
		this._itemWindow.deselect();
		this.popScene();
	};

	Window_Selectable.prototype.processOk = function () {
		if (this.isCurrentItemEnabled()) {
			this.playOkSound();
			this.updateInputData();
			this.deactivate();
			this.callOkHandler();
		} else {
			this.playBuzzerSound();
		}
	};

	Scene_Skill.prototype.helpWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = this.calcWindowHeight(1, false);
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight - wh;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Skill.prototype.itemWindowRect = function () {
		const ww = Graphics.boxWidth / 2;
		const wh = this.statusParamsHeight() - 2;
		const wx = Graphics.boxWidth / 2 - 24
		const wy = Graphics.boxHeight / 2 - wh / 2 - 5;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Skill.prototype.createItemWindow = function () {
		const rect = this.itemWindowRect();
		this._itemWindow = new Window_SkillList(rect);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
		this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
		this._skillTypeWindow.setSkillWindow(this._itemWindow);
		this.addWindow(this._itemWindow);
	};

	Scene_Skill.prototype.statusWindowRect = function () {
		const ww = this.statusParamsHeight() + 24;
		const wh = this.statusParamsHeight() - 2;
		const wx = 24;
		const wy = Graphics.boxHeight / 2 - wh / 2 - 5;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_SkillList.prototype.maxCols = function () {
		return SceneManager._scene instanceof Scene_Battle ? 2 : 1;
	};

	Window_SkillList.prototype.isCurrentItemEnabled = function () {
		return this.isEnabled(this._data[this.index()]);
	};

	Window_SkillList.prototype.drawItem = function (index) {
		const skill = this.itemAt(index);
		if (skill) {
			const costWidth = this.costWidth();
			const rect = this.itemLineRect(index);

			this.drawItemName(skill, rect.x + 10, rect.y, rect.width - costWidth);
			this.drawSkillCost(skill, rect.x, rect.y, rect.width - 6);

		}
	};

	Window_SkillStatus.prototype.drawExpInfo = function (x, y) {
		const lineHeight = this.lineHeight();
		const expTotal = TextManager.expTotal.format(TextManager.exp);
		const expNext = TextManager.expNext.format(TextManager.level);
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(expTotal, x - 8, y + 2 + lineHeight * 0, 270);
		this.drawText(this.expCurrValue() + " / " + this.expNextValue(), x - 8, y + 2, 220 - 36, "right");
		this.resetTextColor();
	};

	Window_SkillStatus.prototype.expCurrValue = function () {
		if (this._actor.isMaxLevel()) {
			return "-------";
		} else {
			return this._actor.currentExp();
		}
	};

	Window_SkillStatus.prototype.expNextValue = function () {
		if (this._actor.isMaxLevel()) {
			return "-------";
		} else {
			return this._actor.nextLevelExp();
		}
	};

	Window_SkillStatus.prototype.refresh = function () {
		Window_StatusBase.prototype.refresh.call(this);
		if (this._actor) {
			const rect = this.itemLineRect(0);
			this.drawActorFace(this._actor, rect.x + 32, rect.y + 20, 144, 144);
			this.drawActorSimpleStatus(this._actor, rect.x + 36, rect.y);
			this.drawStatItem(0);
			this.drawStatItem(1);
			this.drawStatItem(2);
			this.drawStatItem(3);
			this.drawStatItem(4);
			this.drawStatItem(5);
			this.drawExpInfo(rect.x + 36, rect.y + 4);
			this.placeStateIcon(this._actor, rect.x + 8, rect.y + 16);
		}
	};

	Window_StatusBase.prototype.drawActorSimpleStatus = function (actor, x, y) {
		const lineHeight = this.lineHeight();
		const x2 = x + 180;
		this.drawActorName(actor, x - 8, y - 12);
		this.drawActorLevel(actor, x + 164 - 36, y - 12);

		this.placeBasicGauges(actor, x + 2 - 36, y + this.innerHeight - 52);
	};

	Window_SkillStatus.prototype.drawStatItem = function (index) {
		const rect = this.itemLineRect(index);
		const paramId = index + 2;
		const name = TextManager.param(paramId);
		const value = this._actor.param(paramId);
		const color = index % 2 ? ColorManager.textColor(21) : ColorManager.textColor(5);

		this.changeTextColor(color);
		this.drawText(name, rect.x - 8, rect.y - (index * 24) + 36, 160);

		this.drawText(value, rect.x + 152, rect.y - (index * 24) + 36, 60, "right");
	};

	Window_MenuStatus.prototype.maxCols = function () {
		return 1;
	};

	Window_MenuStatus.prototype.numVisibleRows = function () {
		return 6;
	};

	Window_MenuStatus.prototype.drawItemImage = function (index) {
		const actor = this.actor(index);
		const rect = this.itemRectWithPadding(index);
		const w = 32;
		const h = 32;
		const lineHeight = this.lineHeight();

		this.drawActorCharacter(actor, rect.x + 34, rect.y + 46, w, h);

	};

	Window_StatusBase.prototype.drawActorLevel = function (actor, x, y) {
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(TextManager.levelA, x, y, 48);
		this.resetTextColor();
		this.drawText(actor.level, x + 12, y, 36, "right");
	};

	Window_MenuStatus.prototype.drawItemStatus = function (index) {
		const actor = this.actor(index);
		const rect = this.itemRectWithPadding(index);
		const x = rect.x;
		const y = rect.y;
		const width = rect.width;
		const bottom = y + rect.height;
		const lineHeight = this.lineHeight();

		this.drawActorName(actor, x - 9999, y - 4, width); 

		this.drawActorName(actor, x + 66, y - 4, width);
		this.drawActorLevel(actor, x + 66, y + 16, width);

		this.placeBasicGauges(actor, x + 192, y - 1, width);

	};

	Scene_File.prototype.helpWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = this.calcWindowHeight(1, false);
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight - wh;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_File.prototype.listWindowRect = function () {
		const ww = Graphics.boxWidth - 112;
		const wh = 360 - this._helpWindow.height - 16;
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight / 2 - wh / 2 - 32;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_SavefileList.prototype.numVisibleRows = function () {
		return 5;
	};

	Window_SavefileList.prototype.drawTitle = function (savefileId, x, y) {
		if (savefileId === 0) {
			this.drawText(TextManager.autosave, x + 10, y, 180);
		} else {
			this.drawText(TextManager.file + " " + savefileId, x + 10, y, 180);
		}
	};

	Window_SavefileList.prototype.drawContents = function (info, rect) {
		const bottom = rect.y + rect.height;

		this.drawPartyCharacters(info, rect.x + 110, bottom - 6);

		const lineHeight = this.lineHeight();
		const y2 = bottom - lineHeight - 4;
		if (y2 >= lineHeight) {
			this.drawPlaytime(info, rect.x - 6, y2, rect.width);
		}
	};

	Window_SavefileList.prototype.drawPartyCharacters = function (info, x, y) {

		if (info.characters) {
			let characterX = x;
			for (const data of info.characters) {
				this.drawCharacter(data[0], data[1], characterX, y);
				characterX += 48;
			}
		}
	};

	Game_Party.prototype.charactersForSavefile = function () {
		return this.allMembers().map(actor => [
			actor.characterName(),
			actor.characterIndex()
		]);
	};

	DataManager.extractSaveContents = function (contents) {
		$gameSystem = contents.system;
		$gameScreen = contents.screen;
		$gameTimer = contents.timer;
		$gameSwitches = contents.switches;
		$gameVariables = contents.variables;
		$gameSelfSwitches = contents.selfSwitches;
		$gameActors = contents.actors;
		$gameParty = contents.party;
		$gameMap = contents.map;
		$gamePlayer = contents.player;
		$dataActors = contents.dataactors;
	};

	DataManager.makeSaveContents = function () {

		const contents = {};
		contents.system = $gameSystem;
		contents.screen = $gameScreen;
		contents.timer = $gameTimer;
		contents.switches = $gameSwitches;
		contents.variables = $gameVariables;
		contents.selfSwitches = $gameSelfSwitches;
		contents.actors = $gameActors;
		contents.party = $gameParty;
		contents.map = $gameMap;
		contents.player = $gamePlayer;
		contents.dataactors = $dataActors;
		return contents;
	};

	Window_ShopStatus.prototype.drawPossession = function (x, y) {
		const width = this.innerWidth - this.itemPadding() - x;
		const possessionWidth = this.textWidth("0000");
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(TextManager.possession, x, y, width - possessionWidth);
		this.resetTextColor();
		this.drawText($gameParty.numItems(this._item), x - 8, y + 22, width, "right");
	};

	Scene_Shop.prototype.createCommandWindow = function () {
		const rect = this.commandWindowRect();
		this._commandWindow = new Window_ShopCommand(rect);
		this._commandWindow.setPurchaseOnly(this._purchaseOnly);
		this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
		this._commandWindow.setHandler("sell", this.commandSell.bind(this));
		this._commandWindow.setHandler("cancel", this.popScene.bind(this));
		this.addWindow(this._commandWindow);
		this._helpWindow.hide();
	};

	Scene_Shop.prototype.commandSell = function () {
		this._dummyWindow.hide();
		this._sellWindow.show();
		this._sellWindow.deselect();
		this._sellWindow.refresh();
		this.onCategoryOk();
		this._categoryWindow.hide();
	};

	Scene_Shop.prototype.activateBuyWindow = function () {
		this._buyWindow.setMoney(this.money());
		this._buyWindow.show();
		this._buyWindow.activate();
		this._statusWindow.show();
		this._helpWindow.show();
	};

	Scene_Shop.prototype.activateSellWindow = function () {
		if (this._categoryWindow.needsSelection()) {
			this._categoryWindow.show();
		}
		this._sellWindow.refresh();
		this._sellWindow.show();
		this._sellWindow.activate();
		this._statusWindow.hide();
		this._helpWindow.show();
	};

	Scene_Shop.prototype.onBuyCancel = function () {
		this._commandWindow.activate();
		this._dummyWindow.show();
		this._buyWindow.hide();
		this._statusWindow.hide();
		this._statusWindow.setItem(null);
		this._helpWindow.clear();
		this._helpWindow.hide();
	};

	Scene_Shop.prototype.onSellCancel = function () {
		this._sellWindow.deselect();
		this._statusWindow.setItem(null);
		this._helpWindow.clear();
		this.onCategoryCancel();
		this._helpWindow.hide();
	};

	Scene_Shop.prototype.createDummyWindow = function () {
		const rect = this.dummyWindowRect();
		this._dummyWindow = new Window_Base(rect);
		this._dummyWindow.opacity = 0;
		this.addWindow(this._dummyWindow);
	};

	Scene_Shop.prototype.statusWidth = function () {
		return 240;
	};

	Scene_Shop.prototype.goldWindowRect = function () {
		const ww = this.mainCommandWidth();
		const wh = this.calcWindowHeight(1, true);
		const wx = 0;
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Shop.prototype.commandWindowRect = function () {
		const wx = this._goldWindow.width + 4;
		const wy = 0;
		const ww = 332;
		const wh = this.calcWindowHeight(1, true);
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Shop.prototype.buyWindowRect = function () {
		const wx = 0;
		const wy = this._dummyWindow.y;
		const ww = Graphics.boxWidth - this.statusWidth();
		const wh = this._dummyWindow.height;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Shop.prototype.sellWindowRect = function () {
		const wx = 0;
		const wy = this._categoryWindow.height + 4;
		const ww = Graphics.boxWidth;
		const wh = 216;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Shop.prototype.statusWindowRect = function () {
		const ww = this.statusWidth() - 4;
		const wh = 80;
		const wx = Graphics.boxWidth - ww;
		const wy = this._dummyWindow.y;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Shop.prototype.dummyWindowRect = function () {
		const wx = 0;
		const wy = this._commandWindow.y + this._commandWindow.height + 4;
		const ww = Graphics.boxWidth;
		const wh = 216;
		return new Rectangle(wx, wy, ww, wh);
	};

	Window_ShopBuy.prototype.drawCurrencyValue = function (value, unit, x, y, width, enabled) {
		const unitWidth = Math.min(80, this.textWidth(unit));
		this.resetTextColor();
		if (!enabled) {
			this.changeTextColor("#ff0000");
		}
		this.drawText(value, x, y, width - unitWidth - 6, "right");
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
	};

	Window_ShopBuy.prototype.drawItem = function (index) {
		const item = this.itemAt(index);
		const price = this.price(item);
		const rect = this.itemLineRect(index);
		const priceWidth = this.priceWidth();
		const priceX = rect.x + rect.width - priceWidth;
		const nameWidth = rect.width - priceWidth;
		this.changePaintOpacity(true);
		this.drawItemName(item, rect.x + 8, rect.y, nameWidth);
		this.drawCurrencyValue(price, TextManager.currencyUnit, priceX - 8, rect.y, priceWidth, this.isEnabled(item));
		this.resetTextColor();
	};

	Window_ShopNumber.prototype.drawHorzLine = function () {
		const padding = this.itemPadding();
		const lineHeight = this.lineHeight();
		const itemY = this.itemNameY();
		const totalY = this.totalPriceY();
		const x = padding;
		const y = Math.floor((itemY + totalY + lineHeight) / 2);
		const width = this.innerWidth - padding * 2 - 8;
		this.drawRect(x, y, width, 5);
	};

	Window_ShopNumber.prototype.drawTotalPrice = function () {
		const padding = this.itemPadding();
		const total = this._price * this._number;
		const width = this.innerWidth - padding * 2;
		const y = this.totalPriceY();
		this.drawCurrencyValue(total, this._currencyUnit, 0, y, width);
	};

	Window_ShopNumber.prototype.itemNameY = function () {
		return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5) - 32;
	};

	Window_ShopNumber.prototype.totalPriceY = function () {
		return Math.floor(this.itemNameY() + this.lineHeight() * 2);
	};

	Window_ShopNumber.prototype.buttonY = function () {
		return Math.floor(this.totalPriceY() + this.lineHeight() * 2) - 24;
	};

	Window_ShopNumber.prototype.cursorWidth = function () {
		const padding = this.itemPadding();
		const digitWidth = this.textWidth("0");
		return this.maxDigits() * digitWidth + padding * 2 + 18;
	};

	Window_ShopNumber.prototype.drawNumber = function () {
		const x = this.cursorX() - 8;
		const y = this.itemNameY();
		const width = this.cursorWidth() - this.itemPadding();
		this.resetTextColor();
		this.drawText(this._number, x, y, width, "right");
	};

	Window_ShopNumber.prototype.cursorX = function () {
		const padding = this.itemPadding();
		return this.innerWidth - this.cursorWidth() - padding * 2 + 8;
	};

	Window_MapName.prototype.initialize = function (rect) {
		Window_Base.prototype.initialize.call(this, rect);
		this.opacity = 255;
		this.contentsOpacity = 255;
		this._showCount = 0;
		this.y = -64;
		this.refresh();
	};

	Window_MapName.prototype.updateFadeIn = function () {
		this.opacity = $gameMap.displayName() ? 255 : 0;
		this.contentsOpacity = $gameMap.displayName() ? 255 : 0;
		if (this.y < 4)
			this.y += 4;
	};

	Window_MapName.prototype.updateFadeOut = function () {
		if (this.y > -64)
			this.y -= 4;
	};

	Window_MapName.prototype.update = function () {
		Window_Base.prototype.update.call(this);
		if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
			this.updateFadeIn();
			this._showCount--;
		} else {
			this.updateFadeOut();
		}
	};

	Window_MapName.prototype.open = function () {
		this.refresh();
		this._showCount = 150;
	};

	Window_MapName.prototype.refresh = function () {
		this.contents.clear();
		if ($gameMap.displayName()) {
			const width = this.innerWidth;
			this.drawBackground(0, 0, width, this.lineHeight());
			this.drawText($gameMap.displayName(), 10, 0, width, "left");
		}

		Scene_Map.prototype.mapNameWindowRect = function () {
			const wx = 0;
			const wy = 0;

			const bitmap = new Bitmap(1, 1);
			bitmap.fontFace = $gameSystem.mainFontFace();
			bitmap.fontSize = $gameSystem.mainFontSize();
			const width = bitmap.measureTextWidth($gameMap.displayName()) + 56;

			const ww = width;
			const wh = this.calcWindowHeight(1, false);
			return new Rectangle(wx, wy, ww, wh);
		};
	};

	function Window_WithDrawDepositCommand() {
		this.initialize(...arguments);
	}

	Window_WithDrawDepositCommand.prototype = Object.create(Window_Command.prototype);
	Window_WithDrawDepositCommand.prototype.constructor = Window_WithDrawDepositCommand;

	Window_WithDrawDepositCommand.prototype.drawItem = function (index) {
		const rect = this.itemLineRect(index);
		const align = this.itemTextAlign();
		this.resetTextColor();
		if (!this.isCommandEnabled(index)) {
			this.changeTextColor(ColorManager.textColor(8));
		}
		this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
	};

	Window_WithDrawDepositCommand.prototype.makeCommandList = function () {
		this.addCommand('Store', 'deposit', $gameParty.members().length > 1);
		this.addCommand('Take', 'withdraw', $gameParty.members().length < 6);
		this.addCommand('Cancel', 'cancel');
	};

	function Window_DepositPartyCommand() {
		this.initialize(...arguments);
	}

	Window_DepositPartyCommand.prototype = Object.create(Window_HorzCommand.prototype);
	Window_DepositPartyCommand.prototype.constructor = Window_DepositPartyCommand;

	Window_DepositPartyCommand.prototype.maxCols = function () {
		return 6;
	};

	Window_DepositPartyCommand.prototype.lineHeight = function () {
		return 40;
	};

	Window_DepositPartyCommand.prototype.makeCommandList = function () {
		var i = 0;
		for (const member of $gameParty.members()) {
			this.addCommand(member.name(), "party" + i);
			i++;
		}
	};

	Window_DepositPartyCommand.prototype.drawItem = function (index) {
		const rect = this.itemLineRect(index);
		const actor = $gameParty.members()[index];
		this.drawCharacter(actor.characterName(), actor.characterIndex(), rect.x + 26, rect.y + 40);
	};

	Window_DepositPartyCommand.prototype.select = function (index) {
		Window_Selectable.prototype.select.call(this, index);
		selectedPartyMember = $gameParty.members()[index];
	};

	function Window_WithdrawStorageCommand() {
		this.initialize(...arguments);
	}

	Window_WithdrawStorageCommand.prototype = Object.create(Window_Command.prototype);
	Window_WithdrawStorageCommand.prototype.constructor = Window_WithdrawStorageCommand;

	Window_WithdrawStorageCommand.prototype.maxCols = function () {
		return 4;
	};

	Window_WithdrawStorageCommand.prototype.lineHeight = function () {
		return 40;
	};

	Window_WithdrawStorageCommand.prototype.makeCommandList = function () {
		for (var i = storageStartPointInActorData; i < $dataActors.length; i++) {
			if (!$gameParty.members().some(actor => actor.actorId() === i)) {
				this.addCommand(i, "storage");
			}
		}
	};

	Window_WithdrawStorageCommand.prototype.drawItem = function (index) {
		const rect = this.itemLineRect(index);
		const actor = $dataActors[this.commandName(index)];

		this.drawCharacter(actor.characterName, actor.characterIndex, rect.x + 26, rect.y + 40);
	};

	Window_WithdrawStorageCommand.prototype.select = function (index) {
		Window_Selectable.prototype.select.call(this, index);
		if (index >= 0 && index < this._list.length) {
			const i = parseInt(this.commandName(index));
			const actor = $dataActors[i];
			selectedPartyMember = new Game_Actor(actor.id);
		}
	};

	function Window_StorageStatus() {
		this.initialize(...arguments);
	}

	Window_StorageStatus.prototype = Object.create(Window_StatusBase.prototype);
	Window_StorageStatus.prototype.constructor = Window_StorageStatus;

	Window_StorageStatus.prototype.initialize = function (rect) {
		Window_StatusBase.prototype.initialize.call(this, rect);
		this._actor = null;
	};

	Window_StorageStatus.prototype.setActor = function (actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	};

	Window_StorageStatus.prototype.refresh = function () {
		Window_StatusBase.prototype.refresh.call(this);
		if (this._actor) {
			const x = this.colSpacing() / 2;
			const h = this.innerHeight;
			const y = h / 2 - this.lineHeight() * 1.5;
			this.drawActorFace(this._actor, x + 8, 0, 144, h);
			this.drawActorSimpleStatus(this._actor, x + 180, y);
		}
	};

	Window_StorageStatus.prototype.drawActorSimpleStatus = function (actor, x, y) {
		const lineHeight = this.lineHeight();
		const x2 = x + 180;
		this.drawActorName(actor, 6, -12);
		this.drawActorLevel(actor, 6, 6);
		this.placeBasicGauges(actor, 8, this.innerHeight - 52);
	};

	function Scene_PartyStorage() {
		this.initialize(...arguments);
	}

	Scene_PartyStorage.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_PartyStorage.prototype.constructor = Scene_PartyStorage;

	Scene_PartyStorage.prototype.initialize = function () {
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_PartyStorage.prototype.create = function () {
		Scene_MenuBase.prototype.create.call(this);

		this.createSelectWindow();
		this.createPartyWindow();
		this.createActorWindow();
		this.createStatusWindow();
		selectedPartyMember = null;
	};

	Scene_PartyStorage.prototype.createSelectWindow = function () {
		this.selectWindow = new Window_WithDrawDepositCommand(new Rectangle(4, 196, 142, 156));
		this.selectWindow.setHandler('deposit', this.onDeposit.bind(this));
		this.selectWindow.setHandler('withdraw', this.onWithdraw.bind(this));
		this.selectWindow.setHandler('cancel', this.popScene.bind(this));

		this.addWindow(this.selectWindow);
		this.selectWindow.activate();
	};

	Scene_PartyStorage.prototype.createPartyWindow = function () {
		this.partyWindow = new Window_DepositPartyCommand(new Rectangle(150, Graphics.boxHeight - 72, 480, 72));
		this.partyWindow.setHandler('party0', () => this.depositPartyMember(0));
		this.partyWindow.setHandler('party1', () => this.depositPartyMember(1));
		this.partyWindow.setHandler('party2', () => this.depositPartyMember(2));
		this.partyWindow.setHandler('party3', () => this.depositPartyMember(3));
		this.partyWindow.setHandler('party4', () => this.depositPartyMember(4));
		this.partyWindow.setHandler('party5', () => this.depositPartyMember(5));
		this.partyWindow.setHandler('cancel', this.onPartyCancel.bind(this));
		this.partyWindow.deactivate();
		this.partyWindow.deselect();
		this.addWindow(this.partyWindow);
	};

	Scene_PartyStorage.prototype.createActorWindow = function () {
		this.actorWindow = new Window_WithdrawStorageCommand(new Rectangle(216, 0, 328, 276));
		this.actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
		this.actorWindow.setHandler('storage', this.withdrawStorageMember.bind(this));
		this.actorWindow.deactivate();
		this.actorWindow.deselect();
		this.addWindow(this.actorWindow);
	};

	Scene_PartyStorage.prototype.createStatusWindow = function () {
		this.statusWindow = new Window_StorageStatus(new Rectangle(4, 0, 208, 192));
		this.addWindow(this.statusWindow);
	};

	Scene_PartyStorage.prototype.withdrawStorageMember = function () {
		if ($gameParty.members().length < 6) {
			$gameParty.addActor(selectedPartyMember.actorId());
			this.actorWindow.activate();
			if ($gameParty.members().length == 6) {
				this.onActorCancel();
				SoundManager.playBuzzer();
			}
		} else {
			this.onActorCancel();
			SoundManager.playBuzzer();
		}
	};

	Scene_PartyStorage.prototype.depositPartyMember = function (index) {
		const actorId = $gameParty.members()[index].actorId();
		$gameParty.removeActor(actorId);
		if ($gameParty.members().length > 1) {
			this.partyWindow.activate();
			this.partyWindow.select(index > $gameParty.members().length - 1 ? index - 1 : index);
		} else {
			this.onPartyCancel();
			SoundManager.playBuzzer();
		}
	};

	Scene_PartyStorage.prototype.onDeposit = function () {
		this.partyWindow.activate();
		this.partyWindow.select(0);
		this.actorWindow.deactivate();
	};

	Scene_PartyStorage.prototype.onWithdraw = function () {
		this.partyWindow.deactivate();
		this.actorWindow.select(0);
		this.actorWindow.activate();
	};

	Scene_PartyStorage.prototype.onPartyCancel = function () {
		this.partyWindow.deactivate();
		this.selectWindow.activate();
		this.partyWindow.deselect();
		selectedPartyMember = null;
	};

	Scene_PartyStorage.prototype.onActorCancel = function () {
		this.actorWindow.deactivate();
		this.selectWindow.activate();
		this.actorWindow.deselect();
		selectedPartyMember = null;
	};

	Scene_PartyStorage.prototype.update = function () {
		Scene_Base.prototype.update.call(this);
		this.selectWindow.refresh();
		this.partyWindow.refresh();
		this.actorWindow.refresh();
		this.statusWindow.refresh();
		this.statusWindow.setActor(selectedPartyMember);
	};

	Scene_PartyStorage.prototype.checkInput = function () {
		if (Input.isTriggered('cancel')) {
			SceneManager.pop();
		}
	};

	Sprite_Battleback.prototype.adjustPosition = function () {
		this.width = Graphics.width;
		this.height = Graphics.height;
		this.x = (Graphics.width - this.width) / 2;
		if ($gameSystem.isSideView()) {
			this.y = Graphics.height - this.height;
		} else {
			this.y = 0;
		}
		const ratioX = this.width / this.bitmap.width;
		const ratioY = this.height / this.bitmap.height;
		const scale = Math.max(ratioX, ratioY, 1.0);
		this.scale.x = scale;
		this.scale.y = scale;
	};

	BattleManager.isAllMembersDead = function () {
		return $gameParty.allMembers().every(member => member.isDead());
	};

	BattleManager.processSwitch = function (index = -1) {
		if (index >= 0) {
			$gameMessage.add(`Come back ${$gameParty.allMembers()[0].name()}!`);
		} else {
			$gameMessage.add(`${$gameParty.allMembers()[0].name()} has fallen!`);
		}
		const interval = setInterval(() => {

			if (!$gameMessage.hasText()) {
				clearInterval(interval); 
				SceneManager._scene._spriteset._actorSprites[0].startMove(365, 0, 30);
				setTimeout(() => {
					const party = $gameParty.allMembers();
					let newBattleMember = null;
					for (const member of party) {
						if (!member.isDead() && !member.isBattleMember()) {
							newBattleMember = member;
							$gameMessage.add(`Go ${newBattleMember.name()}!`);
							break;
						}
					}
					if (newBattleMember) {
						const nonBattleIndex = party.indexOf(newBattleMember);
						$gameParty.swapOrder(0, index > 0 ? index : nonBattleIndex);
						updateBattleStatus();
					}
					SceneManager._scene._spriteset._actorSprites[0].startMove(0, 0, 30);
				}, 500);
			}
		}, 5);
	};

	BattleManager.checkBattleEnd = function () {
		if (this._phase) {
			if ($gameParty.isEscaped()) {
				this.processPartyEscape();
				return true;
			} else if (this.isAllMembersDead()) {
				this.processDefeat();
				return true;
			} else if ($gameParty.isAllDead()) {
				this.processSwitch();
				return true;
			} else if ($gameTroop.isAllDead()) {
				this.processVictory();
				return true;
			}
		}
		return false;
	};

	Game_Party.prototype.maxBattleMembers = function () {
		return 1;
	};

	function updateBattleStatus() {

		const scene = SceneManager._scene;
		if (scene && scene instanceof Scene_Battle) {
			const statusWindow = scene._statusWindow;
			if (statusWindow) {
				statusWindow.refresh();
			}
		}
	}

	ColorManager.crisisColor = function () {
		return this.textColor(0);
	};

	const _Window_BattleStatus_initialize = Window_BattleStatus.prototype.initialize;
	Window_BattleStatus.prototype.initialize = function (x, y) {
		_Window_BattleStatus_initialize.call(this, x, y);
		this.opacity = 255; 
		this.backOpacity = 0; 
		this.refresh();
	};
	Window_BattleStatus.prototype.updateBackground = function () {

		this.setBackgroundType(0); 
	};
	Window_BattleStatus.prototype.drawItemImage = function (index) {

	};
	Sprite_Enemy.prototype.createStateIconSprite = function () {

	};
	Sprite_Enemy.prototype.updateStateSprite = function () {

	};
	Sprite_Name.prototype.bitmapWidth = function () {
		return 256;
	};
	Window_BattleStatus.prototype.drawItemStatus = function (index) {
		const actor = this.actor(index);
		const rect = this.itemRectWithPadding(index);
		var nameX = 0;
		var nameY = Graphics.boxHeight - 192;
		var stateIconX = 16;
		var stateIconY = Graphics.boxHeight - 206;
		var basicGaugesX = 0;
		var basicGaugesY = Graphics.boxHeight - 158;

		if (index != 0) {
			nameX += rect.width - 8;
			nameY = 28;
			basicGaugesX = rect.width - 8;
			basicGaugesY = 62;
			stateIconX = rect.width + 16 - 8;
			stateIconY = 14
		}

		this.placeActorName(actor, nameX + 4, nameY, 256, "left");
		const enemyInfo = JSON.parse($gameTroop.members()[0].enemy().note);
		var level = actor._level ?? enemyInfo.level;
		this.drawText("Lv " + level, nameX + 4, nameY + 12);
		this.placeStateIcon(actor, stateIconX + 4, stateIconY);
		this.placeBasicGauges(actor, basicGaugesX + 4, basicGaugesY);
	};
	const _Window_BattleStatus_update = Window_BattleStatus.prototype.update
	Window_BattleStatus.prototype.update = function () {
		_Window_BattleStatus_update.call(this);

		this.x = 0; 
		this.y = 0; 

	};

	Scene_Battle.prototype.hideSubInputWindows = function () {
		this._actorWindow.deactivate();
		this._enemyWindow.deactivate();
		this._skillWindow.deactivate();
		this._itemWindow.deactivate();
		this._enemyWindow.hide();
		this._skillWindow.hide();
		this._itemWindow.hide();
		this._actorWindow.hide();
	};

	Scene_Battle.prototype.statusWindowRect = function () {
		const ww = Graphics.boxWidth * 2 - 270;
		const wh = Graphics.boxHeight;
		const wx = 0;
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	};
	Scene_Battle.prototype.createStatusWindow = function () {
		const rect = this.statusWindowRect();
		const statusWindow = new Window_BattleStatus(rect);
		this.addWindow(statusWindow);
		this._statusWindow = statusWindow;
	};
	Window_BattleStatus.prototype.actor = function (index) {
		if (index != 0) {
			$enemy = $gameTroop.members()[0];
			$enemy.actorId = () => 9999;
			return $enemy;
		}
		return $gameParty.battleMembers()[0];
	};
	Window_BattleStatus.prototype.maxCols = function () {
		return 2;
	};
	Window_StatusBase.prototype.drawActorName = function (actor, x, y, width) {
		width = width || 168;
		this.changeTextColor(ColorManager.hpColor(actor));
		this.drawText(actor.name(), x, y, width);
	};

	Window_BattleStatus.prototype.refresh = function () {
		Window_StatusBase.prototype.refresh.call(this);
		this.paint();
		this.drawEnemyMembers(); 
	};

	Window_BattleStatus.prototype.drawEnemyMembers = function () {
		const enemies = $gameTroop.members();
		for (let i = 0; i < enemies.length; i++) {
			const enemy = enemies[i];
			const y = this.lineHeight() * (i + $gameParty.members().length); 
			this.drawItem(1);
		}
	};

	Scene_Battle.prototype.createFormationWindow = function () {
		const rect = this.itemWindowRect();
		this._partyWindow = new Window_PartyMemberSelection(rect);

		this._partyWindow.setHandler("ok", this.onMemberOk.bind(this));
		this._partyWindow.setHandler("cancel", this.onMemberCancel.bind(this));
		this.addWindow(this._partyWindow);
		this._partyWindow.hide();
		this._partyWindow.deactivate();
	};

	Scene_Battle.prototype.onMemberOk = function () {
		const selectedMember = this._partyWindow.index();

		if ($gameParty.allMembers()[selectedMember].hp > 0) {
			this._partyWindow.playOkSound();

			BattleManager.processSwitch(selectedMember);

			this._partyWindow.hide();
			this._partyWindow.deactivate();
			this.changeInputWindow();
			this._actorCommandWindow.select(1);

			this.selectNextCommand(); 
		} else {
			this._partyWindow.playBuzzerSound();
			this._partyWindow.refresh();
			this._partyWindow.show();
			this._partyWindow.activate();

			this._actorCommandWindow.hide();
			return;
		}
	}

	Scene_Battle.prototype.onMemberCancel = function () {
		this._partyWindow.hide();
		this._partyWindow.deactivate();
		this.changeInputWindow();
		this._actorCommandWindow.select(1);
	};

	Scene_Battle.prototype.createAllWindows = function () {

		const party = $gameParty.allMembers();
		if (party[0].hp == 0) {
			let newBattleMember = null;
			for (const member of party) {
				if (!member.isDead() && !member.isBattleMember()) {
					newBattleMember = member;
					break;
				}
			}
			if (newBattleMember) {
				const nonBattleIndex = party.indexOf(newBattleMember);
				$gameParty.swapOrder(0, nonBattleIndex);
			}
		}

		this.createLogWindow();
		this.createStatusWindow();
		this.createPartyCommandWindow();
		this.createActorCommandWindow();
		this.createHelpWindow();
		this.createSkillWindow();
		this.createItemWindow();
		this.createFormationWindow();
		this.createActorWindow();
		this.createEnemyWindow();
		this._logWindow.y -= 300;

		Scene_Message.prototype.createAllWindows.call(this);
	};

	function Window_PartyMemberSelection() {
		this.initialize(...arguments);
	}

	Window_PartyMemberSelection.prototype = Object.create(Window_StatusBase.prototype);
	Window_PartyMemberSelection.prototype.constructor = Window_PartyMemberSelection;

	Window_PartyMemberSelection.prototype.initialize = function () {
		const width = 396; 
		const height = 354;
		const x = (Graphics.boxWidth - width) / 2;
		const y = (Graphics.boxHeight - height) / 2;
		const rect = new Rectangle(x, y, width, height);
		Window_StatusBase.prototype.initialize.call(this, rect);
		this.refresh();
		this.select(0);
		this.activate();
	};

	Window_PartyMemberSelection.prototype.lineHeight = function () {
		return 47; 
	};

	Window_PartyMemberSelection.prototype.numVisibleRows = function () {
		return 6; 

	};

	Window_PartyMemberSelection.prototype.refresh = function () {
		this.contents.clear();
		const members = this.members();
		members.forEach((member, index) => {

			this.drawItem(index);
		});
	};

	Window_PartyMemberSelection.prototype.drawItem = function (index) {
		const member = this.members()[index];
		if (member) {
			this.changeTextColor(ColorManager.textColor(0));
			if (member.hp === 0) {
				this.changeTextColor("#ff0000");
			}

			const actor = member;
			const rect = this.itemRectWithPadding(index);
			const x = rect.x;
			const y = rect.y;
			const width = rect.width;

			this.drawCharacter(member.characterName(), member.characterIndex(), x + 32, y + 46);

			this.drawActorName(actor, x + 66, y - 8, width);
			this.drawActorLevel(actor, x + 66, y + 12, width);

			this.placeBasicGauges(actor, x + 192, y - 2, width);

		}
	};

	Window_PartyMemberSelection.prototype.members = function () {
		return $gameParty.allMembers();
	};

	Window_PartyMemberSelection.prototype.maxItems = function () {
		return this.members().length;
	};

	Window_PartyMemberSelection.prototype.item = function () {
		return this.members()[this.index()];
	};

	Scene_Battle.prototype.isAnyInputWindowActive = function () {
		return (
			this._partyCommandWindow.active ||
			this._actorCommandWindow.active ||
			this._skillWindow.active ||
			this._itemWindow.active ||
			this._actorWindow.active ||
			this._enemyWindow.active ||
			this._partyWindow.active
		);
	};

	Scene_Battle.prototype.createActorCommandWindow = function () {
		const rect = this.actorCommandWindowRect();
		const commandWindow = new Window_ActorCommand(rect);
		commandWindow.y = Graphics.boxHeight - commandWindow.height;
		commandWindow.setHandler("attack", this.commandAttack.bind(this));
		commandWindow.setHandler("skill", this.commandSkill.bind(this));
		commandWindow.setHandler("guard", this.commandGuard.bind(this));
		commandWindow.setHandler("item", this.commandItem.bind(this));
		commandWindow.setHandler("cancel", this.commandCancel.bind(this));
		commandWindow.setHandler("escape", this.commandEscape.bind(this));
		commandWindow.setHandler("party", this.commandParty.bind(this));
		this.addWindow(commandWindow);
		this._actorCommandWindow = commandWindow;
	};

	Scene_Battle.prototype.commandParty = function () {

		this._partyWindow.refresh();
		this._partyWindow.show();
		this._partyWindow.activate();

		this._actorCommandWindow.hide();

	};

	Scene_Battle.prototype.commandSkill = function () {
		this._skillWindow.setActor(BattleManager.actor());
		this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
		this._skillWindow.refresh();
		this._skillWindow.show();
		this._skillWindow.activate();

		this._actorCommandWindow.hide();
	};

	Scene_Battle.prototype.commandItem = function () {
		this._itemWindow.refresh();
		this._itemWindow.show();
		this._itemWindow.activate();

		this._actorCommandWindow.hide();
	};

	Window_ActorCommand.prototype.makeCommandList = function () {
		if (this._actor) {
			this.addSkillCommands();
			this.addCommand("Switch", "party", true);
			this.addItemCommand();
			this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
		}
	};

	Scene_Battle.prototype.actorCommandWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = Graphics.boxHeight;
		const wx = 0;
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	};
	const _Window_ActorCommand_initialize = Window_ActorCommand.prototype.initialize;
	Window_ActorCommand.prototype.initialize = function (actor) {
		_Window_ActorCommand_initialize.call(this, actor);
		this.width = 490; 
		this.height = this.fittingHeight(this.numVisibleRows()); 
		this.x = Graphics.boxWidth / 2 - this.width / 2 
		this.refresh();
	};

	Window_PartyCommand.prototype.makeCommandList = function () {
		this.addCommand(TextManager.fight, "fight");
	};

	const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
	Scene_Battle.prototype.startPartyCommandSelection = function () {
		_Scene_Battle_startPartyCommandSelection.call(this);
		this.selectNextCommand();
	};

	Window_ActorCommand.prototype.maxCols = function () {
		return 4;
	};

	Window_ActorCommand.prototype.numVisibleRows = function () {
		return 1;
	};

	Window_ActorCommand.prototype.addSkillCommands = function () {
		const skillTypes = this._actor.skillTypes();
		for (const stypeId of skillTypes) {
			const name = $dataSystem.skillTypes[stypeId];
			this.addCommand(TextManager.fight, "skill", true, stypeId);
		}
	};

	BattleManager.displayEscapeSuccessMessage = function () {
		$gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
	};

	BattleManager.displayEscapeFailureMessage = function () {
		$gameMessage.add(TextManager.escapeFailure.format($gameParty.name()));
	};

	BattleManager.processEscape = function () {
		$gameParty.performEscape();
		const success = this._preemptive || Math.random() < this._escapeRatio;
		if (success) {
			SoundManager.playEscape();
			this.onEscapeSuccess();
		} else {
			this.onEscapeFailure();
		}
		return success;
	};

	(function (alias) {

		Sprite_Actor.prototype.startMove = function (x, y, duration) {
			alias.call(this, -x, y, duration);
		};
	})(Sprite_Actor.prototype.startMove);

	(function (alias) {

		Sprite_Actor.prototype.setHome = function (x, y) {
			alias.call(this, 256, Graphics.boxHeight - 54);
		};
	})(Sprite_Actor.prototype.setHome);

	(function (alias) {

		Sprite_Actor.prototype.createMainSprite = function () {
			alias.apply(this, arguments);
			this._mainSprite.scale.x *= -1;

		};
	})(Sprite_Actor.prototype.createMainSprite);

	(function (alias) {

		Sprite_Weapon.prototype.initMembers = function () {
			alias.apply(this, arguments);
			this.scale.x *= -1;

		};
	})(Sprite_Weapon.prototype.initMembers);

	(function (alias) {
		Sprite_Actor.prototype.createShadowSprite = function () {
			alias.apply(this, arguments);
			this._shadowSprite.opacity = 0;
		};
	})(Sprite_Actor.prototype.createShadowSprite);

	(function (alias) {
		Sprite_Actor.prototype.updateFrame = function () {

			Sprite_Battler.prototype.updateFrame.call(this);
			const bitmap = this._mainSprite.bitmap;
			if (bitmap) {
				const motionIndex = this._motion ? this._motion.index : 0;
				const pattern = this._pattern < 3 ? this._pattern : 1;
				const cw = bitmap.width / 9;
				const ch = bitmap.height / 6;
				const cx = 0
				const cy = 0
				this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
				this.setFrame(0, 0, cw, ch);
			}
		}
	})(Sprite_Actor.prototype.createShadowSprite);

	Sprite_Actor.prototype.shouldStepForward = function () {
		return this._actor.isActing();
	};

	Window_BattleStatus.prototype.selectActor = function (actor) { };

	function Window_AutoMessage() {
		const ww = 460;
		const wh = 74;
		const wx = (Graphics.boxWidth - ww) / 2 + 4;
		const wy = (Graphics.boxHeight - wh) + 4;
		this.initialize.apply(this, [new Rectangle(wx, wy, ww, wh)]);
	}

	Window_AutoMessage.prototype = Object.create(Window_Base.prototype);
	Window_AutoMessage.prototype.constructor = Window_AutoMessage;

	Window_AutoMessage.prototype.initialize = function (rect) {
		Window_Base.prototype.initialize.call(this, rect);
		this._text = '';
		this._index = 0;
		this._lineHeight = this.lineHeight();
	};

	Window_AutoMessage.prototype.startMessage = function (text) {
		this._text = text;
		this._index = 0;
		this.updateMessage();
	};

	Window_AutoMessage.prototype.updateMessage = function () {
		if (this._index < this._text.length) {

			this.drawText(this._text.substring(0, this._index), 4, -6, 460, 'left');
			this._index++;
			setTimeout(this.updateMessage.bind(this), 10); 
		} else {
			setTimeout(() => {
				SceneManager._scene.removeChild(this);
			}, 1000); 
		}
	};

	_GameTroop_setup = Game_Troop.prototype.setup;
	Game_Troop.prototype.setup = function (troopId) {
		_GameTroop_setup.call(this, troopId);

		var e = this._enemies[0]

	};

	Sprite_Enemy.prototype.setBattler = function (battler) {
		Sprite_Battler.prototype.setBattler.call(this, battler);
		this._enemy = battler;

		this.setHome(Graphics.boxWidth, 192);
		this.startMove(-256, 0, 30);

	};

	const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
	Sprite_Enemy.prototype.updateBitmap = function () {
		if ($gameVariables.value(3) > 0) {
			this.hide();
		} else {
			this.show();
		}
		_Sprite_Enemy_updateBitmap.call(this);
	};

	const _BattleManager_startAction = BattleManager.startAction;
	BattleManager.startAction = function () {
		_BattleManager_startAction.call(this);

		const action = this._action;
		const subject = this._subject;

		if (subject.isEnemy() && action) {

			this.performEnemyAttackAction(subject, action);
		}
		if (subject.isActor() && action) {

			this.performActorAttackAction(subject, action);
		}
	};

	const _BattleManager_endAction = BattleManager.endAction;
	BattleManager.endAction = function () {
		const subject = this._subject;
		if (subject && subject.isEnemy()) {

			this.performPostEnemyAttackAction(subject);
		}
		if (subject && subject.isActor()) {

			this.performPostActorAttackAction(subject);
		}

		_BattleManager_endAction.call(this);
	};

	BattleManager.performEnemyAttackAction = function (subject, action) {
		const scene = SceneManager._scene;
		const enemySprites = scene._spriteset._enemySprites;
		const enemySprite = enemySprites.find(sprite => sprite._battler === subject);
		enemySprite.startMove(-304, 0, 12);

		var messageWindow = new Window_AutoMessage();
		SceneManager._scene.addChild(messageWindow);
		messageWindow.startMessage(`${subject.name()} used ${action.item().name}!`);

	};

	BattleManager.performPostEnemyAttackAction = function (subject) {
		const scene = SceneManager._scene;
		const enemySprites = scene._spriteset._enemySprites;
		const enemySprite = enemySprites.find(sprite => sprite._battler === subject);
		enemySprite.startMove(-256, 0, 12);

	};

	BattleManager.performActorAttackAction = function (subject, action) {
		var messageWindow = new Window_AutoMessage();
		SceneManager._scene.addChild(messageWindow);
		messageWindow.startMessage(`${subject.name()} used ${action.item().name}!`);

	};

	BattleManager.performPostActorAttackAction = function (subject) {

	};

	Scene_Battle.prototype.startEnemySelection = function () {
		this._enemyWindow.refresh();
		this._enemyWindow.show();
		this._enemyWindow.select(0);
		this._enemyWindow.activate();

		const action = BattleManager.inputtingAction();
		action.setTarget(this._enemyWindow.enemyIndex());
		this.hideSubInputWindows();
		this.selectNextCommand();
	};

	Scene_Battle.prototype.startActorSelection = function () {
		this._actorWindow.refresh();
		this._actorWindow.show();
		this._actorWindow.activate();

		const action = BattleManager.inputtingAction();
		action.setTarget(this._actorWindow.index());
		this.hideSubInputWindows();
		this.selectNextCommand();
	};

	Scene_Battle.prototype.windowAreaHeight = function () {
		return this.calcWindowHeight(2, true);
	};
	Window_SkillList.prototype.maxCols = function () {
		const scene = SceneManager._scene;
		if (scene && scene instanceof Scene_Battle) {
			return 2;
		}

		return 1;
	};
	Window_SkillList.prototype.colSpacing = function () {
		return 8;
	};
	Window_ItemList.prototype.drawItem = function (index) {
		const item = this.itemAt(index);
		if (item) {
			const numberWidth = this.numberWidth();
			const rect = this.itemLineRect(index);

			this.changePaintOpacity(1);
			this.drawItemName(item, rect.x + 10, rect.y, rect.width - numberWidth);
			this.drawItemNumber(item, rect.x, rect.y, rect.width - 6);
		}
	};
	Window_SkillList.prototype.drawItem = function (index) {
		const skill = this.itemAt(index);
		if (skill) {
			const costWidth = this.costWidth();
			const rect = this.itemLineRect(index);

			this.changePaintOpacity(1);
			this.drawItemName(skill, rect.x + 10, rect.y, rect.width - costWidth);
			this.drawSkillCost(skill, rect.x, rect.y, rect.width - 6);
		}
	};
	Scene_Battle.prototype.skillWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = this.windowAreaHeight();
		const wx = 0;
		const wy = (Graphics.boxHeight - wh) / 2 - 24
		return new Rectangle(wx, wy, ww, wh);
	};
	Scene_Battle.prototype.helpWindowRect = function () {
		const ww = Graphics.boxWidth;
		const wh = this.calcWindowHeight(1, false);
		const wx = (Graphics.boxWidth - ww) / 2;
		const wy = Graphics.boxHeight - wh;
		return new Rectangle(wx, wy, ww, wh);
	};

	ColorManager.damageColor = function (colorType) {
		switch (colorType) {
			case 0: 
				return "#ff0000";
			case 1: 
				return "#b9ffb5";
			case 2: 
				return "#ffff90";
			case 3: 
				return "#80b0ff";
			default:
				return "#808080";
		}
	};
	Sprite_Damage.prototype.fontSize = function () {
		return $gameSystem.mainFontSize();
	};

	Sprite_Damage.prototype.createMiss = function () {
		const h = this.fontSize();
		const w = Math.floor(h * 3.0);
		const sprite = this.createChildSprite(w, h);
		sprite.bitmap.textColor = "#ffffff";
		sprite.bitmap.drawText("Miss", 1, -2, w, h, "center");
		sprite.bitmap.drawText("Miss", 1, 0, w, h, "center");
		sprite.bitmap.drawText("Miss", 0, -1, w, h, "center");
		sprite.bitmap.drawText("Miss", 2, -1, w, h, "center");
		sprite.bitmap.textColor = this.damageColor();
		sprite.bitmap.drawText("Miss", 1, -1, w, h, "center");
		sprite.dy = 0;
	};

	Sprite_Damage.prototype.createDigits = function (value) {
		const string = Math.abs(value).toString();
		const h = this.fontSize();
		const w = Math.floor(h * 0.75);
		for (let i = 0; i < string.length; i++) {
			const sprite = this.createChildSprite(w, h);
			sprite.bitmap.textColor = "#ffffff";
			sprite.bitmap.drawText(string[i], 1, -2, w, h, "center");
			sprite.bitmap.drawText(string[i], 1, 0, w, h, "center");
			sprite.bitmap.drawText(string[i], 0, -1, w, h, "center");
			sprite.bitmap.drawText(string[i], 2, -1, w, h, "center");
			sprite.bitmap.textColor = this.damageColor();
			sprite.bitmap.drawText(string[i], 1, -1, w, h, "center");
			sprite.x = (i - (string.length - 1) / 2) * w;
			sprite.dy = -i;
		}
	};

	Sprite_Battler.prototype.createDamageSprite = function () {
		const last = this._damages[this._damages.length - 1];
		const sprite = new Sprite_Damage();

		sprite.x = this.x 
		sprite.y = this.y - 40 

		sprite.setup(this._battler);
		this._damages.push(sprite);
		this.parent.addChild(sprite);
	};

	Spriteset_Battle.prototype.createEnemies = function () {
		const enemies = $gameTroop.members();
		const sprites = [];
		for (const enemy of enemies) {
			sprites.push(new Sprite_Enemy(enemy));
			break;
		}
		sprites.sort(this.compareEnemySprite.bind(this));
		for (const sprite of sprites) {
			this._battleField.addChild(sprite);
		}
		this._enemySprites = sprites;
	};

	BattleManager.displayStartMessages = function () {
		if ($gameTroop.troop().id >= trainerStartPointInEnemyData) {
			$gameMessage.add($gameTroop.troop().name + " wants to battle!");
		} else {
			for (const name of $gameTroop.enemyNames()) {
				$gameMessage.add(TextManager.emerge.format(name));
			}
		}
		if (this._preemptive) {
			$gameMessage.add(TextManager.preemptive.format($gameParty.name()));
		} else if (this._surprise) {
			$gameMessage.add(TextManager.surprise.format($gameParty.name()));
		}
	};

	const _BattleManager_startBattle = BattleManager.startBattle;
	BattleManager.startBattle = function () {
		this.adjustEnemyStats();
		_BattleManager_startBattle.call(this);
	};

	BattleManager.adjustEnemyStats = function () {
		$gameTroop.members().forEach(enemy => {
			const info = JSON.parse(enemy.enemy().note)
			if (info) {
				const actorId = parseInt(info.class);
				const targetLevel = parseInt(info.level);
				this.applyActorStatsToEnemy(enemy, actorId, targetLevel);
			}
		});
	};

	BattleManager.applyActorStatsToEnemy = function (enemy, actorId, targetLevel) {
		const actor = new Game_Actor(actorId);

		if (actor) {

			actor.setup(actorId);
			while (targetLevel > actor.level) {
				actor.levelUp();
			}

			for (var i = 0; i < 8; i++) {
				enemy.enemy().params[i] = actor.currentClass().params[i][actor.level];
			}

			enemy.setHp(enemy.mhp);
			enemy.setMp(enemy.mmp);

			for (const skill of actor.skills()) {
				enemy.enemy().actions.push({ conditionParam1: 0, conditionParam2: 0, conditionType: 0, rating: 5, skillId: skill.id });
			}
		}
	};
})(this);