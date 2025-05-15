const url = new URL(window.location.href);
const sParams = url.searchParams;
const nmusuario = sParams.get("nmusuario");
const idusuario = sParams.get("idusuario");
const regiao = sParams.get("regiao") || "AP";
const apikey = sParams.get("apikey");

const cssRoot = document.querySelector(":root").style;
const header = document.getElementById("headerburrao");
const winLoss = document.getElementById("WLvalue");
const rrBar = document.querySelector(".rr-fill");
const rrText = document.getElementById("mmratual");
const lastMatch = document.getElementById("ultimapartida");
const imgRank = document.getElementById("imgRank");
const mmrDisplay = document.getElementById("mmrDisplay");
const mmrValue = document.getElementById("mmrValue");
const mmrText = document.getElementById("mmrText");
const mmrBar = document.querySelector(".mmr-fill");
const mmrBarValue = document.getElementById("mmrBarValue");
const mmrBarText = document.getElementById("mmrBarText");
const mmrBarValueText = document.getElementById("mmrBarValueText");


if (!apikey || !nmusuario || !idusuario) {
    header.innerText = "Missing parameters";
    throw new Error("Required parameters missing");
}

function fetchPlayerData() {
    const apiUrl = `https://api.henrikdev.xyz/valorant/v2/mmr/${regiao}/${nmusuario}/${idusuario}?api_key=${apikey}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.status !== 200) {
                header.innerText = "Player not found";
                return;
            }

            const current = data.data.current_data;
            const season = data.data.by_season.e10a3 || {};

            const rank = current.currenttierpatched;
            const rr = current.ranking_in_tier;
            const mmrDiff = current.mmr_change_to_last_game;
            const wins = season.wins || 0;
            const games = season.number_of_games || 1;
            const winrate = Math.round((wins / games) * 100);

            header.innerText = `${rank} - ${rr}RR`;
            winLoss.innerText = `Win: ${wins} Lose: ${games - wins} (${winrate}%)`;
            rrText.innerText = `${rr}`;
            mmrDisplay.innerText = `MMR: ${current.elo}`;
            cssRoot.setProperty("--progresspontinho", `${rr}%`);

            lastMatch.innerText = `Last Match: ${mmrDiff > 0 ? "+" : ""}${mmrDiff} RR`;

            lastMatch.style.textShadow = "0 0 5px #000";
            lastMatch.style.transition = "color 0.3s ease-in-out";
            lastMatch.style.opacity = "1";
            lastMatch.style.textAlign = "center";
            lastMatch.style.marginTop = "10px";
            lastMatch.style.marginBottom = "10px";
            lastMatch.style.color = mmrDiff < 0 ? "#f87171" : "#4ade80";

            if (current.images && current.images.small) {
                imgRank.src = current.images.small;
            }
        })
        .catch(err => {
            header.innerText = "Error loading data";
            console.error(err);
        });
}

fetchPlayerData();
setInterval(fetchPlayerData, 30000);