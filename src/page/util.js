/**
 * 工具类
 * @author GongLiHai
 */
export default {
  /**
   * 通过 default 字段 获取默认值
   * @param {*} def 可能为 具体值, 也可能为 函数
   * @return default 的具体值 或 default 执行的返回值, 或 null
   */
  getValueByDefault(def) {
    if (def == null || def == undefined) {
      return null;
    }
    if (typeof def === "function") {
      return def();
    } else {
      return def;
    }
  },
  /**
   * 返回集合中对象某个属性的值组成逗号分隔字符串
   * @param {Array}  list  集合
   * @param {String} field 属性名
   * @returns {String} 逗号分隔的字符串
   */
  objectsToString(list, field) {
    let r = "";
    list.forEach((item) => {
      r += item[field] + ",";
    });
    return r.substring(0, r.length - 1);
  },
  /**
   * 返回集合中对象某个属性的值组成的数组
   * @param {Array}  list  集合
   * @param {String} field 属性名
   * @returns {Array} 属性值的数组
   */
  objectsToArray(list, field) {
    let r = new Array();
    list.forEach((item) => {
      r.push(item[field]);
    });
    return r;
  },
  /**
   * 返回 list[field] 与 values 交集
   * @param {Array} list    集合
   * @param {String} field  属性名
   * @param {Array} values  值集合
   * @returns {Array} values 过滤后的 list 集合
   */
  objectsFindToArray(list, field, values) {
    let r = new Array();
    list.forEach((item) => {
      if (values.indexOf(item[field]) !== -1) {
        r.push(item);
      }
    });
    return r;
  },
  /**
   * 如果 value 为 null 或 undefined, 返回 def, 否则返回 value
   * @param {Object} value 值
   * @param {Object} def   默认值
   * @returns {Object} value 或 def
   */
  ifAbsentDefault(value, def) {
    return this.isAbsent(value) ? def : value;
  },
  /**
   * 判空
   * @param {Object} value
   * @returns {Boolean} value == null || value == undefined
   */
  isAbsent(value) {
    return value == null || value == undefined;
  },
  /**
   * 数组转逗号分隔的字符串
   * @param {Array} list 数组
   * @returns {String} 逗号分隔的字符串
   */
  listToCommaString(list) {
    return this.listToString(list, ",");
  },
  /**
   * 数组转以指定分隔符的字符串
   * @param {Array} list 数组
   * @param {String} delimiter 分隔符
   * @returns {String} 以指定分隔符的字符串
   */
  listToString(list, delimiter) {
    if (!list) {
      return;
    }
    let r = "";
    list.forEach((item) => {
      r += item + delimiter;
    });
    return r.substring(0, r.length - 1);
  },
  /**
   * 逗号分隔字符串转数组
   * @param {String} str 逗号分隔字符串
   * @returns {Array} 分割后的数组
   */
  commaStringToList(str) {
    return this.stringToList(str, ",");
  },
  /**
   * 以指定分割符分割字符串
   * @param {String} str 指定分隔符的字符串
   * @param {String} delimiter 指定分隔符
   * @returns {Array} 分割后的数组
   */
  stringToList(str, delimiter) {
    if (str) {
      return str.split(delimiter);
    }
    return [];
  },
  /**
   * 当 value 的值为 false 返回 false, 否则返回 true
   * @param {*} value
   */
  isAbsentTrue(value) {
    return value !== false;
  },
  /**
   * 树查找第一个元素, 找不到返回 null
   * @param {Array}     datas       树数据
   * @param {Function}  predicate   判断: (value: any, index: number) => value is any
   * @param {String}    childrenKey 子级的属性名
   * @returns {any} 元素 或 null
   */
  treeSearchFirst(datas, predicate, childrenKey = 'children') {
    if (!datas || !datas.length) {
      return null;
    }
    for (let index = 0; index < datas.length; index++) {
      const item = datas[index];
      if (predicate(item, index)) {
        return item;
      }
      const find = this.treeSearchFirst(item[childrenKey], predicate, childrenKey);
      if (find) {
        return find;
      }
    }
    return null;
  },
  /**
   * 树获取节点属性值, 返回属性值的数组
   * @param {Array} node 节点数组
   * @param {String} attribute 属性名
   * @param {String} childrenKey 子级属性名
   * @returns Array
   */
  treeGetAttributeValues(nodes, attributeKey, childrenKey = 'children') {
    const r = [];
    if (!nodes || !nodes.length) {
      return r;
    }
    nodes.forEach(node => {
      r.push(node[attributeKey]);
      r.push(...this.treeGetAttributeValues(node[childrenKey], attributeKey, childrenKey))
    })
    return r;
  },
  /**
   * 树, 获取指定级别的所有值
   * @param {Array} nodes 树节点
   * @param {Number} targetLevel 级别, 从 1 开始
   * @param {*} attributeKey 属性名
   * @param {*} currentLevel 递归当前级别
   * @returns Array
   */
  treeGetIdsAtLevel(nodes = [], targetLevel, attributeKey, currentLevel = 1) {
    const values = [];
    if (!nodes || !nodes.length) {
      return values;
    }
    nodes.forEach((node) => {
      values.push(node[attributeKey]);
      if (node.children && currentLevel < targetLevel) {
        values.push(...this.treeGetIdsAtLevel(node.children, targetLevel, attributeKey, currentLevel + 1));
      }
    })
    return values;
  },
  /**
 * 对象深度合并 (数组做为不合并)
 * @param {*} target 目标对象
 * @param {*} source 来源对象
 * @returns 合并后的对象
 */
  objectMerge(target, source) {
    for (const key in source) {
      const sourceValue = source[key];
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        target[key] = this.objectMerge(target[key] || {}, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
    return target;
  },
  /**
   * 字段合并
   * @param {*} source1 来源对象1
   * @param {*} source2 来源对象2
   * @param {*} fieldArray 属性名数组
   * @returns 合并后的对象
   */
  fieldMerge(source1 = {}, source2 = {}, fieldNameArray = []) {
    const r = {};

    fieldNameArray.forEach(fieldName => r[fieldName] = this.ifAbsentDefault(source1[fieldName], source2[fieldName]));

    return r;
  }
};
