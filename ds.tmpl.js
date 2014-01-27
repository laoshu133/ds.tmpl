/**
* ds.tmpl.js
* create: 2013.01.10
* update: 2013.09.26
* admin@laoshu133.com
* @param {String} tmpl
* @param {Object} data
**/
;(function(global){
	var ds = global.ds || (global.ds = {});

	var 
	rarg1 = /\$1/g,
	rgquote = /\\"/g,
	rbr = /([\r\n])/g,
	rchars = /(["\\])/g,
	rdbgstrich = /\\\\/g,
	rfuns = /<%\s*(\w+|.)([\s\S]*?)\s*%>/g,
	rbrhash = {
		'10': 'n',
		'13': 'r'
	},
	helpers = {
		'=': {
			render: '__.push($1);'
		}
	};

	ds.tmpl = function(tmpl, data){
		//console.log( //debug
		var render = new Function('_data',
			'var __=[];__.data=_data;' + 
			'with(_data){__.push("' + 

			tmpl
			//����ת�� ˫���š���б��
			.replace(rchars, '\\$1')
			//����һ�������
			.replace(rfuns, function(a, key, body){
				body = body
					//ת��������еĻ���Ϊ ;
					.replace(rbr, ';')
					//��ԭ֮ǰת��� ˫����
					.replace(rgquote, '"')
					//��ԭ֮ǰת��� ��б��
					.replace(rdbgstrich, '\\');

				var 
				helper = helpers[key],
				tmp = !helper ? key + body : 
					typeof helper.render === 'function' ? 
						helper.render.call(ds, body, data) : 
						helper.render.replace(rarg1, body);
				return '");' + tmp + '__.push("';
			})
			//ת��Ǵ�����еĻ���
			.replace(rbr, function(a, b){
				return '\\' + (rbrhash[b.charCodeAt(0)] || b);
			})
			+  '");}return __.join("");');
		return data ? render.call(data, data) : render;
	};
	ds.tmpl.helper = helpers;
})(this);