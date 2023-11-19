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
