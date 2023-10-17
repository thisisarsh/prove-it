"use strict"
const $ = x => document.getElementById(x);
const backendurl =   "https://test-video123.herokuapp.com"// "http://localhost:4000"//
let roomSession;
var speakerStatus = true, videoStatus = true, micStatus = true, callStatus = true;


// Simple js to control when forms appear
function gotopage(pagename) {
   if (pagename === "videoroom") {
        changeButtonStatus();
        $("videoroom").style.display = "block"
        $("loading").style.display = "none"
    }
    else {
        $("videoroom").style.display = "none"
        $("loading").style.display = "block"
    }
}

function changeButtonStatus(){
    if(speakerStatus){
        $("speaker-inactive").style.display = "none"
        $("resolution-icon").style.display = "block" 
    }else{
        $("speaker-inactive").style.display = "block"
        $("resolution-icon").style.display = "none" 
    }

    if(videoStatus){
        $("video-inactive").style.display = "none"
        $("video-active").style.display = "block" 
    }else{
        $("video-inactive").style.display = "block"
        $("video-active").style.display = "none" 
    }

    if(micStatus){
        $("mic-inactive").style.display = "none"
        $("mic-active").style.display = "block" 
    }else{
        $("mic-inactive").style.display = "block"
        $("mic-active").style.display = "none" 
    }

        $("call-inactive").style.display = "block"
}

async function joing(){
	var url = new URL(window.location);
	var username = url.searchParams.get("name");
	var roomname = url.searchParams.get("id");
	
	console.log("The user picked username", username)
	gotopage("loading")

	try {
		let token = await axios.post(backendurl + "/get_token", {
			user_name: username,
			room_name: roomname
		});
		console.log(token.data)
		token = token.data.token

		try {
			console.log("Setting up RTC session")
			roomSession = new SignalWire.Video.RoomSession({
				token,
                userName:"Ali",
				rootElement: document.getElementById('root'),
				audio: true,
				video: true,
                callerName:'Ali',
                callerNumber:"+1223345",
                remoteCallerName:"test"
			})

            roomSession.on("video.member.updated.audio_muted", e => {
                changeMicStatus(e)
                console.log(`Mic status is ${e}`,e)
            })
            roomSession.on("video.member.updated.output_volume", e => {
                // changeSpeakerStatus(e)
                console.log(`speaker status is ${e}`,e)
            })
            roomSession.on("video.member.updated.video_muted", e => {
                changeVideoStatus(e)
                console.log(`video status is ${e}`)
            })
            roomSession.on("room.updated", e => {
                // changeVideoStatus(e)
                console.log(`update`, e)
                // logevent(`update ${e}`)
            })

            
			roomSession.on("room.joined", e => logevent("You joined the room"))
			roomSession.on("member.joined", e => logevent(e.member.name + " has joined the room"))
			roomSession.on("member.left", e => logevent(e.member.id + " has left the room"))

			await roomSession.join()
		} catch (error) {
			console.error('Something went wrong', error)
		}

		gotopage("videoroom")
	} catch (e) {
		console.log(e)
		alert("Error encountered. Please try again.")
		// gotopage("getusername")
	}
	
}

async function micChange(){
    if (roomSession) {
        if(!micStatus){
            await roomSession.audioUnmute()
        }else{
            await roomSession.audioMute()
        }
    }

}

async function speakerChange(){
    if (roomSession) {
        if(!speakerStatus){
            await roomSession.audioUnmute()
        }else{
            await roomSession.audioMute()
        }
    }
}

async function videoChange(){
    if (roomSession) {
        if(!videoStatus){
            await roomSession.videoUnmute()
        }else{
            await roomSession.videoMute()
        }
    }
}

async function dismisCall(){
    if (roomSession) {
        // window.communicationname.postMessage("native,,,pop,");

        // window.flutter_inappwebview.callHandler('myHandlerName', 12, 2, 50).then(function(result) {
        //     // get result from Flutter side. It will be the number 64.
        //     console.log(result);
        //   });
        // await roomSession.leave();
        await roomSession.hangup()

        window.location = "closeApp://www.yoururl.com";

    }
}


// async function changeVideoStatus(e) {
//     console.log(e.member.video_muted);
//     if(e.member.video_muted){
//         videoStatus = false;
//     }else{
//         videoStatus = true;
//     }
//     changeButtonStatus();
// }

async function changeMicStatus(e){
    console.log(e.member.audio_muted);
    if(e.member.audio_muted){
        micStatus = false;
    }else{
        micStatus = true;
    }
    changeButtonStatus();
}

async function
changeSpeakerStatus(e){
    console.log(e.member.video_muted);
}

function logevent(message) {
	console.log(message);
    //$("events").innerHTML += "<br/>" + message;
}


function getLocalStream() {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( stream => {
        window.localStream = stream;
        window.localAudio.srcObject = stream;
        window.localAudio.autoplay = true;
    }).catch( err => {
        console.log("u got an error:" + err)
    });
}

getLocalStream();

