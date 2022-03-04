const config = {
	type: Phaser.AUTO,
	scale: {
		parent: "phaser-game",
		mode: Phaser.DOM.FIT,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: true,
		},
	},
};

var text;

const game = new Phaser.Game(config);
musicOn = true;

// ************PRELOAD****************
function preload() {
	this.load.spritesheet("pinkman", "/sprites/pinkman_run.png", {
		frameWidth: 32,
		frameHeight: 32,
	});
	this.load.spritesheet("sadGuy", "/sprites/pien.png", {
		frameWidth: 32,
		frameHeight: 32,
	});
	this.load.image("base_tiles", "/tiles/space_tileset.png");
	this.load.tilemapTiledJSON("tilemap", "/tiles/space_map.json");
	this.load.audio("bens_beautiful_song", "/audio/music_2.mp3");
	this.load.audio("beep", "/audio/beep.mp3");
	this.load.image("object", "/sprites/pinkman.png");
	this.load.image("muteMan", "/sprites/muteMan.png");
}

// ************CREATE****************
function create() {
	this.music = this.sound.add("bens_beautiful_song");

	const musicConfig = {
		mute: false,
		volume: 0.3,
		rate: 1,
		detune: 0,
		seek: 0,
		loop: true,
		delay: 0,
	};

	this.music.play(musicConfig);

	const map = this.make.tilemap({ key: "tilemap" });
	const tileset = map.addTilesetImage("space_tileset", "base_tiles");

	const floor = map.createStaticLayer("floor", tileset);
	const walls = map.createStaticLayer("walls", tileset);
	const stuff = map.createStaticLayer("stuff", tileset);

	walls.setCollisionByProperty({ collides: true });
	stuff.setCollisionByProperty({ collides: true });

	this.hero = this.physics.add.sprite(1600, 1600, "sadGuy").setScale(1.3);
	this.heroHand = this.physics.add.sprite(1620, 1620, "sadGuy").setScale(1.6);
	this.heroHand.visible = false;

	let treasureIndex = -1

	treasureGroup = [{ 
		x: 1011, 
		y: 1435, 
		width: 30, 
		height: 63, 
		message: 'Found Treasure! Check in the wishing well'
	 }, { 
		x: 1539, 
		y: 2766, 
		width: 30, 
		height: 63, 
		message: 'Found Treasure! Check by the pipe in the tube seatcover-looking room'
	 }, { 
		x: 50, 
		y: 2350, 
		width: 30, 
		height: 63, 
		message: 'Check under the control desk'
	 }, { 
		x: 1369, 
		y: 1811, 
		width: 30, 
		height: 63, 
		message: 'Game over!!' 
	}];

	function gameOver() {
		console.log(`nice work buddy!`)
	}

	const generateTreasure = (treasure) => {
		treasureShape = this.add.rectangle(treasure.x, treasure.y, treasure.width, treasure.height, "00FFFFFF");
		treasureObj = this.physics.add.existing(treasureShape, 1);
		treasureObj.visible = false;
		treasureObj.setData({ message: treasure.message });
		this.physics.add.overlap(treasureObj, this.heroHand, findTreasure);
		treasureIndex++
		return treasureObj;
	};
	
	function generateNextTreasure() {
		generateTreasure(treasureGroup[treasureIndex]);
	};

	const sfx = this.sound.add("beep");
	const keyObj = this.input.keyboard.addKey("E");
	this.score = 0;

	const findTreasure = (treasure) => {
		if (treasure.active) {
			if (treasure.body.embedded && keyObj.isDown) {
				console.log(`You found the treasure at ${treasure.x}, ${treasure.y}!`);
				this.score += 1;
				sfx.play();
				msg = this.add.text(treasure.x, treasure.y, treasure.data.list.message);
				setTimeout(() => {
					msg.destroy();
				}, 5000);
				treasure.setActive(false);
				if(treasureIndex === treasureGroup.length) {
					gameOver();
				} else {
					generateNextTreasure();
				};
			};
		};
	};

	this.treasure1 = generateTreasure(
		{ x: 1679,
		y: 1418,
		width: 30,
		height: 63,
		message: "Found Treasure! Check in the couch"
		}
	);

	this.physics.add.overlap(this.treasure1, this.heroHand, findTreasure);

	this.cameras.main.startFollow(this.hero, true);

	this.hero2 = this.physics.add.sprite(1650, 1650, "pinkman");
	muteMan = this.add
		.image(30, 20, "muteMan")
		.setInteractive()
		.setScale(2)
		.setScrollFactor(0);

	this.physics.add.collider(this.hero, stuff);
	this.physics.add.collider(this.hero2, stuff);
	this.physics.add.collider(this.hero, walls);
	this.physics.add.collider(this.hero2, walls);

	this.cursors = this.input.keyboard.createCursorKeys();

	keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
	keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

	text = this.add
		.text(5, 40, "Cursors to move", { font: "16px Courier", fill: "#00ff00" })
		.setScrollFactor(0);

	this.anims.create({
		key: "right",
		frames: this.anims.generateFrameNumbers("sadGuy", { start: 6, end: 8 }),
		frameRate: 10,
		repeat: -1,
	});
	this.anims.create({
		key: "left",
		frames: this.anims.generateFrameNumbers("sadGuy", { start: 3, end: 5 }),
		frameRate: 10,
		repeat: -1,
	});
	this.anims.create({
		key: "top",
		frames: this.anims.generateFrameNumbers("sadGuy", { start: 9, end: 11 }),
		frameRate: 10,
		repeat: -1,
	});
	this.anims.create({
		key: "down",
		frames: this.anims.generateFrameNumbers("sadGuy", { start: 0, end: 2 }),
		frameRate: 10,
		repeat: -1,
	});
	this.anims.create({
		key: "idle",
		frames: [{ key: "sadGuy", frame: 1 }],
		frameRate: 10,
	});

	this.physics.add.collider(this.hero, this.hero2);

	mute = muteMan.on("pointerdown", () => {
		if (musicOn) {
			this.music.stop();
			musicOn = false;
		} else {
			this.music.play(musicConfig);
			musicOn = true;
		}
		console.log("muteMan in action!");
	});

	scoreText = this.add
		.text(1000, 0, `Treasures: ${this.score}`, {
			fontSize: "32px",
			fill: "#ffffff",
		})
		.setScrollFactor(0);
}

// ************UPDATE****************

function update() {
	text.setText([
		"screen x: " + this.input.x,
		"screen y: " + this.input.y,
		"world x: " + this.input.mousePointer.worldX.toFixed(0),
		"world y: " + this.input.mousePointer.worldY.toFixed(0),
		"hero x: " + this.hero.x.toFixed(0),
		"hero y: " + this.hero.y.toFixed(0),
	]);

	scoreText.setText(`Treasures: ${this.score}`);

	this.hero.setVelocity(0);
	this.hero.anims.play("idle", true);

	if (this.cursors.up.isDown || keyW.isDown) {
		this.hero.setVelocityY(-160);
		this.hero.anims.play("top", true);
	} else if (this.cursors.down.isDown || keyS.isDown) {
		this.hero.setVelocityY(160);
		this.hero.anims.play("down", true);
	}

	if (this.cursors.right.isDown || keyD.isDown) {
		this.hero.setVelocityX(160);
		this.hero.anims.play("right", true);
	} else if (this.cursors.left.isDown || keyA.isDown) {
		this.hero.setVelocityX(-160);
		this.hero.anims.play("left", true);
	}

	this.heroHand.x = this.hero.x;
	this.heroHand.y = this.hero.y;
}
