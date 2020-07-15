import {json2xml} from './JSON2XML';
import da from "element-ui/src/locale/lang/da";

const paramsFormat = (url) => {
    var qInd = url.indexOf("?");
    var sharpInd = url.indexOf("#"); //路由
    var search = "";
    var paramsList = [];
    var paramsObj = {};

    if (qInd >= 0) {
        if (sharpInd > 0) {
            search = url.substring(qInd + 1, sharpInd);
        } else {
            search = url.substring(qInd + 1);
        }
        paramsList = search.split("&");
        for (var ind in paramsList) {
            var param = paramsList[ind];
            var pind = param.indexOf("=");
            if (pind >= 0) {
                paramsObj[param.substring(0, pind)] = param.substr(pind + 1);
            } else {
                paramsObj[param] = "";
            }
        }
    }
    return paramsObj;
}

const dateFormart = (value, fmt) => {
    function format(value, fmt) {
        var date = new Date(value);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "w+": date.getDay(), //星期
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (k === 'w+') {
                if (o[k] === 0) {
                    fmt = fmt.replace('w', '周日');
                } else if (o[k] === 1) {
                    fmt = fmt.replace('w', '周一');
                } else if (o[k] === 2) {
                    fmt = fmt.replace('w', '周二');
                } else if (o[k] === 3) {
                    fmt = fmt.replace('w', '周三');
                } else if (o[k] === 4) {
                    fmt = fmt.replace('w', '周四');
                } else if (o[k] === 5) {
                    fmt = fmt.replace('w', '周五');
                } else if (o[k] === 6) {
                    fmt = fmt.replace('w', '周六');
                }
            } else if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    if (value) {
        value = format(value, fmt);
    }
    return value;
}

const getScrollTop = () => {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

const getScrollHeight = () => {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

const getWindowHeight = () => {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

const scrollLoading = (options) => {
    //只有回调函数，其他参数默认。
    if (typeof options == "function") {
        let cb = options;
        options = {callback: cb};
    }

    let delay = options.delay || 200;
    let triggerHeight = options.triggerHeight || 100;
    let callback = options.callback;
    let busy = false;

    window.onscroll = function () {
        if (busy) {
            return;
        }

        //检查是否已到触发加载的高度
        if (getScrollTop() + getWindowHeight() + triggerHeight > getScrollHeight()) {
            busy = true;
            // console.log('you are in the bottom');

            setTimeout(function () {
                busy = false;
                callback();
            }, delay);

        }
    };
}

// const wxConfig = (options,isDebugger) => {
//     if(wx != undefined){
//         wx.config({
//             debug: isDebugger ? true:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//             appId: options.appId, // 必填，公众号的唯一标识
//             timestamp: options.timestamp, // 必填，生成签名的时间戳
//             nonceStr: options.noncestr, // 必填，生成签名的随机串
//             signature: options.sgture,// 必填，签名
//             jsApiList: ['updateAppMessageShareData','updateTimelineShareData','onMenuShareWeibo','onMenuShareQZone','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ'] // 必填，需要使用的JS接口列表
//             // jsApiList: ["showAllNonBaseMenuItem", "hideAllNonBaseMenuItem", "showMenuItems", "hideMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "scanQRCode", "getLocation"]
//         });
//     }
// }

// const wxShare = (options) => {
//     if(wx != undefined){
//         wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
//             wx.updateAppMessageShareData({
//                 title: options.title, // 分享标题
//                 desc: options.desc, // 分享描述
//                 link: options.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                 imgUrl: options.imgUrl, // 分享图标
//                 success: function () {
//                   // 设置成功
//                 }
//             });
//             wx.updateTimelineShareData({
//                 title: options.title, // 分享标题
//                 link: options.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//                 imgUrl: options.imgUrl, // 分享图标
//                 success: function () {
//                   // 设置成功
//                 }
//             })
//         });

//     }
// }
const isMinData = (inputData) => {
    let minType = ['string', 'number', 'boolean', 'undefined'];
    let type = typeof inputData;
    return minType.indexOf(type) > -1;
}


const formatToJson = (data) => {
    let obj = {};
    if (typeof data != 'object') {
        throw error('Invalid data');
        return;
    }
    if (data instanceof Array) {
        obj = arrToJson(data);
    } else if (typeof data == 'object') {
        obj = objectToJson(data);
    }
    return obj;
}
const arrToJson = (inputArr) => {
    let arr = [];
    if (!inputArr || !Array.isArray(inputArr)) {
        throw error('agrenment is require Array');
    }
    if (inputArr.length == 0) return arr;
    inputArr.forEach(item => {
        if (isMinData(item)) {
            arr.push(item);
        } else {
            arr.push(formatToJson(item));
        }
    });
    return arr;
}
const objectToJson = (inputObject) => {
    let obj = {};
    if (JSON.stringify(inputObject) == "{}") {
        return obj;
    }
    for (let item in inputObject) {
        if (isMinData(inputObject[item])) {
            obj[item] = inputObject[item];
        } else {
            obj[item] = formatToJson(inputObject[item]);
        }
    }
    return obj;
}

String.prototype.removeLineEnd = function () {
    return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g, '$1 $2')
}

function formatXml(text) {
    //去掉多余的空格
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");

    //把注释编码
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
        var ret = '<!--' + escape(text) + '-->';
        //alert(ret);
        return ret;
    }).replace(/\r/g, '\n');

    //调整格式
    var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    var nodeStack = [];
    var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
        var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/') || (isFull1 == '/') || (isFull2 == '/');
        //alert([all,isClosed].join('='));
        var prefix = '';
        if (isBegin == '!') {
            prefix = getPrefix(nodeStack.length);
        } else {
            if (isBegin != '/') {
                prefix = getPrefix(nodeStack.length);
                if (!isClosed) {
                    nodeStack.push(name);
                }
            } else {
                nodeStack.pop();
                prefix = getPrefix(nodeStack.length);
            }

        }
        var ret = '\n' + prefix + all;
        return ret;
    });

    var prefixSpace = -1;
    var outputText = output.substring(1);
    //alert(outputText);

    //把注释还原并解码，调格式
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        //alert(['[',prefix,']=',prefix.length].join(''));
        if (prefix.charAt(0) == '\r')
            prefix = prefix.substring(1);
        text = unescape(text).replace(/\r/g, '\n');
        var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
        //alert(ret);
        return ret;
    });

    return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
}

function getPrefix(prefixIndex) {
    var span = '    ';
    var output = [];
    for (var i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }

    return output.join('');
}


const jsonToXml = (inputArr) => {
    var xml_content = formatXml(json2xml(inputArr));
    return xml_content;
}


const formatSql = (data, isUpper, isKeyUpper) => {
    let keywords = [
        "SELECT",
        "FROM",
        "LEFT JOIN",
        "RIGHT JOIN",
        "CROSS JOIN",
        "OUTTER JOIN",
        "WHERE",
        "AND",
        "ORDER BY",
        "GROUP BY",
        "EXISTS",
        "WITH(NOLOCK)",
        "WITH",
        "AS",
        "OVER"
    ];

    let res = "";
    let sb = new StringBuilder();
    data = data.split("\n");
    for (let sql of data) {
        sb.append(sql);
    }
    res = sb.toString(" ");
    res = res.replace(/\s+/ig, " ")
    if (isUpper) {
        res = res.toUpperCase();
    } else {
        res = res.toLowerCase();
    }
    if(res.charAt(0)===" "){
        res = res.substr(1);
    }
    for (let keyword of keywords) {
        {
            let kw = keyword;
            if (isKeyUpper) {
                kw = keyword.toUpperCase();
            } else {
                kw = keyword.toLowerCase();
            }
            let replaceValue = "\r\n";
            if('SELECT' === kw.toUpperCase()){
                replaceValue = "";
            }
            res = res.replace(keyword.toUpperCase(), replaceValue + kw);
            res = res.replace(keyword.toLowerCase(), replaceValue + kw);
        }
    }
    return res;
}


const generate = (data) => {
    let name = "sql";//变量名

    let sb = new StringBuilder();
    sb.append("StringBuilder "+name+" = new StringBuilder();\r\n");
    data = data.split("\n");
    for (let sql of data) {
        sql = sql.replace("\r","");
        console.log(name+'.append("'+sql+'");\r\n');
        sb.append(name+'.append("'+sql+'");\r\n');
    }

    // int lineMaxLength = txtSQL.Lines.Select(m => new KeyValuePair<string, int>(m, m.Length)).OrderByDescending(m => m.Value).FirstOrDefault().Value;
    // foreach (string sql in txtSQL.Lines)
    // {
    //     if (!string.IsNullOrEmpty(sql) && sql.Trim().Length > 0)
    //     {
    //         string sqlStr = sql.Trim();
    //         int noteIndex = sqlStr.IndexOf("--");
    //         string note = string.Empty;
    //         if (noteIndex > -1)
    //         {
    //             note = sqlStr.Substring(noteIndex);
    //             note = note.Replace("--", " //");
    //             sqlStr = sql.Substring(0, noteIndex);
    //
    //         }
    //         if (isAutoPad)
    //         {
    //             sqlStr = string.Format("\t{0}", sqlStr.PadRight(lineMaxLength, ' '));
    //         }
    //         if (isFormat)
    //         {
    //             sb.Append(string.Format("{0}.AppendFormat(\" {1} \");{2}\r\n", name, sqlStr, note));
    //         }
    //         else
    //         {
    //             sb.Append(string.Format("{0}.Append(\" {1} \");{2}\r\n", name, sqlStr, note));
    //         }
    //     }
    // }
    let res =sb.toString("");
    return res;
}


function StringBuilder() {
    this._stringArray = new Array();
}

StringBuilder.prototype.append = function (str) {
    this._stringArray.push(str);
}
StringBuilder.prototype.toString = function (joinGap) {
    return this._stringArray.join(joinGap);
}


export {
    paramsFormat,
    dateFormart,
    scrollLoading,
    formatToJson,
    jsonToXml,
    formatSql,
    generate
}