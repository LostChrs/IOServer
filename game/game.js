/**
 * 游戏主逻辑
 */

const { broadcast } = require("./server");
const Helper = require("../helpers/Helper");
let playerList = [];
let itemList = [];
let itemCount = 0;


const getPlayerById = (id) => {
    return playerList.find(player => player.playerId == id);
}

const spawnItem = () => {
    const id = itemCount++;
    const x = Helper.randomRange(-300, 300);
    const y = Helper.randomRange(-200, 200);
    const score = Helper.randomRange(2, 10);
    const data = {
        itemId: id,
        x: x,
        y: y,
        score: score,
    };
    return data;
}

const getItemById = (itemId)=>{
    return itemList.find(item=>item.itemId == itemId);
}

const destroyItem = (itemId)=>{
    itemList = itemList.filter(item=>item.itemId != itemId);
}

const game = {
    enterRoom: (data) => {
        if (!getPlayerById(data.playerId)) {
            playerList.push(data);

            broadcast("enterRoom", playerList);

            //当房间大于两个人时开始游戏
            if (playerList.length >= 2) {
                broadcast("startGame");
                let newItems = [];
                for (let i = 0; i < 5; i++) {
                    const item = spawnItem();
                    newItems.push(item);
                    itemList.push(item);
                }

                setTimeout(() => {
                    broadcast("spawnItem", newItems);
                }, 1000);
            }
        }
    },
    moveTo: (data) => {
        broadcast("moveTo", data);
    },
    takeItem: (data) => {
        const {itemId, playerId} = data;
        const item = getItemById(itemId);
        if(item){
            broadcast("takeItem",{
                playerId,
                itemId,
                score:item.score,
            });
        }
    },
    leaveRoom: (playerId) => {
        playerList = playerList.filter(player => player.playerId != playerId);
        broadcast("leaveRoom", playerId);
    }
};

module.exports = game;