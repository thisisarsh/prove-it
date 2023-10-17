// const backendurl = "https://test-video123.herokuapp.com" //"http://10.200.200.37:4000"
const environment = 'staging';
const backendurl =  environment === 'staging' ? "https://devapi.hometrumpeter.com" : "http://localhost:3000";
var roomSession;
var speakerStatus = true, videoStatus = true, micStatus = true, callStatus = true;

var username = '';
var roomname = '';
var vseconds = 0
var userId = null
var vinterval = null
var isRecordUpdated = false

window.addEventListener('beforeunload', (event) => {
    console.log("Before Unload");
    console.log("UserId: ", userId);
    saveVideoCallSeconds()
});


$(function (_doc) {
    gotopage("loading")
    loadAsset();

});


async function loadAsset() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        window.localStream = stream;
        join();
    }).catch(err => {
        if(err.includes('NotReadableError')){
            alert("Could not start video or audio source");
        }
        else{
            alert("Permission denied: Camera or microphone is blocked");
        }
        console.log("Something went wrong. Error: " + err)
    });
}

async function join() {
    var url = new URL(window.location);
    username = url.searchParams.get("userName");
    roomname = url.searchParams.get("id");
    userId = url.searchParams.get("userId");
    receiverId = url.searchParams.get("receiverId");

    if (username && roomname) {
        try {
            let tokenResponse = await axios.post(backendurl + "/video/join-room", {
                userName: username,
                roomId: roomname,
                userId: userId,
                receiverId: receiverId
            });

            try {
                if(!tokenResponse?.data?.isSuccess) throw tokenResponse?.data
                let room = tokenResponse?.data?.data
                console.log("Setting up RTC session", )
                var _session = {
                    token: room?.token || '',
                    'custom': { username },
                    rootElement: document.getElementById('root'),
                    name: username
                };

                roomSession = new SignalWire.Video.RoomSession(_session)

                roomSession.on("member.updated.audio_muted", e => {

                    const muted = e.member.audio_muted;
                    const memberId = e.member.id;

                    console.log(`${e.member.name} ${muted ? 'muted' : 'unmuted'} mic`);

                    if ($('#members').is(":visible")) {
                        updateIcon('mic', memberId, muted);
                    }

                })


                // roomSession.on("room.member.audio_mute", e => {

                //     changeMicStatus(e)

                //     console.log(`Mic status is ${e}`)
                // })

                // roomSession.on("room.member.audio_unmute", e => {

                //     changeMicStatus(e)

                //     console.log(`Mic status is ${e}`)
                // })


                // roomSession.on("room.self.audio_mute", e => {

                //     changeMicStatus(e)

                //     console.log(`self Mic status is ${e}`,roomSession.getMembers())
                // })
                // roomSession.on("video.member.updated.output_volume", e => {
                //     // changeSpeakerStatus(e)
                //     console.log(`speaker status is ${e}`,e)
                // })


                roomSession.on("video.member.updated.deaf", e => {
                    // changeSpeakerStatus(e)
                    console.log(`video.member.updated.deaf`, e)
                });
                roomSession.on("video.member.updated.undeaf", e => {
                    // changeSpeakerStatus(e)
                    console.log(`speaker undeaf status is`, e)
                });
                roomSession.on("video.member.updated.video_muted", e => {
                    const muted = e.member.video_muted;
                    console.log(`${e.member.name} ${muted ? 'muted' : 'unmuted'} video`);

                    const memberId = e.member.id;
                    updateIcon('video', memberId, muted);

                });
                roomSession.on("room.updated", e => {
                    console.log(`room.updated`, e)
                });


                roomSession.on("room.left", async e => {
                    roomSession.on("room.left", async e => {
                        // console.log("room.left", e);
                        console.log('memberId', roomSession.activeRTCPeerId);
                        //roomSession.options.requestTimeout //time out seconds set on server in how much seconds a member is kicked out.
                        // console.log('state', roomSession.prevState);

                        //session ended, user was kicked out
                        if (roomSession.cause?.length && roomSession.cause === "NORMAL_CLEARING") {
                            console.log('I was kicked out, memberId : ', roomSession.activeRTCPeerId);
                            //send request to mark room as inactive now
                        }
                        // console.log('members Count', roomSession);
                        hideAllWidgets();
                        showCloseWindowMessage('Sorry, your time is up. You can close this window.');
                    });
                });

                roomSession.on("room.joined", async e => {
                    console.log("room.joined", e);
                    vinterval = setInterval(function() {
                        vseconds++
                        console.log(vseconds + ' seconds');
                    }, 1000)
                    
                    // showTimer(room.sessionDuration);
                    // const membersResult = await roomSession.getMembers();
                    // const members = membersResult?.members;
                    // const currentMember = await getCurrentMember();
                    // const membersOtherThenSelf = membersResult?.members?.filter(m => m.id !== currentMember?.id).length
                    // let otherMemberIds = [];
                    // if (membersOtherThenSelf > 1) {
                    //     //loop through all the members and then decide what layout to set
                    //     for (const member of members) {
                    //         if (member.id !== currentMember?.id) { }
                    //     }
                    // }
                    // else {
                    //     const member = membersResult?.members?.find(m => m.id !== currentMember?.id);
                    //     otherMemberIds.push(member?.name || 'No Name');
                    // }
                    // postions = {};
                    // // postions[e.member_id] = "reserved-1";
                    // // postions[e.member.id] = "auto";
                    // if (roomSession.memberId === e.member_id) {
                    //     // await roomSession.setLayout({

                    //     //     name: 'highlight-1-responsive',
                    //     //     positions: postions
                    //     // });
                    //     // await roomSession.setMemberPosition({
                    //     //     memberId: e.member_id,
                    //     //     position: "reserved-1",
                    //     // });
                    // }
                    // else {

                    // }

                    //   await roomSession.setMemberPosition({
                    //     memberId: e.member_id,
                    //     position: "reserved-1",
                    //   });


                });


                roomSession.on("member.joined", e => {
                    logevent(e.member.name + " has joined the room")
                    addUserInDrawer(e.member.id, e.member.name, e.member.audio_muted, e.member.video_muted);
                    playSound('join.mp3');
                    //show alert that user joined
                    addToast({
                        text: `#${e.member.name}# joined`,
                        type: 'info',
                        time: 3000
                    })
                });
                roomSession.on("member.left", e => {
                    logevent(e.member.id + " has left the room", [e]);
                    removeUserFromDrawer(e.member.id);
                    //show alert when user left
                    // toggleSnackbar(`${e.member.name} left`);
                    playSound('drop.mp3');
                    addToast({
                        text: `#${e.member.name}# left`,
                        type: 'error',
                        time: 3000
                    })
                    //pl
                });

                await roomSession.join();
                // await roomSession.setMeta({ "displayname": username });
                // await roomSession.setLayout({ name: 'highlight-1-responsive' });

                let cams = await SignalWire.WebRTC.getCameraDevicesWithPermissions();
                console.log('cameras', cams);





            } catch (error) {
                // console.error('Something went wrong', error)
                if (error?.code === '403' || error?.statusCode == 403) {
                    setTimeout(function () {
                        $("#videoroom").hide();
                    }, 1000);
                    hideAllWidgets();
                    showCloseWindowMessage('You are not authorized to join the session.');
                }


            }

            gotopage("videoroom")
        } catch (e) {
            console.log(e)
            alert("Error encountered. Please try again.")
            // gotopage("getusername")
        }
    } else {
        console.log('no username and roomname');
        dismisCall();
    }



}

function updateIcon(type, memberId, muted) {
    const active = 'active';
    const inActive = 'inactive';

    $("#members-menu").find(`#${memberId}`).find(`img#${type}-${memberId}`)
        .attr('src', `images/${type}-${muted ? inActive : active}.png`);
}

function removeUserFromDrawer(memberId) {
    $("#members-menu").find(`#${memberId}`).remove();
}

function addUserInDrawer(memberId, memberName, audio_muted, video_muted) {
    //for avatar
    //<img class="userAvatar" src="images/user-icon.svg" alt="icon">
    const active = 'active';
    const inActive = 'inactive';
    const initials = memberName.match(/(\b\S)?/g).join("").toUpperCase();
    const li = `<li id="${memberId}"><i class="initials">${initials[0]}</i><span>${memberName || 'no name'}</span>
    <img id="mic-${memberId}" src="images/mic-${audio_muted ? inActive : active}.png" alt="icon">
    <img id="video-${memberId}" src="images/video-${video_muted ? inActive : active}.png" alt="icon">
    </li>`;
    $("#members-menu").append(li);
}

function gotopage(pagename) {
    if (pagename === "videoroom") {
        // changeButtonStatus();

        // $('#videoroom').fadeIn(3000);
        $('#videoroom').toggle('slide');
        $('#loading').fadeOut('slow');
    }
    else {
        $("#videoroom").hide();
        $("#loading").show();
    }
}

async function onMicChange(off) {
    if (roomSession) {
        logevent('mic change', (await getCurrentMember())?.name)
        await toggleMic(off);
    }

}

async function toggleMic(off) {
    if (off) {
        await roomSession.audioUnmute();
    } else {
        await roomSession.audioMute();
    }
    $("#mic-active,#mic-inactive").toggle();
}


async function getCurrentMember() {
    const membersResult = await roomSession.getMembers();
    if (membersResult.members?.length > 0) {
        return membersResult.members.find(v => v.id === roomSession.memberId)
    }
    return {};
}


async function onVideoChange(off) {
    if (roomSession) {
        logevent('video change', (await getCurrentMember())?.name)
        await toggleVideo(off);
    }
}

async function toggleVideo(off) {
    if (off) {
        await roomSession.videoUnmute()
    } else {
        await roomSession.videoMute()
    }
    $("#video-active,#video-inactive").toggle();
}

// async function updateMembersSection(isDrawerClicked) {
//     const membersResult = await roomSession.getMembers();
//     const currentMember = await getCurrentMember();
//     if (membersResult?.members?.filter(m => m.id !== currentMember?.id).length) {
//         if (isDrawerClicked)
//             $('#updown-icon').addClass('flip');
//         const active = 'active';
//         const inActive = 'inactive';
//         const members = membersResult?.members;
//         console.log('members', members);
//         if (members?.filter(m => m.id !== currentMember?.id).length) {
//             if (isDrawerClicked)
//                 $('#members-menu').html("");
//         }
//         for (const member of members) {
//             if (isDrawerClicked) {
//                 if (member.id !== currentMember?.id) {
//                     $("#members-menu").append(`<li id="${member.id}"><span>${member.name || 'no name'}</span>
//                 <img id="mic-${member.id}" src="images/mic-${member.audio_muted ? inActive : active}.png" alt="icon">
//                 <img id="video-${member.id}" src="images/video-${member.video_muted ? inActive : active}.png" alt="icon">
//                 </li>`);
//                 }
//             }
//             else {
//                 if ($("#members-menu").find(`#${member.id}`)) {

//                 }
//             }
//         }
//     }
// }
async function onUpDownDrawer() {
    if (!$('#members').is(":visible")) {
        $('#members').toggle('slow')
        const membersResult = await roomSession.getMembers();
        const currentMember = await getCurrentMember();
        if (membersResult?.members?.filter(m => m.id !== currentMember?.id).length) {
            $('#updown-icon').addClass('flip');
            const active = 'active';
            const inActive = 'inactive';
            const members = membersResult?.members;
            console.log('members', members);
            if (members?.filter(m => m.id !== currentMember?.id).length) {
                $('#members-menu').html("");
            }
            for (const member of members) {
                if (member.id !== currentMember?.id) {
                    addUserInDrawer(member.id, member.name || 'no name', member.audio_muted, member.video_muted);
                }
            }
        }
        else {
            alert('No members');
        }
    }
    else {
        $('#updown-icon').removeClass('flip');
        $('#members').toggle('slow')

    }
}

async function dismisCall() {
    $("#videoroom,#loading,.actionWidget").hide();
    $("#closeWindowMsg").show();
    if (roomSession) {
        await roomSession.leave();
        // await roomSession.hangup()
    }
    window.location = "closeApp://www.yoururl.com";
    saveVideoCallSeconds()
    window.close()
}

function hideAllWidgets() {
    $("#videoroom,#loading,.actionWidget").hide();
}

function showCloseWindowMessage(message) {
    // if (!message) message = 'You can close this window';
    $("#closeWindowMsg").html(message);
    $("#closeWindowMsg").show();
}

//not used
async function speakerChange() {
    roomSession.getLayouts().then(list => console.log('layouts', list.layouts));
    // roomSession.setLayout({name: "10x10"}).then(output => console.log(output));
    // if (roomSession) {
    //     if (!speakerStatus) {
    //         await roomSession.undeaf()
    //     } else {
    //         await roomSession.deaf()
    //     }
    // }
}

function logevent(message, args) {
    console.log(`${message}`, args);
}


let layoutIndex = 0;
async function toggle_layout() {
    if (roomSession === undefined) return;
    const masterlayouts = ["8x8", "full-screen", "2x1", "screen-share-2", "1x1", "screen-share", "5up", "5x5", "4x4", "10x10", "2x2", "6x6", "3x3", "grid-responsive", "highlight-1-responsive"];
    let nLayouts = masterlayouts.length;
    // console.log('layouts.layouts', layouts.layouts)
    // console.log(layoutIndex++, nLayouts);
    // let newLayout = layouts.layouts[layoutIndex++ % nLayouts];
    // $("layout_indicator").innerText = newLayout;

    const availableLayouts = ["highlight-1-responsive", "grid-responsive", "full-screen"];
    let newLayout = availableLayouts[layoutIndex++ % availableLayouts.length];
    console.log("switching to layout ", newLayout);
    await roomSession.setLayout({ name: newLayout });

}

async function toggleCamera() {
    const selectedCameraKey = 'selectedCamera';
    let cams = await SignalWire.WebRTC.getCameraDevicesWithPermissions();
    if (!cams?.length || cams.length === 1) return;
    let selectedCameraDeviceId = localStorage.getItem(selectedCameraKey);
    let cameraDeviceId = '';
    if (!selectedCameraDeviceId)
        cameraDeviceId = cams[1]?.deviceId;
    else {
        let selectedIndex = cams.findIndex(f => f.deviceId != selectedCameraDeviceId);
        cameraDeviceId = cams[selectedIndex++ % cams.length]?.deviceId;
    }
    localStorage.setItem(selectedCameraKey, cameraDeviceId)
    await roomSession.updateCamera({ deviceId: cameraDeviceId });
}

function addToast(option) {
    const id = Date.now();
    option.id = id;
    $("#toaster").css('display', 'block');
    $("#toasts").prepend(slice(option));
    setTimeout(() => {
        removeToast(id);
    }, option.time)
}

function removeToast(id) {
    $(`#${id}`).slideUp('fast', remove);

    function remove() {
        $(`#${id}`).remove();
        if (!$("toasts").children()) {
            $("toaster").css('display', 'none');
        }
    }
}

function slice(option) {
    const memberName = option.text.substr(option.text.indexOf('#') + 1, option.text.lastIndexOf('#') - 1);
    const initials = memberName.match(/(\b\S)?/g).join("").toUpperCase();
    let toast = $(`<div class="type ${option.type}" id="${option.id}"><i class="initials">${initials}</i><span class="text"></span></div>`)

    $(toast).find('.text').text(option.text.replace(/#/g, ''));
    return toast;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        if (minutes === 0 && seconds === 30) {
            playSound('runningOutOfTime.wav');
        }
        if (minutes === 0 && seconds < 30) {
            $('#clockStyle').addClass('blink');
        }
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = 'Session expires in ' + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            document.getElementById("timerDiv").innerHTML = "EXPIRED";
            dismisCall()
        }
    }, 1000);
}

function showTimer(duration) {
    const callDurationMinutes = duration;
    var callDurationSecods = 60 * callDurationMinutes,
        display = document.querySelector('#timerDiv');
    startTimer(callDurationSecods, display);
}

function playSound(name) {
    var audio = new Audio(`sounds/${name}`);
    audio.play();
}

async function saveVideoCallSeconds() {
    if(isRecordUpdated == false){
        isRecordUpdated = true
        console.log("Before updating user seconds");
        await axios.patch(backendurl+"/plan/user-plan/minutes", {
            userId: userId,
            seconds: vseconds
        }).catch(e => console.log("ERROR", e))
        vseconds = 0
        userId = null
        clearInterval(vinterval);
    }
}