import { globalVolume, saveSoundSettings } from './sound-player.js';
import { closeAllDropdown } from './sound-settings.js'

export let melodies = {};

export let soundConfig = null;

export async function loadDefaultSounds() {

    try {
        initSoundConfig();
        const workSoundId = soundConfig.defaultMelodies.work;
        const workSoundInfo = soundConfig.sounds[workSoundId];
        workSoundInfo.audio = new Audio(workSoundInfo.file);
        workSoundInfo.audio.volume = globalVolume;

        const breakSoundId = soundConfig.defaultMelodies.break;
        const breakSoundInfo = soundConfig.sounds[breakSoundId];
        breakSoundInfo.audio = new Audio(breakSoundInfo.file);
        breakSoundInfo.audio.volume = globalVolume;
        console.log(soundConfig);
        updateSoundModal();

    } catch (error) {
        /* const workSecondSound = new Audio('./sounds/workSecondSound.wav');
        const breakSecondSound = new Audio('./sounds/breakSecondSound.wav');
    
        melodies.workSecondSound = workSecondSound;
        melodies.breakSecondSound = breakSecondSound;
    
        initSoundConfig(melodies);
        updateSoundModal(); */
    }
}

export function getSound(mode) {
    if (soundConfig) {

    }

    return melodies[mode === 'work' ? 'workMainSound' : 'breakMainSound'];
}

function initSoundConfig(melodies) {
    soundConfig = {
        sounds: {
            'bell': { name: 'bell', file: 'sounds/achivementBell.wav', audio: null },
            'arcade': { name: 'arcade', file: 'sounds/arcade.wav', audio: null },
            'ring': { name: 'ring', file: 'sounds/ring.wav', audio: null },
            'final fantasy': { name: 'final fantasy', file: 'sounds/victoryFanfare.mp3', audio: null },
        },
        defaultMelodies: {
            work: 'bell',
            break: 'arcade',
        },
        current: {}
    }
}

export function updateSoundModal() {
    if (!soundConfig) { return }

    const workButton = document.querySelector('.sound-select-btn[data-mode="work"] .selected-sound');
    const breakButton = document.querySelector('.sound-select-btn[data-mode="break"] .selected-sound');
    /* const soundId = soundConfig.defaultMelodies.work;
    console.log(soundId);
    const soundObject = soundConfig.sounds[soundId];
    const soundName = soundObject.name;
    workButton.textContent = soundName; */

    /* или короткая запись: */
    /* workButton.textContent = soundConfig.sounds[soundConfig.defaultMelodies.work].name;
    breakButton.textContent = soundConfig.sounds[soundConfig.defaultMelodies.break].name; */

    const workSoundId = soundConfig.current.work || soundConfig.defaultMelodies.work;
    const workSoundInfo = soundConfig.sounds[workSoundId]
    const workSoundName = workSoundInfo.name;
    workButton.textContent = workSoundName;

    const breakSoundId = soundConfig.current.break || soundConfig.defaultMelodies.break;
    const breakSoundInfo = soundConfig.sounds[breakSoundId]
    const breakSoundName = breakSoundInfo.name;
    breakButton.textContent = breakSoundName;
    console.log(breakSoundName);
}

export function selectSound(element) {
    /* получаем и название режима и название мелодии, и записываем в отдельные константы */
    const soundData = element.dataset.sound;
    const [mode, soundId] = soundData.split('-');
    console.log('mode', mode);
    console.log('id', soundId);
    console.log('data:', soundData)

    if (soundConfig && soundConfig.sounds[soundId]) {
        const soundInfo = soundConfig.sounds[soundId]

        const audioFile = new Audio(soundInfo.file)
        audioFile.volume = globalVolume

        soundInfo.audio = audioFile;
        soundConfig.current[mode] = soundId;

        saveSoundSettings();
        playSound(mode);

        const selectedSound = document.querySelector(`.sound-select-btn[data-mode="${mode}"] .selected-sound`);
        selectedSound.textContent = soundId;
        closeAllDropdown();

        console.log(soundConfig)
        return mode
    }
}

export function playSound(mode) {

    if (globalVolume === 0 || !soundConfig) {
        return;
    }

    const soundId = soundConfig.current[mode] || soundConfig.defaultMelodies[mode];

    console.log("soundId", soundId);
    let soundInfo = soundConfig.sounds[soundId];

    console.log('soundInfo', soundInfo);

    if (!soundInfo) {
        console.error("нет soundInfo")
        return
    }

    if (!soundInfo.audio && soundInfo.file) {
        soundInfo.audio = new Audio(soundInfo.file);
        console.log('✅ Создан Audio для', soundId);
    }

    let audio = soundInfo.audio;
    console.log("audio", audio);
    audio.volume = globalVolume;

    audio.play()
}