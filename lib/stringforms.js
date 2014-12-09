module.exports = function (count, strings) {
	var string;

	if (([2, 3, 4].indexOf((count+'').substr(-1, 1)|0) > -1 && [12, 13, 14].indexOf(count) == -1)) {
		string = strings[1];
	} else if ((count+'').substr(-1, 1) == '1' && count != 11) {
		string = strings[0];
	} else {
		string = strings[2];
	}

	return count + ' ' + string;
};