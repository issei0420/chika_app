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
		// 土地情報を取得 (Heart API)
		const res = await fetch(`http://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x=${lng}.0&y=${lat}`);
		const place = await res.json();
		// 県と市を抽出
	    prefecture = place['response']['location'][0]['prefecture'];
	    city = place['response']['location'][0]['city'];
		let idx = 0;
		// 郡名と市名を削除
		for (let i in city) {
			if (city[i] == '郡') {
				city = city.slice(Number(i) + 1);
				break;
			}
			if (city[i] == '市' && city[Number(i) + 1]){
				city = city.slice(Number(i) + 1);
				break;
			}
		}
		// 画面表示
	    const thePlace = document.getElementById('input-place');
		thePlace.value = `${prefecture} ${city}`;
	}
	callApi();
}

// 地価を取得
function getPrice() {
	const prefectureCode = prefectureCodes[prefecture];
	async function callApi() {
		const res = await fetch(`https://www.land.mlit.go.jp/webland/api/CitySearch?area=${prefectureCode}`);
		const resJson = await res.json();
		const cityCodes = resJson['data'];
		let code;
		for (let i in cityCodes) {
			if (cityCodes[i]['name'] == city) {
				code = cityCodes[i]['id'];
			}
		}
		const res2 = await fetch(`https://www.land.mlit.go.jp/webland/api/TradeListSearch?from=20151&to=20152&city=${code}`);
		const res2Json = await res2.json();
		let sumPrice = 0;
		let getNumber = 0;
		for (data of res2Json['data']) {
			if ('PricePerUnit' in data) {
				sumPrice += Number(data['PricePerUnit']);
				getNumber += 1;
			}			
		}
		let pricePerUnit  = Math.floor(sumPrice / getNumber);
		console.log(pricePerUnit);
		console.log(sumPrice);
		console.log(getNumber);
		document.getElementById('getNumber').value = getNumber;
		document.getElementById('averagePrice').value = pricePerUnit.toLocaleString();
	}
	callApi();
}
