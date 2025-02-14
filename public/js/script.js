let currentsong = new Audio();
let songs;
let currfolder;

function formatTime(seconds) {
    // Calculate minutes and remaining seconds

    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}

// // Example usage:
// const inputSeconds = 12;
// const formattedTime = formatTime(inputSeconds);
// console.log(formattedTime);  // Output: "00:12"


async function getsongs(folder) {
    currfolder = folder;
    const response = await fetch(`${folder}`);
    const songs = await response.json();

    // Display songs in the UI
    const songul = document.querySelector(".songlist ul");
    const songHTML = songs.map(song => `
        <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div class="title"> ${song.replaceAll("%20", " ")}</div>
                <div>sathvik</div>
            </div>
            <div class="playbtn">
                <span>play now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>
    `).join("");

    songul.innerHTML = songHTML;

    //atch event listner toeach song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".title").textContent.trim())
        })
    })

    // Add event listeners to each song
    Array.from(songul.children).forEach(li => {
        li.querySelector(".playbtn").addEventListener("click", () => {
            playmusic(li.querySelector(".title").textContent.trim());
        });
    });

    return songs;
}
//event listner for play,next,previous
play.addEventListener("click", (e) => {
    if (currentsong.paused) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    else {
        currentsong.pause()
        play.src = "img/play.svg"
    }
})

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track

    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}




async function displayAlbums() {
    try {
        // Fetch the list of album folders from the backend
        const response = await fetch(`http://localhost:3000/albums`);
        const folders = await response.json();
        const cardContainer = document.querySelector(".card-container");
        let cardsHTML = "";

        // Loop through folders to fetch metadata
        for (const folder of folders) {
            const metadataResponse = await fetch(`http://localhost:3000/songs/${folder}/info.json`);
            const metadata = await metadataResponse.json();

            // Add card HTML to the string
            cardsHTML += `
                <div class="card" data-folder="${folder}">
                    <div class="playButton">
                        <img src="img/play.png" alt="">
                    </div>
                    <img src="http://localhost:3000/songs/${folder}/cover.jpg" alt="${metadata.title}">
                    <h3>${metadata.title}</h3>
                    <p>${metadata.description}</p>
                </div>
            `;
        }

        // Update the DOM once
        cardContainer.innerHTML = cardsHTML;

        // Add event listeners to cards
        Array.from(document.getElementsByClassName("card")).forEach(card => {
            card.addEventListener("click", async () => {
                const folder = card.dataset.folder;
                songs = await getsongs(`songs/${folder}`);
                playmusic(songs[0]);
            });
        });
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

function search() {
    for (let i = 0; i < li.length; i++) {
        let txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toLowerCase().includes(input)) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}



    async function main() {

        // get the list of all songs 

        songs = await getsongs("songs/cs")
        

        if (songs && songs.length > 0) {
            playmusic(songs[0], true); // Play the first song (paused)
        } else {
            console.error("No songs found in the folder.");
        }

        // display all the albums in the page 

        displayAlbums()



        // listen for time update event

        currentsong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;

            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        })

        // evnt to sekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = (currentsong.duration * percent) / 100;
        })

        //add event to for hambureger
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0"
        })

        //add event for close
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-125%"
        })

        //add event listner to previous
        previous.addEventListener("click", () => {
            let songurl = decodeURI(currentsong.src.split("/").pop()) 
            let index = songs.indexOf(songurl)

            if ((index - 1) >= 0) {
                playmusic(songs[index - 1])
            }
        })

        //add event listner to next
        next.addEventListener("click", () => {
            let songurl = decodeURI(currentsong.src.split("/").pop())
            let index = songs.indexOf(songurl)

            if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }

        })

        //add event to volume

        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            currentsong.volume = parseInt(e.target.value) / 100
        })


        // add event to mute the track 
        document.querySelector(".volume>img").addEventListener("click", e => {
            if (e.target.src.includes("img/volume.svg")) {
                e.target.src = "img/mute.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
                currentsong.volume = 0;
            } else {
                e.target.src = "img/volume.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
                currentsong.volume = 0.1;
            }
        })

        











    }

    main()

