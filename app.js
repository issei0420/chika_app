let prefecture;
let city;

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
	// イベントハンドラ設定
	// クリック時の緯度・経度取得
	map.on('click', e=>{ 
		const lat = e.latlng.lat;
		const lng = e.latlng.lng;
		getPlace(lat, lng);
	});
	document.getElementById('send').onclick = () => {
		getPrice();
		return false;
	}
}

// 市町村名を取得
function getPlace (lat, lng) {
	async function callApi() {
		// 土地情報を取得 (Heart)
		const res = await fetch(`http://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x=${lng}.0&y=${lat}`);
		const place = await res.json();
		// 県と市を抽出
	    prefecture = place['response']['location'][0]['prefecture'];
	    city = place['response']['location'][0]['city'];
		// 画面表示
	    const thePlace = document.getElementById('input-place');
		thePlace.value = `${prefecture} ${city}`;
	}
	callApi();
}

function getPrice() {
	const prefectureCode = prefectureCodes[prefecture];
	async function callApi() {
		const res = await fetch(`https://www.land.mlit.go.jp/webland/api/CitySearch?area=${prefectureCode}`);
		const resJson = await res.json();
		console.log(resJson);
		const cityCodes = resJson['data'];
		let code;
		for (let i in cityCodes) {
			if (cityCodes[i]['name'] == city) {
				code = cityCodes[i]['id'];
			}
		}	
	}
	callApi();
}
