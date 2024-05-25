import TitleScene from "./titleScreen";

export default class GameManager {
  constructor() {
    this.startScene = new TitleScene();
    this.currentScene = this.startScene;
  }

  StartGame(){
    this.currentScene.InitScene();
  }

  
}
