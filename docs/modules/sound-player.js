import { getSound, melodies, selectSound, soundConfig, updateSoundModal } from './sound-loader.js'
import { volumeSlider, muteBtn } from './dom-manager.js';

let isMuted = false;
export let globalVolume = 0.5;
let savedVolume = globalVolume;
let soundSettings = null

volumeSlider.addEventListener('input', function () {

    globalVolume = this.value / 100

    if (globalVolume === 0 && !isMuted) {
        isMuted = true;
        muteBtn.textContent = '🔇';
    } else if (globalVolume > 0 && isMuted) {
        isMuted = false;
        muteBtn.textContent = '🔊';
    }

    if (globalVolume > 0) {
        savedVolume = globalVolume;
    }

    saveSoundSettings();

    const soundArray = Object.values(soundConfig.sounds);

    soundArray.forEach(soundInfo => {
        if (soundInfo && soundInfo.audio) {
            soundInfo.audio.volume = globalVolume;
            console.log(soundInfo);
        }
    })
})

export function muteSound() {

    if (!isMuted) {
        muteBtn.textContent = '🔇';
        isMuted = true;

        savedVolume = globalVolume

        globalVolume = 0;
        volumeSlider.value = 0
        console.log(globalVolume);
    } else {
        muteBtn.textContent = '🔊';
        isMuted = false;

        globalVolume = savedVolume;
        volumeSlider.value = savedVolume * 100;
        console.log(globalVolume);
    }

    saveSoundSettings();
}

export function saveSoundSettings() {

    if (!soundConfig) {
        return
    }

    soundSettings = {
        current: soundConfig.current,
        volume: globalVolume,
        isMuted: isMuted,
    };

    localStorage.setItem('soundSettings', JSON.stringify(soundSettings))
}

export function loadSoundSettings() {
    const saved = localStorage.getItem('soundSettings')

    if (!saved) { return }

    const settings = JSON.parse(saved)
    console.log(settings);
    soundConfig.current = settings.current;

    if (settings.volume !== undefined) {
        globalVolume = settings.volume;
    }

    if (settings.isMuted === true) {
        globalVolume = 0;
        volumeSlider.value = 0;
        muteBtn.textContent = '🔇';
        isMuted = true;
    } else {
        isMuted = false;
        muteBtn.textContent = '🔊';
        if (volumeSlider && settings.volume !== undefined) {
            volumeSlider.value = settings.volume * 100;
        }
    }

    /* globalVolume = settings.volume || 0.5; */
    console.log(soundConfig);
    updateSoundModal();
}