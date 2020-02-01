const startMenuEntryWidth = 300;
const startMenuEntryHeight = 75;

class Main extends Phaser.Scene {

    static RussianAttackRate = .015;

    constructor() {
        super('SceneMain')
    };

    init() {
        // STATE VARIABLES ~ todo: good style to define these here..?
        this.firewallRunning = true;
        this.attacksFromRussians = 0;

        this.startMenuOpen = false;
    }

    preload() {
        this.load.image('background', "assets/os/background.png");
        this.load.image('buttonStart', "assets/os/startbutton.png");
        this.load.image('buttonStartClicked', "assets/os/startbutton_clicked.png");
        this.startButtonScale = 0.5;

        this.load.image('folder', "assets/os/folder.png");
        this.load.image('drive', "assets/os/drive.png");
        this.load.image('usb', "assets/os/usb.png");
        this.load.image('file', "assets/os/file.png");
        this.load.image('moviefile', "assets/os/moviefile.png");

        this.load.spritesheet('startMenu', "assets/os/startmenu.png", {
            frameWidth: startMenuEntryWidth,
            frameHeight: startMenuEntryHeight,
        });

        this.load.glsl('glitch', 'frag/glitch.frag');
    }

    create() {
        this.renderTexture = this.add.renderTexture(0,0,screen.frameWidth, screen.frameHeight);

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
        this.background.on('pointerdown', this.clickBackground, this);

        this.add.text(20, 20, "Please your mom, please!", {font: "30px Arial", fill: "yellow"});

        this.buttonStart = new StartButton(this, 0, config.height, "buttonStart", "buttonStartClicked", this.startButtonScale);
        this.add.existing(this.buttonStart);
        this.buttonStart.on('pointerdown', this.openStartMenu, this);

        this.startMenu = [];

        this.desktopButtons = [
            new FileButton(this, 40, 100, 'My Computer', 'folder', this.openFileBrowser, "lightgreen"),
        ]

        this.glitchShader = this.add.shader('glitch', 0., 0., config.width, config.height).setOrigin(0, 0);
    }

    update() {
        this.handleRussianAttacks();
        this.glitchShader.uniforms.amount.value = .1;
    }

    // todo: move this somehow to startButton.js so this.scene is clear...
    openStartMenu() {
        if (this.startMenuOpen) {
            this.collapseStartMenu();
            return;
        }
        this.startMenuOpen = true;

        let startMenuFunctions = [
            this.clickSearchButton,
            this.clickUsbDriveButton,
            this.clickFirewallButton,
            this.clickRebootButton,
        ]
        this.startMenu = [];

        startMenuFunctions.forEach( (func, index) =>
        {
            this.startMenu.push(new SimpleButton(this, {
                'key': 'startMenu',
                'up': 2 * index,
                'over': 2 * index + 1,
                'down': 2 * index + 1,
                'x': this.buttonStart.getTopLeft().x,
                'y': this.buttonStart.getTopLeft().y - 3 - (startMenuEntryHeight + 3) * (startMenuFunctions.length - 1 - index),
                'onDown': func,
            }));
        });
    }

    collapseStartMenu() {
        this.startMenu.forEach(button => {
            button.destroy();
        });
        this.buttonStart.snapBack();
        this.startMenuOpen = false;
    }

    clickBackground() {
        this.collapseStartMenu();
    }

    openFileBrowser() {
        this.scene.launch('SceneFileBrowser', {'parent': this});
    }

    clickSearchButton() {
        console.log(`shitfuck ${this.scene.firewallRunning}`);
    }

    clickFirewallButton() {
        this.scene.scene.launch('SceneFirewall', {'parent': this.scene});
        this.scene.collapseStartMenu();
    }

    clickRebootButton() {
        this.scene.collapseStartMenu();
    }

    handleRussianAttacks() {
        if (!this.firewallRunning) {
            if (Phaser.Math.Between(0, 1000) < Main.RussianAttackRate * 1000) {
                this.attacksFromRussians++;
            }
        }
    }

}

// TODO: error message
// TODO: usb drive menu (super complicated..!)
// TODO: task list
// TODO: progress bar
