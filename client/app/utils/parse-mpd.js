export function parseAttrs(attrs) {
	return attrs.split('\n').reduce((result, attr) => {
		let parts = attr.split(': ')
		result[parts[0]] = parts[1]
		return result
	}, {});
}

export function parseList(str, ...startNames) {
	return str.split('\n').map(str => str.split(': ')).reduce((res, [key, val]) => {
		if(startNames.indexOf(key) !== -1) {
			res.arr.push(res.curr = {})
		}
		res.curr[key] = val;
		return res;
	}, {arr:[]}).arr;
}

export function listToJsonApi(response, prop, rels) {
	return response.filter(d => d[prop] !== undefined)
	.map(item => ({
		id: item[prop],
		type: prop,
		attributes: item,
		relationships: rels(item)
	}));
}