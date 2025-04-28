// utils/dict.js

// 系统字典
const systemDict = {
  USER_STATUS: {
    ACTIVE: { code: 1, label: "活跃" },
    INACTIVE: { code: 0, label: "未激活" },
    LOCKED: { code: 2, label: "已锁定" },
  },
  GENDER: {
    MALE: { code: 1, label: "男" },
    FEMALE: { code: 2, label: "女" },
    UNKNOWN: { code: 0, label: "未知" },
  },
  activityType: [
    { value: 0, text: "找搭子" },
    { value: 1, text: "娃娃接送" },
    { value: 2, text: "上班拼车" },
    { value: 3, text: "代买菜" },
    { value: 4, text: "公园野营" },
  ],
  dynamicType: [
    { value: 0, text: "便民信息" },
    { value: 1, text: "二手市场" },
    { value: 2, text: "吃瓜现场" },
    { value: 3, text: "个人动态" },
    { value: 4, text: "其他" },
  ],
};

// 获取字典项方法
const getDict = (dictName, code) => {
  const dict = systemDict[dictName];
  if (!dict) return null;

  if (code !== undefined) {
    return Object.values(dict).find((item) => item.code === code) || null;
  }

  return dict;
};

// 获取字典选项列表（适合前端下拉框）
const getDictOptions = (dictName) => {
  const dict = systemDict[dictName];
  if (!dict) return [];

  return Object.values(dict).map(({ code, label }) => ({ value: code, label }));
};

const getDictArr = (dictName) => {
  const dict = systemDict[dictName];
  if (!dict) return [];

  return dict;
};

module.exports = {
  systemDict,
  getDict,
  getDictOptions,
  getDictArr,
};
