// ===== DATA SIMULASI =====
const kecamatanPoints = [
    {name:"Sumenep Kota", lat:-7.033, lon:113.916, forecast24:{ "08:00":"Cerah","09:00":"Hujan Ringan","10:00":"Cerah","11:00":"Hujan Sedang","12:00":"Cerah","13:00":"Cerah" }},
    {name:"Batang-Batang", lat:-7.050, lon:113.950, forecast24:{ "08:00":"Hujan Ringan","09:00":"Hujan Sedang","10:00":"Cerah","11:00":"Cerah","12:00":"Cerah","13:00":"Hujan Ringan" }},
    {name:"Gapura", lat:-7.010, lon:113.900, forecast24:{ "08:00":"Cerah","09:00":"Cerah","10:00":"Cerah","11:00":"Cerah","12:00":"Cerah","13:00":"Cerah" }},
    {name:"Talango", lat:-7.088715, lon:114.013120, forecast24:{ "08:00":"Cerah","09:00":"Hujan Ringan","10:00":"Cerah","11:00":"Cerah","12:00":"Hujan Ringan","13:00":"Cerah" }},
    {name:"Kalianget Timur", lat:-7.0482616, lon:113.9413337, forecast24:{ "08:00":"Hujan Ringan","09:00":"Cerah","10:00":"Cerah","11:00":"Hujan Ringan","12:00":"Cerah","13:00":"Cerah" }},
    {name:"Kalianget Barat", lat:-7.0361048, lon:113.9253768, forecast24:{ "08:00":"Cerah","09:00":"Cerah","10":"Hujan Ringan","11":"Cerah","12":"Cerah","13":"Hujan Ringan" }},
    {name:"Bluto", lat:-7.113049, lon:113.802597, forecast24:{ "08:00":"Hujan Sedang","09:00":"Hujan Ringan","10:00":"Cerah","11:00":"Cerah","12:00":"Cerah","13:00":"Hujan Ringan" }},
    {name:"Saronggi", lat:-7.0841005, lon:113.8204769, forecast24:{ "08:00":"Cerah","09:00":"Cerah","10:00":"Hujan Ringan","11:00":"Hujan Sedang","12:00":"Cerah","13:00":"Cerah" }}
];

// ===== GAME =====
const kecSelect = document.getElementById('kecamatanSelect');
kecamatanPoints.forEach(k=>kecSelect.add(new Option(k.name,k.name)));

document.getElementById('submitGuess').addEventListener('click',()=>{
    const kec = kecSelect.value;
    const guess = document.getElementById('cuacaGuess').value;
    const jamNow = "09:00";
    const actual = kecamatanPoints.find(k=>k.name===kec).forecast24[jamNow];
    const feedback = document.getElementById('feedback');
    if(guess===actual){
        feedback.innerHTML="✅ Tebakan Benar! 🎉";
        feedback.style.color="green";
        feedback.classList.add("animateConfetti");
        setTimeout(()=>feedback.classList.remove("animateConfetti"),1000);
    } else {
        feedback.innerHTML=`❌ Salah! Cuaca sebenarnya: ${actual}`;
        feedback.style.color="red";
        feedback.classList.add("animateShake");
        setTimeout(()=>feedback.classList.remove("animateShake"),500);
    }
});

// ===== 5 HARI TERAKHIR =====
const last5daysTable = document.getElementById('last5daysTable');
let html = '<table><tr><th>Kecamatan</th>';
let hours = Object.keys(kecamatanPoints[0].forecast24);
hours.forEach(h=>html+=`<th>${h}</th>`);
html+='</tr>';

kecamatanPoints.forEach(k=>{
    html+=`<tr><td>${k.name}</td>`;
    Object.values(k.forecast24).forEach(val=>{
        let cls='';
        if(val==="Cerah") cls="cerah";
        else if(val==="Hujan Ringan") cls="hujan-ringan";
        else if(val==="Hujan Sedang") cls="hujan-sedang";
        else if(val==="Hujan Lebat") cls="hujan-lebat";
        html+=`<td class="${cls}">${val}</td>`;
    });
    html+='</tr>';
});
html+='</table>';
last5daysTable.innerHTML=html;

// ===== MAP =====
const map = L.map('map').setView([-7.033,113.916],11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OSM'}).addTo(map);

const forecastTable = document.getElementById('forecastTable');

function getStatusColor(status){
    switch(status){
        case "Cerah": return "yellow";
        case "Hujan Ringan": return "lightgreen";
        case "Hujan Sedang": return "orange";
        case "Hujan Lebat": return "red";
        default: return "blue";
    }
}

kecamatanPoints.forEach(k=>{
    const jamNow = "09:00";
    const marker = L.circleMarker([k.lat,k.lon],{
        color:getStatusColor(k.forecast24[jamNow]),
        fillColor:getStatusColor(k.forecast24[jamNow]),
        fillOpacity:0.7,
        radius:10
    }).addTo(map);

    marker.bindPopup(`<b>${k.name}</b>`);
    marker.on('click',()=>{
        let t='<table border="1" style="border-collapse:collapse;margin:auto;"><tr><th>Jam</th>';
        Object.keys(k.forecast24).forEach(h=>t+=`<th>${h}</th>`); t+='</tr><tr><td>Cuaca</td>';
        Object.values(k.forecast24).forEach(val=>{
            let cls='';
            if(val==="Cerah") cls="cerah";
            else if(val==="Hujan Ringan") cls="hujan-ringan";
            else if(val==="Hujan Sedang") cls="hujan-sedang";
            else if(val==="Hujan Lebat") cls="hujan-lebat";
            t+=`<td class="${cls}">${val}</td>`;
        });
        t+='</tr></table>';
        forecastTable.innerHTML=`<h4>${k.name}</h4>`+t;
    });
});
