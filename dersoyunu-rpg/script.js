const API_URL = "https://script.google.com/macros/s/AKfycbxV_pNeaTpW58PEoIp9WwJQyGijhwdN8yOMJIYFeGZ875IXOolZEgf7G-ElUMW4A6rQ/exec";


// ======================
// REGISTER
// ======================
function register(){
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if(!username || !password){
        alert("Boş bırakma!");
        return;
    }

    fetch(API_URL + "?action=register&username=" + username + "&password=" + password)
    .then(res => res.text())
    .then(data => {
        alert(data);
        window.location.href = "login.html";
    });
}


// ======================
// LOGIN
// ======================
function login(){
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if(!username || !password){
        alert("Boş bırakma!");
        return;
    }

    fetch(API_URL + "?action=login&username=" + username + "&password=" + password)
    .then(res => res.text())
    .then(data => {
        data = data.trim();

        if(data == "giriş başarılı"){
            localStorage.setItem("username", username);
            window.location.href = "menu.html";
        }else{
            alert("Hatalı giriş");
        }
    });
}


// ======================
// ONLINE DURUM
// ======================
function onlineGuncelle(){
    let username = localStorage.getItem("username");

    if(!username) return;

    setInterval(() => {
        fetch(API_URL + "?action=online&username=" + username);
    }, 60000);
}


// ======================
// POMODORO → XP
// ======================
function pomodoroBitti(dakika){
    let username = localStorage.getItem("username");
    let xp = dakika * 2;

    fetch(API_URL + "?action=addXP&username=" + username + "&xp=" + xp + "&minutes=" + dakika)
    .then(res => res.text())
    .then(data => {
        alert("Pomodoro bitti! " + xp + " XP kazandın");
    });
}


// ======================
// GÖREV → COIN
// ======================
function gorevTamamla(coin){
    let username = localStorage.getItem("username");
    fetch(API_URL + "?action=addCoin&username=" + username + "&coin=" + coin);
}


// ======================
// ÖDÜL → COIN DÜŞ
// ======================
function odulAl(coin){
    let username = localStorage.getItem("username");

    fetch(API_URL + "?action=useCoin&username=" + username + "&coin=" + coin)
    .then(res => res.text())
    .then(data => {
        alert("Ödül satın alındı");
    });
}


// ======================
// PROFİL YÜKLE
// ======================
function profilYukle(){
    let username = localStorage.getItem("username");

    fetch(API_URL + "?action=getUser&username=" + username)
    .then(res => res.json())
    .then(user => {
        if(document.getElementById("xp"))
            document.getElementById("xp").innerText = user.xp;

        if(document.getElementById("level"))
            document.getElementById("level").innerText = user.level;

        if(document.getElementById("coin"))
            document.getElementById("coin").innerText = user.coin;

        if(document.getElementById("minutes"))
            document.getElementById("minutes").innerText = user.minutes;
    });
}


// ======================
// ARKADAŞ EKLE
// ======================
function arkadasEkle(){
    let to = document.getElementById("friendUser").value;
    let from = localStorage.getItem("username");

    fetch(API_URL + "?action=addFriend&from=" + from + "&to=" + to)
    .then(res => res.text())
    .then(data => alert(data));
}


// ======================
// İSTEKLERİ YÜKLE
// ======================
function istekleriYukle(){
    let username = localStorage.getItem("username");

    fetch(API_URL + "?action=getRequests&username=" + username)
    .then(res => res.json())
    .then(list => {
        let div = document.getElementById("requests");
        if(!div) return;

        div.innerHTML = "";

        if(list.length == 0){
            div.innerHTML = "İstek yok";
            return;
        }

        list.forEach(u => {
            div.innerHTML += `
                <div>
                    ${u}
                    <button onclick="istekKabul('${u}')">Kabul</button>
                </div>
            `;
        });
    });
}


// ======================
// İSTEĞİ KABUL ET
// ======================
function istekKabul(gonderen){
    let username = localStorage.getItem("username");

    fetch(API_URL + "?action=acceptFriend&from=" + gonderen + "&to=" + username)
    .then(res => res.text())
    .then(data => {
        alert("Arkadaş eklendi");
        istekleriYukle();
    });
}


// ======================
// ARKADAŞ LEADERBOARD
// ======================
function friendsLeaderboard(){
    let username = localStorage.getItem("username");

    fetch(API_URL + "?action=getFriendsLeaderboard&username=" + username)
    .then(res => res.json())
    .then(list => {
        let div = document.getElementById("board");
        if(!div) return;

        div.innerHTML = "";

        for(let i=0;i<list.length;i++){
            let user = list[i];

            div.innerHTML += `
                <div onclick="profilAc('${user[0]}')">
                    ${i+1}. ${user[0]} - Level ${user[3]} - ${Math.floor(user[5]/60)} saat
                </div>
            `;
        }
    });
}


// ======================
// ARKADAŞ PROFİLİ
// ======================
function profilAc(user){
    localStorage.setItem("profileUser", user);
    window.location.href = "friendProfile.html";
}