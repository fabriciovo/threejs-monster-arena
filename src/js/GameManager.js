import CharacterSelectionScene from "./Scenes/characterSelectionScene";
import GameScene from "./Scenes/gameScene";
import TitleScene from "./Scenes/titleScene";

export default class GameManager {
  constructor() {
    this.Player = undefined;
    this.startScene = new TitleScene();
    this.currentScene = this.startScene;

    this._documentEvents();
  }

  _documentEvents() {
    document.addEventListener("startgame", () => {
      this._changeScene('CharacterSelectionScene');
    });
  }

  StartGame() {
    this.currentScene.InitScene();
  }

  _startGame() {
    this.currentScene.InitScene();
  }

  _changeScene(sceneName) {
    this.currentScene.DestroyScene();
    this.currentScene = null;

    switch(sceneName){
      case 'TitleScene':
        this.currentScene = new TitleScene();
        this.currentScene.InitScene();

      break;
      case 'GameScene':
        this.currentScene = new GameScene();
        this.currentScene.InitScene();

      break;
      case 'CharacterSelectionScene':
        this.currentScene = new CharacterSelectionScene();
        this.currentScene.InitScene();
      break;
    }
  }
}
