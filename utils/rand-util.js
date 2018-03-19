const ALL_STR = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrktuvwxyz!@#$%^&*()_+-=';

//根据位数生成数字
function randNumber(l=1) {
  return Math.floor(Math.random()*Math.pow(10, l));
}

//根据最大值生成
function randRange(min, max) {
  if(!max) {
    max = min;
    min = 1;
  }
  return Math.floor(Math.random()*(max-min))+min;
}

//随机字串密码
function randStr(l=1) {
  let str = '';
  for(let i=0; i<=l; i++) {
    str += ALL_STR[randRange(ALL_STR.length)];
  }
  return str;
}

// 生成银行卡密码
function randomBankPass() {
  return randNumber(6);
}

const randUtil = {
  randNumber,
  randRange,
  randStr,
  randomBankPass
};


module.exports = randUtil;