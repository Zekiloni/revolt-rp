

export const playAudio = (audioSrc: string, volume = 1.0) => {
  const audio = new Audio(audioSrc);
  audio.load();
  audio.volume = volume;
  audio.play();
}
