
// 宣告全域變數並初始化
var jsonData;
var spotDataLength;
var strData = '';
var zone ='全部區域';
var noData = true;
var hotZone = false;
// Google Map
var map;

// 用 Ajax 取得 JSON 資料
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://ddchris.github.io/Kaohsiung_tourist_attractions/data/data.json', true);
xhr.send(null);
xhr.onload = function () {
	if (xhr.status == 200){
		jsonData = JSON.parse(xhr.responseText);
		spotDataLength = jsonData.result.records.length;
		//頁面初始化
		getDataAndShow();
	};
};

// 儲存待用元件
var el_areaSelect = document.getElementById('areaSelector');
var el_spotList = document.getElementById('spotList');
var el_hotDistrict = document.getElementById('hotDistrict');
var el_message = document.getElementById('message');

// 事件監聽
el_areaSelect.addEventListener('change', getDataAndShow, false);
el_hotDistrict.addEventListener('click', getHotZoneData, false);

// 相關函數
function getDataAndShow (e) {

	buildMap();
	// 經由選擇區域進入函數則取得所選區域名稱
	if( e && !hotZone){ zone = e.target.value; };

	if (zone === '全部區域'){ getAllZoneData(); }
	else { getOneZoneData(); };

	el_spotList.innerHTML = strData;
	// 全域資料設重置
	strData = '';
	zone = '';
	hotzone = false;
};

function getOneZoneData () {
	var name;
	var opentime;
	var add;
	var tel;
	var ticketinfo;
	var picture;

	for (var i = 0; i < spotDataLength; i++) {
		if (jsonData.result.records[i].Zone == zone ){
				noData = false;
				el_message.textContent ='';
				name       = jsonData.result.records[i].Name;
				opentime   = jsonData.result.records[i].Opentime;
				add        = jsonData.result.records[i].Add;
				tel        = jsonData.result.records[i].Tel;
				ticketinfo = jsonData.result.records[i].Ticketinfo;
				picture    = jsonData.result.records[i].Picture1;
				putDataOnPage(i, name, opentime, add, tel, ticketinfo, picture);

				// Google map
				var str = {};
				var place = {};
				place.lng = parseFloat(jsonData.result.records[i].Px);
				place.lat = parseFloat(jsonData.result.records[i].Py);
				str.map = map;
				str.title = jsonData.result.records[i].Name;
				str.position = place;
				new google.maps.Marker(str);
		}
	}
	if (noData){el_message.textContent ='查無資料';};
	noData = true;
};

function getAllZoneData () {
	var name;
	var opentime;
	var add;
	var tel;
	var ticketinfo;
	var picture;

	for (var i = 0; i < spotDataLength; i++) {
		name       = jsonData.result.records[i].Name;
		opentime   = jsonData.result.records[i].Opentime;
		add        = jsonData.result.records[i].Add;
		tel        = jsonData.result.records[i].Tel;
		ticketinfo = jsonData.result.records[i].Ticketinfo;
		picture    = jsonData.result.records[i].Picture1;
		putDataOnPage(i, name, opentime, add, tel, ticketinfo, picture);
	}
};

function putDataOnPage (i, name, opentime, add, tel, ticketinfo,picture) {
	strData += ('<li><div class="spotImgsFrame"><img src="'+ picture +'">')
	strData += ('<h3 id="spotName">'  + name + '</h3> <h3 id="spotZone">' + zone);
	strData += ('</h3> </div> <div class="spotInformation" id="'+ i +'">');
	strData += ('<p> <img src="imgs/icons_clock.png">' + opentime + '</p>');
	strData += ('<p> <img src="imgs/icons_pin.png">' + add + '</p>');
	strData += ('<p> <img src="imgs/icons_phone.png">' + tel + '&nbsp&nbsp&nbsp&nbsp' );
	strData += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
	strData += '<img src="imgs/icons_tag.png"> </p></div></li> ';
};

function getHotZoneData (e) {
	if( e.target.nodeName !== 'LI') {return};
	zone = e.target.textContent;
	hotzone = true;
	getDataAndShow();
};

function buildMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 22.654423, lng: 120.385375},
        zoom: 11,
		});
};