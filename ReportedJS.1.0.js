/**
 * @author Coco 
 * QQ:308695699
 * @name  reportedJS 1.0.0
 * @description 可用于业务在线时长（PCU）等数据上报需求 【统计上报】 -- reportedJS
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * 1、本组件用于将拼装好的上报 URL 进行上报
 *
 * 2、初始化方法，
 *  1）提供 var dr = new dataReported() 构造函数，构建 dataReported 实例
 *  2）直接 dataReported().methodName 进行调用
 *
 * 3、提供一些工具方法
 * 	setCookie -- 设置 cookie
 * 	getCookie -- 获取 cookie
 * 	hexMd5 -- MD5 加密函数
 * 	createRandomString -- 生成任意位数随机字符串
 * 	intervalReported -- 间隔固定时长上报
 * 	leaveLintener -- 离开浏览器上报
 * 	stayTime -- 在页面内的停留时间
 */
;
(function(window, undefined) {

	// md5 加密
	// hex_md5("") -- 16位加密
	// hex_md5("",32) -- 32位加密
	var hex_md5 = function(sMessage, bit) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}

		function AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			if (lX4 | lY4) {
				if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			} else return (lResult ^ lX8 ^ lY8);
		}

		function F(x, y, z) {
			return (x & y) | ((~x) & z);
		}

		function G(x, y, z) {
			return (x & z) | (y & (~z));
		}

		function H(x, y, z) {
			return (x ^ y ^ z);
		}

		function I(x, y, z) {
			return (y ^ (x | (~z)));
		}

		function FF(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function GG(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function HH(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function II(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function ConvertToWordArray(sMessage) {
			var lWordCount;
			var lMessageLength = sMessage.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		}

		function WordToHex(lValue) {
			var WordToHexValue = "",
				WordToHexValue_temp = "",
				lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
			}
			return WordToHexValue;
		}
		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d
		var S11 = 7,
			S12 = 12,
			S13 = 17,
			S14 = 22;
		var S21 = 5,
			S22 = 9,
			S23 = 14,
			S24 = 20;
		var S31 = 4,
			S32 = 11,
			S33 = 16,
			S34 = 23;
		var S41 = 6,
			S42 = 10,
			S43 = 15,
			S44 = 21;
		// Steps 1 and 2. Append padding bits and length and convert to words 
		x = ConvertToWordArray(sMessage);
		// Step 3. Initialise 
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;
		// Step 4. Process the message in 16-word blocks 
		for (k = 0; k < x.length; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = AddUnsigned(a, AA);
			b = AddUnsigned(b, BB);
			c = AddUnsigned(c, CC);
			d = AddUnsigned(d, DD);
		}
		if (bit == 32) {
			return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
		} else {
			return WordToHex(b) + WordToHex(c);
		}
	}

	// 生成 n 位随机数
	function createRandomString(n) {
		var randomString = "",
			len = n,
			i = 0,
			possible = "0123456789abcdefghijklmnopqrstuvwxyz";

		for (; i < len; i++) {
			randomString += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return randomString;
	}

	// 简单的解析字符串表示时间
	// s是指秒，s20 是代表 20 秒
	// h是指小时，h12 是代表 12 小时
	// d是天数，d30 是代表 30 天
	function getSecond(str) {
		if (!str) {
			return;
		}

		var str1 = str.substring(1, str.length) * 1,
			str2 = str.substring(0, 1);

		switch (str2) {
			case "s":
				return str1 * 1000;
				break;
			case "h":
				return str1 * 60 * 60 * 1000;
				break;
			case "d":
				return str1 * 24 * 60 * 60 * 1000;
				break;
			default:
				return 30 * 24 * 60 * 60 * 1000;
		}
	}

	// 设置 cookie
	function setCookie(name, value, time) {
		var strsec = getSecond(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec * 1);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	// 读取 cookie
	function getCookie(name) {
		var arr,
			reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

		if (arr = document.cookie.match(reg)) {
			return (arr[2]);
		} else {
			return null;
		}
	}

	var
	// 记录进入网页的时间
		startTime = new Date(),

		// 心跳上报 setIntervalReported	
		SIR = false,

		// 上报参数列表
		params = {},

		// 初始化方法
		dataReported = function(options) {
			return new dataReported.prototype.init(options);
		};

	dataReported.prototype = {
		// 构造函数
		constructor: dataReported,

		// 上报方法
		// path 的组成由一个 1px*1px 的 gif 图路径，带上上报参数 
		// example:path = http://dataaq.yy.com/d.gif?sed=7b787ece5e314406&te=2&rl=conjs&td=null&ip=null&sd=47171833&sbd=47171833&ud=null&ot=1454469970&dr=0&wy=bd150b15a3eb43f995b7612aa785bf03&rf=http%3A%2F%2Fconcert.m.yy.com%2F&sr=wch_live&cd=null&ui=0.6382519796025008&in=null
		reportSend: function(path) {
			var img = document.createElement('img');

			try {
				img.src = path;
			} catch (err) {} finally {
				img = null;
			}
		},
		// 停留时间，单位：s
		stayTime: function() {
			return Math.round(Math.round(new Date() / 1000) - startTime / 1000);
		},
		// 心跳上报
		// @param:path 上报路径
		// @param:gapTime 间隔上报时间,默认为 60s
		intervalReported: function(path, gapTime) {
			var _this = this;

			if (!path) {
				return;
			}

			gapTime = gapTime || 60;

			SIR = setInterval(function() {
				_this.reportSend(path);
			}, gapTime * 1000);

			return this;
		},
		// 清除心跳上报
		clearSIR: function() {
			clearInterval(SIR);
		},
		// 提供 MD5 加密方法
		// @param:str 加密字符串
		// @param:digit 加密位数,默认 密文为 16 位，
		// digit 为 32，则密文为 32 位
		hexMd5: function(str, digit) {
			var length = arguments.length;

			if (length == 0) {
				return;
			}

			if (length == 1) {
				str = str + "";
				return hex_md5(str);
			} else if (length == 2 && arguments[1] == 32) {
				str = str + "";
				return hex_md5(str, 32);
			}
		},
		// 提供设置 cookie 值的方法
		// @param:time 表示 cookie 的有效期，默认为 30 天
		// s是指秒，s20 是代表 20 秒
		// h是指小时，h12 是代表 12 小时
		// d是天数，d30 是代表 30 天
		setCookie: function(name, value, time) {
			var length = arguments.length;

			if (length < 2 || length > 3) {
				return;
			}

			if (length == 2) {
				setCookie(name, value, "d30");
			} else if (length == 3) {
				setCookie(name, value, time);
			}

			return this;
		},
		// 提供读取 cookie 值的方法
		getCookie: function(name) {
			getCookie(name);
		},
		// 监听用户离开网页事件
		// 并发送上报
		leaveLintener: function(path) {
			var _this = this;

			window.onunload = function() {
				_this.reportSend(path);
			}
		},
		// 提供生成 n 位随机数的方法
		createRandomString: function(n) {
			createRandomString(n);
		}
	}

	// 初始化方法
	dataReported.prototype.init = function() {
		return this;
	}

	dataReported.prototype.init.prototype = dataReported.prototype;

	// 接口暴露出去
	window.dataReported = dataReported;

})(window);