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
const peakRankText = document.getElementById("peakRankText");
const peakRankIcon = document.getElementById("peakRankIcon");
const peakRank = document.getElementById("peakRank");
const tierMovementIcon = document.getElementById("tierMovementIcon");


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
            const peak = data.data.highest_rank.patched_tier || "Unknown";

            const rank = current.currenttierpatched;
            const rr = current.ranking_in_tier;
            const mmrDiff = current.mmr_change_to_last_game;
            const wins = season.wins || 0;
            const games = season.number_of_games || 1;
            const winrate = Math.round((wins / games) * 100);

            header.innerText = `${rank} - ${rr}RR`;
            winLoss.innerText = `Win: ${wins} Lose: ${games - wins} (${winrate}%)`;
            rrText.innerText = `${rr}`;
            // mmrDisplay.innerText = `MMR: ${current.elo}`;
            document.getElementById("peakRankText").innerText = peak;

            let peakIcon = "./Resources/Unranked.png";

            if (peak.includes("Iron 1")) peakIcon = "./Resources/3.png";
            else if (peak.includes("Iron 2")) peakIcon = "./Resources/4.png";
            else if (peak.includes("Iron 3")) peakIcon = "./Resources/5.png";
            else if (peak.includes("Bronze 1")) peakIcon = "./Resources/6.png";
            else if (peak.includes("Bronze 2")) peakIcon = "./Resources/7.png";
            else if (peak.includes("Bronze 3")) peakIcon = "./Resources/8.png";
            else if (peak.includes("Silver 1")) peakIcon = "./Resources/9.png";
            else if (peak.includes("Silver 2")) peakIcon = "./Resources/10.png";
            else if (peak.includes("Silver 3")) peakIcon = "./Resources/11.png";
            else if (peak.includes("Gold 1")) peakIcon = "./Resources/12.png";
            else if (peak.includes("Gold 2")) peakIcon = "./Resources/13.png";
            else if (peak.includes("Gold 3")) peakIcon = "./Resources/14.png";
            else if (peak.includes("Platinum 1")) peakIcon = "./Resources/15.png";
            else if (peak.includes("Platinum 2")) peakIcon = "./Resources/16.png";
            else if (peak.includes("Platinum 3")) peakIcon = "./Resources/17.png";
            else if (peak.includes("Diamond 1")) peakIcon = "./Resources/18.png";
            else if (peak.includes("Diamond 2")) peakIcon = "./Resources/19.png";
            else if (peak.includes("Diamond 3")) peakIcon = "./Resources/20.png";
            else if (peak.includes("Ascendant 1")) peakIcon = "./Resources/21.png";
            else if (peak.includes("Ascendant 2")) peakIcon = "./Resources/22.png";
            else if (peak.includes("Ascendant 3")) peakIcon = "./Resources/23.png";
            else if (peak.includes("Immortal 1")) peakIcon = "./Resources/24.png";
            else if (peak.includes("Immortal 2")) peakIcon = "./Resources/25.png";
            else if (peak.includes("Immortal 3")) peakIcon = "./Resources/26.png";
            else if (peak.includes("Radiant")) peakIcon = "./Resources/27.png";

            peakRankIcon.src = peakIcon;

            cssRoot.setProperty("--progresspontinho", `${rr}%`);

            lastMatch.innerText = `Last Match: ${mmrDiff > 0 ? "+" : ""}${mmrDiff} RR`;
            lastMatch.style.color = mmrDiff < 0 ? "#f87171" : "#4ade80";

            // Determine icon just by RR change
            let movementIcon = "";
            let showIcon = true;

            if (mmrDiff >= 18) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_MajorIncrease.png";
            } else if (mmrDiff >= 10) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_MinorIncrease.png";
            } else if (mmrDiff > 0) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_Promoted.png";
            } else if (mmrDiff <= -21) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_MajorDecrease.png";
            } else if (mmrDiff <= -10) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_MediumDecrease.png";
            } else if (mmrDiff < 0) {
                movementIcon = "./Resources/TX_CompetitiveTierMovement_MinorDecrease.png";
            } else {
                showIcon = false;
            }

            if (showIcon) {
                tierMovementIcon.src = movementIcon;
                tierMovementIcon.style.display = "inline-block";
            } else {
                tierMovementIcon.style.display = "none";
            }

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