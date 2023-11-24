import * as THREE from "three";

const jumpSoundFiles = [
  "./assets/sounds/computer-boop_fordps3.wav",
];

/**
 * Loads audio files and stores them in the jumpSounds array.
 *
 * @param three      Object storing the THREE.js classes we use.
 * @param jumpSounds Array where all jump sounds will be added.
 */
export function loadAudio(three, jumpSounds) {
  jumpSoundFiles.forEach((soundFile) => {
    three.audioLoader.load(soundFile, (buffer) => {
      const jumpSound = new THREE.Audio(three.listener);
      jumpSound.setBuffer(buffer);
      jumpSounds.push(jumpSound);
    });
  });
}

let currentJumpSound = null;

/**
 * Plays a random jump sound from the jump sounds available.
 * If a jump sound is already playing, it is stopped before playing a new one.
 *
 * @param jumpSounds Array containing all jump sounds (THREE.Audio) available.
 */
export function playJumpSound(jumpSounds) {
  if (jumpSounds.length > 0) {
    if (currentJumpSound) {
      currentJumpSound.stop();
    }
    const randomIndex = Math.floor(Math.random() * jumpSounds.length);
    const randomJumpSound = jumpSounds[randomIndex];
    randomJumpSound.play();

    currentJumpSound = randomJumpSound;
  }
}
