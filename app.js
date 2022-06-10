// 初期中心緯度経度
const init_center = [35.69, 139.695];
// 初期地図表示実行イベント登録
window.onload = ()=> {
	const map = L.map("mapid").setView(init_center, 5);
	L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
		{
			attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", 
			minZoom: 5, 
			maxZoom: 18, 
		}).addTo(map);
	// クリック時の緯度・経度取得
	map.on('click', e=>{ 
		const lat = e.latlng.lat;
		const lng = e.latlng.lng;
		alert("lat: " + lat + ",lng: " + lng);
		getPlace(lat, lng);
	});
}

// 市町村名を取得
function getPlace (lat, lng) {
	const request = new XMLHttpRequest();

	request.open('GET', 'http://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x=135.0&y=35.0', true);
	request.responseType = 'json';

	request.onload = function () {
		const data = this.response;
		console.log(data);
	}
	request.send();
}