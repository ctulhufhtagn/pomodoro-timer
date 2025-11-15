import { getSound } from './sound-loader.js'

export function playSound(currentMode) {

    getSound(currentMode);

    let song = getSound(currentMode);

    if (!song) {
        console.log('Звук не найден');
        return;
    }

    song.currentTime = 0;
    song.play();

    setTimeout(() => {
        song.pause();
    }, 4250)

    console.log(song);
}