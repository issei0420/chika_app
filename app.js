// 初期中心緯度経度
const init_center = [35.69, 139.695];
// 描画線分の初期緯度経度
const latlngs = [init_center];
// 初期線分
let pline;
// 初期地図表示実行イベント登録
window.onload = ()=> {
	const map = L.map("mapid").setView(init_center, 8);
	L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
		{
			attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>", 
			minZoom: 5, 
			maxZoom: 18, 
		}).addTo(map);
	// 地図クリック時イベントハンドラ登録
	map.on('click', e=>{ 
		pline.addLatLng(e.latlng); 
		const l_json = JSON.stringify(pline.getLatLngs());
		document.getElementById('loc').value = l_json;
	});
	map.on('contextmenu', e=>{
		let l = pline.getLatLngs();
		l.pop();
		pline.setLatLngs(l);
		document.getElementById('loc').value = JSON.stringify(l);
	});
	

	// 初期線分の地図上への表示
	pline = L.polyline(latlngs, { color: 'red', weight: 8 }).addTo(map);
	// id への初期表示
	document.getElementById('id').value = 0;
	// loc textareaへの初期表示
	document.getElementById('loc').value = JSON.stringify(latlngs);
	// form内 submitボタンへのイベントハンドラ登録
	document.getElementById('store').onclick = ()=> { storeAction() }
	document.getElementById('retrieve').onclick = ()=> { retrieveAction() }
}