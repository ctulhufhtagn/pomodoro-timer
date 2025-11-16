let melodies = {};

const soundPromise = new Promise((resolve, reject) => {

    if (typeof Audio === 'undefined') {
        reject(error('Не удалось загрузить файлы'));
        return;
    }

    const workMainSound = new Audio('./sounds/victoryFanfare.mp3');
    const breakMainSound = new Audio('./sounds/breakMainSound.wav');

    resolve({
        work: workMainSound,
        break: breakMainSound,
    });

});

export async function loadAllSounds() {

    try {
        const mainSounds = await soundPromise;
        /* console.log(mainSounds); */

        melodies.workMainSound = mainSounds.work;
        melodies.breakMainSound = mainSounds.break;

        console.log(melodies);

    } catch (error) {
        const workSecondSound = new Audio('./sounds/workSecondSound.wav');
        const breakSecondSound = new Audio('./sounds/breakSecondSound.wav');

        melodies.workSecondSound = workSecondSound;
        melodies.breakSecondSound = breakSecondSound;

        console.log(melodies);
    }
}

export function getSound(mode) {
    return melodies[mode === 'work' ? 'workMainSound' : 'breakMainSound'];
}