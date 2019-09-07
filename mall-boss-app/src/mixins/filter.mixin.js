
export const filterCutOut = (value, max) => {
    return value
        ? `${value.substring(0, max)}${value.length > max ? '...' : ''}`
        : '';
};

const filters = {

    filterAmount (s) {
        let money = parseFloat(s);
        if (money) {
            s = (money / 100).toFixed(2) + "";
            let l = s.split(".")[0].split("").reverse();
            let r = s.split(".")[1];
            let t = "";
            l.forEach((ll, key) => {
                t += l[key] + ((key + 1) % 3 == 0 && (key + 1) != l.length ? "," : "");
            });
            return t.split("").reverse().join("") + "." + r;
            // return s;
        } else if (s == 0) {
            return "0.00"
        } else {
            return '---';
        }
    },

    filterCutOut,

    filterCardNo (value) {
        return value ? value.substring(value.length - 4) : '';
    },

    filterBankCard (value) {
        if (!value) return '';
        let len = value.length;
        value = `${new Array(len - 3).join('*')}${value.substring(len - 4)}`;
        return value.replace(/(.{4})/g, '$1 ');
    },

    filterPhone (value) {
        return value ? value.substring(0,3) + ' **** ' + value.substring(7) : '';
    },

    filterName (value) {
        return value ? value.substring(0,1) + new Array(value.length).join('*') : '';
    },

    filterDateTime (value) {
        return value ? value.split(' ')[0] : '---'
    },

    filterDate (value, fmt = 'yyyy-MM-dd hh:mm:ss') {
        if (!value) return '---';
        let date = new Date(value.replace(/-/g, '/'));
        let o = {
            "M+" : date.getMonth()+1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth()+3)/3),
            "S"  : date.getMilliseconds()
        };
        if(/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    },
};


export default {
    filters,
}
