export function startVideo(video) {
    navigator.getUserMedia(
        {video : {}},
        stream => video.srcObject = stream,
        error => console.log(error)
    )
}
