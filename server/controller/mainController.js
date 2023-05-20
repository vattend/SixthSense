const { getLevel, getWalletBalance, updateWalletBalance, updateTotalAssets, getBalanceInShares } = require("./dataController");
const { getDayCount, updateDayCount, getDate } = require("./timeController");
const { getTransactions, getTransaction, setTransaction, buyShare, sellShare, getBuyQuantity, getSellQuantity, setModel, addMoney } = require("./tradeController");
const data = require("../data.js");

const userID = "64675dd96bb5b00a806f75d5";

const makeTrade = async () => {
    try{

    await addMoney(userID);
    
    let dayCount = await getDayCount(userID);
    if(dayCount >= data.length - 1){
        console.log("All Days are over!");
        return;
    }
    let sendingData = data[dayCount];

    const {b,c,i,j,l,n,s,t,u} = sendingData;
    let senddata = [b,c,i,j,l,n,s,t,u];

    let level = await getLevel(senddata);
    console.log(level, dayCount, sendingData.Price);
    let walletBalance = await getWalletBalance(userID);


    // if level is 1 then buy
    if(level == 1){
        let quantity = await getBuyQuantity(userID);
        if(quantity == 0) {
            updateDayCount(userID);
            return;
        }
        let n = await buyShare(userID, quantity);
        if(n == false) {
            updateDayCount(userID);
            return;
        }
        await setTransaction(userID, "buy", quantity, data[dayCount].Price, walletBalance, data[dayCount].Date);
    }
    // if level is 0 then sell
    else if(level == 0){
        let quantity = await getSellQuantity(userID);
        if(quantity == 0) {
            updateDayCount(userID);
            return;
        }
        let n = await sellShare(userID, quantity);
        if(n == false) {
            updateDayCount(userID);
            return;
        }
        await setTransaction(userID, "sell", quantity, data[dayCount].Price, walletBalance, data[dayCount].Date);
    }
    updateDayCount(userID);

    } catch (e) {
        console.log(e);
    }
    
}

module.exports = { makeTrade };