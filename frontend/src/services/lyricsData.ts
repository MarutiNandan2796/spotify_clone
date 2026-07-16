import type { LyricLine } from '../types';

const lyricsMap: Record<string, LyricLine[]> = {
  'summer breeze lullaby': [
    { time: 0, text: '♪ (Mellow instrumental opening) ♪' },
    { time: 8, text: 'Close your eyes and breathe the air so sweet...' },
    { time: 16, text: 'Feel the summer wind beneath your feet.' },
    { time: 24, text: 'Golden sun rays fade into the blue...' },
    { time: 32, text: 'Whispering a peaceful tune to you.' },
    { time: 40, text: '♪ (Smooth lo-fi transition) ♪' },
    { time: 52, text: 'Let the worries of the day drift away...' },
    { time: 60, text: 'Nothing else matters, you are safe to stay.' },
    { time: 68, text: 'Quiet shadows dancing on the wall...' },
    { time: 76, text: 'Listening to the gentle rain that falls.' },
    { time: 84, text: '♪ (Chill keyboard chords) ♪' },
    { time: 100, text: 'Rest your mind, tomorrow is brand new...' },
    { time: 108, text: 'Summer breeze is singing just for you.' },
    { time: 116, text: '♪ (Fading lo-fi ambient beats) ♪' }
  ],
  'raindrops & tea cups': [
    { time: 0, text: '♪ (Soft rain sound and piano intro) ♪' },
    { time: 10, text: 'Raindrops tapping on the window pane...' },
    { time: 20, text: 'Warm tea cup washing down the pain.' },
    { time: 30, text: 'A cozy blanket, a quiet book to read...' },
    { time: 40, text: 'This simple moment is all the peace I need.' },
    { time: 50, text: '♪ (Relaxing ambient guitar) ♪' },
    { time: 65, text: 'Steam rises slow, the world is moving fast...' },
    { time: 75, text: 'But in this room, we make the silence last.' },
    { time: 85, text: 'Watching ripples in the porcelain cup...' },
    { time: 95, text: 'Lift your spirits, never giving up.' },
    { time: 105, text: '♪ (Soft acoustic outro) ♪' }
  ],
  'study session focus': [
    { time: 0, text: '♪ (Relaxing vinyl crackle & study beats) ♪' },
    { time: 12, text: 'Focus your mind, leave the noise behind...' },
    { time: 24, text: 'Every single line, knowledge you will find.' },
    { time: 36, text: 'Deep concentration, deep inspiration...' },
    { time: 48, text: 'Stepping stone to your dream destination.' },
    { time: 60, text: '♪ (Deep bass groove & percussion) ♪' },
    { time: 80, text: 'Flip the pages, learn through the ages...' },
    { time: 92, text: 'Unlocking wisdom from ancient sages.' },
    { time: 104, text: 'Keep on going, thoughts are flowing...' },
    { time: 116, text: 'Watch your understanding keep on growing.' },
    { time: 128, text: '♪ (Calming instrumental fading out) ♪' }
  ],
  'retro-wave neon grid': [
    { time: 0, text: '♪ (Heavy synthesizer intro & drum machine) ♪' },
    { time: 15, text: 'Cruising down the highway in the neon light...' },
    { time: 23, text: 'Electric currents pulsing through the night.' },
    { time: 31, text: 'Analog dreams on the dashboard screen...' },
    { time: 39, text: 'The wildest ride that you have ever seen.' },
    { time: 47, text: '♪ (Retro wave build-up) ♪' },
    { time: 55, text: 'Outrun the sunset, flying through the grid...' },
    { time: 63, text: 'Living the future like we always did.' },
    { time: 71, text: 'Synth keys screaming, laser beams in sight...' },
    { time: 79, text: 'We are the riders of the retro night!' },
    { time: 87, text: '♪ (Epic keytar solo) ♪' },
    { time: 110, text: 'No speed limits on this cyber track...' },
    { time: 118, text: 'Moving forward, never looking back.' },
    { time: 126, text: '♪ (Synthesizer arpeggio outro) ♪' }
  ],
  'cyberpunk skyline walk': [
    { time: 0, text: '♪ (Futuristic atmospheric pads) ♪' },
    { time: 12, text: 'Rain-soaked concrete, holographic glow...' },
    { time: 21, text: 'Underneath the skyline, where the hackers go.' },
    { time: 30, text: 'Chromed out wires, digital desires...' },
    { time: 39, text: 'Rebel souls ignited by the city fires.' },
    { time: 48, text: '♪ (Industrial drum beat drops) ♪' },
    { time: 60, text: 'Walking through the shadows of the megacorp...' },
    { time: 69, text: 'Data stream flowing to the neutral port.' },
    { time: 78, text: 'Augmented vision, virtual decision...' },
    { time: 87, text: 'Living on the edge with perfect precision.' },
    { time: 96, text: '♪ (Techno synth bassline) ♪' }
  ],
  'folk whispers in the wind': [
    { time: 0, text: '♪ (Sweet acoustic guitar picking) ♪' },
    { time: 10, text: 'I hear the whispers in the rustling leaves...' },
    { time: 20, text: 'A tale of autumn that the heart believes.' },
    { time: 30, text: 'Cross the meadows, follow where it leads...' },
    { time: 40, text: 'Sowing simple dreams and planting tiny seeds.' },
    { time: 50, text: 'Oh, wind, carry me home...' },
    { time: 60, text: 'Over the hills where the wild horses roam.' },
    { time: 70, text: 'No need to wander, no need to hide...' },
    { time: 80, text: 'With the quiet mountain standing by our side.' },
    { time: 90, text: '♪ (Beautiful violin section) ♪' },
    { time: 110, text: 'Whispers in the wind tell us who we are...' },
    { time: 120, text: 'Guided by the light of the evening star.' },
    { time: 130, text: '♪ (Soft fingerpicked guitar fade) ♪' }
  ],
  'woodland cabin acoustic': [
    { time: 0, text: '♪ (Warm campfire crackling and banjo strumming) ♪' },
    { time: 12, text: 'Up in the cabin where the pine trees grow...' },
    { time: 24, text: 'Chasing the shadows in the fireplace glow.' },
    { time: 36, text: 'Wooden floors creaking, kettle on the stove...' },
    { time: 48, text: 'Safe in our little corner, sheltered in the grove.' },
    { time: 60, text: '♪ (Indie folk acoustic bridge) ♪' },
    { time: 75, text: 'Time moves slower when the winter comes...' },
    { time: 87, text: 'Listening to the rhythm of the wooden drums.' },
    { time: 99, text: 'Warm hands, warm hearts, cozy in the wood...' },
    { time: 111, text: 'Living simply like we always knew we should.' },
    { time: 123, text: '♪ (Folk whistle and strumming outro) ♪' }
  ],
  'sunset spark horizon': [
    { time: 0, text: '♪ (High-energy synthwave intro) ♪' },
    { time: 14, text: 'Where the ocean meets the neon sky...' },
    { time: 22, text: 'Watch the purple clouds drifting by.' },
    { time: 30, text: 'Sunset spark is shining in your eyes...' },
    { time: 38, text: 'A digital romance that never dies.' },
    { time: 46, text: '♪ (Uplifting retro chorus beat) ♪' },
    { time: 58, text: 'Drive into the horizon, feel the heat...' },
    { time: 66, text: 'Bassline pumping to our heartbeat.' },
    { time: 74, text: 'Hold on tight, we are breaking free...' },
    { time: 82, text: 'Into the neon cyber sea!' },
    { time: 90, text: '♪ (Guitar-synth solo & retro drum fill) ♪' }
  ]
};

export const getLyricsForSong = (title: string, artist: string): LyricLine[] => {
  const cleanTitle = title.toLowerCase().trim();
  if (lyricsMap[cleanTitle]) {
    return lyricsMap[cleanTitle];
  }

  // Dynamic procedural generator fallback for any custom uploaded songs
  return [
    { time: 0, text: `♪ Listening to "${title}" by ${artist} ♪` },
    { time: 6, text: 'Let the rhythm guide your mind...' },
    { time: 12, text: 'Leaving all the stress behind.' },
    { time: 18, text: 'Feel the melody start to rise...' },
    { time: 24, text: 'Underneath the starry skies.' },
    { time: 30, text: '♪ (Instrumental Solo) ♪' },
    { time: 45, text: 'Every beat is a step brand new...' },
    { time: 51, text: 'This sweet melody is just for you.' },
    { time: 57, text: 'Lose yourself in this beautiful song...' },
    { time: 63, text: 'Where you know that you belong.' },
    { time: 70, text: '♪ (Fading vibes of the music) ♪' }
  ];
};
