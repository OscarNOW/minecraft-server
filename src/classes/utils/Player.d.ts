export class Player extends Entity {
    tabItem?: TabItem;
    playerInfo: playerInfo;
}

type playerInfo = {
    readonly name: string; //todo: make changable
    readonly uuid: string; //todo: make changable
    gamemode: gamemode;
};